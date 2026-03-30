import { Buffer } from "node:buffer";

// Allocate just the exact size of buffer required to store the data below to memory
// 0100 1000 0110 1001 0010 0001
// Once it is allocated, log it in utf-8 encoding

const binaryRep = ["0100", "1000", "0110", "1001", "0010", "0001"]; // 6 items each of 4 bits => Total = 24 bits ~ 3 bytes
// Since we allocate memory in terms of 8bits, we merge each pair into 1
// 0100 1000 => 0x48
// 0110 1001 => 0x69
// 0110 0001 => 0x21
const descimalRep = [0x48, 0x69, 0x21];

const allocatedBuffer = Buffer.alloc(3);

descimalRep.forEach((num, index) => {
  allocatedBuffer[index] = num;
});

console.log(allocatedBuffer.toString("utf-8")); // => Output : Hi!

// Alternate Approach
// Using the Buffer.from method, we don;t need to allocate memory maually,
// It will figure out the required memory automatically.
const altBuffer = Buffer.from(descimalRep);
console.log(altBuffer.toString("utf-8"));
