import React, { Component } from 'react';

// eslint-disable-next-line
let animationWall = undefined;

class Wall extends Component {
  constructor() {
    super();
    this.state = {
      wallX: 400,
      wallLowY: 300,
    }
  }
  componentDidMount() {
    animationWall = requestAnimationFrame(this.moveWall);
  }
  componentDidUpdate() {
    const hitHeight = this.props.bird.y + this.props.settings.birdHeight >= this.state.wallLowY;
    const hitWidth = this.props.bird.x + this.props.settings.birdWidth > this.state.wallX && this.props.bird.x < this.state.wallX + 50;

    if (hitWidth && hitHeight) {
      this.props.gameOver();
    }

    const heightHighWall = this.props.bird.y <= this.state.wallLowY - 200;

    if (hitWidth && heightHighWall) {
      this.props.gameOver();
    }
  }
  moveWall = () => {
    if (this.state.wallX > -50) {
      this.setState({
          wallX: this.state.wallX - 2,
      });
    } else {
      this.setState({
        wallX: 400,
        wallLowY: this.props.settings.appHeight - (Math.floor(Math.random() * (300 - 100)) + 100),
      });
    }
    animationWall = requestAnimationFrame(this.moveWall);
  };
  render() {
    return(
      <g>
        <rect
          width="50"
          height={ this.props.settings.appHeight - (this.props.settings.appHeight - this.state.wallLowY) - 200 }
          x={ this.state.wallX }
          y="0"
          fill="red"
        />

        <rect
          width="50"
          height={ this.props.settings.appHeight - this.state.wallLowY }
          x={ this.state.wallX }
          y={ this.state.wallLowY }
          fill="red"
        />
      </g>
    )
  }
}

export default Wall;