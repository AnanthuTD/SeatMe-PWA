function createRange(length, initializer) {
  return [...new Array(length)].map((_, index) => initializer(index));
}

export {createRange}