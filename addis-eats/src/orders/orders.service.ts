import { DomainError } from '../common/errors/domain-error';

const ALLOWED_TRANSITIONS: Record<OrderStatus, readonly OrderStatus[]> = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['PREPARING', 'CANCELLED'],
  PREPARING: ['DELIVERED', 'CANCELLED'],
  DELIVERED: [],
  CANCELLED: [],
};

// inside the service class:
updateStatus(id: number, next: OrderStatus): Order {
  const order = this.findOne(id); // throws DomainError('NOT_FOUND') if missing

  const allowed = ALLOWED_TRANSITIONS[order.status];
  if (!allowed.includes(next)) {
    const options = allowed.length > 0 ? allowed.join(', ') : 'none (final status)';
    throw new DomainError(
      'INVALID_TRANSITION',
      `Order ${id} is ${order.status} and cannot move to ${next}. Allowed next statuses: ${options}.`,
    );
  }

  return this.repo.update(id, { status: next });
}