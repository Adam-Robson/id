import { FIELD_LABELS } from '@/lib/constants/field-labels';
/**
 * Provides a human-readable description of the given fields.
 * @param fields
 * @returns
 */
export const describe = (fields: readonly string[]) => {
  return fields
    .map((field) => (FIELD_LABELS[field] ?? field.replace(/_/g, ' ')).toLowerCase())
    .join(', ');
};
