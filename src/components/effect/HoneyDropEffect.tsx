import { useEffect, useRef, useState } from "react";
import honeyCellImage from "@/assets/honey-cell.svg";

const honeyCellSprite = new Image();
honeyCellSprite.src = honeyCellImage;

class honeyCell {
  LIFE_TIME: number = 1000;

  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  radius: number = 20;
  spawnTime: number;

  constructor(ctx, x, y, spawnTime) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.spawnTime = spawnTime;
  }

  /**
   * Update the frame of the honey cell
   *
   * @returns boolean true if the cell is still alive, false if it's dead
   */
  updateFrame(): boolean {
    if (Date.now() - this.spawnTime > this.LIFE_TIME) return false;

    this.ctx.beginPath();
    const remainingLife = 1 - (Date.now() - this.spawnTime) / this.LIFE_TIME;
    this.ctx.globalAlpha = remainingLife;
    this.ctx.drawImage(
      honeyCellSprite,
      this.x,
      this.y,
      this.radius * remainingLife,
      this.radius * remainingLife
    );

    return true;
  }
}

export default function HoneyDropEffect() {
  const HONEY_CELL_SPAWN_RATE: number = 200;

  const canvasRef = useRef(null);
  const [ctx, setCtx] = useState(null);
  const [honeyCells] = useState([]);
  const [lastCellSpawn, setLastCellSpawn] = useState(0);

  //init animation interval

  useEffect(() => {
    const updateFrame = () => {
      if (!ctx) return;

      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      for (let i = 0; i < honeyCells.length; i++) {
        if (!honeyCells[i].updateFrame()) honeyCells.splice(i, 1);
      }
    };

    const interval = setInterval(updateFrame, 1000 / 60);
    return () => clearInterval(interval);
  }, [ctx, honeyCells]);

  //init resize listener
  useEffect(() => {
    const resize = () => {
      if (!canvasRef.current) return;
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
    };

    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [canvasRef]);

  //init mouse listener
  useEffect(() => {
    const mouseMove = (e) => {
      if (!ctx) return;
      if (Date.now() - lastCellSpawn < HONEY_CELL_SPAWN_RATE) return;
      setLastCellSpawn(Date.now());

      const spawnNum = Math.floor(Math.random() * 2) + 1;

      for (let i = 0; i < spawnNum; i++) {
        const x = e.clientX + Math.random() * 24 - 12;
        const y = e.clientY + Math.random() * 24 - 12;

        const honey = new honeyCell(ctx, x, y, Date.now());
        honeyCells.push(honey);
      }
    };

    window.addEventListener("mousemove", mouseMove);
    return () => window.removeEventListener("mousemove", mouseMove);
  }, [ctx, honeyCells, lastCellSpawn]);

  //init canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    canvasRef.current.width = window.innerWidth;
    canvasRef.current.height = window.innerHeight;
    canvasRef.current.style.position = "fixed";
    canvasRef.current.style.top = "0";
    canvasRef.current.style.left = "0";
    canvasRef.current.style.pointerEvents = "none";
    canvasRef.current.style.zIndex = "10000";

    setCtx(canvasRef.current.getContext("2d"));
  }, [canvasRef, ctx]);

  return <canvas ref={canvasRef}></canvas>;
}
