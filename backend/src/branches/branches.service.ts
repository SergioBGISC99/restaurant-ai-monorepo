import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { QrService } from 'src/qr/qr.service';
import { ConfigService } from '@nestjs/config';

interface CreateBranchWithUserId extends CreateBranchDto {
  userId: string;
}

@Injectable()
export class BranchesService {
  constructor(
    private prisma: PrismaService,
    private qrService: QrService,
    private config: ConfigService,
  ) {}

  create(dto: CreateBranchWithUserId) {
    return this.prisma.branch.create({
      data: {
        name: dto.name,
        address: dto.address,
        userId: dto.userId,
        assistantId: dto.assistantId,
      },
    });
  }

  findAll() {
    return this.prisma.branch.findMany({
      include: {
        assistant: true,
        user: true,
      },
    });
  }

  findByUser(userId: string) {
    return this.prisma.branch.findMany({
      where: { userId },
      include: {
        assistant: true,
      },
    });
  }

  async generateQr(branchId: string, userId: string) {
    const branch = await this.prisma.branch.findUnique({
      where: { id: branchId },
    });

    if (!branch || branch.userId !== userId) {
      throw new ForbiddenException('No autorizado para esta sucursal');
    }

    const url = 'https://wa.me/526442194553';
    const fileName = `qr-${branchId}`;

    const qrPath = await this.qrService.generateQrWithLogo(url, fileName);
    return { qr: qrPath };
  }

  async generateWebQr(branchId: string, userId: string) {
    const branch = await this.prisma.branch.findUnique({
      where: { id: branchId },
    });

    if (!branch || branch.userId !== userId) {
      throw new ForbiddenException('No autorizado para esta sucursal');
    }

    const url = `${this.config.get('WEB_CHAT_URL')}/${branchId}`;
    const fileName = `qr-web-${branchId}`;

    const qrPath = await this.qrService.generateQrWithLogo(url, fileName);
    return { qr: qrPath };
  }

  async assignAssistant(branchId: string, assistantId: string) {
    return this.prisma.branch.update({
      where: { id: branchId },
      data: { assistantId },
    });
  }
}
