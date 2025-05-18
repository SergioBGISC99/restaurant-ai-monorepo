import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BranchesService } from './branches.service';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CreateBranchDto } from './dto/create-branch.dto';
import { Role } from '@prisma/client';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('branches')
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  @Post()
  @Roles(Role.CLIENTE)
  create(@Body() dto: CreateBranchDto, @Req() req: any) {
    const userId = req.user.sub;
    return this.branchesService.create({ ...dto, userId });
  }

  @Get()
  @Roles(Role.ADMIN, Role.CLIENTE)
  findAll() {
    return this.branchesService.findAll();
  }

  @Put(':id/assistant')
  @Roles(Role.CLIENTE)
  assignAssistant(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('assistantId', ParseUUIDPipe) assistantId: string,
  ) {
    return this.branchesService.assignAssistant(id, assistantId);
  }

  @Get('mine')
  @Roles(Role.CLIENTE)
  getMyBranches(@Req() req: any) {
    const userId = req.user.sub;
    return this.branchesService.findByUser(userId);
  }

  @Get(':id/qr')
  @Roles(Role.CLIENTE)
  generateQr(@Param('id', ParseUUIDPipe) id: string, @Req() req: any) {
    const userId = req.user.sub;
    return this.branchesService.generateQr(id, userId);
  }
  
  @Get(':id/web-qr')
  @Roles(Role.CLIENTE)
  generateWebQr(@Param('id', ParseUUIDPipe) id: string, @Req() req: any) {
    const userId = req.user.sub;
    return this.branchesService.generateQr(id, userId);
  }
}
