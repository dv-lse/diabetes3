import {h, diff, patch, create} from 'virtual-dom'

import Immutable from 'seamless-immutable'

// view
function render(count) {
  return h('div', 'hello world: ' + count)
}

// mutate
function mutate(count) {
  return Immutable(count + (Math.random() < 0.3 ? 1 : 0))
}

// render loop

let count = Immutable(0)
let tree = render(count)
let rootNode = create(tree)
document.body.appendChild(rootNode)

setInterval(() => {
  let nextState = mutate(count)
  console.log('tick')

  if(nextState !== count) {
    console.log('dirty: updating')
    let newTree = render(nextState)
    let patches = diff(tree, newTree)
    rootNode = patch(rootNode, patches)
    tree = newTree
    count = nextState
  }
}, 250)
