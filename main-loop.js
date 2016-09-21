
import {diff, patch, create} from 'virtual-dom'

function loop(render) {

  let tree = render()
  let rootNode = create(tree)

  document.body.appendChild(rootNode)
  window.requestAnimationFrame(tick)

  function tick() {
    let newTree = render()
    let patches = diff(tree, newTree)
    rootNode = patch(rootNode, patches)
    tree = newTree
    window.requestAnimationFrame(tick)
  }
}

export default loop
