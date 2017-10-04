import React, { Component } from 'react';
import './App.css';

import Building from './components/Building.js';
import Wall from './components/Wall.js';

// import robot from './img/robot.png';
import robot from './img/android-logo.png';

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
    if (!this.state.gameStart) {
      this.startGame();
    }
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
          height: Math.random() * ((settings.appHeight - 300) - 70) + 70,
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

          <linearGradient id="Gradient2" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="black"/>
            <stop offset="100%" stopColor="#303f9f"/>
          </linearGradient>

          <rect
            width={ settings.appWidth }
            height={ settings.appHeight }
            x="0"
            fill="url(#Gradient2)"
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
              <rect width="40" height="40" rx="5" ry="5" fill="#009688"/>

              <text
                textAnchor="middle"
                transform="translate(20,30)"
                style={{fontSize: '26px', fill: 'white'}}>
                { this.state.score }
              </text>
            </g>
          }

          { this.state.countdown >= 0 &&
            <g
              className={ 'fade-in ' + (this.state.countdown === 0 ? 'fade-out' : '') }
              transform={`translate(${settings.appWidth / 2},${settings.appHeight / 2})`}
              >
              <circle
                r="35"
                fill="white"
              />

              <polygon
                className={ this.state.gameStart ? 'fade-out' : '' }
                transform="translate(-18,-25)"
                points="10,10, 10,40 33,25"
                fill="black"
              />

              { this.state.gameStart &&
                <text
                  textAnchor="middle"
                  transform="translate(0, 15)"
                  style={{fontSize: '44px'}}>
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
