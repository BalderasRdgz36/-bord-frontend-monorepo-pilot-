import countryRules from '@/data/country-rules.json';
import documentTypes from '@/data/document-types.json';
import phoneRules from '@/data/phone-rules.json';

export function getReferenceData() {
  return Promise.resolve({
    rules: countryRules,
    phones: phoneRules,
    docs: documentTypes,
  });
}
