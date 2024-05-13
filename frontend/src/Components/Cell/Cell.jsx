import uuid from "react-uuid";
import Draggable from "react-draggable";
import React from "react";
import ellipsis from "../../assets/ellipsis-vertical.svg";
import CellMenu from "./CellComponents/CellMenu.jsx";
import { WorkspaceContext } from "../../Pages/Home.jsx";
import { Curve } from "./Curve.jsx";

class Position {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  toObject() {
    return {
      x: this.x,
      y: this.y,
    };
  }
}

class Node extends React.Component {
  constructor() {
    super();
    this.state = {
      selected: false,
      next: [], // Curve[]
      prev: [], // Curve[]
    };
  }

  componentDidMount() {}

  id = uuid();
  width = 12.5;
  ref = React.createRef();

  render() {
    const { selected } = this.state;
    return (
      <WorkspaceContext.Consumer>
        {(context) => (
          <div
            ref={this.ref}
            style={{
              width: `${this.width}px`,
              height: `${this.width}px`,
              backgroundColor: "black",
            }}
            className={`absolute rounded-full cursor-pointer ${
              selected ? "opacity-100" : "opacity-0 hover:opacity-50"
            }`}
            onClick={() => {
              this.setState({
                selected: !selected,
              });

              if (!context.currentNode) {
                context.setCurrentNode(this);
              } else {
                context.currentNode.setState((p) => {
                  return { next: [...p.next, curveRef] };
                });

                this.setState((p) => {
                  return { prev: [...p.prev, curveRef] };
                });

                // Push Curve
                const curveRef = React.createRef();
                context.pushToComponentsStack(
                  <Curve
                    ref={curveRef}
                    start={context.currentNode}
                    end={this}
                  />
                );
                context.setCurrentNode(null);
              }
            }}
          ></div>
        )}
      </WorkspaceContext.Consumer>
    );
  }

  toObject() {
    return {
      id: this.id,
      next: this.state.next.map((c) => c.current.state.end.id),
      prev: this.state.prev.map((c) => c.current.state.start.id),
    };
  }
}

export class Cell extends React.Component {
  nodeWidth = new Node().width;

  // Cell Properties
  id;
  menuOffset = new Position(-45, 42);

  // Refs
  cellRef;
  ellipsisRef;

  // Node Refs
  nodes = {};

  toObject() {
    return {
      id: this.id,
      position: this.state.position.toObject(),
      menuOffset: this.menuOffset.toObject(),
      nodes: {
        top: this.nodes.top.current.toObject(),
        left: this.nodes.left.current.toObject(),
        right: this.nodes.right.current.toObject(),
        bottom: this.nodes.bottom.current.toObject(),
      },
    };
  }

  constructor(props) {
    super(props);

    // Cell Properties
    this.id = uuid();
    this.cellRef = React.createRef();
    this.state = {
      position: new Position(0, 0),
      showMenu: false,
    };

    // Node Refs
    this.nodes.top = React.createRef();
    this.nodes.left = React.createRef();
    this.nodes.right = React.createRef();
    this.nodes.bottom = React.createRef();
  }

  componentDidMount() {
    this.width = this.cellRef.current.offsetWidth;

    this.setState({
      position: new Position(this.props.x, this.props.y),
    });
  }

  innerCellComponent() {
    return (
      <div className="rounded-lg shadow p-6 min-w-72 max-w-96 cursor-move bg-white w-fit">
        <div className="flex">
          <img src={this.icon} className="w-8 p-2 mb-auto" />
          <h1 className="pt-1.5 font-bold text-[15px] pl-1.5">{this.title}</h1>
          <img
            src={ellipsis}
            className="w-1 ml-auto cursor-pointer hover:opacity-50 mb-auto"
            alt="ellipsis"
            draggable={false}
            onClick={() => this.setState((p) => ({ showMenu: !p.showMenu }))}
          />
        </div>
        <div className="text-sm py-7 text-xs px-5 text-gray-600">
          {this.description}
        </div>
      </div>
    );
  }

  render() {
    return (
      <Draggable
        nodeRef={this.cellRef}
        onDrag={(event) => {
          this.setState({
            position: new Position(event.screenX, event.screenY),
          });

          // Update Curves
          for (const node of Object.values(this.nodes)) {
            for (const next of Object.values(node.current.state.next)) {
              next.current.setState({
                start: node.current,
              });
            }

            for (const prev of Object.values(node.current.state.prev)) {
              prev.current.setState({
                end: node.current,
              });
            }
          }
        }}
        defaultPosition={{
          x: this.props.x,
          y: this.props.y,
        }}
      >
        <div className="w-fit absolute" ref={this.cellRef}>
          <div
            style={{
              transform: `translate(${this.width}px, ${0}px)`,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: this.menuOffset.y,
                left: this.menuOffset.x,
              }}
            >
              <CellMenu
                show={this.state.showMenu}
                setShow={(e) => {
                  this.setState({ showMenu: e });
                }}
              />
            </div>
          </div>
          <div className="w-fit">
            {/* Top Node */}
            <div
              style={{ transform: `translateY(-${this.nodeWidth}px)` }}
              className="flex justify-center"
            >
              <Node ref={this.nodes.top} />
            </div>
            <div className="flex">
              {/* Left Node */}
              <div
                style={{ transform: `translateX(-${this.nodeWidth}px)` }}
                className="my-auto"
              >
                <Node ref={this.nodes.left} />
              </div>
              {/* Inner */}
              {this.innerCellComponent()}
              {/* Right Node */}
              <div className="my-auto">
                <Node ref={this.nodes.right} />
              </div>
            </div>
            {/* Bottom Node */}
            <div className="flex justify-center">
              <Node ref={this.nodes.bottom} />
            </div>
          </div>
        </div>
      </Draggable>
    );
  }
}
