import {h} from 'virtual-dom'

import './slider.css!'

function Slider() {
  let state = {
    value: 0,
    channels: {
      setvalue: (val) => state.value = val
    }
  }
  return state
}

Slider.render = function(state, title) {
  let node

  function move(ev) {
    let p = point(node, ev)
    state.channels.setvalue(p[0])
  }
  function up() {
    document.body.removeEventListener('mousemove', move)
    document.body.removeEventListener('mouseup', up)
  }

  return h('div.slider', [
    h('div.slider-title', title),
    h('div.slider-tray', {
        onmousedown: function() {
          // NB presumes slider x,y position is constant during the drag
          node = this
          document.body.addEventListener('mousemove', move)
          document.body.addEventListener('mouseup', up)
        }
      },
      h('div.slider-handle', { style: 'left:' + state.value + 'px' },
        h('div.slider-handle-icon')
      ),
    )
  ])
}

function point(node, event) {
  let rect = node.getBoundingClientRect()
  return [event.clientX - rect.left - node.clientLeft, event.clientY - rect.top - node.clientTop]
}

export default Slider
