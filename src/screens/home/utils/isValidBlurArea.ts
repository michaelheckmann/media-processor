export const isValidBlurArea = (area: string) => {
  const pattern = /^\d+:\d+:\d+:\d+$/;
  return pattern.test(area);
};
