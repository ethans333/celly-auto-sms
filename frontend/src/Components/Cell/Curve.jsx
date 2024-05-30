import React from "react";
import { WorkspaceContext } from "../../Contexts/Workspace";
import uuid from "react-uuid";

export class Curve extends React.Component {
  constructor(props) {
    super(props);
    this.id = this.props.id;
    this.props.start.setState({
      selected: false,
    });
    this.props.end.setState({
      selected: false,
    });

    this.state = {
      start: this.props.start, // Node
      end: this.props.end, // Node
      deltaX: props.deltaX,
      deltaY: props.deltaY,
    };
  }

  render() {
    let start = this.state.start.ref.current?.getBoundingClientRect();
    let end = this.state.end.ref.current?.getBoundingClientRect();

    if (!start || !end) return null;

    const a = {
      x: start.x < end.x ? 0 : start.x - end.x,
      y: start.y < end.y ? 0 : start.y - end.y,
      side: this.state.start.side,
    };

    const b = {
      x: start.x < end.x + end.width ? end.x - start.x : 0,
      y: start.y < end.y + end.width ? end.y - start.y : 0,
      side: this.state.end.side,
    };

    const paths = [];

    const space = 5; // Space between arrow and cell

    if (a.side == "right" && b.side == "left") {
      // Right to Left
      const mid = {
        x: Math.abs(a.x - b.x) / 2,
        y: Math.abs(a.y - b.y) / 2,
      };

      const qr = 20;

      // Line 1
      const l1 = {
        x1: a.x,
        y1: a.y,
        x2: mid.x - qr + 1,
        y2: a.y,
      };

      // Quad 1
      const q1 = {
        x1: mid.x - qr,
        y1: a.y,
        x2: mid.x,
        y2: start.y > end.y ? a.y - qr : a.y + qr,
        qx: mid.x,
        qy: a.y,
      };

      // Line 2
      const l2 = {
        x1: mid.x,
        y1: start.y > end.y ? a.y - qr : a.y + qr,
        x2: mid.x,
        y2: start.y > end.y ? b.y + qr : b.y - qr,
      };

      // Quad 2
      const q2 = {
        x1: mid.x,
        y1: start.y > end.y ? b.y + qr : b.y - qr,
        x2: mid.x + qr,
        y2: b.y,
        qx: mid.x,
        qy: b.y,
      };

      // Line 3
      const l3 = {
        x1: mid.x + qr - 1,
        y1: b.y,
        x2: b.x - space + start.width,
        y2: b.y,
      };

      const arrowr = 10;

      // Arrow
      const arrow = {
        x1: b.x - arrowr - space + start.width,
        y1: b.y - arrowr,
        x2: b.x - space + start.width,
        y2: b.y,
        x3: b.x - arrowr - space + start.width,
        y3: b.y + arrowr,
      };

      paths.push(
        <path
          key={uuid()}
          d={`M ${l1.x1} ${l1.y1} L ${l1.x2} ${l1.y2}`}
          stroke="black"
          fill="transparent"
        />,
        <path
          key={uuid()}
          d={`M ${q1.x1} ${q1.y1} Q ${q1.qx} ${q1.qy} ${q1.x2} ${q1.y2}`}
          stroke="black"
          fill="transparent"
        />,
        <path
          key={uuid()}
          d={`M ${l2.x1} ${l2.y1} L ${l2.x2} ${l2.y2}`}
          stroke="black"
          fill="transparent"
        />,
        <path
          key={uuid()}
          d={`M ${q2.x1} ${q2.y1} Q ${q2.qx} ${q2.qy} ${q2.x2} ${q2.y2}`}
          stroke="black"
          fill="transparent"
        />,
        <path
          key={uuid()}
          d={`M ${l3.x1} ${l3.y1} L ${l3.x2} ${l3.y2}`}
          stroke="black"
          fill="transparent"
        />,
        <path
          key={uuid()}
          d={`M ${arrow.x1} ${arrow.y1} L ${arrow.x2} ${arrow.y2} L ${arrow.x3} ${arrow.y3}`}
          stroke="black"
          fill="transparent"
        />
      );
    } else if (a.side == "left" && b.side == "right") {
      // Left to Right
      const mid = {
        x: Math.abs(a.x - b.x) / 2,
        y: Math.abs(a.y - b.y) / 2,
      };

      const qr = 20;

      // Line 3
      const l3 = {
        x1: a.x + start.width,
        y1: a.y,
        x2: mid.x + qr - 1,
        y2: a.y,
      };

      // Quad 1
      const q1 = {
        x1: mid.x + qr,
        y1: a.y,
        x2: mid.x,
        y2: start.y > end.y ? a.y - qr : a.y + qr,
        qx: mid.x,
        qy: a.y,
      };

      // Line 2
      const l2 = {
        x1: mid.x,
        y1: start.y > end.y ? a.y - qr : a.y + qr,
        x2: mid.x,
        y2: start.y > end.y ? b.y + qr : b.y - qr,
      };

      // Quad 2
      const q2 = {
        x1: mid.x,
        y1: start.y > end.y ? b.y + qr : b.y - qr,
        x2: mid.x - qr,
        y2: b.y,
        qx: mid.x,
        qy: b.y,
      };

      // Line 1
      const l1 = {
        x1: mid.x - qr + 1,
        y1: b.y,
        x2: b.x - space + start.width,
        y2: b.y,
      };

      const arrowr = 10;

      // Arrow
      const arrow = {
        x1: b.x + arrowr - space + start.width,
        y1: b.y + arrowr,
        x2: b.x - space + start.width,
        y2: b.y,
        x3: b.x + arrowr - space + start.width,
        y3: b.y - arrowr,
      };

      paths.push(
        <path
          key={uuid()}
          d={`M ${l1.x1} ${l1.y1} L ${l1.x2} ${l1.y2}`}
          stroke="black"
          fill="transparent"
        />,
        <path
          key={uuid()}
          d={`M ${q1.x1} ${q1.y1} Q ${q1.qx} ${q1.qy} ${q1.x2} ${q1.y2}`}
          stroke="black"
          fill="transparent"
        />,
        <path
          key={uuid()}
          d={`M ${l2.x1} ${l2.y1} L ${l2.x2} ${l2.y2}`}
          stroke="black"
          fill="transparent"
        />,
        <path
          key={uuid()}
          d={`M ${q2.x1} ${q2.y1} Q ${q2.qx} ${q2.qy} ${q2.x2} ${q2.y2}`}
          stroke="black"
          fill="transparent"
        />,
        <path
          key={uuid()}
          d={`M ${l3.x1} ${l3.y1} L ${l3.x2} ${l3.y2}`}
          stroke="black"
          fill="transparent"
        />,
        <path
          key={uuid()}
          d={`M ${arrow.x1} ${arrow.y1} L ${arrow.x2} ${arrow.y2} L ${arrow.x3} ${arrow.y3}`}
          stroke="black"
          fill="transparent"
        />
      );
    } else if (a.side == "top" && b.side == "bottom") {
      // Bottom to Top
      const mid = {
        x: Math.abs(a.x - b.x) / 2,
        y: Math.abs(a.y - b.y) / 2,
      };

      const qr = 20;

      // Line 1
      const l1 = {
        x1: a.x,
        y1: a.y + start.height,
        x2: a.x,
        y2: mid.y + qr - 1,
      };

      // Quad 1
      const q1 = {
        x1: a.x,
        y1: mid.y + qr,
        x2: start.x > end.x ? a.x - qr : a.x + qr,
        y2: mid.y,
        qx: a.x,
        qy: mid.y,
      };

      // Line 2
      const l2 = {
        x1: start.x > end.x ? a.x - qr : a.x + qr,
        y1: mid.y,
        x2: start.x > end.x ? b.x + qr : b.x - qr,
        y2: mid.y,
      };

      // Quad 2
      const q2 = {
        x1: start.x > end.x ? b.x + qr : b.x - qr,
        y1: mid.y,
        x2: b.x,
        y2: mid.y - qr,
        qx: b.x,
        qy: mid.y,
      };

      // Line 3
      const l3 = {
        x1: b.x,
        y1: mid.y - qr + 1,
        x2: b.x,
        y2: b.y + space,
      };

      const arrowr = 10;

      // Arrow
      const arrow = {
        x1: b.x - arrowr,
        y1: b.y + arrowr + space,
        x2: b.x,
        y2: b.y + space,
        x3: b.x + arrowr,
        y3: b.y + arrowr + space,
      };

      paths.push(
        <path
          key={uuid()}
          d={`M ${l1.x1} ${l1.y1} L ${l1.x2} ${l1.y2}`}
          stroke="black"
          fill="transparent"
        />,
        <path
          key={uuid()}
          d={`M ${q1.x1} ${q1.y1} Q ${q1.qx} ${q1.qy} ${q1.x2} ${q1.y2}`}
          stroke="black"
          fill="transparent"
        />,
        <path
          key={uuid()}
          d={`M ${l2.x1} ${l2.y1} L ${l2.x2} ${l2.y2}`}
          stroke="black"
          fill="transparent"
        />,
        <path
          key={uuid()}
          d={`M ${q2.x1} ${q2.y1} Q ${q2.qx} ${q2.qy} ${q2.x2} ${q2.y2}`}
          stroke="black"
          fill="transparent"
        />,
        <path
          key={uuid()}
          d={`M ${l3.x1} ${l3.y1} L ${l3.x2} ${l3.y2}`}
          stroke="black"
          fill="transparent"
        />,
        <path
          key={uuid()}
          d={`M ${arrow.x1} ${arrow.y1} L ${arrow.x2} ${arrow.y2} L ${arrow.x3} ${arrow.y3}`}
          stroke="black"
          fill="transparent"
        />
      );
    } else if (a.side == "bottom" && b.side == "top") {
      // Top to Bottom
      const mid = {
        x: Math.abs(a.x - b.x) / 2,
        y: Math.abs(a.y - b.y) / 2,
      };

      const qr = 20;

      // Line 1
      const l1 = {
        x1: a.x,
        y1: a.y,
        x2: a.x,
        y2: mid.y - qr + 1,
      };

      // Quad 1
      const q1 = {
        x1: a.x,
        y1: mid.y - qr,
        x2: start.x > end.x ? a.x - qr : a.x + qr,
        y2: mid.y,
        qx: a.x,
        qy: mid.y,
      };

      // Line 2
      const l2 = {
        x1: start.x > end.x ? a.x - qr : a.x + qr,
        y1: mid.y,
        x2: start.x > end.x ? b.x + qr : b.x - qr,
        y2: mid.y,
      };

      // Quad 2
      const q2 = {
        x1: start.x > end.x ? b.x + qr : b.x - qr,
        y1: mid.y,
        x2: b.x,
        y2: mid.y + qr,
        qx: b.x,
        qy: mid.y,
      };

      // Line 3
      const l3 = {
        x1: b.x,
        y1: mid.y + qr - 1,
        x2: b.x,
        y2: b.y - space + start.height,
      };

      const arrowr = 10;

      // Arrow
      const arrow = {
        x1: b.x - arrowr,
        y1: b.y - arrowr - space + start.height,
        x2: b.x,
        y2: b.y - space + start.height,
        x3: b.x + arrowr,
        y3: b.y - arrowr - space + start.height,
      };

      paths.push(
        <path
          key={uuid()}
          d={`M ${l1.x1} ${l1.y1} L ${l1.x2} ${l1.y2}`}
          stroke="black"
          fill="transparent"
        />,
        <path
          key={uuid()}
          d={`M ${q1.x1} ${q1.y1} Q ${q1.qx} ${q1.qy} ${q1.x2} ${q1.y2}`}
          stroke="black"
          fill="transparent"
        />,
        <path
          key={uuid()}
          d={`M ${l2.x1} ${l2.y1} L ${l2.x2} ${l2.y2}`}
          stroke="black"
          fill="transparent"
        />,
        <path
          key={uuid()}
          d={`M ${q2.x1} ${q2.y1} Q ${q2.qx} ${q2.qy} ${q2.x2} ${q2.y2}`}
          stroke="black"
          fill="transparent"
        />,
        <path
          key={uuid()}
          d={`M ${l3.x1} ${l3.y1} L ${l3.x2} ${l3.y2}`}
          stroke="black"
          fill="transparent"
        />,
        <path
          key={uuid()}
          d={`M ${arrow.x1} ${arrow.y1} L ${arrow.x2} ${arrow.y2} L ${arrow.x3} ${arrow.y3}`}
          stroke="black"
          fill="transparent"
        />
      );
    }

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
                position: "absolute",
                top: Math.min(start.y, end.y) - this.state.deltaY,
                left: Math.min(start.x, end.x) - this.state.deltaX,
                overflow: "visible",
              }}
            >
              {/* <path
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
              /> */}
              {paths}
            </svg>
          </div>
        )}
      </WorkspaceContext.Consumer>
    );
  }
}
