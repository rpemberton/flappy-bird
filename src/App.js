import React, { Component } from 'react';
import './App.css';

import Building from './components/Building.js';
import Wall from './components/Wall.js';

const settings = {
  appWidth: 400,
  appHeight: 600,
  birdWidth: 30,
  birdHeight: 30,
};

let animationMoveUp = undefined;
let animationGravity = undefined;
let animationWall = undefined;

class App extends Component {
  constructor() {
    super();
    this.state = {
      gameActive: false,
      birdY: 150,
      birdX: settings.appWidth / 2 - settings.birdWidth / 4,
      wallX: settings.appWidth,
      wallLowY: settings.appHeight - (Math.floor(Math.random() * (300 - 100)) + 100),
      gravity: 0.4,
      velocity: -8,
    };
  };

  componentDidUpdate() {
    const heightLowWall = this.state.birdY + settings.birdHeight >= this.state.wallLowY;
    const heightHighWall = this.state.birdY <= this.state.wallLowY - 200;
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
    animationMoveUp = requestAnimationFrame(this.moveUp);
  };

  handleMouseUp = () => {
    cancelAnimationFrame(animationMoveUp);
  };

  moveUp = () => {
    if (!this.state.gameActive) {
      cancelAnimationFrame(animationMoveUp);
      return;
    }
    if (this.state.birdY <= 0) {
      this.setState({
        birdY: 0,
        velocity: 0,
      });
    } else {
      this.setState({ velocity: -8 });
    }
    animationMoveUp = requestAnimationFrame(this.moveUp);
  };

  gravity = () => {
    if (!this.state.gameActive) {
      cancelAnimationFrame(animationGravity);
      return;
    }
    this.setState({
      birdY: this.state.birdY + this.state.velocity,
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
      wallLowY: settings.appHeight - (Math.floor(Math.random() * (300 - 100)) + 100),
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
        wallLowY: settings.appHeight - (Math.floor(Math.random() * (300 - 100)) + 100),
      });
    }
    animationWall = requestAnimationFrame(this.moveWall);
  };

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
            wallLowY={ this.state.wallLowY }
          />
          
          { this.state.gameActive &&
            <rect
              width={ settings.birdWidth }
              height={ settings.birdHeight }
              x={ this.state.birdX }
              y={ this.state.birdY }
              fill="#008d46"
            />
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
                transform="translate(180, 270)"
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
