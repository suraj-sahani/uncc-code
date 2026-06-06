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
    // The porble with this approach is that we are creating,
    // a lot of back pressure where extra chunks are being buffered
    // the same issue that we faced with the for-loop example.
    // This will crash the process if we are writing a lot of data.
    // To fix this, we will have to use the "drain" stream method again
    const isDrainWritable = writeStream.write(chunk)
    // Checking if the current stream buffer is full and we 
    // cannot write anymore until it has been emptied.
    // We pause the stream read as well as we need to keep track
    // of our read progress
    if (!isDrainWritable) {
      readStream.pause()
    }
  })


  // Once the stream is drained, we resume the stream read
  writeStream.on('drain', () => {
    // Doing this stream pause and resume process,
    // we are making sure that our read-write process never creashed,
    // no matter how large out streams are
    readStream.resume()
  })
})();
