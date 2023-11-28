import { IsStringField } from '@assemble/common';

export class CreateOptionDto {
  @IsStringField()
  name!: string;

  @IsStringField({ required: false })
  value?: string;

  @IsStringField()
  description!: string;
}
