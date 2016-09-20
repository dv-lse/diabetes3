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

Slider.render = function(state, fmt, title) {
  let node

  function move(ev) {
    let p = point(node, ev)
    state.channels.setvalue(p[0])
  }
  function up() {
    document.body.removeEventListener('mousemove', move)
    document.body.removeEventListener('mouseup', up)
  }

  let formatted_value = fmt ? fmt(state.value) : '' + state.value

  return h('div.slider', {
    onmousedown: function() {
      // NB presumes slider x,y position is constant during the drag
      node = this
      document.body.addEventListener('mousemove', move)
      document.body.addEventListener('mouseup', up)
    }
  }, [
    h('div.slider-title', title),
    h('div.slider-tray',
      h('div.slider-handle', { style: 'left:' + state.value + 'px' },
        h('div.slider-handle-icon')
      ),
    ),
    h('div.slider-value', formatted_value)
  ])
}

function point(node, event) {
  let rect = node.getBoundingClientRect()
  return [event.clientX - rect.left - node.clientLeft, event.clientY - rect.top - node.clientTop]
}

export default Slider
