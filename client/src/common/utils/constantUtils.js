const enumerate = (values) => {
  const obj = [...values];

  for (const value of values) {
    const key = value.toLowerCase().replace(/\s+/g, "_");
    obj[key] = value;
  }

  return Object.freeze(obj);
};

export { enumerate };
