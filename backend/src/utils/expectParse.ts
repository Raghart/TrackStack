import { BadRequestException } from '@nestjs/common';

export const expectParseError = <Input>(
  parseFn: (input: Input) => unknown,
  data: Input,
  msg: string,
) => {
  expect(() => parseFn(data)).toThrow(BadRequestException);
  expect(() => parseFn(data)).toThrow(msg);
};

export const expectParse = <Data>(parseFn: (err: Data) => Data, data: Data) =>
  expect(parseFn(data)).toEqual(data);
