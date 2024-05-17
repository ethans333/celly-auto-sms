import { Curve } from "./Curve.jsx";
import { WorkspaceContext } from "../../Contexts/Workspace";
import React from "react";
import uuid from "react-uuid";
import { Position } from "./Position.jsx";
export class Node extends React.Component {
  id;
  width = 12.5;

  constructor(props) {
    super(props);

    this.state = {
      selected: false,
      next: [], // Curve[]
      prev: [], // Curve[]
    };

    if (!props) return;
    this.id = this.props.id;
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

                // Push Curve
                const curveRef = React.createRef();
                context.setComponentsStack([
                  ...context.componentsStack,
                  <Curve
                    key={uuid()}
                    ref={curveRef}
                    start={context.currentNode}
                    end={this}
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
