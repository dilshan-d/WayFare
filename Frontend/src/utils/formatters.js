export const CURRENCY_RATES = {
  USD: { symbol: '$', rate: 1.0, label: 'USD ($)' },
  EUR: { symbol: '€', rate: 0.92, label: 'EUR (€)' },
  GBP: { symbol: '£', rate: 0.79, label: 'GBP (£)' },
  LKR: { symbol: 'Rs', rate: 300.0, label: 'LKR (Rs)' },
};

export const formatCurrency = (amountInUSD, currencyCode = 'USD') => {
  if (amountInUSD === undefined || amountInUSD === null || isNaN(amountInUSD)) {
    return '$0';
  }

  const currencyObj = CURRENCY_RATES[currencyCode] || CURRENCY_RATES.USD;
  const convertedAmount = amountInUSD * currencyObj.rate;

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode === 'LKR' ? 'LKR' : currencyCode,
    maximumFractionDigits: currencyCode === 'LKR' ? 0 : 0,
  }).format(convertedAmount);
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

export const calculateNights = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 1;
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays || 1;
};
