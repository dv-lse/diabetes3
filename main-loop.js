import {diff, patch, create, h} from 'virtual-dom'

// TODO. modifies the DOM on file load.  perhaps better to delay...
let tree = h('div#loading')
let rootNode = create(tree)
document.body.appendChild(rootNode)

function loop(render) {
  return () => window.requestAnimationFrame(tick)

  function tick() {
    let newTree = render()
    let patches = diff(tree, newTree)
    rootNode = patch(rootNode, patches)
    tree = newTree
  }
}

export default loop
