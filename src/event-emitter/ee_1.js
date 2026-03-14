import { count } from "console";
import EventEmitter from "events"

class Emitter extends EventEmitter { }

const myEmitter = new Emitter()

let sameEventCount = 1;

// If multiple events have the same event name,
// They will be called sequentially irrespective of the event callback difference

myEmitter.on('foo', () => {
  sameEventCount++
  console.log(`Event name: foo, event count: ${sameEventCount}`)
})

myEmitter.on('foo', () => {
  sameEventCount++
  console.log(`Event name: foo, event count: ${sameEventCount}`)
})


myEmitter.on('foo', (x) => {
  sameEventCount++
  console.log(`Event name: foo, event count: ${sameEventCount}`)
})

myEmitter.on("bar", (val) => {
  console.log(`Event name: bar`)
  console.dir({ event_value: val }, { depth: null })
})

myEmitter.emit("foo")
myEmitter.emit("bar", {
  type: 'test',
  timestamp: Date.now()
})
