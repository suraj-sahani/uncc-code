import fs from "node:fs/promises"
import { pipeline } from "node:stream/promises";

// (async () => {
//   // read content of the file.
//   const destFile = await fs.open('text-copy.txt', 'w')
//   // this will load the entire file in memory thereby
//   // increasing memory consumption
//   const sourceFile = await fs.readFile('source.txt')
//
//   // this is ok for small files but not a 
//   // good approach for large files and also, 
//   // nod will throw an error if the file size is
//   // larger than 2GB
//   await destFile.write(sourceFile)
//   console.log(sourceFile)
// })()

// Execution Time: 2s
// Memory Consumption: 30MB
// (async () => {
//   const destFile = await fs.open('text-copy.txt', 'w')
//   const sourceFile = await fs.open('source.txt', 'r')
//
//   let bytesRead = -1;
//   // bytesRead contains the amount of data that we have read
//   // and at the end of the file, this value will be zero.
//   // Thus, we use this to keep reading the file until its
//   // read completely
//   while (bytesRead !== 0) {
//     // This does not load/return the entire file but,
//     // returns a chunk if 16KB of the file
//     const readResult = await sourceFile.read()
//     bytesRead = readResult.bytesRead
//
//     // This works but we get some random characters
//     // at the end of the file due to the fact that out last
//     // buffer doe not contain anything and has 0's
//     // we can do this by checking that if our buffer size
//     // is not 16KB, we extract the data until which we have 0's
//     // and just create a copy of the buffer with the correct data.
//     if (bytesRead !== 16384) {
//       // This contains the data until the first zero is found
//       const indexOfZero = readResult.buffer.indexOf(0)
//       const correctBuffer = Buffer.alloc(indexOfZero)
//
//       // Copy the portion of correct data to the new buffer
//       readResult.buffer.copy(correctBuffer, 0, 0, indexOfZero)
//       destFile.write(correctBuffer)
//     }
//     // If the size matches, do the normal write
//     else {
//       await destFile.write(readResult.buffer)
//     }
//
//
//   }
// })()


// Piping example
// Execution Time: ~15ms
//
(async () => {

  console.time('Pipe')
  const destFile = await fs.open('text-copy.txt', 'w')
  const sourceFile = await fs.open('source.txt', 'r')

  const readStream = sourceFile.createReadStream()
  const writeStream = destFile.createWriteStream()

  // The pipe method only works for writeable streams.
  // It handles all the draining and resuming for us without us
  // explicitly doing so
  // One thing to also note is that pipe does not allow us to
  // handle errors gracefully and this can lead to potential memory
  // leaks if the on-going stream is not destroyed.
  // readStream.pipe(writeStream)
  //
  // readStream.on('end', () => {
  //   console.timeEnd('Pipe')
  // })

  // To fix this issue of error handling,
  // node.js provides us pipelines.
  pipeline(readStream, writeStream, (err){
    console.error(err)
  })
})()
