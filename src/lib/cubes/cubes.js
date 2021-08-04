import merge from "lodash-es/merge";

import createState from "./state";
import { degToRad } from "../utility";
import {
  getWebGLContext,
  initShaders,
  setupWebGL,
  resizeCanvasToDisplaySize,
  setAttributes,
  setIndices,
  getUniformLocations,
} from "./lib/gl-utils";

import { mat4 } from "gl-matrix";

const VS = `
  attribute vec4 a_Position;
  uniform mat4 u_Matrix;

  void main(void) {
    gl_Position = u_Matrix * a_Position;
  }
`;

const FS = `
  precision mediump float;
  uniform float u_Opacity;

  void main(void) {
    gl_FragColor = vec4(23, 184, 144, u_Opacity);
  }
`;

export class Cubes {
  constructor(canvas, { fpsCallback, ...config }) {
    const state = createState();
    this.state = merge(state, config);

    this.state.gl = getWebGLContext(canvas);
    /** @type {HTMLCanvasElement} */
    this.state.canvas = this.state.gl.canvas;

    this.fps = {
      then: 0,
      last: 0,
      current: 0,
      callback: fpsCallback,
    };
  }

  init = () => {
    // Create canvas element and get WebGL context from it.
    // Compile program from shader sources
    this.state.program = initShaders(this.state.gl, VS, FS);

    // Setup GL for drawing scene.
    // Set clear color, enable DEPTH_TEST, and set viewport.
    setupWebGL(this.state.gl);

    setPerspective(this.state);

    // Setup position vertex data and save buffer reference
    setAttributes(this.state);

    // Setup indices buffer and save buffer reference
    setIndices(this.state);

    // Find uniform location in program
    getUniformLocations(this.state, ["u_Matrix", "u_Opacity"]);

    // initEvents(this.state);
    // resizeCanvasToDisplaySize(this.state.canvas, window.devicePixelRatio);
    // this.state.gl.viewport(
    //   0,
    //   0,
    //   this.state.canvas.width,
    //   this.state.canvas.height,
    // );
    this.state.gl.viewport(
      0,
      0,
      this.state.gl.drawingBufferWidth,
      this.state.gl.drawingBufferHeight
    );
  };

  tick = (now) => {
    if (!this.state.raf) return;

    drawScene(this.state, 0.01); // maybe use delta time ?

    if (this.fps.callback) {
      const nowToSecond = now * 0.001; // convert to seconds
      const deltaTime = nowToSecond - this.fps.then;
      if (performance.now() - this.fps.last > 1000) {
        this.fps.current = 1 / deltaTime;
        this.fps.last = performance.now();
        this.fps.callback(this.fps.current.toFixed(1));
      }
      this.fps.then = nowToSecond;
    }

    this.state.raf = requestAnimationFrame(this.tick);
  };

  start = () => {
    this.init();
    this.addEventListeners();
    this.state.raf = requestAnimationFrame(this.tick);
  };

  stop = () => {
    this.removeEventListeners();
    cancelAnimationFrame(this.state.raf);
    this.state.raf = null;
  };

  changeCameraSpeed = (value) => (this.state.camera.speed = value);

  toggleFPS = (cb) =>
    !!(this.fps.callback = this.fps.callback ? undefined : cb);

  addEventListeners() {
    const { canvas } = this.state;
    // window.addEventListener("resize", this.evResize);
    canvas.addEventListener("mousedown", this.evDown);
    canvas.addEventListener("mouseup", this.evUp);
    canvas.addEventListener("mousemove", this.evMove);
    canvas.addEventListener("wheel", this.evWheel);

    canvas.addEventListener("touchstart", this.evDown);
    canvas.addEventListener("touchend", this.evUp);
    canvas.addEventListener("touchmove", this.evMove);
  }

  removeEventListeners() {
    const { canvas } = this.state;
    // window.removeEventListener("resize", this.evResize);
    canvas.removeEventListener("mousedown", this.evDown);
    canvas.removeEventListener("mouseup", this.evUp);
    canvas.removeEventListener("mousemove", this.evMove);
    canvas.removeEventListener("wheel", this.evWheel);

    canvas.removeEventListener("touchstart", this.evDown);
    canvas.removeEventListener("touchend", this.evUp);
    canvas.removeEventListener("touchmove", this.evMove);
  }

  evDown = (e) => {
    e.preventDefault();
    this.state.ui.mouse.dragging = true;
    this.state.ui.mouse.lastX = e.layerX;
    this.state.ui.mouse.lastY = e.layerY;
  };

  evUp = (e) => {
    e.preventDefault();
    this.state.ui.mouse.dragging = false;
  };

  evMove = (e) => {
    e.preventDefault();

    // const x = e.targetTouches ? e.targetTouches[0].clientX : e.clientX;
    // const y = e.targetTouches ? e.targetTouches[0].clientY : e.clientY;

    // The rotation speed factor
    // dx and dy here are how for in the x or y direction the mouse moved
    if (this.state.ui.mouse.dragging) {
      // const factor = 100 / this.state.canvas.height; // adjust for speed
      const factor = e.targetTouches ? 0.2 : 0.1;
      const dx = factor * (e.layerX - this.state.ui.mouse.lastX);
      const dy = factor * (e.layerY - this.state.ui.mouse.lastY);

      // update the latest angle
      this.state.camera.angle.x = this.state.camera.angle.x + dy;
      this.state.camera.angle.y = this.state.camera.angle.y + dx;

      // updateCameraAngle();
    }
    // update the last mouse position
    this.state.ui.mouse.lastX = e.layerX;
    this.state.ui.mouse.lastY = e.layerY;
  };

  evWheel = (e) => {
    e.preventDefault();
    if (!e.deltaMode) this.state.camera.radius += e.deltaY * 0.006;
    else if (e.deltaMode === 1) this.state.camera.radius += e.deltaY * 0.15;
  };
  // { passive: true }
}

//
// Setup perspective matrix
//
function setPerspective(state) {
  const perspective = mat4.create();
  // const field = (75 * Math.PI) / 180;
  const field = degToRad(75);
  const aspect = state.gl.canvas.clientWidth / state.gl.canvas.clientHeight;
  // mat4.perspective(pm, field, aspect, 1e-4, 1e4);
  mat4.perspective(perspective, field, aspect, 0.1, 100);
  state.matrix.perspective = perspective;
}

//
// Draw objects on scene
//
function drawScene(state, deltaTime) {
  // Resize canvas if window is resized maintaining aspect ratio
  if (resizeCanvasToDisplaySize(state.gl.canvas, window.devicePixelRatio)) {
    state.gl.viewport(0, 0, state.gl.canvas.width, state.gl.canvas.height);
    setPerspective(state);
  }

  // Clear the canvas AND the depth buffer
  state.gl.clear(state.gl.COLOR_BUFFER_BIT | state.gl.DEPTH_BUFFER_BIT);

  // Set the uniforms that are the same for all objects.
  state.gl.uniform1f(state.uniforms.u_Opacity, state.color.opacity);

  // render all object from state
  for (const [key] of Object.entries(state.objects)) {
    state.objects[key].array.forEach((obj) => {
      const indexBuffer = obj.selected
        ? state.objects[key].common.indexSelected.buffer
        : state.objects[key].common.index.buffer;

      const indexBufferLength = obj.selected
        ? state.objects[key].common.indexSelected.data.length
        : state.objects[key].common.index.data.length;

      state.gl.bindBuffer(state.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

      updateCube(obj.matrix.model, obj.speed, deltaTime);
      updateCamera(state, deltaTime);

      // ----------------------------------------------------
      // mvp matrix
      const mvp = mat4.create();

      // V * M
      mat4.multiply(mvp, state.matrix.camera, obj.matrix.model);

      // P * MV => (M * V * P)
      // mat4.multiply(mvp, perspectiveMatrix, mv);
      mat4.multiply(mvp, state.matrix.perspective, mvp);

      // ----------------------------------------------------
      // // P * M
      // mat4.multiply(mvp, matrix.perspective, mm);

      // Set the uniforms that are the same for all objects.
      state.gl.uniformMatrix4fv(state.uniforms.u_Matrix, false, mvp);

      // Draw the geometry.
      state.gl.drawElements(
        state.gl.LINES,
        indexBufferLength,
        state.gl.UNSIGNED_SHORT,
        0
      );
    });
  }
}

//
// Camera animation
//
function updateCamera(state, deltaTime) {
  const camera = mat4.create();

  !state.ui.mouse.dragging &&
    (state.camera.angle.y += deltaTime * state.camera.speed);

  mat4.rotateX(camera, camera, degToRad(state.camera.angle.x));
  mat4.rotateY(camera, camera, degToRad(state.camera.angle.y));
  mat4.translate(camera, camera, [0, 0, state.camera.radius * 1.5]);
  mat4.invert(camera, camera);

  state.matrix.camera = camera;
}

//
// Cube animation
//
function updateCube(modelMatrix, cubeRotation, deltaTime) {
  mat4.rotate(
    modelMatrix, // destination matrix
    modelMatrix, // matrix to rotate
    deltaTime * cubeRotation, // amount to rotate in radians
    // degToRad(cubeRotation), // amount to rotate in radians
    [0, 0, 1]
  ); // axis to rotate around (Z)
  mat4.rotate(
    modelMatrix, // destination matrix
    modelMatrix, // matrix to rotate
    deltaTime * cubeRotation * 0.7, // amount to rotate in radians
    // degToRad(cubeRotation) * 0.7, // amount to rotate in radians
    [0, 1, 0]
  ); // axis to rotate around (X)
}
