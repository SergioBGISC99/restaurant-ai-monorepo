import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBranchDto } from './dto/create-branch.dto';

interface CreateBranchWithUserId extends CreateBranchDto {
  userId: string;
}

@Injectable()
export class BranchesService {
  constructor(private prisma: PrismaService) {}

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

  async assignAssistant(branchId: string, assistantId: string) {
    return this.prisma.branch.update({
      where: { id: branchId },
      data: { assistantId },
    });
  }
}
