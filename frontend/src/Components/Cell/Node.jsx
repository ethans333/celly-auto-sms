import { Curve } from "./Curve.jsx";
import { WorkspaceContext } from "../../Contexts/Workspace";
import React from "react";
import uuid from "react-uuid";
export class Node extends React.Component {
  id;
  width = 12.5;
  ref = React.createRef();

  constructor(props) {
    super(props);

    this.state = {
      selected: false,
      next: [], // Curve[]
      prev: [], // Curve[]
    };

    if (!props) return;
    this.id = this.props.id;
    this.side = this.props.side;
  }

  componentDidMount() {
    if (this.props.onMount) this.props.onMount(this);
  }

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

                if (
                  !(
                    (context.currentNode.side == "top" &&
                      this.side == "bottom") ||
                    (context.currentNode.side == "bottom" &&
                      this.side == "top") ||
                    (context.currentNode.side == "left" &&
                      this.side == "right") ||
                    (context.currentNode.side == "right" && this.side == "left")
                  )
                )
                  return;

                // Push Curve
                const curveRef = React.createRef();
                const cid = uuid();
                context.setComponentsStack([
                  ...context.componentsStack,
                  <Curve
                    key={cid}
                    id={cid}
                    ref={curveRef}
                    start={context.currentNode}
                    end={this}
                    deltaX={context.deltaX}
                    deltaY={context.deltaY}
                  />,
                ]);
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
