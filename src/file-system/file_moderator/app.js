import fs from "fs/promises";

(async () => {
  try {
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
        console.dir({ event }, { depth: Infinity });
      }
    }
  } catch (error) {
    console.error(error);
  }
})();
