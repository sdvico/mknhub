export const decimalToDMS_String = (decimal: number, isLatitude: boolean) => {
  const degrees = Math.floor(Math.abs(decimal));
  const minutes = Math.floor((Math.abs(decimal) - degrees) * 60);
  const seconds = parseFloat(
    ((Math.abs(decimal) - degrees - minutes / 60) * 3600).toFixed(2),
  );

  let direction;
  if (isLatitude) {
    direction = decimal >= 0 ? 'N' : 'S';
  } else {
    direction = decimal >= 0 ? 'E' : 'W';
  }

  return `${degrees}° ${minutes}' ${seconds}" ${direction}`;
};

export const decimalToDMS_OBJ = (
  decimal: number,
): {degrees: number; minutes: number; seconds: number; isNegative: boolean} => {
  const isNegative = decimal < 0;
  const abs = Math.abs(decimal);
  const degrees = Math.floor(abs);
  const minutesFloat = (abs - degrees) * 60;
  const minutes = Math.floor(minutesFloat);
  const seconds = Math.round((minutesFloat - minutes) * 60);
  return {degrees, minutes, seconds, isNegative};
};

export const dmsToDecimal = (
  degrees: number,
  minutes: number,
  seconds: number,
  isNegative: boolean,
): number => {
  const decimal = degrees + minutes / 60 + seconds / 3600;
  return isNegative ? -decimal : decimal;
};
