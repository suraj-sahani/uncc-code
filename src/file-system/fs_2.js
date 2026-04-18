// Node has three ways of handling files:
// 1. Promise API
// 2: Callback API
// 3. Synchronous API
// These three different methods dont differ in functionality
// but differ on how they do things under the hood
//
// When to use each?
// - Promises API - Defacto for hanlding files.
// - Callback API - Rare cases when we are doing somwthing 
// really computationalyy heavy, the Node.js documentation suggests the Callback API.
// - Synchronous API - Stay away from it. Only use it when we are sure we have to use it. Example use-case,
// We need to read a configuration file before out application starts or in otherwords, we we need 
// the data from that configuration to start our application.
//
// How do these have different performances?
// Promises and Callback API are faster because they don't block the main thread.
// Synchronous API blocks the main thread.


// Copying files in three different ways
import * as fsPromise from "fs/promises";

(async () => {
  try {
    await fsPromise.copyFile("text.txt", "copied-promise.txt")
  } catch (error) {
    console.error(error)
  }
})()


// Copying using the Callback API
import fs from "fs"
fs.copyFile('text.txt', "copied-callback.txt", (error) => {
  if (error) console.error(error)
})

// Copying using Synchronous API
fs.copyFileSync('text.txt', 'copied-sync.txt')



