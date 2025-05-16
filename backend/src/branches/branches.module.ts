import { Module } from '@nestjs/common';
import { BranchesService } from './branches.service';
import { BranchesController } from './branches.controller';
import { QrService } from 'src/qr/qr.service';

@Module({
  controllers: [BranchesController],
  providers: [BranchesService, QrService],
})
export class BranchesModule {}
