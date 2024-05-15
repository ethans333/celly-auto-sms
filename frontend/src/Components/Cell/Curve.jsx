import React, { useEffect, useState, useContext } from "react";
import { WorkspaceContext } from "../../Contexts/Workspace";
import uuid from "react-uuid";

export class Curve extends React.Component {
  id = uuid();

  constructor(props) {
    super(props);
    this.state = {
      start: this.props.start, // Node
      end: this.props.end, // Node
    };
  }

  render() {
    const start = this.state.start.ref.current.getBoundingClientRect();
    const end = this.state.end.ref.current.getBoundingClientRect();

    const a = {
      x: start.x < end.x ? 0 : start.x - end.x,
      y: start.y < end.y ? 0 : start.y - end.y,
    };

    const b = {
      x: start.x < end.x ? end.x - start.x : 0,
      y: start.y < end.y ? end.y - start.y : 0,
    };

    const mid1 = {
      x: (a.x + b.x) / 2,
      y: (a.y + b.y) / 2,
    };

    const offset = {
      x: (a.x - b.x) * 0.3,
      y: (a.y - b.y) * 0.3,
    };

    const c1 = {
      x: mid1.x - offset.y,
      y: mid1.y + offset.x,
    };

    const c2 = {
      x: mid1.x + offset.y,
      y: mid1.y - offset.x,
    };

    return (
      <WorkspaceContext.Consumer>
        {(context) => (
          <div className="relative">
            <svg
              fill="white"
              stroke="black"
              strokeWidth={5}
              className="absolute -z-50"
              style={{
                top: Math.min(start.y, end.y) + start.width / 2,
                left: Math.min(start.x, end.x) + start.width / 2,
                overflow: "visible",
              }}
            >
              <path
                onClick={() => {
                  // Delete curve
                  this.state.start.setState((p) => {
                    return {
                      selected: p.next.length + p.prev.length - 1 > 0,
                      next: p.next.filter((e) => e.current != this),
                      prev: p.prev.filter((e) => e.current != this),
                    };
                  });

                  this.state.end.setState((p) => {
                    return {
                      selected: p.next.length + p.prev.length - 1 > 0,
                      next: p.next.filter((e) => e.current != this),
                      prev: p.prev.filter((e) => e.current != this),
                    };
                  });

                  context.setComponentsStack((p) =>
                    p.filter((e) => {
                      return e.ref?.current.id != this.id;
                    })
                  );
                }}
                className="hover:opacity-30 cursor-pointer"
                d={`M${a.x},${a.y} C${c1.x},${c1.y} ${c2.x},${c2.y} ${b.x},${b.y}`}
                style={{
                  strokeDasharray: "20,1",
                  strokeDashoffset: 0, // Change over time
                }}
              />
            </svg>
          </div>
        )}
      </WorkspaceContext.Consumer>
    );
  }
}
