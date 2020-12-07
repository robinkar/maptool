import React from "react";

export default function CoordinateBox(props: {
  pos: { x: number; y: number };
}) {
  return (
    <div className="coord-box">
      <input type="text" value={props.pos.x} readOnly className="coord-input" />
      <input type="text" value={props.pos.y} readOnly className="coord-input" />
    </div>
  );
}
