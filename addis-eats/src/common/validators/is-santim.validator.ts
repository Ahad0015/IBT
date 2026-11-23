import { registerDecorator, ValidationOptions } from 'class-validator';

export const MAX_SANTIM = 100_000_000; // 1,000,000 birr: a sanity ceiling

export function isSantim(value: unknown): boolean {
  return (
    typeof value === 'number' &&
    Number.isInteger(value) &&
    value >= 1 &&
    value <= MAX_SANTIM
  );
}

export function IsSantim(options?: ValidationOptions): PropertyDecorator {
  return (object: object, propertyName: string | symbol): void => {
    registerDecorator({
      name: 'isSantim',
      target: object.constructor,
      propertyName: propertyName as string,
      options: {
        message: ({ property }) =>
          `${property} must be a whole number of santim, at least 1 (100 santim = 1 birr), with no decimals`,
        ...options,
      },
      validator: {
        validate: (value: unknown): boolean => isSantim(value),
      },
    });
  };
}