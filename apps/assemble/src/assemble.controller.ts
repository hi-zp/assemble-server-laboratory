import { Controller, Get, Logger } from '@nestjs/common';
import { AssembleService } from './assemble.service';

@Controller()
export class AssembleController {
  private readonly logger = new Logger(AssembleController.name);

  constructor(private readonly assembleService: AssembleService) {}

  @Get()
  getHello(): string {
    this.logger.error('1234');
    return this.assembleService.getHello();
  }

  @Get('/helthcheck')
  helthcheck(): string {
    this.logger.verbose({ foo: 'bar' }, 'baz %s', 'qux');
    this.logger.warn('foo %s %o', 'bar', { baz: 'qux' });
    this.logger.log('foo');
    this.logger.error('error');
    return 'helthcheck log';
  }
}
