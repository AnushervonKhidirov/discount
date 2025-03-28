import { logger } from '@config/logger';
import { HttpException, InternalServerErrorException } from '@exception';

export function exceptionHelper(err: unknown, logError?: boolean): [null, HttpException] {
  const isHttpException = err instanceof HttpException;
  if (logError && !isHttpException) logger.error(err);
  const exception = isHttpException ? err : new InternalServerErrorException();
  return [null, exception];
}
