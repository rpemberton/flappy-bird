import React from 'react';

const Wall = (props) => {
  return(
    <g>
      <rect
        width="50"
        height={ props.wallTopHeight }
        x={ props.wallX }
        y="0"
        fill="red"
      />

      <rect
        width="50"
        height={ props.settings.appHeight - props.wallTopHeight - 200  }
        x={ props.wallX }
        y={ props.wallTopHeight + 200 }
        fill="red"
      />
    </g>
  )
}

export default Wall;
