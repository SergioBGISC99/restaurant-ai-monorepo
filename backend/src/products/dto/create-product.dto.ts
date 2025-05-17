import { IsNotEmpty, IsPositive, IsString, IsUUID, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsPositive()
  @Min(1)
  price: number;

  @IsUUID()
  branchId: string;
}
