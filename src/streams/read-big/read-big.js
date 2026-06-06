import fs from "node:fs/promises";

(async () => {
  const fileHandleRead = await fs.open("./sample-read.txt", "r");
  const fileHandleWrite = await fs.open("./sample-write.txt", "w")

  // While creating a read-able stream, the stream does not do
  // anything by deafult and is in a paused state.
  // As soon as we attach an event-handler, we start using the stream
  const readStream = fileHandleRead.createReadStream();

  const writeStream = fileHandleWrite.createWriteStream()

  readStream.on('data', (chunk) => {
    console.log(chunk)
    // Note this this chunk is not 16 kb instead its 64 kb
    // We can also change this value by passing a option of highWatermMark(bytes)
    // To change this size
    console.log(chunk.length)

    // We will not take the chunk and write it
    // to another file using write streams
    writeStream.write(chunk)
  })
})();
