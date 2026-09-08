/**
 * Strips empty-string values from a plain object before sending it as a JSON
 * payload. DRF rejects '' for non-text fields (FK/date/number) — it wants
 * either a real value or the key omitted entirely — so an unselected
 * dropdown or blank optional date must not be sent as ''.
 */
export function cleanPayload(values) {
  return Object.fromEntries(Object.entries(values).filter(([, value]) => value !== ''))
}
