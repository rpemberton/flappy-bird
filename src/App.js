import React, { Component } from 'react';
import './App.css';

const settings = {
  appWidth: 400,
  appHeight: 600,
  birdWidth: 50,
  birdHeight: 50,
};

let moveUpAnimation = undefined;
let moveUpAnimationAfter = undefined;
let gravityAnimation = undefined;

class App extends Component {
  constructor() {
    super();
    this.state = {
      posX: 175,
      posY: 400,
      wallX: 400,
      wallH: 300,
      debouncerTimer: undefined,
      fallSpeed: 2,
      elevateSpeed: 14,
    };
  };
  componentDidMount() {
    gravityAnimation = requestAnimationFrame(this.gravity);
    this.wallX();
  };
  handleMouseDown = () => {
    cancelAnimationFrame(moveUpAnimationAfter);
    cancelAnimationFrame(gravityAnimation);
    this.setState({
      fallSpeed: 3,
      elevateSpeed: 14,
    });
    moveUpAnimation = requestAnimationFrame(this.moveUp);
  };
  handleMouseUp = () => {
    cancelAnimationFrame(moveUpAnimation);
    moveUpAnimationAfter = requestAnimationFrame(this.moveUpAfter);
    gravityAnimation = requestAnimationFrame(this.gravity);
  };
  moveUp = () => {
    if (this.state.posY > 0) {
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
    if (this.state.posY < (settings.appHeight - settings.birdHeight)) {
      this.setState({
        posY: this.state.posY + this.state.fallSpeed,
        fallSpeed: this.state.fallSpeed + 0.2,
      });
      gravityAnimation = requestAnimationFrame(this.gravity);
    }
  };
  wallX = () => {
    setInterval(() => {
      if (this.state.wallX > -50) {
        this.setState({
           wallX: this.state.wallX - 1,
        });
      } else {
        this.setState({
          wallX: 400,
          wallH: Math.floor(Math.random() * (400 - 200)) + 200,
        });
      }
    }, 10)
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
            height={ this.state.wallH } 
            x={ this.state.wallX } 
            y={ settings.appHeight - this.state.wallH } 
            fill="red"
          />
          
          <rect 
            width={ settings.birdWidth }
            height={ settings.birdHeight }
            x={ this.state.posX } 
            y={ this.state.posY } 
            fill="#008d46" 
          />
          
        </svg>
      </div>
    );
  }
}

export default App;
