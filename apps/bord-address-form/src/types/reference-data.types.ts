// Tipos del catálogo de referencia (reglas por país, teléfonos, documentos y
// divisiones territoriales). Solo incluyen los campos que el formulario
// realmente consume. Solo tipos: la lógica vive en lib/form-helpers.ts.

export interface PhoneRule {
  country: string;
  country_code: number;
  digits: number;
  local_format_example: string;
}

export interface DocumentType {
  country: string;
  document_name: string;
  placeholder: string;
}

export interface CountryRule {
  country: string;
  street_label: string;
  number_label: string;
  neighborhood_label: string;
  apartment_label: string;
}

/** Opción de documento lista para renderizar en el selector. */
export interface DocumentOption {
  key: string;
  label: string;
  country: string;
  name: string;
  placeholder: string;
}
