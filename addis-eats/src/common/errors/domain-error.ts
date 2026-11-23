export type DomainErrorCode =
  | 'NOT_FOUND'
  | 'INVALID_TRANSITION'
  | 'RESTAURANT_CLOSED'
  | 'DISH_NOT_IN_RESTAURANT'
  | 'BELOW_MINIMUM_ORDER';

export class DomainError extends Error {
  constructor(
    readonly code: DomainErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'DomainError';
  }
}

// Record keyed on the code: if you add a code and forget the status,
// TypeScript stops you at compile time.
export const STATUS_BY_CODE: Record<DomainErrorCode, number> = {
  NOT_FOUND: 404,
  INVALID_TRANSITION: 409,
  RESTAURANT_CLOSED: 409,
  DISH_NOT_IN_RESTAURANT: 422,
  BELOW_MINIMUM_ORDER: 422,
};