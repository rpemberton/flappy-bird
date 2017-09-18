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
let animationWall = undefined;

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
      wallX: 400,
      wallLowY: 300,
    };
  };
  componentDidUpdate() {
    this.testCollision();
    const fellToGround = this.state.bird.y > settings.appHeight - settings.birdHeight;

    if (fellToGround) {
      this.gameOver();
    }
  }
  startGame = () => {
    this.setState({
      gameActive: true,
    });
    
    animationWall = requestAnimationFrame(this.moveWall);
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
    if (!this.state.gameActive) {
      cancelAnimationFrame(animationMoveUp);
      return;
    }
    const bird = Object.assign(this.state.bird);
    bird.y = this.state.bird.y - 10 > 0 ? this.state.bird.y - 10 : 0;
    this.setState({
      bird,
    });
    animationMoveUp = requestAnimationFrame(this.moveUp);
  };
  moveUpAfter = () => {
    if (!this.state.gameActive) {
      cancelAnimationFrame(animationMoveUpAfter);
      return;
    }
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
  testCollision = () => {
    const heightLowWall = this.state.bird.y + settings.birdHeight >= this.state.wallLowY;
    const heightHighWall = this.state.bird.y <= this.state.wallLowY - 200;
    const hitWidth = this.state.bird.x + settings.birdWidth > this.state.wallX && this.state.bird.x < this.state.wallX + 50;

    if ((hitWidth && heightLowWall) || (hitWidth && heightHighWall)) {
      this.gameOver();
    }
  }
  gameOver = () => {
    this.setState({
      gameActive: false,
      bird: {
        x: settings.appWidth / 2 - settings.birdWidth / 4,
        y: 150,
      },
      fallSpeed: 2,
      elevateSpeed: 10,
      wallX: 400,
      wallLowY: 300,
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
        wallX: 400,
        wallLowY: settings.appHeight - (Math.floor(Math.random() * (300 - 100)) + 100),
      });
    }
    animationWall = requestAnimationFrame(this.moveWall);
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
            wallX={ this.state.wallX }
            wallLowY={ this.state.wallLowY }
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
