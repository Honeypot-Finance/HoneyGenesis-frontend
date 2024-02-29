export default class honeyBubble {
  posX: number;
  posY: number;

  constructor(posX: number, posY: number) {
    this.posX = posX;
    this.posY = posY;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.posX, this.posY, 3, 0, 2 * Math.PI);
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.fill();
  }
}
