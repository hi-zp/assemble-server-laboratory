import { ApiHideProperty } from '@nestjs/swagger';
import { Allow, IsBase64 } from 'class-validator';

import { PaginationType } from '../enums';
import { PaginationDto } from './pagination.dto';
import { validationI18nMessage } from '@assemble/common/i18n';
import {
  IsNumberField,
  IsStringField,
} from '@assemble/common/decorators/validator';

export class CursorPaginationDto extends PaginationDto {
  @ApiHideProperty()
  @Allow()
  type: PaginationType.CURSOR = PaginationType.CURSOR;

  /**
   * The cursor of the page you are requesting
   */
  @IsStringField({ required: false })
  @IsBase64({
    message: validationI18nMessage('validation.isDataType', {
      type: 'base64',
    }),
  })
  after?: string;

  /**
   * Results page you want to retrieve (0..N)
   */
  @IsNumberField({ required: false })
  first = 10;
}
