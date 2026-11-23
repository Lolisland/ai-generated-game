export const START = { x: -2.5, z: 2 };
export const STONE = { x: 2.5, z: -1.5 };
export function moveToward(position, target, distance) {
  const dx = target.x - position.x, dz = target.z - position.z;
  const length = Math.hypot(dx, dz), step = length ? Math.min(distance / length, 1) : 0;
  return { x: Math.max(-7, Math.min(7, position.x + dx * step)), z: Math.max(-7, Math.min(7, position.z + dz * step)) };
}
export function touchesStone(position) { return Math.hypot(position.x - STONE.x, position.z - STONE.z) < 1.2; }
