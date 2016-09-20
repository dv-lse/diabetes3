import {h, diff, patch, create} from 'virtual-dom'

import Slider from './slider'

import 'styles.css!'

// state

let state = {
  metric1: Slider()
}

// view

const fmt = (d) => '' + d

function render(state) {
  return h('div.contents', [
    Slider.render(state.metric1, fmt, 'Metric 1')
  ])
}

// main loop

let tree = render(state)
let rootNode = create(tree)
let prevState = state

document.body.appendChild(rootNode)
window.requestAnimationFrame(loop)

function loop() {
  let newTree = render(state)
  let patches = diff(tree, newTree)
  rootNode = patch(rootNode, patches)
  tree = newTree
  prevState = state
  window.requestAnimationFrame(loop)
}
