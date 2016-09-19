import {h, diff, patch, create} from 'virtual-dom'

// view
function render(count) {
  return h('div', 'hello world: ' + count)
}

// state
let count = 0

// event loop
let tree = render(count)
let rootNode = create(tree)
document.body.appendChild(rootNode)

setInterval(() => {
  count++
  var newTree = render(count)
  var patches = diff(tree, newTree)
  rootNode = patch(rootNode, patches)
  tree = newTree
}, 1000)
