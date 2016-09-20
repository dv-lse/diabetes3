import {h, diff, patch, create} from 'virtual-dom'
import Immutable from 'seamless-immutable'
import EventEmitter from 'events'

// state

let state = Immutable({
  clicks: 0
})

// controller

class StateBus extends EventEmitter {}
let bus = new StateBus()

bus.on('count', () => {
  console.log('advancing')
  state = state.set('clicks', state.clicks + 1)
})

// view

function render(state) {
  return h('div', { onclick: () => bus.emit('count') },
           'hello world: ' + state.clicks)
}

// main loop

let tree = render(state)
let rootNode = create(tree)
let prevState = state

document.body.appendChild(rootNode)

setInterval(() => {
  if(state !== prevState) {
    console.log('dirty')
    let newTree = render(state)
    let patches = diff(tree, newTree)
    rootNode = patch(rootNode, patches)
    tree = newTree
    prevState = state
  } else {
    console.log('tick')
  }
}, 200)
