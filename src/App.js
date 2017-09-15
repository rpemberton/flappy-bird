import React, { Component } from 'react';
import './App.css';

const settings = {
  appWidth: 400,
  appHeight: 600,
  birdWidth: 30,
  birdHeight: 30,
};

let animationMoveUp = undefined;
let animationMoveUpAfter = undefined;
let animationGravity = undefined;
// eslint-disable-next-line
let animationWall = undefined;
// eslint-disable-next-line
let animationBuilding = undefined;

class App extends Component {
  constructor() {
    super();
    this.state = {
      gameActive: false,
      posX: settings.appWidth / 2 - settings.birdWidth / 4,
      posY: 150,
      wallLowX: 400,
      wallLowY: 300,
      buildingX: 75,
      fallSpeed: 2,
      elevateSpeed: 14,
    };
  };
  componentDidMount() {
    animationBuilding = requestAnimationFrame(this.buildingX);
  };
  componentDidUpdate() {
    const fellToGround = this.state.posY > settings.appHeight - settings.birdHeight;

    if (fellToGround) {
      this.gameOver();
    }

    const heightLowWall = this.state.posY + settings.birdHeight >= this.state.wallLowY;
    const width = this.state.posX + settings.birdWidth > this.state.wallLowX && this.state.posX < this.state.wallLowX + 50;

    if (width && heightLowWall) {
      this.gameOver();
    }

    const heightHighWall = this.state.posY <= this.state.wallLowY - 200;

    if (width && heightHighWall) {
      this.gameOver();
    }
  }
  startGame = () => {
    this.setState({
      gameActive: true,
      posY: 150,
      elevateSpeed: 14,
    });
    animationWall = requestAnimationFrame(this.wallLowX);
    animationMoveUpAfter = requestAnimationFrame(this.moveUpAfter);
    animationGravity = requestAnimationFrame(this.gravity);
  };
  handleMouseDown = () => {
    cancelAnimationFrame(animationMoveUpAfter);
    cancelAnimationFrame(animationGravity);
    if (!this.state.gameActive) { return; }
    this.setState({
      fallSpeed: 3,
      elevateSpeed: 14,
    });
    animationMoveUp = requestAnimationFrame(this.moveUp);
  };
  handleMouseUp = () => {
    if (!this.state.gameActive) { return; }

    cancelAnimationFrame(animationMoveUp);

    animationMoveUpAfter = requestAnimationFrame(this.moveUpAfter);
    animationGravity = requestAnimationFrame(this.gravity);
  };
  moveUp = () => {
    if (this.state.posY > 14) {
      this.setState({
        posY: this.state.posY - 10,
      });
      animationMoveUp = requestAnimationFrame(this.moveUp);
    }
  };
  moveUpAfter = () => {
    if (this.state.posY > 0 && this.state.elevateSpeed > 0) {
      this.setState({
        posY: this.state.posY - this.state.elevateSpeed,
        elevateSpeed: this.state.elevateSpeed - 0.7,
      });
      animationMoveUpAfter = requestAnimationFrame(this.moveUpAfter);
    }
  };
  gravity = () => {
    if (!this.state.gameActive) {
      cancelAnimationFrame(animationGravity);
      return;
    }
    this.setState({
      posY: this.state.posY + this.state.fallSpeed,
      fallSpeed: this.state.fallSpeed + 0.2,
    });
    animationGravity = requestAnimationFrame(this.gravity);
  };
  wallLowX = () => {
    if (!this.state.gameActive) {
      cancelAnimationFrame(animationWall);
      return;
    }
    if (this.state.wallLowX > -50) {
      this.setState({
          wallLowX: this.state.wallLowX - 2,
      });
    } else {
      this.setState({
        wallLowX: 400,
        wallLowY: settings.appHeight - (Math.floor(Math.random() * (300 - 100)) + 100),
      });
    }
    animationWall = requestAnimationFrame(this.wallLowX);
  };
  buildingX = () => {
    if (this.state.buildingX > -80) {
      this.setState({
          buildingX: this.state.buildingX - 0.5,
      });
    } else {
      this.setState({
        buildingX: 400,
      });
    }
    animationBuilding = requestAnimationFrame(this.buildingX);
  };
  gameOver = () => {
    cancelAnimationFrame(animationMoveUp);
    cancelAnimationFrame(animationMoveUpAfter);
    this.setState({
      gameActive: false,
      posX: settings.appWidth / 2 - settings.birdWidth / 4,
      posY: 150,
      wallLowX: 400,
      wallLowY: 300,
      fallSpeed: 2,
      elevateSpeed: 14,
    });
  };
  render() {

    console.log(this.state.posY);

    return (
      <div>
        <svg xmlns="http://www.w3.org/2000/svg"
          onMouseDown={ this.handleMouseDown }
          onMouseUp={ this.handleMouseUp }
          width={ settings.appWidth }
          height={ settings.appHeight }>

          <rect
            width={ settings.appWidth }
            height={ settings.appHeight }
            x="0"
            fill="black"
          />

          <circle
            className="star"
            cx="100"
            cy="250"
            r="1.5"
            fill="rgba(255, 255, 255, 0.6)"
          />

          <circle
            className="star"
            cx="350"
            cy="210"
            r="1.8"
            fill="rgba(255, 255, 255, 0.8)"
          />

          <circle
            className="star"
            cx="50"
            cy="100"
            r="1.5"
            fill="rgba(255, 255, 255, 0.9)"
          />

          <circle
            className="moon"
            cx="150"
            cy="150"
            r="20"
            fill="white"
          />

          <circle
            className="eclipse"
            cx="160"
            cy="148"
            r="20"
            fill="black"
          />

          <rect
            width="80"
            height="200"
            x={ this.state.buildingX }
            y="400"
            fill="#444"
          />

          <rect
            width="50"
            height={ settings.appHeight - this.state.wallLowY }
            x={ this.state.wallLowX }
            y={ this.state.wallLowY }
            fill="red"
          />

          <rect
            width="50"
            height={ settings.appHeight - (settings.appHeight - this.state.wallLowY) - 200 }
            x={ this.state.wallLowX }
            y="0"
            fill="red"
          />

          { this.state.gameActive &&
            <rect
              width={ settings.birdWidth }
              height={ settings.birdHeight }
              x={ this.state.posX }
              y={ this.state.posY }
              fill="#008d46"
            />
          }

          { !this.state.gameActive &&
            <g onClick={ this.startGame }>
              <circle
                cx={ settings.appWidth / 2 }
                cy={ settings.appHeight / 2 }
                r="50"
                fill="rgba(255,255,255,0.7)"
              />
              <polygon
                transform="translate(177, 265)"
                points="10,10, 10,60 50,35"
                fill="black"
              />
            </g>
          }
        </svg>
      </div>
    );
  }
}

export default App;
