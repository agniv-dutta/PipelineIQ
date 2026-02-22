export const formatCurrency = (value: number, currency: string = '₹'): string => {
  return `${currency} ${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
};

export const formatNumber = (value: number): string => {
  if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M';
  if (value >= 1000) return (value / 1000).toFixed(1) + 'K';
  return value.toFixed(2);
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(2)}%`;
};

export const calculateRoas = (revenue: number, spend: number): number => {
  return spend > 0 ? revenue / spend : 0;
};

export const calculateCac = (spend: number, leads: number): number => {
  return leads > 0 ? spend / leads : 0;
};
