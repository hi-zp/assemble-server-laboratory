import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';
import {
  BaseRepository,
  CursorPaginationDto,
  CursorType,
  PaginationResponse,
  QueryOrder,
  itemDoesNotExistKey,
  translate,
} from '@assemble/common';
import { Options } from '@assemble/common/entities';
import { InjectRepository } from '@mikro-orm/nestjs';
import { AutoPath } from '@mikro-orm/core/typings';

@Injectable()
export class OptionsService {
  private readonly queryName = 'options';

  constructor(
    @InjectRepository(Options)
    private readonly optionsRepository: BaseRepository<Options>,
  ) {}
  /**
   * It returns an promise of a pagination object, which is created from the results of a query to the
   * database
   * offset.
   * @param dto - this is the DTO that we created earlier.
   * @returns An promise of a pagination object.
   */
  async findAll(
    dto: CursorPaginationDto,
  ): Promise<PaginationResponse<Options>> {
    const qb = this.optionsRepository.createQueryBuilder(this.queryName);

    return this.optionsRepository.qbCursorPagination({
      qb,
      pageOptionsDto: {
        alias: this.queryName,
        cursor: 'name',
        cursorType: CursorType.STRING,
        order: QueryOrder.ASC,
        searchField: 'name',
        ...dto,
        // TODO: add fields
        fields: ['name', 'value', 'description'],
      },
    });
  }

  /**
   * It returns an option object from the database
   * @param name - string - The name of the option you want to find
   * @param populate - AutoPath<Option, keyof Option>[]
   * @returns An option object
   */
  async findOne(
    name: string,
    populate: AutoPath<Options, keyof Options>[] = [],
  ): Promise<Options> {
    const option = await this.optionsRepository.findOne(
      {
        name,
      },
      { populate },
    );

    if (!option) {
      throw new NotFoundException(
        translate(itemDoesNotExistKey, { args: { item: 'option' } }),
      );
    }

    return option;
  }

  /**
   * It returns an option object from the database
   * @param index - string
   * @returns An option object
   */
  async getById(index: string): Promise<Options> {
    const option = await this.optionsRepository.findOne({ idx: index });
    if (!option) {
      throw new NotFoundException(
        translate(itemDoesNotExistKey, { args: { item: 'option' } }),
      );
    }
    return option;
  }

  /**
   * It creates a new option, saves it to the database, and returns it
   * @param dto - CreateOptionDto - this is the DTO that we created earlier.
   * @returns The option object
   */
  async create(dto: CreateOptionDto) {
    const option = this.optionsRepository.create(dto);
    await this.optionsRepository.persistAndFlush(option);
    return option;
  }

  /**
   * It updates an option in the database
   * @param name - The name of the option you want to update
   * @param dto - UpdateOptionDto
   * @returns The option object
   */
  async update(name: string, dto: UpdateOptionDto): Promise<Options> {
    const option = await this.findOne(name);
    this.optionsRepository.assign(option, dto);
    await this.optionsRepository.flush();
    return option;
  }

  /**
   * It updates an option in the database
   * @param index - string
   * @param dto - UpdateOptionDto
   * @returns The option object
   */
  async updateById(index: string, dto: UpdateOptionDto): Promise<Options> {
    const option = await this.optionsRepository.findOne({ idx: index });
    if (!option) {
      throw new NotFoundException(
        translate(itemDoesNotExistKey, { args: { item: 'option' } }),
      );
    }
    this.optionsRepository.assign(option, dto);
    await this.optionsRepository.flush();
    return option;
  }

  /**
   * It deletes an option from the database
   * @param name - The name of the option you want to delete
   * @returns The option object
   */
  async remove(name: string): Promise<Options> {
    const option = await this.findOne(name);
    if (!option) {
      throw new NotFoundException(
        translate(itemDoesNotExistKey, { args: { item: 'option' } }),
      );
    }
    return this.optionsRepository.softRemoveAndFlush(option);
  }

  /**
   * It deletes an option from the database
   * @param index - string
   * @returns The option object
   */
  async removeById(index: string): Promise<Options> {
    const option = await this.optionsRepository.findOne({ idx: index });
    if (!option) {
      throw new NotFoundException(
        translate(itemDoesNotExistKey, { args: { item: 'option' } }),
      );
    }
    return this.optionsRepository.softRemoveAndFlush(option);
  }
}
