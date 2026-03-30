export function toDateOnlyInSaoPaulo(value) {
  if (!value) return '';
  try {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Sao_Paulo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(new Date(value));
    const y = parts.find((p) => p.type === 'year')?.value;
    const m = parts.find((p) => p.type === 'month')?.value;
    const d = parts.find((p) => p.type === 'day')?.value;
    return y && m && d ? `${y}-${m}-${d}` : '';
  } catch {
    return '';
  }
}

export function toDatetimeLocalValue(isoLike) {
  if (!isoLike) return '';
  const date = new Date(isoLike);
  if (Number.isNaN(date.getTime())) return '';
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function fromDatetimeLocalToSaoPaulo(localValue) {
  if (!localValue) return null;
  return localValue + ':00-03:00';
}

export function formatDatetimeBR(isoValue) {
  if (!isoValue) return '–';
  try {
    return new Date(isoValue).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Sao_Paulo',
    });
  } catch {
    return '–';
  }
}

export function formatDateBR(isoValue) {
  if (!isoValue) return '–';
  try {
    return new Date(isoValue).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'America/Sao_Paulo',
    });
  } catch {
    return '–';
  }
}

export function formatTimeBR(isoValue) {
  if (!isoValue) return '–';
  try {
    return new Date(isoValue).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Sao_Paulo',
    });
  } catch {
    return '–';
  }
}

/**
 * Converts a Date object (picker value) to ISO string with -03:00 offset
 * for sending to the API. Uses local time as SP time.
 */
export function formatDateTimeForApi(date) {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) return null;
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:00-03:00`;
}
