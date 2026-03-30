import { Buffer } from 'node:buffer'

const memoryContainer = Buffer.alloc(4)

memoryContainer[0] = 0xf4
memoryContainer[1] = 0x34
memoryContainer[2] = 0xb6
memoryContainer[3] = 0xff

// We have seen that can store positive number in a buffer
// but what is we store a negative number?

memoryContainer[0] = -32 // => <Buffer e0 34 b6 ff>
console.log(memoryContainer[0]) // => 224

// Why did we get a large number i.e 224 for -32
// Because 224 is nothing but the 2's complement of 34
