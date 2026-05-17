export function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function labelCase(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
