export const getMdc = (a: number, b: number) => {
  const gcd = (a: number, b: number) => {
    return !b ? a : gcd(b, a % b);
  };

  const lcm = (a: number, b: number) => {
    return (a * b) / gcd(a, b);
  };

  let multiple = a;
  multiple = lcm(a, b);

  return multiple;
};
