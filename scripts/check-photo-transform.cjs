const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const assert = require('node:assert/strict');

function load(file, dependencies = {}) {
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: {module: ts.ModuleKind.CommonJS}
  }).outputText;
  vm.runInNewContext(code, {exports, require: name => dependencies[name] ?? {}, Math, console});
  return exports;
}

const text = load('src/modules/photo/text.ts');
const T = load('src/modules/photo/transform.ts', {'./text': text, './types': {}});

// Modules run in their own VM realm, so objects they return need re-wrapping before a strict
// deep comparison (their prototype is a different Object).
const plain = value => ({...value});
const near = (actual, expected, what, epsilon = 1e-6) =>
  assert.ok(Math.abs(actual - expected) <= epsilon, `${what}: ${actual} != ${expected}`);
const nearPoint = (actual, expected, what) => {
  near(actual.x, expected.x, `${what}.x`);
  near(actual.y, expected.y, `${what}.y`);
};

// --- resizing keeps the opposite handle pinned ------------------------------------------------
const box = {x: 0, y: 0, w: 100, h: 50, rotation: 0};

const se = T.resizeTransformBox(box, 'se', {x: 10, y: 20});
assert.deepEqual(
  {x: se.x, y: se.y, w: se.w, h: se.h},
  {x: 0, y: 0, w: 110, h: 70},
  'dragging the south-east handle grows the box and leaves the north-west corner alone'
);

const nw = T.resizeTransformBox(box, 'nw', {x: 10, y: 10});
assert.deepEqual({x: nw.x, y: nw.y, w: nw.w, h: nw.h}, {x: 10, y: 10, w: 90, h: 40});

const east = T.resizeTransformBox(box, 'e', {x: 10, y: 999});
assert.deepEqual({w: east.w, h: east.h}, {w: 110, h: 50}, 'an edge handle only moves its own axis');

// Alt resizes around the centre.
const centred = T.resizeTransformBox(box, 'se', {x: 10, y: 10}, {fromCenter: true});
nearPoint(T.boxCenter(centred), T.boxCenter(box), 'centre stays put with Alt');
assert.deepEqual({w: centred.w, h: centred.h}, {w: 120, h: 70});

// Shift keeps the proportions.
const ratio = T.resizeTransformBox(box, 'se', {x: 50, y: 0}, {aspect: true});
near(ratio.w / ratio.h, box.w / box.h, 'aspect ratio held with Shift');
near(ratio.w, 150, 'aspect resize follows the larger axis');

// A box never collapses through zero.
assert.ok(T.resizeTransformBox(box, 'se', {x: -500, y: -500}).w >= 1);

// --- resizing a rotated box works along its own axes -------------------------------------------
const spun = {x: 0, y: 0, w: 100, h: 50, rotation: 90};
const anchorBefore = T.handlePoint(spun, 'w');
const spunWider = T.resizeTransformBox(spun, 'e', {x: 0, y: 10});
near(spunWider.w, 110, 'a world drag is taken into the rotated box own frame');
near(spunWider.h, 50, 'the other axis is untouched');
nearPoint(T.handlePoint(spunWider, 'w'), anchorBefore, 'the opposite handle stays pinned in document space');

// --- rotation -----------------------------------------------------------------------------------
const rotated = T.rotateTransformBox(box, {x: 100, y: 25}, {x: 50, y: 125});
near(rotated.rotation, 90, 'dragging a quarter turn around the centre rotates 90 degrees');
const snapped = T.rotateTransformBox(box, {x: 100, y: 25}, {x: 100, y: 45}, true);
assert.equal(snapped.rotation % 15, 0, 'Shift snaps rotation to 15 degrees');
assert.equal(T.normalizeRotation(540), 180);
assert.equal(T.normalizeRotation(-190), 170);

// --- hit testing ----------------------------------------------------------------------------------
assert.equal(T.hitTransformTarget({x: 0, y: 0}, box, 5), 'nw');
assert.equal(T.hitTransformTarget({x: 50, y: 25}, box, 5), 'move');
assert.equal(T.hitTransformTarget({x: -10, y: -10}, box, 5), 'rotate', 'just outside the box rotates');
assert.equal(T.hitTransformTarget({x: -400, y: -400}, box, 5), null);
assert.equal(
  T.hitTransformTarget(T.handlePoint(spun, 'se'), spun, 5),
  'se',
  'handles are found through the rotation'
);

// --- vector layers --------------------------------------------------------------------------------
const shape = {mode: 'rect', x: 10, y: 20, w: 30, h: 40, style: 'fill', fill: '#f00', stroke: '#000', strokeWidth: 1, fillAlpha: 1, strokeAlpha: 1, cornerRadius: 0};
assert.deepEqual(plain(T.shapeToTransformBox(shape)), {x: 10, y: 20, w: 30, h: 40, rotation: 0});
const shaped = T.shapeFromTransformBox(shape, {x: 1, y: 2, w: 3, h: 4, rotation: 45});
assert.deepEqual(
  {x: shaped.x, y: shaped.y, w: shaped.w, h: shaped.h, rotation: shaped.rotation, fill: shaped.fill},
  {x: 1, y: 2, w: 3, h: 4, rotation: 45, fill: '#f00'},
  'a shape layer takes the box directly and keeps its styling'
);

// Text measures without a canvas here, so the bounds are the deterministic fallback.
const baseText = {content: 'AB', x: 100, y: 50, fontSize: 10, fontFamily: 'Arial', fontWeight: 'normal', fontStyle: 'normal', color: '#000', align: 'left', lineHeight: 1, tracking: 0, underline: false, strokeWidth: 0, strokeColor: '#000'};
const baseBounds = text.getTextLayerBounds(baseText);
assert.deepEqual(plain(baseBounds), {x: 100, y: 50, w: 12, h: 10});
assert.deepEqual(plain(T.textToTransformBox(baseText, baseBounds)), {x: 100, y: 50, w: 12, h: 10, rotation: 0});

const scaledText = T.textFromTransformBox(baseText, baseBounds, {x: 100, y: 50, w: 24, h: 20, rotation: 0});
assert.deepEqual(
  {x: scaledText.x, y: scaledText.y, scaleX: scaledText.scaleX, scaleY: scaledText.scaleY, fontSize: scaledText.fontSize},
  {x: 100, y: 50, scaleX: 2, scaleY: 2, fontSize: 10},
  'scaling text stores a scale instead of resampling it'
);
assert.deepEqual(plain(text.getTextLayerBounds(scaledText)), {x: 100, y: 50, w: 24, h: 20});

// Centre-aligned text keeps the box where the user dragged it, anchor offset and all.
const centreText = {...baseText, align: 'center'};
const centreBounds = text.getTextLayerBounds(centreText);
assert.deepEqual(plain(centreBounds), {x: 94, y: 50, w: 12, h: 10});
const centreScaled = T.textFromTransformBox(centreText, centreBounds, {x: 94, y: 50, w: 24, h: 20, rotation: 0});
assert.deepEqual(plain(text.getTextLayerBounds(centreScaled)), {x: 94, y: 50, w: 24, h: 20});

// A rotated text box survives the round trip, so reopening Ctrl+T frames the same quad.
const target = {x: 94, y: 50, w: 24, h: 20, rotation: 30};
const rotatedText = T.textFromTransformBox(centreText, centreBounds, target);
const roundTrip = T.textToTransformBox(rotatedText, text.getTextLayerBounds(rotatedText));
near(roundTrip.x, target.x, 'round trip x');
near(roundTrip.y, target.y, 'round trip y');
near(roundTrip.w, target.w, 'round trip w');
near(roundTrip.h, target.h, 'round trip h');
near(roundTrip.rotation, target.rotation, 'round trip rotation');

console.log('PASS: pinned-anchor resize, Alt/Shift, rotated-axis resize, rotation snap, hit ring, vector box mapping');
