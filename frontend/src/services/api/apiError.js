/**
 * Backend's friendly_exception_handler (apps/core/exceptions.py) always
 * responds with { detail, errors }. `errors` holds field-level messages for
 * forms; `detail` is the human-readable summary for a toast.
 */
export function getErrorDetail(error, fallback = 'Something went wrong. Please try again.') {
  return error?.response?.data?.detail || fallback
}

export function getFieldErrors(error) {
  const errors = error?.response?.data?.errors
  if (!errors || typeof errors !== 'object') return {}
  return Object.fromEntries(
    Object.entries(errors).map(([field, messages]) => [field, Array.isArray(messages) ? messages[0] : messages])
  )
}
