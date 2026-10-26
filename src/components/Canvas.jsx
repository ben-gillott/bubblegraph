import React, { useRef, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

/**
 * TODO:
 * - color constants
 * - circle outlines
 * - sidebar component start
 * - switch to animation based draw (dt)
 * */

function Canvas() {
  const canvasRef = useRef(null);
  const wrap = useRef(null);
  const balls = useRef([]);
  const lines = useRef([]);
  const draggingLine = useRef(false);
  const dragSrcCoord = useRef({ x: 0, y: 0 });
  const mouseCoord = useRef({ x: 0, y: 0 });

  const addBall = (x, y) => {
    balls.current.push({
      x,
      y,
      r: 50,
      vx: 0,
      vy: 0,
      color: "red",
      bordercolor: "black",
      hovered: false,
      id: uuidv4(),
    });
  };

  const addLine = (ax, ay, bx, by) => {
    lines.current.push({
      ax,
      ay,
      bx,
      by,
    });
  };

  const handleMouseMove = (event) => {
    const canvasRef = event.target;
    const rect = canvasRef.getBoundingClientRect();
    const x = event.clientX - rect.left; // Adjust for canvas offset
    const y = event.clientY - rect.top; // Adjust for canvas offset

    mouseCoord.x = x;
    mouseCoord.y = y;

    //detect ball hover
    for (const ball of balls.current) {
      const dx = x - ball.x;
      const dy = y - ball.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance <= ball.r) {
        ball.hovered = true;
      } else {
        ball.hovered = false;
      }

      //TODO: Only hover closest ball
    }

    draw();
  };

  const handleClick = (event) => {
    // console.log(`Clicked position: (${mouseCoord.x}, ${mouseCoord.y})`);

    addBall(mouseCoord.x, mouseCoord.y);
    addLine(dragSrcCoord.x, dragSrcCoord.y, mouseCoord.x, mouseCoord.y);

    console.log("Balls", balls);
    console.log("Lines", lines);

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
      ctx.strokeStyle = "rgba(31, 55, 236, 0.8)";
      ctx.setLineDash([6, 6]);
      ctx.lineWidth = 3;

      ctx.beginPath(); // Start a new path
      ctx.moveTo(dragSrcCoord.x, dragSrcCoord.y);
      ctx.lineTo(mouseCoord.x, mouseCoord.y);
      ctx.stroke(); // Render the path
    }

    //Draw existing lines
    ctx.strokeStyle = "rgba(8, 8, 16, 0.8)";
    ctx.setLineDash([0, 0]);
    ctx.lineWidth = 3;
    for (const line of lines.current) {
      ctx.beginPath(); // Start a new path
      ctx.moveTo(line.ax, line.ay);
      ctx.lineTo(line.bx, line.by);
      ctx.stroke(); // Render the path
    }

    //Draw balls
    for (const b of balls.current) {
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);

      //Highlight a ball if hovering
      if (b.hovered) {
        ctx.fillStyle = "blue";
      } else {
        ctx.fillStyle = b.color;
      }

      ctx.fill();
    }
  };

  return (
    <div
      ref={wrap}
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
