import * as d3 from 'd3'

import debounce from 'debounce'


// Animation hook for vitual dom

let Interpolate = function(target, duration=500, delay=0) {
  this.target = target
  this.duration = duration
  this.delay = delay
}

Interpolate.prototype.run = function(interpolate, callback) {
  // stop any running timers
  if(this.timer)
    this.timer.stop()

  // start a new transition
  let self = this
  this.timer = d3.timer( (elapsed) => {
    let progress = d3.easeCubic(elapsed / self.duration)
    let value = interpolate(progress)

    if(elapsed > self.duration)
      self.timer.stop()

    callback(value)
  })
}

Interpolate.prototype.hook = function(node, propertyName, prevValue) {

  // if already debouncing, adopt prior delay
  this.timer = (prevValue && prevValue.timer)
  this.animate = (prevValue && prevValue.animate) || debounce(this.run, 500)

  // if no prior state, do not use a transition
  if(!prevValue) {
    node.setAttribute(propertyName, this.target)
    return
  }

  // note current state
  let curValue = node.getAttribute(propertyName) || prevValue.target

  // if called twice with the same state, a timer is already running
  if(curValue === this.target) return

  // start new animation thread
  this.animate(d3.interpolate(curValue, this.target),
               (value) => node.setAttribute(propertyName, value))
}

export default Interpolate
