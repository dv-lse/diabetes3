import * as d3 from 'd3'

// Animation hook for vitual dom

let Interpolate = function(target, duration=500, delay=0) {
  this.target = target
  this.duration = duration
  this.delay = delay
}

Interpolate.prototype.hook = function(node, propertyName, prevValue) {
  // if no prior state, do not use a transition
  if(!prevValue) {
    node.setAttribute(propertyName, this.target)
    return
  }

  // note current state
  let curValue = node.getAttribute(propertyName) || prevValue.target

  // if called twice with the same state, a timer is already running
  if(curValue === this.target) return

  // stop any running timers
  if(this.timer)
    this.timer.stop()

  // set up the interpolation
  this.interpolate = d3.interpolate(curValue, this.target)

  // start a new transition
  let self = this
  this.timer = d3.timer( (elapsed) => {
    let progress = d3.easeCubic(elapsed / self.duration)
    let value = self.interpolate(progress)
    node.setAttribute(propertyName, value)

    if(elapsed > self.duration)
      self.timer.stop()

  }, self.delay)
}

export default Interpolate
