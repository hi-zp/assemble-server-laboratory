import { Injectable } from '@nestjs/common';

@Injectable()
export class AssembleService {
  getHello(): string {
    return 'Hello World!';
  }
}
