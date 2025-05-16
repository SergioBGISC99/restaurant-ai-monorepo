import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AssistantsService } from './assistants.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CreateAssistantDto } from './dto/create-assistant.dto';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('assistants')
export class AssistantsController {
  constructor(private readonly assistantsService: AssistantsService) {}

  @Post()
  @Roles('ADMIN')
  create(@Body() dto: CreateAssistantDto) {
    return this.assistantsService.create(dto);
  }

  @Get()
  @Roles('ADMIN')
  findAll() {
    return this.assistantsService.findAll();
  }
}
