import React, { Component } from 'react';
import './App.css';

import Building from './components/Building.js';
import Wall from './components/Wall.js';

import robot from './img/robot.png';

const settings = {
  appWidth: window.innerWidth < 500 ? window.innerWidth : 500,
  appHeight: window.innerHeight < 750 ? window.innerHeight : 750,
  birdWidth: 40,
  birdHeight: 40,
  wallGap: 200,
  wallWidth: 50,
};

let lastDownEvent = undefined;
let lastUpEvent = undefined;

let animationMoveUp = undefined;
let animationGravity = undefined;
let animationWall = undefined;
// eslint-disable-next-line
let animationRotate = undefined;

class App extends Component {
  constructor() {
    super();
    this.state = {
      gameActive: false,
      birdY: 150,
      birdX: settings.appWidth / 2 - settings.birdWidth / 4,

      wallX1: settings.appWidth,
      wallX2: settings.appWidth * 1.5 + settings.wallWidth / 2,

      wallTopHeight1: Math.floor(Math.random() * (300 - 50)) + 50,
      wallTopHeight2: Math.floor(Math.random() * (300 - 50)) + 50,

      gravity: 0.4,
      velocity: -8,
      birdRotation: 20,
    };
  };

  componentDidUpdate() {
    const fellToGround = this.state.birdY > settings.appHeight - settings.birdHeight;

    if (fellToGround) {
      this.gameOver();
    }
  }

  startGame = () => {
    this.setState({ gameActive: true, birdRotation: 20 });
    animationWall = requestAnimationFrame(this.moveWall);
    animationGravity = requestAnimationFrame(this.gravity);
  };

  handleMouseDown = (e) => {
    // prevent click event if touch is being used
    if (e.type === 'mousedown' && lastDownEvent === 'touchstart') {
      return;
    }
    lastDownEvent = e.type;
    cancelAnimationFrame(animationRotate);
    this.setState({
      birdRotation: 20,
    });
    animationMoveUp = requestAnimationFrame(this.moveUp);
  };

  handleMouseUp = (e) => {
    // prevent click event if touch is being used
    if (e.type === 'mouseup' && lastUpEvent === 'touchend') {
      return;
    }
    lastUpEvent = e.type;
    cancelAnimationFrame(animationMoveUp);
    animationRotate = requestAnimationFrame(this.rotateBird);
  };

  moveUp = () => {
    if (!this.state.gameActive) {
      cancelAnimationFrame(animationMoveUp);
      return;
    }
    this.setState({ velocity: -8 });
    animationMoveUp = requestAnimationFrame(this.moveUp);
  };

  gravity = () => {
    if (!this.state.gameActive) {
      cancelAnimationFrame(animationGravity);
      return;
    }
    this.setState({
      birdY: this.state.birdY + this.state.velocity >= 0 ? this.state.birdY + this.state.velocity : 0,
      velocity: this.state.velocity + this.state.gravity,
    });
    animationGravity = requestAnimationFrame(this.gravity);
  };

  gameOver = () => {
    this.setState({
      gameActive: false,
      birdY: 150,
      birdX: settings.appWidth / 2 - settings.birdWidth / 4,
      wallX1: settings.appWidth,
      wallX2: settings.appWidth * 1.5 + settings.wallWidth / 2,
      wallTopHeight1: Math.floor(Math.random() * (300 - 50)) + 50,
      wallTopHeight2: Math.floor(Math.random() * (300 - 50)) + 50,
      velocity: -8,
      birdRotation: 20,
    });
  };

  moveWall = () => {
    if (!this.state.gameActive) {
      cancelAnimationFrame(animationWall);
      return;
    }

    if (this.state.wallX1 > -50) {
      this.setState({
        wallX1: this.state.wallX1 - 2,
      });
    } else {
      this.setState({
        wallX1: settings.appWidth,
        wallTopHeight1: Math.floor(Math.random() * (300 - 50)) + 50,
      });
    }

    if (this.state.wallX2 > -50) {
      this.setState({
        wallX2: this.state.wallX2 - 2,
      });
    } else {
      this.setState({
        wallX2: settings.appWidth,
        wallTopHeight2: Math.floor(Math.random() * (300 - 50)) + 50,
      });
    }

    animationWall = requestAnimationFrame(this.moveWall);
  };

  rotateBird = () => {
    this.setState({
      birdRotation: this.state.birdRotation + 2 < 180 ? this.state.birdRotation + 2 : 180,
    });
    animationRotate = requestAnimationFrame(this.rotateBird);
  }

  render() {
    return (
      <div id="gameApp">
        <svg
          onMouseDown={ this.handleMouseDown }
          onMouseUp={ this.handleMouseUp }

          onTouchStart={ this.handleMouseDown }
          onTouchEnd={ this.handleMouseUp }

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
            fill="white"
          />

          <circle
            className="star"
            cx="350"
            cy="210"
            r="1.8"
            fill="white"
          />

          <circle
            className="star"
            cx="50"
            cy="100"
            r="1.5"
            fill="white"
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

          <Building
            settings={ settings }
            posX="75"
          />

          <Building
            settings={ settings }
            posX="300"
          />

          <Wall
            settings={ settings }
            wallX={ this.state.wallX1 }
            wallTopHeight={ this.state.wallTopHeight1 }
            birdY={ this.state.birdY }
            birdX={ this.state.birdX }
            gameOver={ this.gameOver }
          />

          <Wall
            settings={ settings }
            wallX={ this.state.wallX2 }
            wallTopHeight={ this.state.wallTopHeight2 }
            birdY={ this.state.birdY }
            birdX={ this.state.birdX }
            gameOver={ this.gameOver }
          />

          { this.state.gameActive &&
            <svg
              x={ this.state.birdX }
              y={ this.state.birdY }>
              <image
                width={ settings.birdWidth + 10 }
                height={ settings.birdHeight + 10 }
                xlinkHref={ robot }
                transform={`rotate(${this.state.birdRotation}, 25, 25)`}
              />
            </svg>
          }

          { !this.state.gameActive &&
            <g onClick={ this.startGame }
              transform={`translate(${settings.appWidth / 2},${settings.appHeight / 2})`}
              >
              <circle
                r="35"
                fill="white"
              />
              <polygon
                transform="translate(-18,-25)"
                x="0"
                y="0"
                points="10,10, 10,40 33,25"
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
