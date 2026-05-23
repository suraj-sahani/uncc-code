import fs from "node:fs"
import { performance } from "perf_hooks"

// Execution Time : 8s
// CPU Usage : 100% of 1 core
// Memory Usage: 50mb
// (async () => {
//
//   const start = performance.now();
//   try {
//     const fileHandle = await fs.open("./test-write-many.txt", "w")
//
//     for (let i = 0; i < 1_000_000; i++) {
//       await fileHandle.write(`Iteration count: ${i}\n`)
//     }
//   } catch (error) {
//     console.error(error)
//   }
//
//   const end = performance.now();
//
//   console.log(`Time: ${(end - start).toFixed(2)}ms`)
// })()


// Execution Time: 0.6s
// CPU Usage: 100% of 1 core
// Memory Usage: 600mb
// (async () => {
//
//   console.time("write_many")
//   fs.open("./test-write-many.txt", "w", (err, fd) => {
//
//
//     for (let i = 0; i < 1_000_000; i++) {
//       fs.write(fd, `Iteration count: ${i}\n`, () => { })
//     }
//
//     console.timeEnd("write_many")
//
//   })
//
//
// })()


// Execution Time: 1.3s
// CPU Usage: 100% of 1 core
// Memory Usage: 30mb
(async () => {

  console.time("write_many")
  fs.open("./test-write-many.txt", "w", (err, fd) => {


    for (let i = 0; i < 1_000_000; i++) {
      fs.writeSync(fd, `Iteration count: ${i}\n`)
    }

    console.timeEnd("write_many")

  })


})()

