import {h} from 'virtual-dom'

import './slider.css!'

// pass in a d3 scale whose range is the input extent

function Slider(scale, value) {
  let state = {
    scale: scale,
    value: value || scale.range()[0],
    channels: {
      setvalue: (val) => state.value = val
    }
  }
  return state
}

Slider.render = function(state, title, active) {
  let node

  let domain = state.scale.domain()
  let width = domain[1] - domain[0]

  function move(ev) {
    let p = point(node, ev)
    let v = state.scale(p[0] - domain[0])
    state.channels.setvalue(v)
  }
  function up() {
    document.body.removeEventListener('mousemove', move)
    document.body.removeEventListener('mouseup', up)
  }

  return h('div.slider.' + (active ? 'active' : 'inactive'), [
    h('div.slider-title', title),
    h('div.slider-tray', {
        style: 'width:' + width + 'px',
        onmousedown: function() {
          if(!active) return
          // NB presumes slider x,y position is constant during the drag
          node = this
          document.body.addEventListener('mousemove', move)
          document.body.addEventListener('mouseup', up)
        }
      },
      h('div.slider-handle', { style: 'left:' + invert(state.value, state.scale) + 'px' },
        h('div.slider-handle-icon')
      ),
    )
  ])
}

function invert(val, scale) {
  if(scale.invert) return scale.invert(val)
  if(scale.invertExtent) {
    let range = scale.invertExtent(val)
    return (range[0] + range[1]) / 2
  }
  throw 'Scale has no invert function'
}

function point(node, event) {
  let rect = node.getBoundingClientRect()
  return [event.clientX - rect.left - node.clientLeft, event.clientY - rect.top - node.clientTop]
}

export default Slider
