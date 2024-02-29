import { useEffect, useRef, useState } from "react";

export default function HoneyDropEffect() {
  const canvasRef = useRef(null);
  const [ctx, setCtx] = useState(null);

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

    if (!ctx) return;

    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    //ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    window.addEventListener("resize", () => {
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
    });
  }, [canvasRef, ctx]);

  return <canvas ref={canvasRef}></canvas>;
}
