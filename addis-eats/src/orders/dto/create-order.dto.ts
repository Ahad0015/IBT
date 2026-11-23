import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsString,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { OrderLineDto } from './order-line.dto';

export class CreateOrderDto {
  @IsString()
  @MinLength(2, { message: 'customer must be at least 2 characters' })
  customer!: string;

  @IsString()
  @MinLength(2, { message: 'area must be at least 2 characters' })
  area!: string;

  @IsInt({ message: 'restaurantId must be a whole number' })
  @Min(1, { message: 'restaurantId must be 1 or more' })
  restaurantId!: number;

  @IsArray({ message: 'lines must be a list of order lines' })
  @ArrayNotEmpty({ message: 'lines must contain at least one order line' })
  @ArrayMaxSize(30, { message: 'lines can contain at most 30 order lines' })
  @ValidateNested({ each: true })
  @Type(() => OrderLineDto)
  lines!: OrderLineDto[];

  // telebirrPhone and paymentMethod are added in Step 3
}import { IsIn, IsOptional, ValidateIf } from 'class-validator';
import { IsTeleBirrNumber } from '../../common/validators/is-telebirr-number.validator';
import { RequiredWhen } from '../../common/validators/required-when.validator';

export const PAYMENT_METHODS = ['CASH', 'TELEBIRR'] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

// inside the class:
  @IsOptional()
  @IsIn(PAYMENT_METHODS, { message: 'paymentMethod must be CASH or TELEBIRR' })
  paymentMethod: PaymentMethod = 'CASH';

  @RequiredWhen('paymentMethod', 'TELEBIRR')
  @ValidateIf((o: CreateOrderDto) => o.paymentMethod === 'TELEBIRR' || o.telebirrPhone !== undefined)
  @IsTeleBirrNumber()
  telebirrPhone?: string;
