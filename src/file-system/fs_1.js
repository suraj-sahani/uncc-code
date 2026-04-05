import fs from "fs"

// When we try to read a file, like the way below,
// we will get a buffer as all files are stores as 0's and 1's
// in the file system
const content = fs.readFileSync("./text.txt")

// This logs a buffer with hex values
console.log(content)

// To get a readable version of the file contents,
// we need to convert it to utf-8
console.log(content.toString('utf-8'))
