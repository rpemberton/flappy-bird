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
let animationMoveUpAfter = undefined;
let animationGravity = undefined;

class App extends Component {
  constructor() {
    super();
    this.state = {
      gameActive: false,
      bird: {
        x: settings.appWidth / 2 - settings.birdWidth / 4,
        y: 150,
      },
      fallSpeed: 2,
      elevateSpeed: 10,
    };
  };
  componentDidUpdate() {
    const fellToGround = this.state.bird.y > settings.appHeight - settings.birdHeight;

    if (fellToGround) {
      this.gameOver();
    }
  }
  startGame = () => {
    this.setState({
      gameActive: true,
      bird: {
        x: settings.appWidth / 2 - settings.birdWidth / 4,
        y: 150,
      },
      elevateSpeed: 10,
    });
    
    animationMoveUpAfter = requestAnimationFrame(this.moveUpAfter);
    animationGravity = requestAnimationFrame(this.gravity);
  };
  handleMouseDown = () => {
    cancelAnimationFrame(animationMoveUpAfter);
    cancelAnimationFrame(animationGravity);
    if (!this.state.gameActive) { return; }
    this.setState({
      fallSpeed: 3,
      elevateSpeed: 10,
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
    if (this.state.bird.y > 0) {
      const bird = Object.assign(this.state.bird);
      bird.y = this.state.bird.y - 10;
      this.setState({
        bird,
      });
      animationMoveUp = requestAnimationFrame(this.moveUp);
    }
  };
  moveUpAfter = () => {
    if (this.state.bird.y > 0 && this.state.elevateSpeed > 0) {
      const bird = Object.assign(this.state.bird);
      bird.y = this.state.bird.y - this.state.elevateSpeed;
      this.setState({
        bird,
        elevateSpeed: this.state.elevateSpeed - 0.5,
      });
      animationMoveUpAfter = requestAnimationFrame(this.moveUpAfter);
    }
  };
  gravity = () => {
    if (!this.state.gameActive) {
      cancelAnimationFrame(animationGravity);
      return;
    }
    const bird = Object.assign(this.state.bird);
    bird.y = this.state.bird.y + this.state.fallSpeed;
    this.setState({
      bird,
      fallSpeed: this.state.fallSpeed + 0.3,
    });
    animationGravity = requestAnimationFrame(this.gravity);
  };
  gameOver = () => {
    cancelAnimationFrame(animationMoveUp);
    cancelAnimationFrame(animationMoveUpAfter);
    this.setState({
      gameActive: false,
      bird: {
        x: settings.appWidth / 2 - settings.birdWidth / 4,
        y: 150,
      },
      fallSpeed: 2,
      elevateSpeed: 10,
    });
  };
  render() {
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
          />

          { this.state.gameActive &&
            <rect
              width={ settings.birdWidth }
              height={ settings.birdHeight }
              x={ this.state.bird.x }
              y={ this.state.bird.y }
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
