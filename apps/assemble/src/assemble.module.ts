import { Module } from '@nestjs/common';
import { AssembleController } from './assemble.controller';
import { AssembleService } from './assemble.service';
import { NestConfigModule } from '@assemble/config';

@Module({
  imports: [NestConfigModule],
  controllers: [AssembleController],
  providers: [AssembleService],
})
export class AssembleModule {}
