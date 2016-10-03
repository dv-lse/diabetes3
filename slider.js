import {h} from 'virtual-dom'

import './slider.css!'

// pass in a d3 scale whose range is the input extent

function Slider(tick, scale, value) {
  let state = {
    scale: scale,
    value: value || scale.range()[0],
    channels: {
      setvalue: (val) => { state.value = val; tick(); }
    }
  }
  return state
}

Slider.render = function(state, active=true, color='lightblue') {
  let node

  let domain = state.scale.domain()
  let width = domain[1] - domain[0]
  let x = invert(state.value, state.scale)

  function move(ev) {
    let p = point(node, ev)
    let v = state.scale(p[0] - domain[0])
    state.channels.setvalue(v)
  }
  function up() {
    document.removeEventListener('mousemove', move)
    document.removeEventListener('mouseup', up)
  }

  return h('div.slider-tray', {
        style: {width: width + 'px', background: 'linear-gradient(to right, ' + color + ' ' + x + 'px, #f0f0f0 ' + x + 'px)'},
        onmousedown: function() {
          if(!active) return
          // NB presumes slider x,y position is constant during the drag
          node = this
          document.addEventListener('mousemove', move)
          document.addEventListener('mouseup', up)
        }
      },
      h('div.slider-handle', { style: {left: x + 'px' } },
        h('div.slider-handle-icon')
      ),
    )
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
