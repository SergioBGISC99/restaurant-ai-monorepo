import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateAssistantDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  assistantId: string;

  @IsOptional()
  @IsUUID()
  usuarioId?: string;
}
