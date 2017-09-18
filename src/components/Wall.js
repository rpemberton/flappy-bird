import React from 'react';

const Wall = (props) => {
  return(
    <g>
      <rect
        width="50"
        height={ props.settings.appHeight - (props.settings.appHeight - props.wallLowY) - 200 }
        x={ props.wallX }
        y="0"
        fill="red"
      />

      <rect
        width="50"
        height={ props.settings.appHeight - props.wallLowY }
        x={ props.wallX }
        y={ props.wallLowY }
        fill="red"
      />
    </g>
  )
}

export default Wall;
