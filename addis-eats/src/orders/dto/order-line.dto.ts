import { IsInt, Min, Max } from 'class-validator';

export class OrderLineDto {
  @IsInt({ message: 'dishId must be a whole number' })
  @Min(1, { message: 'dishId must be 1 or more' })
  dishId!: number;

  @IsInt({ message: 'quantity must be a whole number' })
  @Min(1, { message: 'quantity must be at least 1' })
  @Max(50, { message: 'quantity must be 50 or less per line' })
  quantity!: number;
}