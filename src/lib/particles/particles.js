import merge from "lodash-es/merge";

import { resizeCanvasToDisplaySize, debounce, rangeMap } from "../utility";

import { Mouse } from "../mouse";
import Point from "./particle";

const AMOUNT_DELTA = 12;

const DEFAULT_COLOR = {
  opacity: 1,
  particle: "rgb(255,255,255)",
  connection: "rgb(255,255,255)",
};

const DEFAULT_CONNECTIONS = {
  showConnections: true,
  lineWidth: 2,
  distanceThreshold: 0,
  distanceThresholdMin: 20,
  distanceThresholdMax: 40,
};

export class Particles {
  constructor(canvas, { fpsCallback, color, connections, mouse }) {
    /** @type {CanvasRenderingContext2D} */
    this.ctx = canvas.getContext("2d");
    /** @type {HTMLCanvasElement} */
    this.canvas = canvas;

    this.mouse = new Mouse(mouse);
    this.points = [];
    this.raf = null;

    this.fps = {
      then: 0,
      last: 0,
      current: 0,
      callback: fpsCallback,
    };

    this.color = merge(this.color, DEFAULT_COLOR, color);
    this.connections = merge(
      this.connections,
      DEFAULT_CONNECTIONS,
      connections
    );

    this.dpRatio = window.devicePixelRatio;

    this.connections.distanceThresholdMin *= this.dpRatio;
    this.connections.distanceThresholdMax *= this.dpRatio;

    this.screenWidth = window.screen.width * this.dpRatio;
    this.screenHeight = window.screen.height * this.dpRatio;

    // Initialization order
    this.initFunctions = [this.populate, this.initConnections];
  }

  init = () =>
    resizeCanvasToDisplaySize(this.canvas, this.dpRatio) &&
    this.initFunctions.forEach((fnc) => fnc());

  initConnections = () => {
    if (!this.connections.showConnections) return;

    this.ctx.lineWidth = this.connections.lineWidth;
    this.ctx.strokeStyle = this.color.connection;

    this.connections.distanceThreshold = rangeMap(
      [0, this.screenWidth],
      [
        this.connections.distanceThresholdMin,
        this.connections.distanceThresholdMax,
      ]
    )(this.canvas.width);
    // console.log({ distanceThreshold: this.connections.distanceThreshold });
  };

  populate = () => {
    this.points = [];

    const amount = Math.ceil(
      ((this.canvas.width + this.canvas.height) / 100) * AMOUNT_DELTA
    );

    for (let i = 0; i < amount; i++)
      this.points.push(new Point(this.canvas.width, this.canvas.height));

    return amount;
  };

  drawScene() {
    let dx, dy, distance;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = 0; i < this.points.length; i++) {
      // Connect points
      if (this.connections.showConnections) {
        for (let j = i; j < this.points.length; j++) {
          dx = this.points[i].x - this.points[j].x;
          dy = this.points[i].y - this.points[j].y;
          // distance = Math.hypot(dx, dy);
          distance = Math.sqrt(dx * dx + dy * dy); // 2 time faster

          // In threshold distance
          if (distance < this.connections.distanceThreshold) {
            this.ctx.globalAlpha =
              1 - distance / this.connections.distanceThreshold;
            this.ctx.beginPath();
            this.ctx.moveTo(this.points[i].x, this.points[i].y);
            this.ctx.lineTo(this.points[j].x, this.points[j].y);
            this.ctx.stroke();
          }
        }
      }

      // Draw points
      this.ctx.globalAlpha = 1;
      this.points[i].draw(this.ctx, this.color.particle);
      this.points[i].update(this.mouse);
      this.points[i].move && this.points[i].move(this.canvas);
    }

    this.mouse.decreaseRadius(2);
  }

  tick = (now) => {
    if (!this.raf) return;

    this.drawScene();

    // Calculate drawing FPS
    if (this.fps.callback) {
      const nowInSeconds = now * 0.001; // convert to seconds
      const deltaTime = nowInSeconds - this.fps.then;
      if (performance.now() - this.fps.last > 1000) {
        this.fps.current = 1 / deltaTime;
        this.fps.last = performance.now();
        this.fps.callback(this.fps.current.toFixed(1));
      }
      this.fps.then = nowInSeconds;
    }

    this.raf = requestAnimationFrame(this.tick);
  };

  start = () => {
    this.init();
    this.addEventListeners();
    this.raf = requestAnimationFrame(this.tick);
  };

  stop = () => {
    this.removeEventListeners();
    cancelAnimationFrame(this.raf);
    this.raf = null;
  };

  toggleFPS = (cb) =>
    !!(this.fps.callback = this.fps.callback ? undefined : cb);

  showConnections = (value) => {
    this.connections.showConnections = value;
    this.initConnections();
  };

  changeDistanceThreshold(min, max) {
    this.connections.distanceThresholdMin = min * this.dpRatio;
    this.connections.distanceThresholdMax = max * this.dpRatio;
    this.initConnections();
  }

  changeMouseRadius(min, max) {
    [this.mouse.radiusMin, this.mouse.radiusMax] = [min, max];
  }

  addEventListeners() {
    window.addEventListener("resize", this.evResize);
    this.canvas.addEventListener("mousemove", this.evMove);
    this.canvas.addEventListener("touchmove", this.evMove);
  }

  removeEventListeners() {
    window.removeEventListener("resize", this.evResize);
    this.canvas.removeEventListener("mousemove", this.evMove);
    this.canvas.removeEventListener("touchmove", this.evMove);
  }

  evMove = (e) => {
    e.preventDefault();
    this.mouse.X = e.layerX;
    this.mouse.Y = e.layerY;
    this.mouse.increaseRadius(10);
  };

  evResize = debounce(this.init, 250);
}
