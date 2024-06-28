import React from "react";
import { WorkspaceContext } from "../../Contexts/Workspace";
import uuid from "react-uuid";

const arrowRadius = 10;

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

      // Set quad radius
      let qr = 20;

      const dy = Math.abs(a.y - b.y);
      if (dy <= qr * 2) qr = dy / 2;

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

      // Set quad radius
      let qr = 20;

      const dy = Math.abs(a.y - b.y);
      if (dy <= qr * 2) qr = dy / 2;

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

      // Set quad radius
      let qr = 20;

      const dy = Math.abs(a.x - b.x);
      if (dy <= qr * 2) qr = dy / 2;

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

      // Set quad radius
      let qr = 20;

      const dx = Math.abs(a.x - b.x);
      if (dx <= qr * 2) qr = dx / 2;

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
    } else if (a.side == "right" && b.side == "bottom") {
      // Right to Bottom

      // Set quad radius
      let qr = 20;

      const dx = Math.abs(a.x - b.x);
      if (dx <= qr * 2) qr = dx / 2;

      // Line 1
      const l1 = horizontalLine(
        a.x,
        b.x - a.x - qr + start.width / 2,
        a.y + start.width / 2
      );

      // Line 2
      const l2 = verticalLine(l1.y1 - qr, b.y + space, b.x + start.width / 2);

      // Quad 1
      const q1 = bottomRightQuad(l2.x1, l1.y1, qr);

      // Arrow
      const arrow = arrowTip(l2.x1, l2.y2, arrowRadius, "up");

      paths.push(
        <Line {...l1} />,
        <Corner {...q1} />,
        <Line {...l2} />,
        <Arrow {...arrow} />
      );
    } else if (a.side == "bottom" && b.side == "right") {
      // Bottom to Right

      // Set quad radius
      let qr = 20;

      const dx = Math.abs(a.x - b.x);
      if (dx <= qr * 2) qr = dx / 2;

      // Line 1
      const l1 = verticalLine(a.y, b.y - qr, a.x);

      // Line 2
      const l2 = horizontalLine(a.x - qr, b.x + space, b.y);

      // Quad 1
      const q1 = bottomRightQuad(a.x, b.y, qr);

      // Arrow
      const arrow = arrowTip(b.x + space, b.y, arrowRadius, "left");

      paths.push(
        <Line {...l1} />,
        <Corner {...q1} />,
        <Line {...l2} />,
        <Arrow {...arrow} />
      );
    } else if (a.side == "bottom" && b.side == "left") {
      // Bottom to Left

      // Set quad radius
      let qr = 20;

      const dx = Math.abs(a.x - b.x);
      if (dx <= qr * 2) qr = dx / 2;

      // Line 1
      const l1 = verticalLine(a.y, b.y - qr, a.x + start.width / 2);

      // Line 2
      const l2 = horizontalLine(l1.x1 + qr, b.x + space, b.y);

      // Quad 1
      const q1 = bottomLeftQuad(l1.x1 + qr, b.y, qr);

      // Arrow
      const arrow = arrowTip(b.x + space, b.y, arrowRadius, "right");

      paths.push(
        <Line {...l1} />,
        <Corner {...q1} />,
        <Line {...l2} />,
        <Arrow {...arrow} />
      );
    } else if (a.side == "left" && b.side == "bottom") {
      // Bottom to Left

      // Set quad radius
      let qr = 20;

      const dx = Math.abs(a.x - b.x);
      if (dx <= qr * 2) qr = dx / 2;

      // Line 1
      const l1 = horizontalLine(
        a.x + start.width,
        b.x + start.width / 2 + qr,
        a.y + start.height / 2
      );

      // Line 2
      const l2 = verticalLine(
        a.y - qr + start.height / 2,
        b.y + space,
        b.x + start.width / 2
      );

      // Quad 1
      const q1 = bottomLeftQuad(l2.x1 + qr, l1.y1, qr);

      // Arrow
      const arrow = arrowTip(l2.x1, b.y + space, arrowRadius, "up");

      paths.push(
        <Line {...l1} />,
        <Corner {...q1} />,
        <Line {...l2} />,
        <Arrow {...arrow} />
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
              className="absolute -z-50 hover:opacity-50 cursor-pointer"
              style={{
                position: "absolute",
                top: Math.min(start.y, end.y) - this.state.deltaY,
                left: Math.min(start.x, end.x) - this.state.deltaX,
                overflow: "visible",
              }}
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
            >
              {paths}
            </svg>
          </div>
        )}
      </WorkspaceContext.Consumer>
    );
  }
}

function Corner({ x1, y1, qx, qy, x2, y2 }) {
  return (
    <path
      key={uuid()}
      d={`M ${x1} ${y1} Q ${qx} ${qy} ${x2} ${y2}`}
      stroke="black"
      fill="transparent"
    />
  );
}

function Line({ x1, y1, x2, y2 }) {
  return (
    <path
      key={uuid()}
      d={`M ${x1} ${y1} L ${x2} ${y2}`}
      stroke="black"
      fill="transparent"
    />
  );
}

function Arrow({ x1, y1, x2, y2, x3, y3 }) {
  return (
    <path
      key={uuid()}
      d={`M ${x1} ${y1} L ${x2} ${y2} L ${x3} ${y3}`}
      stroke="black"
      fill="transparent"
    />
  );
}

// Angles
const bottomRightQuad = (offsetX = 0, offsetY = 0, radius = 20) => {
  const quad = {
    x1: 0,
    y1: radius,
    x2: radius,
    y2: 0,
    qx: radius,
    qy: radius,
  };

  quad.x1 += offsetX;
  quad.y1 += offsetY;
  quad.x2 += offsetX;
  quad.y2 += offsetY;
  quad.qx += offsetX;
  quad.qy += offsetY;
  quad.x1 -= radius;
  quad.y1 -= radius;
  quad.x2 -= radius;
  quad.y2 -= radius;
  quad.qx -= radius;
  quad.qy -= radius;
  return quad;
};

const bottomLeftQuad = (offsetX = 0, offsetY = 0, radius = 20) => {
  const quad = {
    x1: radius,
    y1: radius,
    x2: 0,
    y2: 0,
    qx: 0,
    qy: radius,
  };

  quad.x1 += offsetX;
  quad.y1 += offsetY;
  quad.x2 += offsetX;
  quad.y2 += offsetY;
  quad.qx += offsetX;
  quad.qy += offsetY;
  quad.x1 -= radius;
  quad.y1 -= radius;
  quad.x2 -= radius;
  quad.y2 -= radius;
  quad.qx -= radius;
  quad.qy -= radius;
  return quad;
};

const topLeftQuad = (offsetX = 0, offsetY = 0, radius = 20) => {
  const quad = {
    x1: -radius,
    y1: -radius,
    x2: 0,
    y2: 0,
    qx: -radius,
    qy: -radius,
  };

  quad.x1 += offsetX;
  quad.y1 += offsetY;
  quad.x2 += offsetX;
  quad.y2 += offsetY;
  quad.qx += offsetX;
  quad.qy += offsetY;
  quad.x1 += radius;
  quad.y1 += radius;
  quad.x2 += radius;
  quad.y2 += radius;
  quad.qx += radius;
  quad.qy += radius;
  return quad;
};

const topRightQuad = (offsetX = 0, offsetY = 0, radius = 20) => {
  const quad = {
    x1: 0,
    y1: -radius,
    x2: radius,
    y2: 0,
    qx: radius,
    qy: -radius,
  };

  quad.x1 += offsetX;
  quad.y1 += offsetY;
  quad.x2 += offsetX;
  quad.y2 += offsetY;
  quad.qx += offsetX;
  quad.qy += offsetY;
  quad.x1 -= radius;
  quad.y1 += radius;
  quad.x2 -= radius;
  quad.y2 += radius;
  quad.qx -= radius;
  quad.qy += radius;
  return quad;
};

// Lines
const horizontalLine = (x1, x2, y) => {
  const line = {
    x1: x1,
    y1: y,
    x2: x2,
    y2: y,
  };
  return line;
};

const verticalLine = (y1, y2, x) => {
  const line = {
    x1: x,
    y1: y1,
    x2: x,
    y2: y2,
  };
  return line;
};

// Arrow Tip
const arrowTip = (offsetX = 0, offsetY = 0, radius = 20, direction = "up") => {
  let points = {
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
    x3: 0,
    y3: 0,
    qx1: 0,
    qy1: 0,
    qx2: 0,
    qy2: 0,
  };

  switch (direction) {
    case "up":
      points = {
        x1: -radius,
        y1: radius,
        x2: 0,
        y2: 0,
        x3: radius,
        y3: radius,
        qx1: -radius,
        qy1: radius / 2,
        qx2: radius,
        qy2: radius / 2,
      };
      break;
    case "down":
      points = {
        x1: -radius,
        y1: -radius,
        x2: 0,
        y2: 0,
        x3: radius,
        y3: -radius,
        qx1: -radius,
        qy1: -radius / 2,
        qx2: radius,
        qy2: -radius / 2,
      };
      break;
    case "left":
      points = {
        x1: radius,
        y1: -radius,
        x2: 0,
        y2: 0,
        x3: radius,
        y3: radius,
        qx1: radius / 2,
        qy1: -radius,
        qx2: radius / 2,
        qy2: radius,
      };
      break;
    case "right":
      points = {
        x1: -radius,
        y1: -radius,
        x2: 0,
        y2: 0,
        x3: -radius,
        y3: radius,
        qx1: -radius / 2,
        qy1: -radius,
        qx2: -radius / 2,
        qy2: radius,
      };
      break;
    default:
      throw new Error(
        'Invalid direction. Use "up", "down", "left", or "right".'
      );
  }

  points.x1 += offsetX;
  points.y1 += offsetY;
  points.x2 += offsetX;
  points.y2 += offsetY;
  points.x3 += offsetX;
  points.y3 += offsetY;
  points.qx1 += offsetX;
  points.qy1 += offsetY;
  points.qx2 += offsetX;
  points.qy2 += offsetY;

  return points;
};
