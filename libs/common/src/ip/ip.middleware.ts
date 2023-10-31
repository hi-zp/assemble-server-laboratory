import { Injectable, NestMiddleware } from '@nestjs/common';
import { getClientIp } from '@supercharge/request-ip';
import { FastifyRequest, FastifyReply } from 'fastify';

@Injectable()
export class IpMiddleware implements NestMiddleware {
  use(req: FastifyRequest['raw'], res: FastifyReply['raw'], next: () => void) {
    (req as any).realIp = getClientIp(req)!;
    next();
  }
}
