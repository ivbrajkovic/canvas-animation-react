const MAX_SIZE = 3;
const MAX_DENSITY = 30;
const DEFAULT_COLOR = "rgba(255,255,255)";

export class Point {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.baseX = this.x;
    this.baseY = this.y;
    this.size = Math.random() * (size || MAX_SIZE) + 1;
    this.density = Math.random() * MAX_DENSITY + 1;
  }

  draw(ctx, color) {
    ctx.fillStyle = color || DEFAULT_COLOR;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }

  update(mouse) {
    const dx = mouse.X - this.x;
    const dy = mouse.Y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy); // 2 time faster

    if (distance < mouse.radius) {
      const forceDirectionX = dx / distance;
      const forceDirectionY = dy / distance;
      const force = (mouse.radius - distance) / mouse.radius;
      const directionX = forceDirectionX * force * this.density;
      const directionY = forceDirectionY * force * this.density;
      this.x -= directionX;
      this.y -= directionY;
    } else {
      if (this.x !== this.baseX) {
        const dx = this.x - this.baseX;
        this.x -= dx / 50;
      }
      if (this.y !== this.baseY) {
        const dy = this.y - this.baseY;
        this.y -= dy / 50;
      }
    }
  }
}
