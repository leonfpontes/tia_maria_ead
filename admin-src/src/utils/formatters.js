export function formatPhoneDisplay(phone) {
  if (!phone) return '–';
  const digits = String(phone).replace(/\D/g, '');
  if (digits.length === 13 && digits.startsWith('55')) {
    return `+55 (${digits.slice(2, 4)}) ${digits.slice(4, 9)}-${digits.slice(9)}`;
  }
  if (digits.length === 12 && digits.startsWith('55')) {
    return `+55 (${digits.slice(2, 4)}) ${digits.slice(4, 9)}-${digits.slice(9)}`;
  }
  if (digits.length === 11) {
    return `+55 (${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `+55 (${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return phone;
}

export function normalizeDisplayText(value) {
  if (value === null || value === undefined) return '';
  const text = String(value);
  try {
    return decodeURIComponent(escape(text));
  } catch {
    return text;
  }
}

export function formatTipoCardLabel(tipoCard) {
  const labels = {
    EXU_POMBOGIRA: 'Exus e Pombogiras',
    PRETOS_VELHOS: 'Pretos Velhos',
    CABOCLOS_BOIADEIROS: 'Caboclos e Boiadeiros',
    MALANDROS: 'Malandros',
    NAO_HAVERA_GIRA: 'Não haverá Gira',
    GIRA_MISTA: 'Gira Mista',
  };
  return labels[tipoCard] || tipoCard || '–';
}

export function formatarTelefoneInput(raw) {
  const digits = raw.replace(/\D/g, '');
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}
