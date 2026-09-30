const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const ts = require('typescript');
const result = {};
function canvas(width, height, data = new Uint8ClampedArray(width * height * 4)) {
  return {width, height, getContext: () => ({
    getImageData: () => ({data}),
    createImageData: (w,h) => ({data: new Uint8ClampedArray(w*h*4)}),
    putImageData: image => { data = image.data; }
  })};
}
vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/modules/photo/selection.ts','utf8'), {
  compilerOptions: {module: ts.ModuleKind.CommonJS}
}).outputText, {exports: result, require: () => ({createLayerCanvas: canvas})});
// A connected L and a separate matching island must not become a solid rectangle.
const data = new Uint8ClampedArray(4*3*4);
for(let p=0;p<12;p++) {data[p*4+2]=255; data[p*4+3]=255;}
for(const p of [0,4,8,9,3]) {data[p*4]=255; data[p*4+2]=0;}
const source = canvas(4,3,data);
const selected = result.magicWandSelection(source,0,0,0);
assert.equal(selected.selection.w,2);
assert.equal(selected.selection.h,3);
const mask = selected.mask.getContext('2d').getImageData().data;
for(let p=0;p<12;p++) assert.equal(mask[p*4+3], [0,4,8,9].includes(p)?255:0);
assert.equal(result.magicWandSelection(source,-1,0), null);
assert.equal(result.magicWandSelection(source,4,0), null);
const transparent = result.magicWandSelection(canvas(2,2),0,0);
assert.equal(transparent.selection.w,2);
assert.equal(transparent.selection.h,2);
console.log('PASS: wand exact connected mask, excluded holes/islands, bounds and transparency');
