import fs from "fs/promises";

(async () => {
  try {
    const commandFile = await fs.open("./command.txt", "r")
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
        const content = await commandFile.read(Buffer.alloc(fileSize))
        console.dir({ content }, { depth: Infinity })

      }

    }
  } catch (error) {
    console.error(error);
  }
})();
