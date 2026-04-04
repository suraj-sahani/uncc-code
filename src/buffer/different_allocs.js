import { Buffer } from "node:buffer";

// Default method of allocating memory
const buffer = Buffer.alloc(1000, 0)

// Alternative
// This is faster but an unsafe method as the name suggest
// Becuase, allocUnsafe does not fill the memory with zero's,
// It will just allocate the memory without clearing out any data that,
// was previously assigned to this memory that may or mat ot be in use,
// As a result of which, this allocated memeory might have some critical/sensitive
// information stored from previous sessions
const unsafeBuffer = Buffer.allocUnsafe(10000)

// See if this is unsafe,
// We can log the data 
for (let i = 0; i < unsafeBuffer.length; i++) {
  // The data is returned as binary, thus we check
  // if its not zero
  if (unsafeBuffer[i] !== 0) {
    console.log(`Index ${i}, Value: ${unsafeBuffer[i].toString(2)}`)
  }
}

// Other ways of allocating buffers are:
// Buffer.From()
// Buffer.concat()
// Note that these two methods also use Buffer.allocUnsafe behind the scenes,
// but these buffers are filled/overwritten with 0's or the data that is being
// passed to them as soon as they are allocated
// Making these safe to use

// Another way to allocate buffer is 
// The key difference is that this method will not use any memory
// that was previously allocated
const bufferAlloc = Buffer.allocUnsafeSlow(1000)


// Also a key not is that if we create a buffer using 
// Buffer.allocUnsafe and we allocate a memory of <= Buffer.poolSize,
// It create a really fast Buffer that can be retrieved and used in case 
// we allocate another buffer of the same size
// This size of buffer is used by nodejs internally

