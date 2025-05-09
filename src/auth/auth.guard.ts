import type { Observable } from 'rxjs';

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { TokenService } from 'src/token/token.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authorization: string | undefined = request.headers['authorization'];

    if (!authorization) throw new UnauthorizedException();

    const token = authorization.split(' ')[1];
    const [userPayload, err] = this.tokenService.verifyAccessToken(token);
    if (err) throw new UnauthorizedException();

    request['user'] = userPayload;

    return true;
  }
}
