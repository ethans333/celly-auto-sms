import uuid from "react-uuid";
import Draggable from "react-draggable";
import React from "react";
import ellipsis from "../../assets/ellipsis-vertical.svg";
import CellMenu from "./CellComponents/CellMenu.jsx";
import { WorkspaceContext } from "../../Contexts/Workspace";
import { SnackbarContext } from "../../Contexts/Snackbar.jsx";
import { Node } from "./Node.jsx";
import { Position } from "./Position.jsx";

export class Cell extends React.Component {
  static contextType = WorkspaceContext;
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
      x: this.state.position.x,
      y: this.state.position.y,
      menuOffset: this.menuOffset.toObject(),
      typename: this.typename,
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

    this.typename = this.constructor.name.toLocaleLowerCase();

    // Cell Properties
    this.id = this.props ? this.props.id : uuid();
    this.cellRef = React.createRef();
    this.selectionRef = React.createRef();
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

  initState(props) {
    // Set inital state values to passed in prop values
    for (const [key, value] of Object.entries(this.state)) {
      if (props && props[key]) {
        this.state[key] = props[key];
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState !== this.state) {
      this.context.setSavedTimer(10); // Reset timer
    }
  }

  componentDidMount() {
    this.width = this.cellRef.current.offsetWidth;
    this.setState({
      position: new Position(this.props.x, this.props.y),
    });
  }

  inner() {
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

  newSelf(props) {
    return React.createElement(this.constructor, props);
  }

  selectionCell() {
    return (
      <div className="rounded-lg shadow p-6 min-w-72 max-w-96 cursor-move bg-white w-fit">
        <div className="flex">
          <img src={this.icon} className="w-8 p-2 mb-auto" />
          <h1 className="pt-[6px] font-bold text-[15px] pl-1.5">
            {this.title}
          </h1>
          <img
            src={ellipsis}
            className="w-1 ml-auto cursor-pointer hover:opacity-50 mb-auto invisible"
            alt="ellipsis"
            draggable={false}
          />
        </div>
        <div className="text-sm py-7 text-xs px-5 text-gray-600 w-64 truncate">
          {this.description}
        </div>
      </div>
    );
  }

  selection() {
    return (
      <WorkspaceContext.Consumer>
        {(context) => (
          <SnackbarContext.Consumer>
            {(snackbarContext) => (
              <div className="w-[303.99px] h-[151.97px]">
                <div className="hover:absolute">
                  <Draggable
                    onStart={(e) => {
                      context.setDragStart({ x: e.clientX, y: e.clientY });
                    }}
                    onStop={(e) => {
                      // Prevent multiple scheduling cells
                      for (const c of context.componentsStack) {
                        if (
                          ["scheduling", "windowscheduling"].includes(
                            c.props.typename
                          )
                        ) {
                          snackbarContext.setSnackbarMessage(
                            "Two scheduling cell is not permitted!"
                          );
                          return;
                        }
                      }

                      // Ignore small movements
                      const delta = Math.floor(
                        Math.sqrt(
                          (context.dragStart.x - e.clientX) ** 2 +
                            (context.dragStart.y - e.clientY) ** 2
                        )
                      );

                      if (delta < 100) return;

                      const r =
                        this.selectionRef.current.getBoundingClientRect();

                      const cid = uuid();

                      const el = this.newSelf({
                        key: cid,
                        id: cid,
                        ref: React.createRef(),
                        x: r.x - context.deltaX,
                        y: r.y - context.deltaY,
                        typename: this.typename,
                      });

                      context.setComponentsStack([
                        ...context.componentsStack,
                        el,
                      ]);
                    }}
                    nodeRef={this.selectionRef}
                    position={{ x: 0, y: 0 }}
                  >
                    <div ref={this.selectionRef} className="hover:opacity-80">
                      {this.selectionCell()}
                    </div>
                  </Draggable>
                </div>
              </div>
            )}
          </SnackbarContext.Consumer>
        )}
      </WorkspaceContext.Consumer>
    );
  }

  toJSON() {
    return {
      ...this.toObject(),
      ...this.state,
    };
  }

  render() {
    Cell.contextType = WorkspaceContext;

    return (
      <WorkspaceContext.Consumer>
        {(context) => (
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
                    deltaX: context.deltaX,
                    deltaY: context.deltaY,
                  });
                }

                for (const prev of Object.values(node.current.state.prev)) {
                  prev.current.setState({
                    end: node.current,
                    deltaX: context.deltaX,
                    deltaY: context.deltaY,
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
                    onDelete={() => {
                      // Remove associated curves

                      // For each node in deleted cell
                      for (const node of Object.values(this.nodes)) {
                        // For each next and prev curve in deleted cell node
                        for (const next of Object.values(
                          node.current.state.next
                        )) {
                          next.current.state.end.setState((p) => {
                            return {
                              selected: p.next - 1 > 0,
                              prev: p.next.filter(
                                (c) =>
                                  next.current.props.start !==
                                  c.current.props.start
                              ),
                            };
                          });

                          context.setComponentsStack((p) =>
                            p.filter((c) => c.key !== next.current.id)
                          );
                        }
                        for (const prev of Object.values(
                          node.current.state.prev
                        )) {
                          prev.current.state.start.setState((p) => {
                            return {
                              selected: p.prev - 1 > 0,
                              next: p.next.filter(
                                (c) =>
                                  prev.current.props.end !== c.current.props.end
                              ),
                            };
                          });
                          context.setComponentsStack((p) =>
                            p.filter((c) => c.key !== prev.current.id)
                          );
                        }
                      }
                      // Remove from components stack
                      context.setComponentsStack((p) =>
                        p.filter((c) => c.key !== this.id)
                      );
                    }}
                    onOpen={() => {
                      context.setSidebar(this.sidebar());
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
                  <Node
                    ref={this.nodes.top}
                    cell={this}
                    id={this.props.nodes ? this.props.nodes.top.id : uuid()}
                    onMount={this.props.onNodeMount}
                    side="top"
                  />
                </div>
                <div className="flex">
                  {/* Left Node */}
                  <div
                    style={{ transform: `translateX(-${this.nodeWidth}px)` }}
                    className="my-auto"
                  >
                    <Node
                      ref={this.nodes.left}
                      cell={this}
                      id={this.props.nodes ? this.props.nodes.left.id : uuid()}
                      onMount={this.props.onNodeMount}
                      side="left"
                    />
                  </div>
                  {/* Inner */}
                  {this.inner()}
                  {/* Right Node */}
                  <div className="my-auto">
                    <Node
                      ref={this.nodes.right}
                      cell={this}
                      id={this.props.nodes ? this.props.nodes.right.id : uuid()}
                      onMount={this.props.onNodeMount}
                      side="right"
                    />
                  </div>
                </div>
                {/* Bottom Node */}
                <div className="flex justify-center">
                  <Node
                    ref={this.nodes.bottom}
                    cell={this}
                    id={this.props.nodes ? this.props.nodes.bottom.id : uuid()}
                    onMount={this.props.onNodeMount}
                    side="bottom"
                  />
                </div>
              </div>
            </div>
          </Draggable>
        )}
      </WorkspaceContext.Consumer>
    );
  }
}
