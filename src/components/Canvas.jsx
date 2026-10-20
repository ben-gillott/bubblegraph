import React, { useRef, useEffect, useState } from "react";

function Canvas() {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const ballsRef = useRef([]);

  const addBall = (x, y) => {
    ballsRef.current.push({
      x,
      y,
      r: 50,
      vx: 0,
      vy: 0,
      color: "red",
    });
  };

  const handleClick = (event) => {
    const canvas = event.target;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left; // Adjust for canvas offset
    const y = event.clientY - rect.top; // Adjust for canvas offset
    console.log(`Clicked position: (${x}, ${y})`);
    addBall(x, y);

    console.log(ballsRef);
    draw();
  };

  const draw = () => {
    console.log("DRAWING");
    const canvas = canvasRef.current; // find the target canvas element
    const ctx = canvas.getContext("2d"); // initialize a canvas "context"
    const rect = canvas.getBoundingClientRect();

    const w = rect.width;
    const h = rect.height;
    console.log("Canvas rect w,h: ", w, h);

    const offsetX = rect.left;
    const offsetY = rect.top;
    console.log("Canvas offset:", offsetX, offsetY);

    ctx.clearRect(0, 0, w, h); //reset canvas

    for (const b of ballsRef.current) {
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fillStyle = b.color;
      ctx.fill();
    }
  };

  return (
    <div
      ref={wrapRef}
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "blue",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <canvas
        width="700"
        height="600"
        ref={canvasRef}
        // onPointerDown={onPointerDown}
        // onPointerMove={onPointerMove}
        // onPointerUp={onPointerUp}
        onClick={handleClick}
        style={{
          display: "block",
          borderRadius: 8,
          touchAction: "none",
          cursor: "crosshair",
          backgroundColor: "#eeeeee",
          imageRendering: "pixelated",
        }}
      />
    </div>
  );
}

export default Canvas;
