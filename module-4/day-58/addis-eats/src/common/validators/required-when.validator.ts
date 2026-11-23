import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function RequiredWhen(
  otherField: string,
  otherValue: unknown,
  options?: ValidationOptions,
): PropertyDecorator {
  return (object: object, propertyName: string | symbol): void => {
    registerDecorator({
      name: 'requiredWhen',
      target: object.constructor,
      propertyName: propertyName as string,
      constraints: [otherField, otherValue],
      options: {
        message: (args: ValidationArguments) => {
          const [field, value] = args.constraints as [string, unknown];
          return `${args.property} is required when ${field} is ${String(value)}`;
        },
        ...options,
      },
      validator: {
        validate(value: unknown, args: ValidationArguments): boolean {
          const [field, expected] = args.constraints as [string, unknown];
          const other = (args.object as Record<string, unknown>)[field];
          if (other !== expected) return true; // rule does not apply
          return value !== undefined && value !== null && value !== '';
        },
      },
    });
  };
}