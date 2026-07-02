// Valores de dominio del formulario. Centralizados para evitar strings mágicos
// dispersos por componentes, hooks, validaciones y data.

/** Pasos del formulario, en orden. */
export enum FormStep {
  PERSONAL_INFO = 0,
  ADDRESS = 1,
  DELIVERY_PREFERENCES = 2,
  REVIEW = 3,
}

/** Cantidad total de pasos del formulario. */
export const TOTAL_STEPS = Object.keys(FormStep).length / 2;

/** Estado del formulario de verificación (espejo del backend). */
export enum FormStatus {
  SENT = 'SENT',
  OPEN = 'OPEN',
  COMPLETED = 'COMPLETED',
  EXPIRED = 'EXPIRED',
}

/**
 * Preferencia horaria de entrega. Usa directamente los valores que espera el
 * backend, así no se necesita una segunda representación ni un mapeo.
 */
export enum DeliveryTimePreference {
  AM = 'AM',
  PM = 'PM',
  NONE = 'NONE',
}

/** Opción elegida por el usuario respecto a la dirección en Google Maps. */
export enum GoogleMapsChoice {
  NONE = '',
  MATCH = 'match',
  MISMATCH = 'mismatch',
}

/** Tipos de documento que no dependen del país de residencia. */
export enum SpecialDocumentType {
  PASSPORT = 'Pasaporte',
  OTHER = 'Otro',
}

/** Países soportados. El valor coincide con el nombre usado en la data y la API. */
export enum Country {
  ARGENTINA = 'Argentina',
  BOLIVIA = 'Bolivia',
  BRASIL = 'Brasil',
  CHILE = 'Chile',
  COLOMBIA = 'Colombia',
  COSTA_RICA = 'Costa Rica',
  CUBA = 'Cuba',
  ECUADOR = 'Ecuador',
  EL_SALVADOR = 'El Salvador',
  GUATEMALA = 'Guatemala',
  HAITI = 'Haití',
  HONDURAS = 'Honduras',
  MEXICO = 'México',
  NICARAGUA = 'Nicaragua',
  PANAMA = 'Panamá',
  PARAGUAY = 'Paraguay',
  PERU = 'Perú',
  REPUBLICA_DOMINICANA = 'República Dominicana',
  URUGUAY = 'Uruguay',
  VENEZUELA = 'Venezuela',
}

/** Valor sentinel del item deshabilitado "no hay datos" en los selects. */
export const EMPTY_OPTION_VALUE = '__empty';

/**
 * Países donde el documento es obligatorio. El producto solo lo exige aquí; se
 * mantiene como lista explícita y extensible.
 */
export const COUNTRIES_REQUIRING_DOCUMENT: ReadonlySet<string> = new Set<string>([Country.BRASIL]);

/** Indica si un país de residencia obliga a capturar el documento. */
export const isDocumentRequired = (country: string): boolean =>
  COUNTRIES_REQUIRING_DOCUMENT.has(country);
