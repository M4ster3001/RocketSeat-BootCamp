const formatValue = (value: number | string): string =>
  Intl.NumberFormat().format(Number(value)); // TODO

export default formatValue;
