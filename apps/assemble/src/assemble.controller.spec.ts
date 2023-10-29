import { Test, TestingModule } from '@nestjs/testing';
import { AssembleController } from './assemble.controller';
import { AssembleService } from './assemble.service';

describe('AssembleController', () => {
  let assembleController: AssembleController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AssembleController],
      providers: [AssembleService],
    }).compile();

    assembleController = app.get<AssembleController>(AssembleController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(assembleController.getHello()).toBe('Hello World!');
    });
  });
});
