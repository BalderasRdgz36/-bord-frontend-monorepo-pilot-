import type { DocumentOption, DocumentType } from '@/types/reference-data.types';

import { Country, SpecialDocumentType } from '@/constants/form.constants';
import { OTHER_PLACEHOLDER, PASSPORT_PLACEHOLDER } from '@/constants/placeholders';

// Deja únicamente los dígitos de un texto.
export const onlyDigits = (value: string) => (value || '').replace(/\D+/g, '');

// Normaliza el número local para WhatsApp. Hace ajustes específicos por país
// (Argentina agrega un 9, el resto usa los dígitos tal cual).
export function buildWhatsAppNumber(
  country: string,
  countryCode: number,
  localDigits: string,
): string {
  const digits = onlyDigits(localDigits);
  if (!digits) return '';
  if (country === Country.ARGENTINA) {
    // Quita los ceros iniciales y el prefijo móvil "15" posterior al código de
    // área, y agrega un 9 justo después del código de país.
    let normalized = digits.replace(/^0+/, '');
    normalized = normalized.replace(/^(\d{2,4})15/, '$1');
    return `${countryCode}9${normalized}`;
  }
  return `${countryCode}${digits.replace(/^0+/, '')}`;
}

export function whatsappLink(fullDigits: string): string {
  return `https://wa.me/${fullDigits}`;
}

// Limpia el documento según las particularidades de cada país.
export function cleanDocument(country: string, raw: string): string {
  const trimmed = (raw || '').trim();
  if (!trimmed) return '';
  if (country === Country.MEXICO) return trimmed.toUpperCase().replace(/\s+/g, '');
  if (country === Country.CHILE || country === Country.VENEZUELA)
    return trimmed.replace(/[.\s]/g, '').toUpperCase().replace(/-/g, '');
  // Por defecto: documentos numéricos → se elimina todo lo no alfanumérico.
  return trimmed.replace(/[^0-9A-Za-z]/g, '').toUpperCase();
}

export function isValidDocument(country: string, raw: string): boolean {
  const cleaned = cleanDocument(country, raw);
  if (!cleaned) return false;
  // Rangos mínimos de longitud aceptados por país.
  const lengths: Partial<Record<Country, [number, number]>> = {
    [Country.ARGENTINA]: [7, 9],
    [Country.BRASIL]: [11, 11],
    [Country.CHILE]: [8, 9],
    [Country.COLOMBIA]: [6, 12],
    [Country.MEXICO]: [13, 18],
    [Country.PERU]: [8, 8],
    [Country.URUGUAY]: [7, 9],
    [Country.BOLIVIA]: [5, 10],
    [Country.ECUADOR]: [10, 10],
    [Country.PARAGUAY]: [5, 10],
    [Country.VENEZUELA]: [7, 12],
    [Country.COSTA_RICA]: [9, 12],
    [Country.GUATEMALA]: [13, 13],
    [Country.HONDURAS]: [13, 13],
    [Country.EL_SALVADOR]: [9, 9],
    [Country.NICARAGUA]: [10, 14],
    [Country.PANAMA]: [5, 12],
    [Country.REPUBLICA_DOMINICANA]: [11, 11],
    [Country.CUBA]: [11, 11],
    [Country.HAITI]: [5, 20],
  };
  const [minLength, maxLength] = lengths[country as Country] ?? [5, 20];
  return cleaned.length >= minLength && cleaned.length <= maxLength;
}

// Arma el texto de dirección recomendado a partir de los campos del formulario.
export function buildAddressText(values: {
  country: string;
  street?: string;
  streetNumber?: string;
  apartment?: string;
  neighborhood?: string;
  city?: string;
  postalCode?: string;
}): string {
  const parts = [
    values.street,
    values.streetNumber,
    values.apartment,
    values.neighborhood,
    values.city,
    values.postalCode,
  ]
    .map((part) => (part || '').trim())
    .filter(Boolean);
  return [parts.join(', '), values.country].filter(Boolean).join(', ');
}

export function googleMapsLink(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

// Separadores internos de la clave de una opción de documento.
const DOCUMENT_KEY_SEPARATOR = '::';
const NO_COUNTRY_MARKER = '__';

// Construye la clave única de una opción de documento (país + nombre).
export function buildDocumentOptionKey(country: string, name: string): string {
  return `${country || NO_COUNTRY_MARKER}${DOCUMENT_KEY_SEPARATOR}${name}`;
}

// Arma las opciones del selector de documento: una por documento de país más
// los tipos independientes del país (pasaporte / otro).
export function buildDocumentOptions(allDocs: DocumentType[]): DocumentOption[] {
  const options: DocumentOption[] = allDocs.map((document) => ({
    key: buildDocumentOptionKey(document.country, document.document_name),
    label: `${document.document_name} — ${document.country}`,
    country: document.country,
    name: document.document_name,
    placeholder: document.placeholder,
  }));

  const specialPlaceholders: Record<SpecialDocumentType, string> = {
    [SpecialDocumentType.PASSPORT]: PASSPORT_PLACEHOLDER,
    [SpecialDocumentType.OTHER]: OTHER_PLACEHOLDER,
  };

  for (const special of [SpecialDocumentType.PASSPORT, SpecialDocumentType.OTHER]) {
    options.push({
      key: buildDocumentOptionKey('', special),
      label: special,
      country: '',
      name: special,
      placeholder: specialPlaceholders[special],
    });
  }

  return options;
}
