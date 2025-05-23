import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateAssistantDto {
  @IsNotEmpty()
  @IsString()
  assistantId: string;

  @IsOptional()
  @IsUUID()
  usuarioId?: string;
}
