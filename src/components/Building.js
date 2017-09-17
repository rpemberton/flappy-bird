import React, { Component } from 'react';

// eslint-disable-next-line
let animate = undefined;

class Building extends Component {
  constructor() {
    super();
    this.state = {
      height: 200,
      width: 80,
      posX: 75,
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
        posX: this.props.settings.appWidth,
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
        y={ this.props.settings.appWidth }
        fill="#444"
      />
    )
  }
}

export default Building;