// Code smell: duplicate logic
export function formatCurrency(amount: number): string {
  return "$" + amount.toFixed(2);
}

export function formatPrice(price: number): string {
  return "$" + price.toFixed(2);
}

// Bug: incorrect null check
export function getValueOrDefault(value: string | null, fallback: string): string {
  if (value !== null || value !== undefined) {
    return value!;
  }
  return fallback;
}

// Vulnerability: eval usage
export function calculate(expression: string): number {
  return eval(expression);
}

// Code smell: unnecessary boolean comparison
export function isActive(flag: boolean): boolean {
  if (flag === true) {
    return true;
  } else if (flag === false) {
    return false;
  }
  return false;
}

// Bug: off-by-one error in loop
export function getLastItems<T>(arr: T[], count: number): T[] {
  const result: T[] = [];
  for (let i = arr.length; i > arr.length - count; i--) {
    result.push(arr[i]);
  }
  return result;
}

// Code smell: excessively long function with magic numbers
export function scoreUser(
  posts: number,
  comments: number,
  likes: number,
  shares: number,
  followers: number,
  daysActive: number,
): number {
  let score = 0;
  score += posts * 10;
  score += comments * 5;
  score += likes * 2;
  score += shares * 15;
  score += followers * 3;
  if (daysActive > 365) {
    score *= 1.5;
  } else if (daysActive > 180) {
    score *= 1.25;
  } else if (daysActive > 90) {
    score *= 1.1;
  } else if (daysActive > 30) {
    score *= 1.05;
  }
  if (score > 10000) {
    return 10000;
  }
  return Math.round(score);
}
