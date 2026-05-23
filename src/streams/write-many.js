
// import fs from "fs/promises"
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


// import fs from "node:fs"
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

// import fs from "node:fs"
// Execution Time: 1.3s
// CPU Usage: 100% of 1 core
// Memory Usage: 30mb
// (async () => {
//
//   console.time("write_many")
//   fs.open("./test-write-many.txt", "w", (err, fd) => {
//
//
//     for (let i = 0; i < 1_000_000; i++) {
//       fs.writeSync(fd, `Iteration count: ${i}\n`)
//     }
//
//     console.timeEnd("write_many")
//
//   })
//
// })()

import fs from "fs/promises"
// We can make this process much faster using streams
// Note: This is a bad way of doing it
// One of the problems is the memory usage
// We will optimise it later
// Execution Time: 0.15s/150ms
// CPU Usage: 100% of 1 core
// Memory Usage: 200mb
(async () => {
  console.time("write_stream")

  const fileHandle = await fs.open("./test-write-many.txt", "w")

  const stream = fileHandle.createWriteStream()

  for (let i = 0; i < 1_000_000; i++) {
    const buffer = Buffer.from(`Iteration: ${i}\n`, "utf-8")
    stream.write(buffer)
  }

  console.timeEnd("write_stream")
})()
