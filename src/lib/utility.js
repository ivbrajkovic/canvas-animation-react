/**
 * Resize a canvas to match the size its displayed.
 * @param {HTMLCanvasElement} canvas The canvas to resize.
 * @param {number} [multiplier] amount to multiply by.
 *    Pass in window.devicePixelRatio for native pixels.
 * @return {boolean} true if the canvas was resized.
 * @memberOf module:glUtils
 */
export function resizeCanvasToDisplaySize(canvas, multiplier) {
  multiplier = multiplier || 1;
  const width = (canvas.clientWidth * multiplier) | 0;
  const height = (canvas.clientHeight * multiplier) | 0;
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
    return true;
  }
  return false;
}

/**
 * Debounce function
 * @param {object} func function to call
 * @param {number} delay delay timeout
 */
export function debounce(func, delay) {
  let inDebounce;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(inDebounce);
    inDebounce = setTimeout(() => func.apply(context, args), delay);
  };
}

/**
 * Generate random number between min and max
 * @param {number} min min
 * @param {number} max max
 */
export function random2(min, max, fixed = 0, floor = false) {
  let n;
  if (floor) n = Math.floor(Math.random() * (max - min)) + min;
  n = Math.random() * (max - min) + min;

  if (fixed) return n.toFixed(fixed);
  return n;
}
export function random(min, max) {
  let num = Math.floor(Math.random() * (max - min)) + min;
  return num;
}

export function radToDeg(r) {
  return (r * 180) / Math.PI;
}

export function degToRad(d) {
  return (d * Math.PI) / 180;
}

export function isPowerOf2(value) {
  return (value & (value - 1)) === 0;
}

export function fixToOne(num) {
  return Math.round(num * 10) / 10;
}

// rangeMap :: (Num, Num) -> (Num, Num) -> Num -> Num
export const rangeMap = (a, b) => (s) => {
  const [a1, a2] = a;
  const [b1, b2] = b;
  // Scaling up an order, and then down, to bypass a potential,
  // precision issue with negative numbers.
  return ((((b2 - b1) * (s - a1)) / (a2 - a1)) * 10 + 10 * b1) / 10;
};
