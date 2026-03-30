import EventEmitter from "events"

class Emitter extends EventEmitter { }

const myEmitter = new Emitter()

let sameEventCount = 1;

// If multiple events have the same event name,
// They will be called sequentially irrespective of the event callback difference
// Every time an event with the same name is declared,
// The main object stores an array for that event instead of a single value
// Thus, myEmitter = {
//  foo : []
//  bar : () => {}
// }

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

myEmitter.on("bar", (val: unknown) => {
  console.log(`Event name: bar`)
  console.dir({ event_value: val }, { depth: null })
})

// Each emit instance will call all the event with this name
// So, if we emit the same event two times, 
// All the events with the same name will be called twice
// In total, the "foo" event will be called 6 times as there are 3 events with the same name
myEmitter.emit("foo")
myEmitter.emit("bar", {
  type: 'test',
  timestamp: Date.now()
})

// The "once" method works the same way as "on"
// bu has a fundamental difference where, no matter how many times we emit this 
// event, it will only run once
myEmitter.once("baz", () => {
  console.log("Baz will only run once")
})

// All the calls will be ignored and run only once
myEmitter.emit('baz')
myEmitter.emit('baz')
myEmitter.emit('baz')
myEmitter.emit('baz')
