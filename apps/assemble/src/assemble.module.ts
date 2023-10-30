import { Module } from '@nestjs/common';
import { AssembleController } from './assemble.controller';
import { AssembleService } from './assemble.service';
import { NestConfigModule } from '@assemble/config';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { HelperService } from '@assemble/common';

@Module({
  imports: [
    NestConfigModule,
    DevtoolsModule.register({
      http: HelperService.isDev(),
    }),
  ],
  controllers: [AssembleController],
  providers: [AssembleService],
})
export class AssembleModule {}
