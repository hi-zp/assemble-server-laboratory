import { Injectable } from '@nestjs/common';
import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';
import { BaseRepository, Options } from '@assemble/common';
import { InjectRepository } from '@mikro-orm/nestjs';

@Injectable()
export class OptionsService {
  constructor(
    @InjectRepository(Options)
    private readonly optionsRepository: BaseRepository<Options>,
  ) {}
  async create(_createOptionDto: CreateOptionDto) {
    const option = new Options();
    option.description = '1234';
    option.name = '111';
    await this.optionsRepository.persist(option).flush();
    return 'This action adds a new option';
  }

  findAll() {
    return this.optionsRepository.findAll();
  }

  findOne(id: number) {
    return `This action returns a #${id} option`;
  }

  update(id: number, updateOptionDto: UpdateOptionDto) {
    return `This action updates a #${id} option`;
  }

  remove(id: number) {
    return `This action removes a #${id} option`;
  }
}
