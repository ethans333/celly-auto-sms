import uuid from "react-uuid";
import Draggable from "react-draggable";
import React from "react";
import ellipsis from "../../assets/ellipsis-vertical.svg";
import { WorkspaceContext } from "../../Pages/Home.jsx";
import { useContext } from "react";

class Position {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Node extends React.Component {
  constructor() {
    super();
    this.state = {
      clicked: false,
    };
  }

  id = uuid();
  next = [];
  prev = [];
  width = 12.5;

  handleClick = () => {
    this.setState((p) => ({
      clicked: !p.clicked,
    }));
  };

  render() {
    const { clicked } = this.state;
    return (
      <div
        style={{
          width: `${this.width}px`,
          height: `${this.width}px`,
          opacity: 1,
          backgroundColor: clicked ? "red" : "black",
        }}
        className="absolute rounded-full cursor-pointer"
        onClick={this.handleClick}
      ></div>
    );
  }
}

export class Cell extends React.Component {
  id;
  position;
  title;
  nodes = {
    top: new Node(),
    right: new Node(),
    bottom: new Node(),
    left: new Node(),
  };

  constructor(x = 300, y = 500) {
    super();
    this.id = uuid();
    this.position = new Position(x, y);
  }

  innerComponent() {
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
            // onClick={() => setShowMenu((p) => !p)}
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
      <Draggable defaultPosition={this.position}>
        <div className="w-fit">
          {/* Top Node */}
          <div
            style={{ transform: `translateY(-${this.nodes.top.width}px)` }}
            className="flex justify-center"
          >
            {this.nodes.top.render()}
          </div>
          <div className="flex">
            {/* Left Node */}
            <div
              style={{ transform: `translateX(-${this.nodes.left.width}px)` }}
              className="my-auto"
            >
              {this.nodes.left.render()}
            </div>
            {/* Inner */}
            {this.innerComponent()}
            {/* Right Node */}
            <div className="my-auto">{this.nodes.left.render()}</div>
          </div>
          {/* Top Node */}
          <div className="flex justify-center">{this.nodes.top.render()}</div>
        </div>
      </Draggable>
    );
  }
}
