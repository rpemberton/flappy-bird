import React, { Component } from 'react';
import './App.css';

import Building from './components/Building.js';
import Wall from './components/Wall.js';

import robot from './img/robot.png';

const settings = {
  appWidth: window.innerWidth < 450 ? window.innerWidth : 450,
  appHeight: window.innerHeight < 750 ? window.innerHeight : 750,
  birdWidth: 30,
  birdHeight: 30,
  wallGap: 200,
  wallWidth: 70,
  velocity: -9,
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
      birdY: settings.appHeight * 0.3,
      birdX: settings.appWidth / 2,
      wallX1: settings.appWidth,
      wallX2: settings.appWidth * 1.8,
      wallTopHeight1: settings.appHeight * 0.2,
      wallTopHeight2: Math.floor(Math.random() * (300 - 50)) + 50,
      wallPoint1: false,
      wallPoint2: false,
      score: 0,
      gravity: 0.5,
      velocity: settings.velocity,
      birdRotation: 32,
    };
  };

  componentDidUpdate() {
    const fellToGround = this.state.birdY > settings.appHeight - settings.birdHeight;

    if (fellToGround) {
      this.gameOver();
    }

    if (this.state.birdX > this.state.wallX1 && !this.state.wallPoint1) {
      this.setState({
        wallPoint1: true,
        score: this.state.score + 1,
      });
    }

    if (this.state.birdX > this.state.wallX2 && !this.state.wallPoint2) {
      this.setState({
        wallPoint2: true,
        score: this.state.score + 1,
      });
    }
  }

  startGame = () => {
    this.setState({ gameActive: true });
    animationWall = requestAnimationFrame(this.moveWall);
    animationGravity = requestAnimationFrame(this.gravity);
  };

  handleMouseDown = (e) => {
    // prevent click event if touch is being used
    if (e.type === 'mousedown' && lastDownEvent === 'touchstart') {
      return;
    }
    lastDownEvent = e.type;
    animationMoveUp = requestAnimationFrame(this.moveUp);
  };

  handleMouseUp = (e) => {
    // prevent click event if touch is being used
    if (e.type === 'mouseup' && lastUpEvent === 'touchend') {
      return;
    }
    lastUpEvent = e.type;
    cancelAnimationFrame(animationMoveUp);
  };

  moveUp = () => {
    if (!this.state.gameActive) {
      cancelAnimationFrame(animationMoveUp);
      return;
    }
    this.setState({ velocity: settings.velocity, birdRotation: 32 });
    animationMoveUp = requestAnimationFrame(this.moveUp);
  };

  gameOver = () => {
    this.setState({
      gameActive: false,
      birdY: settings.appHeight * 0.3,
      birdX: settings.appWidth / 2,
      wallX1: settings.appWidth,
      wallX2: settings.appWidth * 1.8,
      wallTopHeight1: settings.appHeight * 0.2,
      wallTopHeight2: Math.floor(Math.random() * (300 - 50)) + 50,
      wallPoint1: false,
      wallPoint2: false,
      score: 0,
      gravity: 0.5,
      velocity: settings.velocity,
      birdRotation: 32,
    });
  };

  moveWall = () => {
    if (!this.state.gameActive) {
      cancelAnimationFrame(animationWall);
      return;
    }

    if (this.state.wallX1 >= settings.appWidth * -0.6) {
      this.setState({
        wallX1: this.state.wallX1 - 2,
      });
    } else {
      this.setState({
        wallX1: settings.appWidth,
        wallTopHeight1: Math.floor(Math.random() * (300 - 50)) + 100,
        wallPoint1: false,
      });
    }

    if (this.state.wallX2 >= settings.appWidth * -0.6) {
      this.setState({
        wallX2: this.state.wallX2 - 2,
      });
    } else {
      this.setState({
        wallX2: settings.appWidth,
        wallTopHeight2: Math.floor(Math.random() * (300 - 50)) + 100,
        wallPoint2: false,
      });
    }

    // ['wallX1', 'wallX2'].forEach(wall => {
    //   if (this.state[wall] >= settings.appWidth * -0.6) {
    //     this.setState({
    //       [wall]: this.state[wall] - 2,
    //     });
    //   } else {
    //     this.setState({
    //       [wall]: settings.appWidth,
    //       wallTopHeight1: Math.floor(Math.random() * (300 - 50)) + 100,
    //       wallPoint1: false,
    //     });
    //   }
    // })



    animationWall = requestAnimationFrame(this.moveWall);
  };

  gravity = () => {
    if (!this.state.gameActive) {
      cancelAnimationFrame(animationGravity);
      return;
    }
    this.setState({
      birdY: this.state.birdY + this.state.velocity >= 0 ? this.state.birdY + this.state.velocity : 0,
      velocity: this.state.velocity + this.state.gravity,
      birdRotation: this.state.birdRotation + 2 < 180 ? this.state.birdRotation + 2 : 180,
    });
    animationGravity = requestAnimationFrame(this.gravity);
  };

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
            posX={ settings.appWidth * 0.2 }
          />

          <Building
            settings={ settings }
            posX={ settings.appWidth * 0.8 }
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
                width={ settings.birdWidth + 10}
                height={ settings.birdHeight + 10}
                xlinkHref={ robot }
                transform={`rotate(${this.state.birdRotation}, 20, 20)`}
              />
            </svg>
          }

          { this.state.gameActive &&
            <g transform={`translate(${settings.appWidth / 2 - 20},20)`}>
              <rect width="40" height="40" rx="5" ry="5" fill="gray"/>

              <text
                textAnchor="middle"
                transform="translate(20,31)"
                style={{'font-size': '30px', fill: 'white'}}>
                { this.state.score }
              </text>
            </g>
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
