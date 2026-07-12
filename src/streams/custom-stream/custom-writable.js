import { Writable } from "node:stream";
import fs from "node:fs"
class FileWriteStream extends Writable {
  constructor({ highWaterMark, fileName }) {
    super({ highWaterMark })

    this.fileName = fileName
    this.fd = null
    this.chunks = []
    this.chunksSize = 0
    this.writesCount = 0
  }


  // The _contruct method runs after the
  // constructor has been called and
  // can be used to do operation before the write method
  _construct(callback) {
    // This will prevent all the other methods from running
    // until 5 seconds have passed
    // setTimeout(() => {
    //   callback()
    // }, 5000)
    fs.open(this.fileName, 'w', (err, fd) => {
      // if we pass the error to the callback,
      // the stream object will automactically handle the
      // stream object
      if (err) {
        callback(err)
      } else {
        this.fd = fd
        // No arguments means it was successful
        callback()
      }
    })

  }

  _write(chunk, encoding, callback) {
    console.log(this.fd)
    // Now, if we do this, it is not doing actually doing the
    // work it is intended i.e it is writing every single time
    // to the file and not write to the file in chunks
    // Thus, to solve this we will implement chunks
    this.chunks.push(chunk)
    this.chunksSize += chunk.length

    // We check if the chunkSize exceeds the highWaterMark value,
    // we only then write to the file
    if (this.chunksSize > this.writableHighWaterMark) {
      fs.write(this.fd, Buffer.concat(this.chunks), (err) => {
        // if there is an error while writing to it, we pass the error
        // to the callback signifying that the stream has errored and needs to
        // be closed
        if (err) {
          return callback(err)
        }
        this.chunks = []
        this.chunksSize = 0
        ++this.writesCount
        callback()
      })
    } else {
      callback()
    }

    // Implement out write operation
    // and when we are done, we should call our callback function
    // callback()
    // ALso remeber not to implement your own events
    // from the child class if the parent class already supports
    // these events as emitting your own will cause unexpected behaviour
    // For the same reason, do not overwrite the existing methods
    // already present in the base class. Instead, use the private
    // methods to extend behaviours.
    // Do not call these methods directly as well.
    // i.e stream._write() is forbidden
  }

  // The final method is responsible for writing all the data in the
  // stream to the actuall file and this only runs when the stream.end
  // event is called
  _final(callback) {
    fs.write(this.fd, Buffer.concat(this.chunks), (err) => {
      if (err)
        return callback(err)

      this.chunks = []
      callback() // if we don't call this callback,
      // the finish event will not be triggered
    })
  }

  // this runs when all the stream operation is done,
  // and the stream is destroyed.
  _destroy(error, callback) {
    console.log(`Write Count: ${this.writesCount}`)
    // Since this method is called when the stream is about to be destroyed,
    // we also need to close the file.
    if (this.fd) {
      // pass the errors if any error is caused while closing
      // the file
      fs.close(this.fd, (err) => {
        callback(err || error)
      })
    } else {
      callback(error)
    }
  }
}

const stream = new FileWriteStream({ highWaterMark: 1800, fileName: "text.txt" })
stream.write(Buffer.from("Some random string."))
stream.end(Buffer.from("Writing last stream"))
// The finish event is called when the stream is destroyed
stream.on('finish', () => {
  console.log("Stream was finished")
})
// stream.on('drain', () => { })
