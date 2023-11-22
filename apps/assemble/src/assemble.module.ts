import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AssembleController } from './assemble.controller';
import { AssembleService } from './assemble.service';
import { CommonModule, IpMiddleware } from '@assemble/common';
import { SWAGGER_API_ENDPOINT } from '@assemble/constant';
import { ModulesModule } from '@assemble/modules';

const stripeWebhookPath = 'stripe/webhook';
const excludedPaths = [stripeWebhookPath, SWAGGER_API_ENDPOINT];

@Module({
  imports: [CommonModule, ModulesModule],
  controllers: [AssembleController],
  providers: [AssembleService],
})
export class AssembleModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(IpMiddleware)
      .exclude(
        ...excludedPaths.map((path) => ({
          path,
          method: RequestMethod.ALL,
        })),
      )
      .forRoutes(
        {
          path: '*',
          method: RequestMethod.ALL,
        },
        {
          path: '/',
          method: RequestMethod.ALL,
        },
      );
  }
}
