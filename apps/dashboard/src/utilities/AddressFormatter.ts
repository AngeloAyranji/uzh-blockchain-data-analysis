export const formatAddress = (address: string) => {
  return `${address.slice(0, 12)}...${address.slice(-5)}`;
};
