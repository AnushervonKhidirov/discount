import { HttpException } from '@nestjs/common';

export type ReturnWithErr<T> = [T, null] | [null, HttpException];
export type ReturnPromiseWithErr<T> = Promise<ReturnWithErr<T>>;
