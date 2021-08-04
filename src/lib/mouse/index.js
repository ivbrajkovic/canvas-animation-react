export class Mouse {
  constructor({
    x = null,
    y = null,
    radius = 120,
    minRadius = 0,
    maxRadius = 180,
  }) {
    this._x = x;
    this._y = y;
    this.dpRatio = window.devicePixelRatio;
    this.radius = radius * this.dpRatio;
    this._minRadius = minRadius * this.dpRatio;
    this._maxRadius = maxRadius * this.dpRatio;
  }

  get X() {
    return this._x;
  }

  set X(value) {
    this._x = value * this.dpRatio;
  }

  get Y() {
    return this._y;
  }

  set Y(value) {
    this._y = value * this.dpRatio;
  }

  increaseRadius(value) {
    if (this.radius < this._maxRadius) this.radius += value;
  }

  decreaseRadius(value) {
    if (this.radius > this._minRadius) this.radius -= value;
  }

  /**
   * @param {number} value
   */
  set minRadius(value) {
    this._maxRadius = value * this.dpRatio;
  }

  /**
   * @param {number} value
   */
  set maxRadius(value) {
    this._maxRadius = value * this.dpRatio;
  }
}
