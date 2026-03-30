import { Buffer } from "node:buffer";

const memoryContainer = Buffer.alloc(4);

memoryContainer[0] = 0xf4;
memoryContainer[1] = 0x34;
memoryContainer[2] = 0xb6;
memoryContainer[3] = 0xff;

// We have seen that can store positive number in a buffer
// but what is we store a negative number?

memoryContainer[0] = -32; // => <Buffer e0 34 b6 ff>
console.log(memoryContainer[0]); // => 224
// Why did we get a large number i.e 224 for -32
// Because 224 is nothing but the 2's complement of 34
// Non-traditional way to store negative number in Buffers.

// If we want to store negative integers, we use the writeInt8 method
// It takes two arguments, 1 : negative interger, 2 : offset/postion in the buffer,
// where we want to store this number
memoryContainer.writeInt8(-34, 2);
// We also use the method readInt8 to get the exact negative value instead of the 2's complement value
console.log(memoryContainer.readInt8(2)); // => -34

// To get all the values in the buffer logged,
// we can use the toString() method
console.log(memoryContainer.toString("hex"));

// Reference from challenge-1,
// We can create buffers from Buffer.from method.
// With a modification.
// This is the traditional appraoch for using Buffer.from
// const altBuffer = Buffer.from([0x48, 0x69, 0x21])
// Alternative
const altBuffer = Buffer.from("486921", "hex"); // We pass the values as a string and the type of data that we passing
// i.e hex
console.log(altBuffer); // Same output => <Buffer 48 69 21>
console.log(altBuffer.toString("utf-8")); // We get the same output : "Hi!
