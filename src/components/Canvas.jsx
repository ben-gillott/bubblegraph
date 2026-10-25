import React, { useRef, useEffect, useState } from "react";

function Canvas() {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const ballsRef = useRef([]);
  const linesRef = useRef([]);
  const draggingLine = useRef(false);
  const dragSrcCoord = useRef({ x: 0, y: 0 });
  const mouseCoord = useRef({ x: 0, y: 0 });

  const addBall = (x, y) => {
    ballsRef.current.push({
      x,
      y,
      r: 50,
      vx: 0,
      vy: 0,
      color: "red",
      bordercolor: "black",
      selected: false,
    });
  };

  const addLine = (ax, ay, bx, by) => {
    linesRef.current.push({
      ax,
      ay,
      bx,
      by,
    });
  };

  const handleMouseMove = (event) => {
    const canvas = event.target;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left; // Adjust for canvas offset
    const y = event.clientY - rect.top; // Adjust for canvas offset

    mouseCoord.x = x;
    mouseCoord.y = y;

    if (draggingLine) {
      draw();
    }
  };

  const handleClick = (event) => {
    // console.log(`Clicked position: (${mouseCoord.x}, ${mouseCoord.y})`);

    addBall(mouseCoord.x, mouseCoord.y);
    addLine(dragSrcCoord.x, dragSrcCoord.y, mouseCoord.x, mouseCoord.y);

    console.log(ballsRef);
    console.log(linesRef);

    dragSrcCoord.x = mouseCoord.x;
    dragSrcCoord.y = mouseCoord.y;
    draggingLine.current = true;

    draw();
  };

  const draw = () => {
    // console.log("DRAWING");
    const canvas = canvasRef.current; // find the target canvas element
    const ctx = canvas.getContext("2d"); // initialize a canvas "context"
    const rect = canvas.getBoundingClientRect();

    const w = rect.width;
    const h = rect.height;
    // console.log("Canvas rect w,h: ", w, h);

    // const offsetX = rect.left;
    // const offsetY = rect.top;
    // console.log("Canvas offset:", offsetX, offsetY);

    ctx.clearRect(0, 0, w, h); //reset canvas

    //Draw line if dragging
    if (draggingLine) {
      ctx.beginPath(); // Start a new path
      ctx.moveTo(dragSrcCoord.x, dragSrcCoord.y);
      ctx.lineTo(mouseCoord.x, mouseCoord.y);
      ctx.stroke(); // Render the path
    }

    //Draw existing lines
    for (const line of linesRef.current) {
      ctx.beginPath(); // Start a new path
      ctx.moveTo(line.ax, line.ay);
      ctx.lineTo(line.bx, line.by);
      ctx.stroke(); // Render the path
    }

    for (const b of ballsRef.current) {
      //Highlight a ball if hovering

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
        backgroundColor: "lightblue",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <canvas
        width="800"
        height="600"
        ref={canvasRef}
        // onPointerDown={onPointerDown}
        // onPointerMove={onPointerMove}
        // onPointerUp={onPointerUp}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
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
