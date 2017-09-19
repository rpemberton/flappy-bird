import React, { Component } from 'react';
import './App.css';

import Building from './components/Building.js';
import Wall from './components/Wall.js';

import robot from './img/robot.png';

const settings = {
  appWidth: 450,
  appHeight: 650,
  birdWidth: 40,
  birdHeight: 40,
};

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
      wallX: settings.appWidth,
      wallTopHeight: Math.floor(Math.random() * (300 - 50)) + 50,
      gravity: 0.4,
      velocity: -8,
      birdRotation: 20,
    };
  };

  componentDidUpdate() {
    const heightHighWall = this.state.birdY <= this.state.wallTopHeight;
    const heightLowWall = this.state.birdY + settings.birdHeight >= this.state.wallTopHeight + 200;
    const widthWall = this.state.birdX + settings.birdWidth > this.state.wallX && this.state.birdX < this.state.wallX + 50;
    if ((widthWall && heightLowWall) || (widthWall && heightHighWall)) {
      this.gameOver();
    }

    const fellToGround = this.state.birdY > settings.appHeight - settings.birdHeight;
    if (fellToGround) {
      this.gameOver();
    }
  }

  startGame = () => {
    this.setState({ gameActive: true });
    animationWall = requestAnimationFrame(this.moveWall);
    animationGravity = requestAnimationFrame(this.gravity);
  };

  handleMouseDown = () => {
    cancelAnimationFrame(animationRotate);
    this.setState({
      birdRotation: 20,
    });
    animationMoveUp = requestAnimationFrame(this.moveUp);
  };

  handleMouseUp = () => {
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
      wallX: settings.appWidth,
      wallTopHeight: Math.floor(Math.random() * (300 - 50)) + 50,
      velocity: -8,
    });
  };

  moveWall = () => {
    if (!this.state.gameActive) {
      cancelAnimationFrame(animationWall);
      return; 
    }
    if (this.state.wallX > -50) {
      this.setState({
        wallX: this.state.wallX - 2,
      });
    } else {
      this.setState({
        wallX: settings.appWidth,
        wallTopHeight: Math.floor(Math.random() * (300 - 50)) + 50,
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
      <div>
        <svg
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
          />

          <Wall 
            settings={ settings } 
            bird={ this.state.bird }
            gameOver={ this.gameOver }
            gameActive={ this.state.gameActive }
            wallX={ this.state.wallX }
            wallTopHeight={ this.state.wallTopHeight }
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
            <g onClick={ this.startGame }>
              <circle
                cx={ settings.appWidth / 2 }
                cy={ settings.appHeight / 2 }
                r="40"
                fill="white"
              />
              <polygon
                transform="translate(204, 294)"
                points="10,10, 10,50 40,30"
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
