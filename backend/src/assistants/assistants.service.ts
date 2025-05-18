import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAssistantDto } from './dto/create-assistant.dto';
import { Role } from '@prisma/client';

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

  async assingToUser(assistantId: string, userId: string) {
    const assistant = await this.prisma.assistant.findUnique({
      where: { id: assistantId },
    });

    if (!assistant) throw new NotFoundException('Asistente no encontrado');

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.role !== Role.CLIENTE) {
      throw new BadRequestException('Usuario inválido');
    }

    return this.prisma.assistant.update({
      where: { id: assistantId },
      data: { userId },
    });
  }
}
