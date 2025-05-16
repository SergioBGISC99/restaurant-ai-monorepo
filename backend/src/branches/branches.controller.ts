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

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('branches')
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  @Post()
  @Roles('CLIENTE')
  create(@Body() dto: CreateBranchDto, @Req() req: any) {
    const userId = req.user.sub;
    return this.branchesService.create({...dto, userId});
  }

  @Get()
  @Roles('ADMIN', 'CLIENTE')
  findAll() {
    return this.branchesService.findAll();
  }

  @Put(':id/assistant')
  @Roles('CLIENTE')
  assignAssistant(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('assistantId', ParseUUIDPipe) assistantId: string,
  ) {
    return this.branchesService.assignAssistant(id, assistantId);
  }

  @Get('mine')
  @Roles('CLIENTE')
  getMyBranches(@Req() req: any) {
    const userId = req.user.sub;
    return this.branchesService.findByUser(userId);
  }
}
