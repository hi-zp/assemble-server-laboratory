import { Controller, Get } from '@nestjs/common';
import { AssembleService } from './assemble.service';

@Controller('')
export class AssembleController {
  constructor(private readonly assembleService: AssembleService) {}

  @Get()
  getHello(): string {
    return this.assembleService.getHello();
  }
}
