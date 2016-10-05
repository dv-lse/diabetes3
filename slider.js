import {h} from 'virtual-dom'
import * as d3 from 'd3'

import './slider.css!'

function Slider(tripwire, range, value) {
  let state = {
    range: range,
    value: value || range[0],
    channels: {
      setvalue: (val) => { state.value = val; tripwire(); }
    }
  }
  return state
}

Slider.render = function(state, active=true, color='lightblue') {
  let node
  let scale = (state.range.length === 2) ? d3.scaleLinear().clamp(true) : d3.scaleQuantize()

  scale.range(state.range)
    .domain([0,100])

  let x = invert(state.value, scale)

  function move(ev) {
    let p = point(node, ev)
    let v = scale(p[0])
    state.channels.setvalue(v)
  }
  function up() {
    document.removeEventListener('mousemove', move)
    document.removeEventListener('mouseup', up)
  }

  return h('div.slider-tray', {
        style: { background: 'linear-gradient(to right, ' + color + ' ' + Math.round(x) + '%, #f0f0f0 ' + Math.round(x) + '%)' },
        onmousedown: function(ev) {
          if(!active) return
          // NB presumes slider x,y position is constant during the drag
          node = this
          document.addEventListener('mousemove', move)
          document.addEventListener('mouseup', up)
          ev.stopImmediatePropagation()
        },
        ontouchstart: function(ev) {
          ev.stopImmediatePropagation()
        },
        ontouchmove: function(ev) {
          ev.preventDefault()
          ev.stopImmediatePropagation()
          // TODO.  the first changed touch may not be the right value (e.g. for 'fumbles')
          let p = point(this, ev.changedTouches[0])
          let v = scale(p[0])
          state.channels.setvalue(v)
        },
        ontouchend: function(ev) {
          ev.stopImmediatePropagation()
        }
      },
      h('div.slider-handle', { style: { left: Math.round(x) + '%' } },
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

function point(node, eventInfo) {
  let rect = node.getBoundingClientRect()
  return [eventInfo.clientX - rect.left - node.clientLeft, eventInfo.clientY - rect.top - node.clientTop]
}

export default Slider
