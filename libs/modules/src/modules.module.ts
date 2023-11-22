import { Module } from '@nestjs/common';
import { ModulesService } from './modules.service';
import { OptionsModule } from './options/options.module';

@Module({
  providers: [ModulesService],
  exports: [ModulesService],
  imports: [OptionsModule],
})
export class ModulesModule {}
