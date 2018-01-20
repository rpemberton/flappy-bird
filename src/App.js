import React, { Component } from 'react';
import './App.css';

import Building from './components/Building.js';
import Wall from './components/Wall.js';

const settings = {
  appWidth: window.innerWidth < 450 ? window.innerWidth : 450,
  appHeight: window.innerHeight < 750 ? window.innerHeight : 750,
  birdWidth: 32,
  birdHeight: 32,
  wallGap: 230,
  wallWidth: 70,
  velocity: -8,
};

let lastDownEvent = undefined;
let lastUpEvent = undefined;

let countdown = undefined;
let animationMoveUp = undefined;
let animationGravity = undefined;
let animationWall = undefined;

class App extends Component {
  constructor() {
    super();
    this.state = {
      gameStart: false,
      gameActive: false,
      birdY: settings.appHeight * 0.3,
      birdX: settings.appWidth / 2,

      countdown: 3,
      score: 0,
      gravity: 0.5,
      velocity: settings.velocity,
      birdRotation: 45,

      wall1: {
        x: settings.appWidth,
        height: settings.appHeight * 0.2,
        point: false,
      },

      wall2: {
        x: settings.appWidth * 1.8,
        height: Math.random() * (
          ((settings.appHeight / 2) - (settings.wallGap / 2) - 100) 
        ) + 100,
        point: false,
      }
    };
  };

  startGame = () => {
    if (this.state.gameStart) {
      return;
    }
    this.setState({ gameStart: true });

    countdown = setInterval(() => {
      this.setState({ countdown: this.state.countdown - 1});
      if (this.state.countdown === 0) {
        this.setState({ gameActive: true });
        animationWall = requestAnimationFrame(this.moveWall);
        animationGravity = requestAnimationFrame(this.gravity);
      }
      if (this.state.countdown === -1) {
        clearInterval(countdown);
      }
    }, 400);
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
    this.setState({ velocity: settings.velocity, birdRotation: 45 });
    animationMoveUp = requestAnimationFrame(this.moveUp);
  };

  gameOver = () => {
    this.setState({
      gameStart: false,
      gameActive: false,
      birdY: settings.appHeight * 0.3,
      birdX: settings.appWidth / 2,

      countdown: 3,
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
        height: Math.random() * (
          ((settings.appHeight / 2) - (settings.wallGap / 2) - 100) 
        ) + 100,
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
        updatedState[wall].x -= 2.2;
        this.setState(updatedState);
      } else {
        updatedState[wall] = {
          x: settings.appWidth,
          height: Math.random() * 
            ((settings.appHeight - (settings.wallGap + 50)) - 50) + 50,
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
      birdRotation: this.state.birdRotation + 2.7 < 180 ? this.state.birdRotation + 2.7 : 180,
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

          <linearGradient id="background-gradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="black"/>
            <stop offset="100%" stopColor="#303f9f"/>
          </linearGradient>

          <rect
            width={ settings.appWidth }
            height={ settings.appHeight }
            x="0"
            fill="url(#background-gradient)"
          />

          <circle
            className="star"
            cx="100"
            cy="180"
            r="1.2"
            fill="white"
          />

          <circle
            className="star"
            cx={ settings.appWidth - 20 }
            cy="160"
            r="1.2"
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
            r="1.4"
            fill="white"
          />

          <circle
            className="star"
            cx="40"
            cy="320"
            r="1"
            fill="white"
          />

          <circle
            className="star"
            cx="240"
            cy="280"
            r="1"
            fill="white"
          />

          <circle
            className="star"
            cx="260"
            cy="80"
            r="1.5"
            fill="white"
          />

          <g transform={`translate(${settings.appWidth * 0.7},${settings.appHeight * 0.6})`}>
            <path d="M20 20A35 35 0 1 0 50 80 30 30 0 1 1 20 20z" fill="white"/>
          </g>

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
              y={ this.state.birdY }
              width={ settings.birdWidth + 10}
              height={ settings.birdHeight + 10}
              fill="#009688"
              viewBox="0 0 48 48">
              <path
                transform={`rotate(${this.state.birdRotation}, 24, 24)`}
                d="M12 36c0 1.1.9 2 2 2h2v7c0 1.66 1.34 3 3 3s3-1.34 3-3v-7h4v7c0 1.66 1.34 3 3 3s3-1.34 3-3v-7h2c1.1 0 2-.9 2-2V16H12v20zM7 16c-1.66 0-3 1.34-3 3v14c0 1.66 1.34 3 3 3s3-1.34 3-3V19c0-1.66-1.34-3-3-3zm34 0c-1.66 0-3 1.34-3 3v14c0 1.66 1.34 3 3 3s3-1.34 3-3V19c0-1.66-1.34-3-3-3zM31.06 4.32l2.61-2.61c.39-.39.39-1.02 0-1.41-.39-.39-1.02-.39-1.41 0L29.3 3.25C27.7 2.46 25.91 2 24 2c-1.92 0-3.72.46-5.33 1.26L15.7.29c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41l2.62 2.62C13.94 6.51 12 10.03 12 14h24c0-3.98-1.95-7.5-4.94-9.68zM20 10h-2V8h2v2zm10 0h-2V8h2v2z"
              />
            </svg>
          }

          { this.state.gameActive &&
            <g transform={`translate(${settings.appWidth / 2 - 22},20)`}>
              <rect width="44" height="40" rx="5" ry="5" fill="#009688"/>

              <text
                textAnchor="middle"
                transform="translate(22,30)"
                style={{fontSize: '26px', fill: 'white'}}>
                { this.state.score }
              </text>
            </g>
          }

          { this.state.countdown >= 0 &&
            <g
              onClick={ this.startGame }
              className={ 'fade-in ' + (this.state.countdown === 0 ? 'fade-out' : '') }
              transform={`translate(${settings.appWidth / 2},${settings.appHeight / 2})`}
              >
              <circle
                r="32"
                fill="white"
              />

              { !this.state.gameStart &&
                <polygon
                  transform="translate(-18,-25)"
                  points="10,10, 10,40 33,25"
                  fill="black"
                />
              }

              { this.state.gameStart &&
                <text
                  textAnchor="middle"
                  transform="translate(0, 14)"
                  style={{fontSize: '40px'}}>
                  { this.state.countdown }
                </text>
              }
            </g>
          }
        </svg>


      </div>
    );
  }
}

export default App;
