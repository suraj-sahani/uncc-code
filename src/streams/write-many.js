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

// import fs from "fs/promises"
// We can make this process much faster using streams
// Note: This is a bad way of doing it
// One of the problems is the memory usage
// We will optimise it later
// Execution Time: 0.15s/150ms
// CPU Usage: 100% of 1 core
// Memory Usage: 200mb
// (async () => {
//   console.time("write_stream")

//   const fileHandle = await fs.open("./test-write-many.txt", "w")

//   const stream = fileHandle.createWriteStream()

//   for (let i = 0; i < 1_000_000; i++) {
//     const buffer = Buffer.from(`Iteration: ${i}\n`, "utf-8")
//     stream.write(buffer)
//   }

//   console.timeEnd("write_stream")
// })()

// Its clear that streams just made our process
// a lot faster but, the memory consumtion is still high.
//
import fs from "fs/promises";

(async () => {
  console.time("write_stream");

  const fileHandle = await fs.open("./test.txt", "w");

  const stream = fileHandle.createWriteStream();

  // Provides the size of the internal buffer where the stream data is stored
  console.log(stream.writableHighWaterMark);
  // Provides a value that indicates how much of the internal buffer is filled
  // This value is currently zero as we are not wrting anything to the string.
  console.log("Before writing:", stream.writableLength);

  // We create a buffer in order to fill the inner buffer
  // const buff = Buffer.alloc(16384);

  // stream.write return a boolean that signifies that if its waiting
  // for the stream to call the "drain" event
  // The drain event esentially empties the inner buffer if the writeable
  // data size is more the size of the inner buffer
  // const isWaiting = stream.write(buff);

  console.log("While writing:", stream.writableLength);

  // To identify, if the stream is now free and able to write,
  // the stream objects provides an event
  stream.on("drain", () => {
    console.log("Free to add data to stream");
  });

  // In this for-loop, we are creating a back-pressure
  // i.e we are not letting the inner before to empty
  // and we keep writing to it. Due to this, the extra data is
  // buffered into the memory resulting in high memory usage
  // for (let i = 0; i < 1_000_000; i++) {
  //   const buffer = Buffer.from(`Iteration: ${i}\n`, "utf-8")
  //   stream.write(buffer)
  // }
  //

  // In order to implement the same behaviour but without,
  // the high memory consumption problem, we need to check
  // for if the inner buffer is filled or not.
  let i = 0;
  const writeMany = () => {
    while (i < 1_000_000) {
      const buffer = Buffer.from(`Iteration: ${i}\n`, "utf-8");

      // Checking if we are on our last write,
      //
      if (i === 999999) {
        // This ends out stream and if we try to write
        // anything after this, it will throw an error.
        // This end moethod also emits an "finish" event
        return stream.end(buffer);
      }
      // Check if the buffer is full and if it is,
      // terminate the loop
      const isWaiting = stream.write(buffer);
      if (!isWaiting) break;
      i++;
    }
  };

  writeMany();

  // Resume writing once the streams internal buffer
  // is empty
  stream.on("drain", () => {
    writeMany();
  });

  stream.on("finish", () => {
    console.timeEnd("write_stream");
    // Once writing to the stream is finished,
    // we close the fileHandle to prevent memory leaks
    fileHandle.close();
  });
})();
