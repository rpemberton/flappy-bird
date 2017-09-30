import React, { Component } from 'react';

class Wall extends Component {
  componentDidUpdate() {
    const heightHighWall = this.props.birdY <= this.props.wallTopHeight;
    const heightLowWall = this.props.birdY + this.props.settings.birdHeight >= this.props.wallTopHeight + this.props.settings.wallGap;
    const widthWall = this.props.birdX + this.props.settings.birdWidth > this.props.wallX && this.props.birdX < this.props.wallX + 50;

    if ((widthWall && heightLowWall) || (widthWall && heightHighWall)) {
      this.props.gameOver();
    }
  };
  render() {
    return(
      <g>
        <rect
          width="50"
          height={ this.props.wallTopHeight }
          x={ this.props.wallX }
          y="0"
          fill="#673AB7"
        />

        <rect
          width="50"
          height={ this.props.settings.appHeight - this.props.wallTopHeight - this.props.settings.wallGap  }
          x={ this.props.wallX }
          y={ this.props.wallTopHeight + this.props.settings.wallGap }
          fill="#673AB7"
        />
      </g>
    )
  }
}

export default Wall;
