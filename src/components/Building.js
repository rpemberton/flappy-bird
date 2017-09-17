import React, { Component } from 'react';

let animate = undefined;
let appWidth = 400;

class Building extends Component {
  constructor() {
    super();
    this.state = {
      height: 200,
      width: 80,
      posX: 75,
      appWidth: appWidth,
    };
  };
  componentDidMount() {
    animate = requestAnimationFrame(this.moveX);
  };
  moveX = () => {
    if (this.state.posX > -80) {
      this.setState({
          posX: this.state.posX - 0.5,
      });
    } else {
      this.setState({
        posX: appWidth,
      });
    }
    animate = requestAnimationFrame(this.moveX);
  };
  render() {
    return (
      <rect
        width={ this.state.width }
        height={ this.state.height }
        x={ this.state.posX }
        y={ appWidth }
        fill="#444"
      />
    )
  }
}

export default Building;