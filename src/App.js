import React, { Component } from 'react';
import './App.css';

const settings = {
  appWidth: 400,
  appHeight: 600,
  birdWidth: 40,
  birdHeight: 40,
};

let moveUpAnimation = undefined;
let moveUpAnimationAfter = undefined;
let gravityAnimation = undefined;
// eslint-disable-next-line
let wallAnimation = undefined;

class App extends Component {
  constructor() {
    super();
    this.state = {
      gameActive: false,
      posX: settings.appWidth / 2 - settings.birdWidth / 4,
      posY: 150,
      wallX: 400,
      wallY: 300,
      fallSpeed: 2,
      elevateSpeed: 14,
    };
  };
  componentDidMount() {
    wallAnimation = requestAnimationFrame(this.wallX);
  };
  componentDidUpdate() {
    const fellToGround = this.state.posY > settings.appHeight - settings.birdHeight;
    const height = this.state.posY + settings.birdHeight >= this.state.wallY;
    const width = this.state.posX + settings.birdWidth > this.state.wallX && this.state.posX < this.state.wallX + 50;

    if ((width && height) || fellToGround) {
      this.gameOver();
    }
  }
  startGame = () => {
    this.setState({
      gameActive: true,
    });
    moveUpAnimationAfter = requestAnimationFrame(this.moveUpAfter);
    gravityAnimation = requestAnimationFrame(this.gravity);
  };
  handleMouseDown = () => {
    cancelAnimationFrame(moveUpAnimationAfter);
    cancelAnimationFrame(gravityAnimation);
    if (!this.state.gameActive) { return; }
    this.setState({
      fallSpeed: 3,
      elevateSpeed: 14,
    });
    moveUpAnimation = requestAnimationFrame(this.moveUp);
  };
  handleMouseUp = () => {
    if (!this.state.gameActive) { return; }

    cancelAnimationFrame(moveUpAnimation);
    
    moveUpAnimationAfter = requestAnimationFrame(this.moveUpAfter);
    gravityAnimation = requestAnimationFrame(this.gravity);
  };
  moveUp = () => {
    if (this.state.posY > 8) {
      this.setState({
        posY: this.state.posY - 8,
      });
      moveUpAnimation = requestAnimationFrame(this.moveUp);
    }
  };
  moveUpAfter = () => {
    if (this.state.posY > 0 && this.state.elevateSpeed > 0) {
      this.setState({
        posY: this.state.posY - this.state.elevateSpeed,
        elevateSpeed: this.state.elevateSpeed - 0.7,
      });
      moveUpAnimationAfter = requestAnimationFrame(this.moveUpAfter);
    }
  };
  gravity = () => {
    if (!this.state.gameActive) {
      cancelAnimationFrame(gravityAnimation);
      return;
    }
    this.setState({
      posY: this.state.posY + this.state.fallSpeed,
      fallSpeed: this.state.fallSpeed + 0.2,
    });
    gravityAnimation = requestAnimationFrame(this.gravity);
  };
  wallX = () => {
    if (this.state.wallX > -50) {
      this.setState({
          wallX: this.state.wallX - 1.5,
      });
    } else {
      this.setState({
        wallX: 400,
        wallY: settings.appHeight - (Math.floor(Math.random() * (400 - 200)) + 200),
      });
    }
    wallAnimation = requestAnimationFrame(this.wallX);
  };
  gameOver = () => {
    cancelAnimationFrame(gravityAnimation);
    cancelAnimationFrame(moveUpAnimation);
    cancelAnimationFrame(moveUpAnimationAfter);
    this.setState({
      gameActive: false,
      posX: settings.appWidth / 2 - settings.birdWidth / 4,
      posY: 150,
      wallX: 400,
      wallY: 300,
      fallSpeed: 2,
      elevateSpeed: 14,
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
          
          <rect 
            width="50"
            height={ settings.appHeight - this.state.wallY  } 
            x={ this.state.wallX } 
            y={ this.state.wallY } 
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
            <g>
              <circle
                onClick={ this.startGame }
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
