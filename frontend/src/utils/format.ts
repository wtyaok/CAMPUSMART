export function money(value: number) {
  return `¥${Number(value || 0).toFixed(2)}`;
}

export function shortDate(value: string) {
  if (!value) return '-';
  return value.replace('T', ' ').slice(0, 16);
}

export function debounce<T extends (...args: any[]) => void>(fn: T, wait = 300) {
  let timer: number | undefined;
  return (...args: Parameters<T>) => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => fn(...args), wait);
  };
}

export function makeOrderNo() {
  return `CM${Date.now()}${Math.floor(Math.random() * 90 + 10)}`;
}
