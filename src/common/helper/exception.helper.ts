import { logger } from '@config/logger';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ConflictException, HttpException, InternalServerErrorException } from '@exception';
import { PrismaCode } from '../constant/prisma-code';

export function exceptionHelper(err: unknown, logError?: boolean): [null, HttpException] {
  const isHttpException = err instanceof HttpException;
  if (logError && !isHttpException) logger.error(err);

  if (err instanceof PrismaClientKnownRequestError) {
    const exception = prismaException(err);
    if (exception) return [null, exception];
  }

  const exception = isHttpException ? err : new InternalServerErrorException();
  return [null, exception];
}

function prismaException(err: PrismaClientKnownRequestError) {
  if (err.code === PrismaCode.Unique_Constraint_Failed) {
    return new ConflictException();
  }
}
