export const isValidPercentageUnit = (value: string | number): boolean => {
  const valueString = `${value}`;
  return (
    valueString.lastIndexOf('%') === valueString.length - 1 &&
    !isNaN(parseInt(valueString, 10))
  );
};
