import React, { useRef } from "react";
import { v4 as uuidv4 } from "uuid";

/**
 * TODO:
 * - issue, adding balls directly on top of self.
 * - display both hovered & selected somehow
 * - color constants
 * - circle outlines
 * - sidebar component
 * - switch to animation based draw (dt)
 * -  - Hover animation, generation animation, line dots animation
 * */

function Canvas() {
  const canvasRef = useRef(null);
  const wrap = useRef(null);
  const balls = useRef([]);
  const lines = useRef([]);

  const mouseCoord = useRef({ x: 0, y: 0 });

  const selectedBall = useRef(null);
  const hoveredBall = useRef(null);

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
      selected: false,
      id: uuidv4(),
    });
    return balls.current[balls.current.length - 1];
  };

  const addLine = (aBall, bBall) => {
    lines.current.push({
      aBall,
      bBall,
      thickness: 2,
      color: "black",
      id: uuidv4(),
    });
  };

  const handleMouseMove = (event) => {
    const canvasRef = event.target;
    const rect = canvasRef.getBoundingClientRect();
    const x = event.clientX - rect.left; // Adjust for canvas offset
    const y = event.clientY - rect.top; // Adjust for canvas offset

    mouseCoord.x = x;
    mouseCoord.y = y;

    //Detect ball hover
    var closestDist = Number.MAX_SAFE_INTEGER;
    var closestBall = null;

    for (const ball of balls.current) {
      ball.hovered = false;
      const dx = x - ball.x;
      const dy = y - ball.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance <= ball.r && distance < closestDist) {
        closestDist = distance;
        closestBall = ball;
      }
    }
    if (closestBall) {
      closestBall.hovered = true;
      hoveredBall.current = closestBall;
    } else {
      hoveredBall.current = null;
    }

    draw();
  };

  const handleClick = (event) => {
    //selected exists
    //--hovered exists
    //----not same -> add line. deselect.
    //----is same -> deselect
    //--hovered dne -> add ball, with line between
    //selected dne
    //--hovered exists -> select
    //--hovered dne -> add new ball

    if (selectedBall.current) {
      if (hoveredBall.current) {
        if (hoveredBall.current.id !== selectedBall.current.id) {
          //Add line between
          addLine(selectedBall.current, hoveredBall.current);
          console.log("Added line. \nLines", lines);
        } else {
          //Clicked yourself to deselect
          console.log("Deselected.");
        }
      } else {
        //Add a ball and a line from selected to it. Deselect.
        let newBall = addBall(mouseCoord.x, mouseCoord.y);
        addLine(selectedBall.current, newBall);
        console.log("Added ball with line.");
        console.log("Balls:", balls);
        console.log("Lines:", lines);
      }
      //Deselect if clicked selected, or clicked space, or clicked ball
      selectedBall.current = null;
    } else {
      if (hoveredBall.current) {
        //Select hovered
        selectedBall.current = hoveredBall.current;
        console.log("Selected ball. ID:", selectedBall.current.id);
      } else {
        //Add new ball
        addBall(mouseCoord.x, mouseCoord.y);
        console.log("Added ball.\nBalls:", balls);
      }
    }

    draw();
  };

  const draw = () => {
    // console.log("DRAWING");
    const canvas = canvasRef.current; // find the target canvas element
    const ctx = canvas.getContext("2d"); // initialize a canvas "context"
    const rect = canvas.getBoundingClientRect();

    const w = rect.width;
    const h = rect.height;

    //Calculate offset
    // console.log("Canvas rect w,h: ", w, h);
    // const offsetX = rect.left;
    // const offsetY = rect.top;
    // console.log("Canvas offset:", offsetX, offsetY);

    //Reset canvas
    ctx.clearRect(0, 0, w, h);

    //Draw dragline
    if (selectedBall.current) {
      ctx.strokeStyle = "rgba(31, 55, 236, 0.8)";
      ctx.setLineDash([6, 6]);
      ctx.lineWidth = 3;

      ctx.beginPath(); // Start a new path
      ctx.moveTo(selectedBall.current.x, selectedBall.current.y);
      ctx.lineTo(mouseCoord.x, mouseCoord.y);
      ctx.stroke(); // Render the path
    }

    //Draw lines
    for (const line of lines.current) {
      ctx.strokeStyle = line.color;
      ctx.lineWidth = line.thickness;
      ctx.setLineDash([0, 0]);

      ctx.beginPath(); // Start a new path
      ctx.moveTo(line.aBall.x, line.aBall.y);
      ctx.lineTo(line.bBall.x, line.bBall.y);
      ctx.stroke(); // Render the path
    }

    //Draw balls
    for (const b of balls.current) {
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);

      //Highlight a ball if hovering
      if (selectedBall.current && b.id == selectedBall.current.id) {
        ctx.fillStyle = "green";
      } else if (hoveredBall.current && b.id === hoveredBall.current.id) {
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
