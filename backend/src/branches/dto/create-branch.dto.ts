import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateBranchDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsOptional()
  @IsUUID()
  assistantId?: string;
}
