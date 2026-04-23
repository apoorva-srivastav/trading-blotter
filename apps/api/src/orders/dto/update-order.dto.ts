import { IsOptional, IsNumber, IsString, IsEnum, Min } from 'class-validator';

export class UpdateOrderDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  doneQuantity?: number;

  @IsOptional()
  @IsEnum(['Pending', 'Partial', 'Filled', 'Cancelled', 'Rejected'])
  state?: 'Pending' | 'Partial' | 'Filled' | 'Cancelled' | 'Rejected';

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  averagePrice?: number;

  @IsOptional()
  @IsString()
  rejectReason?: string;
}
