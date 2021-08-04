import { Particles } from "../particles";
import { Point } from "./particle";
import { rangeMap } from "../utility";

export class ParticlesText extends Particles {
  constructor(canvas, { text, ...options }) {
    super(canvas, options);

    /** @type {ImageData} */
    this.textCoordinates = null;

    this.text = text;
    this.adjustX = 0;
    this.adjustY = 0;
    this.spreadX = 20;
    this.spreadY = 20;

    // Initialization order
    this.initFunctions = [
      this.initPosition,
      this.drawText,
      this.populate,
      this.initConnections,
    ];
  }

  initPosition = () => {
    const mappingX =
      this.screenWidth > this.screenHeight
        ? rangeMap([0, this.screenWidth], [0, 10])(this.canvas.width)
        : 0;

    const mappingY = rangeMap(
      [0, this.screenHeight],
      [0, 0]
    )(this.canvas.height);

    [this.adjustX, this.adjustY] = [mappingX, mappingY];
  };

  drawText = () => {
    const font = rangeMap([0, this.screenWidth], [10, 30])(this.canvas.width);

    this.ctx.fillStyle = "white";
    this.ctx.font = `${font}px Verdana`;
    this.ctx.fillText(this.text, 0, 30);

    // Visualize scanning rect for debugging
    this.ctx.strokeStyle = "red";
    this.ctx.strokeRect(0, 0, font * 3, 50);

    this.textCoordinates = this.ctx.getImageData(0, 0, font * 3, 50);
  };

  populate = () => {
    this.points = [];

    const positionOffset = rangeMap(
      [0, this.screenWidth],
      [5, 14 + 10 * this.dpRatio]
    )(this.canvas.width);

    for (let y = 0, y2 = this.textCoordinates.height; y < y2; y++) {
      for (let x = 0, x2 = this.textCoordinates.width; x < x2; x++) {
        if (
          // Every 4th element of array, maybe some optimization ?
          this.textCoordinates.data[
            y * 4 * this.textCoordinates.width + x * 4 + 3
          ] > 128
        ) {
          const positionX = x + this.adjustX;
          const positionY = y + this.adjustY;
          this.points.push(
            new Point(positionX * positionOffset, positionY * positionOffset)
          );
        }
      }
    }
  };
}
