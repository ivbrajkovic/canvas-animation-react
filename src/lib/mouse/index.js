export class Mouse {
  constructor({
    x = null,
    y = null,
    radius = 120,
    radiusMin = 0,
    radiusMax = 180,
  }) {
    this._x = x;
    this._y = y;
    this.dpRatio = window.devicePixelRatio;
    this.radius = radius * this.dpRatio;
    this._radiusMin = radiusMin * this.dpRatio;
    this._radiusMax = radiusMax * this.dpRatio;
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
    if (this.radius < this._radiusMax) this.radius += value;
  }

  decreaseRadius(value) {
    if (this.radius > this._radiusMin) this.radius -= value;
  }

  /**
   * @param {number} value
   */
  set radiusMin(value) {
    this._radiusMax = value * this.dpRatio;
  }

  /**
   * @param {number} value
   */
  set radiusMax(value) {
    this._radiusMax = value * this.dpRatio;
  }
}
