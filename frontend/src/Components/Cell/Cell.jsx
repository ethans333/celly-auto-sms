import uuid from "react-uuid";
import Draggable from "react-draggable";
import React from "react";
import ellipsis from "../../assets/ellipsis-vertical.svg";
import CellMenu from "./CellComponents/CellMenu.jsx";
import { WorkspaceContext } from "../../Pages/Home.jsx";
import Curve from "../Curves/Curve.jsx";

class Position {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
}

class Node extends React.Component {
  constructor() {
    super();
    this.state = {
      selected: false,
    };
  }

  componentDidMount() {}

  id = uuid();
  next = [];
  prev = [];
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
                const rS =
                  context.currentNode.ref.current.getBoundingClientRect();
                const rE = this.ref.current.getBoundingClientRect();

                context.pushToComponentsStack(<Curve start={rS} end={rE} />);
                this.setState({ selected: false });
                context.currentNode.setState({ selected: false });
                context.setCurrentNode(null);
              }
            }}
          ></div>
        )}
      </WorkspaceContext.Consumer>
    );
  }
}

export class Cell extends React.Component {
  nodeWidth = new Node().width;

  // Cell Properties
  id;
  menuOffset = new Position(-45, 42);

  // Cell Properties Defined in Sub Class
  title;

  // Refs
  cellRef;
  ellipsisRef;

  // Node Refs
  top;
  left;
  right;
  bottom;

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
    this.top = React.createRef();
    this.left = React.createRef();
    this.right = React.createRef();
    this.bottom = React.createRef();
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
              <Node ref={this.top} />
            </div>
            <div className="flex">
              {/* Left Node */}
              <div
                style={{ transform: `translateX(-${this.nodeWidth}px)` }}
                className="my-auto"
              >
                <Node ref={this.left} />
              </div>
              {/* Inner */}
              {this.innerCellComponent()}
              {/* Right Node */}
              <div className="my-auto">
                <Node ref={this.right} />
              </div>
            </div>
            {/* Bottom Node */}
            <div className="flex justify-center">
              <Node ref={this.bottom} />
            </div>
          </div>
        </div>
      </Draggable>
    );
  }
}
