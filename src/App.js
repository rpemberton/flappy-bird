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

class App extends Component {
  constructor() {
    super();
    this.state = {
      gameActive: false,
      birdY: settings.appHeight * 0.3,
      birdX: settings.appWidth / 2,

      score: 0,
      gravity: 0.5,
      velocity: settings.velocity,
      birdRotation: 28,

      wall1: {
        x: settings.appWidth,
        height: settings.appHeight * 0.2,
        point: false,
      },

      wall2: {
        x: settings.appWidth * 1.8,
        height: Math.random() * ((settings.appHeight - 300) - 100) + 100,
        point: false,
      }
    };
  };

  componentDidUpdate() {
    if (this.state.birdY > settings.appHeight - settings.birdHeight) {
      this.gameOver();
    }

    if (this.state.birdX > this.state.wall1.x && !this.state.wall1.point) {
      const wall1 = Object.assign({}, this.state.wall1);
      wall1.point = true;
      this.setState({
        wall1,
        score: this.state.score + 1,
      })
    }

    if (this.state.birdX > this.state.wall2.x && !this.state.wall2.point) {
      const wall2 = Object.assign({}, this.state.wall2);
      wall2.point = true;
      this.setState({
        wall2,
        score: this.state.score + 1,
      })
    }
  }

  startGame = () => {
    this.setState({ gameActive: true });
    animationWall = requestAnimationFrame(this.moveWall);
    animationGravity = requestAnimationFrame(this.gravity);
  };

  handleMouseDown = (e) => {
    if (e.type === 'mousedown' && lastDownEvent === 'touchstart') {
      return;
    }
    lastDownEvent = e.type;
    animationMoveUp = requestAnimationFrame(this.moveUp);
  };

  handleMouseUp = (e) => {
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
    this.setState({ velocity: settings.velocity, birdRotation: 28 });
    animationMoveUp = requestAnimationFrame(this.moveUp);
  };

  gameOver = () => {
    this.setState({
      gameActive: false,
      birdY: settings.appHeight * 0.3,
      birdX: settings.appWidth / 2,

      score: 0,
      gravity: 0.5,
      velocity: settings.velocity,
      birdRotation: 28,

      wall1: {
        x: settings.appWidth,
        height: settings.appHeight * 0.2,
        point: false,
      },

      wall2: {
        x: settings.appWidth * 1.8,
        height: Math.random() * ((settings.appHeight - 300) - 100) + 100,
        point: false,
      }
    });
  };

  moveWall = () => {
    if (!this.state.gameActive) {
      cancelAnimationFrame(animationWall);
      return;
    }

    const updatedState = Object.assign({}, this.state);

    ['wall1', 'wall2'].forEach(wall => {
      if (this.state[wall].x > settings.appWidth * -0.6) {
        updatedState[wall].x -= 2;
        this.setState(updatedState);
      } else {
        updatedState[wall] = {
          x: settings.appWidth,
          height: Math.random() * ((settings.appHeight - 300) - 100) + 100,
          point: false,
        }
        this.setState(updatedState);
      }
    });

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
      birdRotation: this.state.birdRotation + 2.5 < 180 ? this.state.birdRotation + 2.5 : 180,
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
            birdY={ this.state.birdY }
            birdX={ this.state.birdX }
            gameOver={ this.gameOver }
            wall={ this.state.wall1 }
          />

          <Wall
            settings={ settings }
            birdY={ this.state.birdY }
            birdX={ this.state.birdX }
            gameOver={ this.gameOver }
            wall={ this.state.wall2 }
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
                style={{fontSize: '30px', fill: 'white'}}>
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
