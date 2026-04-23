import fs from "fs/promises";


async function createFile(path) {
  let existingFile

  try {
    // Checking if we already have the file created.
    // if there is not, it will throw an error
    existingFile = await fs.open(path, "r")
    // We also need to close the file, this will create a memory leak
    existingFile.close()
    console.error(`The file ${path} is already created.`)
    return
  } catch (error) {
    const newFile = await fs.open(path, 'w')
    console.log("New File was creatd")
    newFile.close()
  }

}

(async () => {
  try {
    const commandFile = await fs.open("./command.txt", "r")

    // The FileHandle object that we get from fs.open()
    // is an EventEmitter as well, so, we can use this to clean-up our code
    commandFile.on('change', async () => {
      // To read the contents of a file, we have to first open it.
      // When we open a file, we are not actually moving all the content of the file
      // to the memory, except, we are saving a number regaring the file.
      // This number is called the file descriptor.
      // const content = await commandFile.read()
      // When we log this file, we can see that the amount of bytes allocated,
      // for this is much more that actually needed.
      // This is overuse of memory.
      // console.dir({ content }, { depth: Infinity })

      // to allocate a buffer that is only limmited to content,
      // we need to pass an option to  the readFile method
      // this will be size of the bufffer and to allocate that size,
      // we pass it using Buffer.alloc()
      // But, we need to find out the size of out file.
      const fileStats = await commandFile.stat()
      const fileSize = fileStats.size
      // Now, the memory allocated is only limited to the size of the file/contents
      // of the file
      // const content = await commandFile.read(Buffer.alloc(fileSize))
      // We can often see that we are getting logs where the file/buffer is filled with zeros.
      // This is due to the fact that everytime we save the file, the position from which,
      // the file is read changes
      // this is due to the fact that when the file is read for the first time, it reads it from the beginning
      // but afterwards, it reads it from the end. This is why we get all zeros as there is nothing
      // after the end of the file contents.
      // We can prevent this by passing the exact location to the file,
      // in the fileRead method.
      // Reference: https://nodejs.org/docs/latest/api/fs.html#filehandlereadfileoptions
      // Syntax = command.readFile(buffer,offset,length, options)
      const offset = 0, buff = Buffer.alloc(fileSize), length = buff.byteLength, position = 0
      // Now, we always get the correct refernce to the file
      // const content = await commandFile.read(buff, offset, length, position)
      // We dont really need to store the data into a variable, as it is already,
      // present in the buff using which we are allocating memory
      await commandFile.read(buff, offset, length, position)

      // Now, the content we get is actually encode hexa-decimals and we want to get
      // meaningful data out of it, thus, we need to deconde it.
      const command = buff.toString('utf-8')

      // Command Format: CREATE : Path
      const [type, path] = command.split(':')

      switch (type) {
        case "CREATE": {
          await createFile(path.replaceAll('\n', ''))
          break;
        }
        default: {
          console.error(`Invalid command type: ${type}`)
          break;
        }
      }


    })

    // Watch the entire directory for changes
    const watcher = fs.watch("./command.txt");



    for await (const event of watcher) {
      // The event value return the following results:
      // 1. rename => This is a bit counter intuitive, but this event
      // is fired when file is created,renamed or deleted
      // 2. changes => When the contents of the files have changed
      // Also, the number of times the log runs is different
      // in case of changes. Sometimes, there can a single log
      // and sometimes, there can be multiple logs.
      // There is no definite reason for it and is dependent
      // on how the OS handles file changes
      // We need to check for change events only.
      if (event.eventType === "change") {
        // We emit the change event and let the EventEmitter callback,
        // handle our logic
        commandFile.emit('change')
      }

    }
  } catch (error) {
    console.error(error);
  }
})();
