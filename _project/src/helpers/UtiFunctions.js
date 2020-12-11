const makeFixed2 = (number) => {
  if (!number || Number.isNaN(number)) return 0;
  return (Math.round(number * 100) / 100).toFixed(2);
};

export default {
  makeFixed2,
};
