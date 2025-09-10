
export const formatCash = (str: number, prefix = 'đ') => {
  const value = `${str}`;
  if (!value) {
    return '0';
  }
  return (
    value
      .split('')
      .reverse()
      .reduce((prev, next, index) => {
        return (index % 3 ? next : next + ',') + prev;
      }) + prefix
  );
};

interface data {
  regular_price?: number;
  sale_price?: number;
  price?: number;
  coupon?: any;
  free?: string;
}
export const getMoneyFormat = props => {
  const { regular_price, sale_price, price, coupon, free } = props as data;
  let monney = 0;
  if (sale_price !== undefined && sale_price !== null) {
    monney = sale_price;
  } else {
    monney = regular_price || 0;
  }

  if (monney === 0 && price && typeof price === 'number') {
    monney = price;
  }

  if (coupon) {
    if (coupon.type === 1) {
      monney = monney - coupon.discount_value;
    } else {
      monney = monney - coupon.discount_value * monney;
    }
  }

  if (!monney || monney === 0 || Number(monney) < 0) {
    return free ? free : 'free';
  }

  return formatCash(monney ?? 0);
};
