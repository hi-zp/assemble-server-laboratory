import {
  EntityProperty,
  Platform,
  TransformContext,
  Type,
} from '@mikro-orm/core';

export class MixedType extends Type {
  convertToDatabaseValue(
    value: object | number | string | null,
    platform: Platform,
    context?: TransformContext,
  ): string {
    return JSON.stringify({ value });
  }

  convertToJSValue(value: string, platform: Platform): string {
    return JSON.parse(value).value;
  }

  getColumnType(prop: EntityProperty<any, any>, platform: Platform): string {
    return 'text';
  }
}
