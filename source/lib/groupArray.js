function groupArray(array, selector) {
  const result = {};
  
  array.forEach((element) => {
    const key = selector(element);
    result[key] = result[key] || [];
    result[key].push(element);
  });

  return result;
};

export default groupArray;