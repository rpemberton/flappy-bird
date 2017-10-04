import React, { Component } from 'react';

// eslint-disable-next-line
let animate = undefined;

class Building extends Component {
  constructor() {
    super();
    this.state = {
      height: undefined,
      width: undefined,
      posX: undefined,
    };
  };
  componentWillMount() {
    this.newBuilding();
    this.setState({
      posX: this.props.posX,
    });
    animate = requestAnimationFrame(this.moveX);
  };
  newBuilding() {
    this.setState({
      height: Math.floor(Math.random() * (this.props.settings.appHeight / 3 - 50)) + 50,
      width: Math.floor(Math.random() * (120 - 80)) + 80,
    })
  };
  moveX = () => {
    if (this.state.posX > -this.state.width) {
      this.setState({
          posX: this.state.posX - 0.5,
      });
    } else {
      this.setState({
        posX: this.props.settings.appWidth,
      });
      this.newBuilding();
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
        fill="#212121"
      />
    )
  }
}

export default Building;