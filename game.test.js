import assert from 'node:assert/strict';
import { moveToward, touchesStone, START, STONE } from './rules.js';
assert.deepEqual(moveToward(START, START, 1), START);
assert.deepEqual(moveToward({ x: 0, z: 0 }, { x: 1, z: 0 }, 3), { x: 1, z: 0 });
assert.deepEqual(moveToward({ x: 7, z: 0 }, { x: 9, z: 0 }, 1), { x: 7, z: 0 });
assert.equal(touchesStone(START), false);
assert.equal(touchesStone(STONE), true);
assert.equal(touchesStone({ x: STONE.x + 1.2, z: STONE.z }), false);
console.log('Movement and stone interaction checks passed.');
