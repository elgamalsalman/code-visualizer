const deepCopy = (value, cache = new Map()) => {
  // Check for non-objects or null values
  if (value === null || typeof value !== "object") {
    return value;
  }

  // Handle circular references
  if (cache.has(value)) {
    return cache.get(value);
  }

  // Handle dates
  if (value instanceof Date) {
    return new Date(value);
  }

  // Handle arrays
  if (Array.isArray(value)) {
    const copy = [];
    cache.set(value, copy); // Cache the array to handle circular references
    value.forEach((item, index) => {
      copy[index] = deepCopy(item, cache);
    });
    return copy;
  }

  // Handle objects
  if (value instanceof Object) {
    const copy = {};
    cache.set(value, copy); // Cache the object to handle circular references
    Object.keys(value).forEach((key) => {
      copy[key] = deepCopy(value[key], cache);
    });
    return copy;
  }

  // For unsupported types (e.g., functions, undefined), return the value directly
  return value;
};

export { deepCopy };
