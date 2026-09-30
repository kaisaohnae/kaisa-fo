const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const assert = require('node:assert/strict');

// Minimal canvas stand-in: records the draws each module makes so the checks below can assert
// on sizes and placement without a DOM.
function fakeCanvas(width, height, fill) {
  const canvas = {
    width: Math.max(1, Math.round(width)),
    height: Math.max(1, Math.round(height)),
    fill: fill ?? null,
    draws: []
  };
  const ctx = {
    canvas,
    globalAlpha: 1,
    globalCompositeOperation: 'source-over',
    fillStyle: null,
    save() {}, restore() {}, clearRect() {}, fillRect() {}, beginPath() {},
    rect() {}, ellipse() {}, roundRect() {}, fill() {}, stroke() {},
    drawImage(source, x = 0, y = 0) { canvas.draws.push({source, x, y}); },
    getImageData: () => ({data: new Uint8ClampedArray(4)}),
    putImageData() {}
  };
  canvas.getContext = () => ctx;
  return canvas;
}

function load(file, dependencies = {}, extraContext = {}) {
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: {module: ts.ModuleKind.CommonJS}
  }).outputText;
  vm.runInNewContext(code, {
    exports,
    require: name => dependencies[name] ?? {},
    crypto: {randomUUID: () => Math.random().toString(16).slice(2)},
    document: {createElement: () => fakeCanvas(1, 1)},
    ...extraContext
  });
  return exports;
}

// --- oversized placement: a pasted image bigger than the canvas is never cropped -----------
let created = [];
const documentStub = {
  createElement() {
    const canvas = fakeCanvas(1, 1);
    created.push(canvas);
    return canvas;
  }
};
const canvasModule = load('src/modules/photo/canvas.ts', {'./types': {}}, {document: documentStub});

const big = fakeCanvas(1200, 900);
const placedBig = canvasModule.createPlacedLayerCanvas(800, 600, big);
assert.equal(placedBig.canvas.width, 1200, 'buffer grows to the image width');
assert.equal(placedBig.canvas.height, 900, 'buffer grows to the image height');
assert.deepEqual({x: placedBig.x, y: placedBig.y}, {x: 0, y: 0}, 'overflowing image is anchored at the origin so nothing is cut');
assert.deepEqual(placedBig.canvas.draws, [{source: big, x: 0, y: 0}]);

const small = fakeCanvas(400, 300);
const placedSmall = canvasModule.createPlacedLayerCanvas(800, 600, small);
assert.equal(placedSmall.canvas.width, 800, 'a fitting image keeps the document size');
assert.deepEqual({x: placedSmall.x, y: placedSmall.y}, {x: 200, y: 150}, 'a fitting image is centered');

const placedAt = canvasModule.createPlacedLayerCanvas(800, 600, fakeCanvas(500, 500), {x: 600, y: 400});
assert.deepEqual([placedAt.canvas.width, placedAt.canvas.height], [1100, 900], 'buffer covers content pasted past the edge');

// --- vector shape layers -------------------------------------------------------------------
const shapeDraws = [];
const layersModule = load('src/modules/photo/layers.ts', {
  './canvas': {
    createLayerCanvas: (w, h) => fakeCanvas(w, h),
    cloneCanvas: canvas => fakeCanvas(canvas.width, canvas.height)
  },
  './composite': {},
  './paint': {drawShapeLayer: (canvas, shape) => shapeDraws.push({canvas, shape})},
  './text': {drawTextLayer: () => {}},
  './types': {
    DEFAULT_ADJUSTMENT: {},
    DEFAULT_LAYER_STYLE: {dropShadow: {}, border: {}, overlay: {}}
  }
});

const drawn = layersModule.createShapeLayer({
  mode: 'ellipse', x: 120, y: 90, w: -40, h: -30, style: 'both',
  fill: '#ff0000', stroke: '#000000', strokeWidth: 3, fillAlpha: 1, strokeAlpha: 1, cornerRadius: 12
});
assert.equal(drawn.kind, 'shape', 'a drawn shape becomes its own vector layer');
assert.equal(drawn.name, 'Ellipse');
assert.deepEqual(
  {x: drawn.shape.x, y: drawn.shape.y, w: drawn.shape.w, h: drawn.shape.h},
  {x: 80, y: 60, w: 40, h: 30},
  'a shape dragged backwards is normalized'
);

const inputs = layersModule.toCompositeInputs([drawn], new Map(), new Map(), 800, 600);
assert.equal(inputs[0].kind, 'shape');
assert.equal(inputs[0].shape, drawn.shape, 'shape data reaches the compositor');
assert.equal(inputs[0].canvas, undefined, 'a vector layer carries no pixel buffer');

const buffers = new Map();
const rasterized = layersModule.rasterizeShapeLayer([drawn], drawn.id, buffers, 800, 600);
assert.equal(rasterized.layer.kind, 'raster');
assert.equal(rasterized.layer.shape, undefined);
assert.equal(buffers.get(drawn.id).width, 800, 'rasterizing renders at document size');
assert.equal(shapeDraws.length, 1, 'rasterizing goes through the vector renderer');

// --- the compositor renders shape layers from their data, every frame ----------------------
const compositeDraws = [];
const compositeModule = load('src/modules/photo/composite.ts', {
  './adjust': {applyAdjustment: canvas => canvas},
  './canvas': {
    applyMaskToCanvas: canvas => canvas,
    createLayerCanvas: (w, h) => fakeCanvas(w, h)
  },
  './paint': {drawShapeLayer: (canvas, shape) => compositeDraws.push(shape)},
  './text': {drawTextLayer: () => {}},
  './types': {DEFAULT_ADJUSTMENT: {}}
});
const out = fakeCanvas(800, 600);
compositeModule.compositeLayers(800, 600, [
  {kind: 'shape', visible: true, opacity: 1, shape: drawn.shape},
  {kind: 'shape', visible: false, opacity: 1, shape: drawn.shape}
], out);
assert.deepEqual(compositeDraws, [drawn.shape], 'only visible shape layers are rendered, straight from their geometry');
assert.equal(out.draws.length, 1, 'the rendered shape is drawn into the composite');

// --- the shape tool must not depend on the active layer being a raster one --------------------
// Regression: it used to bail out unless getPaintTarget() returned a canvas, which made the tool
// dead the moment the previous shape layer (or a text layer) was selected.
const editor = fs.readFileSync('src/components/photo/photo-editor.tsx', 'utf8');
const pointerDownBranch = editor.slice(
  editor.indexOf("if (currentTool === 'shape') {"),
  editor.indexOf("if (currentTool === 'lasso') {")
);
assert.ok(pointerDownBranch.length > 0, 'shape branch found in onPointerDown');
assert.ok(
  !/getPaintTarget\(\)/.test(pointerDownBranch),
  'the shape tool must start a drag whatever kind of layer is active'
);
const releaseBranch = editor.slice(
  editor.indexOf("if (drag?.mode === 'shape') {"),
  editor.indexOf("if (drag?.mode === 'lasso'")
);
assert.ok(/createShapeLayer\(/.test(releaseBranch), 'releasing a shape drag creates a vector layer');
assert.ok(!/drawShape\(/.test(releaseBranch), 'releasing a shape drag must not paint pixels into a layer');

console.log('PASS: oversized paste keeps every pixel, shape tool makes vector layers on any active layer, composite renders them');
