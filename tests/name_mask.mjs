import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
const require = createRequire(import.meta.url);
const { mask, maskLines } = require('../name-mask.js');

const cases = [
  ['王曉明', '王O明'],
  ['王明', '王O'],
  ['歐陽小明', '歐OO明'],
  ['司徒王小明', '司OOO明'],
  ['王小明小華', '王OOO華'],
  ['王小明小華強', '王OOOO強'],
  ['王', 'O'],
  ['  王曉明  ', '王O明'],
  ['陳𠮷明', '陳O明'],
];

for (const [input, expected] of cases) {
  assert.equal(mask(input), expected, `${input} should become ${expected}`);
}

assert.deepEqual(
  maskLines('王曉明\n王明\n\n歐陽小明'),
  [
    {name:'王曉明', masked:'王O明'},
    {name:'王明', masked:'王O'},
    {name:'歐陽小明', masked:'歐OO明'},
  ]
);

console.log(`PASS ${cases.length + 1}/${cases.length + 1} name masking checks`);
