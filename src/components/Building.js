import React, { Component } from 'react';

// eslint-disable-next-line
let animate = undefined;

class Building extends Component {
  constructor() {
    super();
    this.state = {
      height: undefined,
      width: 80,
      posX: undefined,
    };
  };
  componentDidMount() {
    this.randomHeight();
    this.setState({
      posX: this.props.posX,
    });
    animate = requestAnimationFrame(this.moveX);
  };
  randomHeight() {
    this.setState({
      height: Math.floor(Math.random() * (300 - 50)) + 50,
    })
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
      this.randomHeight();
    }
    animate = requestAnimationFrame(this.moveX);
  };
  render() {
    return (
      <rect
        width={ this.state.width }
        height={ this.state.height }
        x={ this.state.posX }
        y={ this.props.settings.appHeight - this.state.height }
        fill="#444"
      />
    )
  }
}

export default Building;