export type RuntimeMessage = { type: 'PING' }

export function isRuntimeMessage(value: unknown): value is RuntimeMessage {
  return Boolean(
    value &&
      typeof value === 'object' &&
      'type' in value &&
      (value as { type: unknown }).type === 'PING',
  )
}
