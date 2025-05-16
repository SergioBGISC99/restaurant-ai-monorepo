import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAssistantDto } from './dto/create-assistant.dto';

@Injectable()
export class AssistantsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateAssistantDto) {
    const assitantExist = await this.prisma.assistant.findUnique({
      where: { assistantId: dto.assistantId },
    });

    if (assitantExist)
      throw new UnauthorizedException('Asistente ya registrado');

    return this.prisma.assistant.create({
      data: {
        assistantId: dto.assistantId,
        userId: dto.usuarioId,
      },
    });
  }

  async findAll() {
    return this.prisma.assistant.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }
}
