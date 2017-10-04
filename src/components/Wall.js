import React, { Component } from 'react';

class Wall extends Component {
  componentDidUpdate() {
    const heightHighWall = this.props.birdY <= this.props.wall.height;
    const heightLowWall = this.props.birdY + this.props.settings.birdHeight >= this.props.wall.height + this.props.settings.wallGap;
    const widthWall =
      this.props.birdX + this.props.settings.birdWidth > this.props.wall.x &&
      this.props.birdX < this.props.wall.x + this.props.settings.wallWidth;

    if ((widthWall && heightLowWall) || (widthWall && heightHighWall)) {
      this.props.gameOver();
    }
  };
  render() {
    return(
      <g>
        <rect
          width={ this.props.settings.wallWidth }
          height={ this.props.wall.height }
          x={ this.props.wall.x }
          y="0"
          fill="#757575"
        />

        <rect
          width={ this.props.settings.wallWidth }
          height={ this.props.settings.appHeight - this.props.wall.height - this.props.settings.wallGap  }
          x={ this.props.wall.x }
          y={ this.props.wall.height + this.props.settings.wallGap }
          fill="#757575"
        />
      </g>
    )
  }
}

export default Wall;
