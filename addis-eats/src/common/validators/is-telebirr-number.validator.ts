import { registerDecorator, ValidationOptions } from 'class-validator';

// Accepts 09XXXXXXXX, 2519XXXXXXXX and +2519XXXXXXXX (9 digits after the 9)
const TELEBIRR_REGEX = /^(?:\+251|251|0)9\d{8}$/;

export function isTeleBirrNumber(value: unknown): boolean {
  return typeof value === 'string' && TELEBIRR_REGEX.test(value);
}

export function IsTeleBirrNumber(options?: ValidationOptions): PropertyDecorator {
  return (object: object, propertyName: string | symbol): void => {
    registerDecorator({
      name: 'isTeleBirrNumber',
      target: object.constructor,
      propertyName: propertyName as string,
      options: {
        message: ({ property }) =>
          `${property} must be an Ethiopian mobile number like 0911234567 or +251911234567`,
        ...options,
      },
      validator: {
        validate: (value: unknown): boolean => isTeleBirrNumber(value),
      },
    });
  };
}