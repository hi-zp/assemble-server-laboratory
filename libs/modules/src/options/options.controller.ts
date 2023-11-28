import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { OptionsService } from './options.service';
import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';
import {
  ApiPaginatedResponse,
  CursorPaginationDto,
  Options,
  PaginationResponse,
} from '@assemble/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('options')
@ApiTags('options')
export class OptionsController {
  constructor(private readonly optionsService: OptionsService) {}

  @Post()
  create(@Body() dto: CreateOptionDto) {
    return this.optionsService.create(dto);
  }

  @Get()
  @ApiPaginatedResponse(Options)
  findAll(
    @Query() dto: CursorPaginationDto,
  ): Promise<PaginationResponse<Options>> {
    return this.optionsService.findAll(dto);
  }

  @Get(':idx')
  getById(@Param('idx') idx: string) {
    return this.optionsService.getById(idx);
  }

  @Patch(':idx')
  update(@Param('idx') idx: string, @Body() dto: UpdateOptionDto) {
    return this.optionsService.updateById(idx, dto);
  }

  @Delete(':idx')
  remove(@Param('idx') idx: string) {
    return this.optionsService.removeById(idx);
  }
}
