import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { SignInDto } from './dto/sign-in.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-up')
  async signUp(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    const [token, err] = await this.authService.signUp(createUserDto);
    if (err) throw err;
    return token;
  }

  @Post('/sign-in')
  async signIn(@Body(new ValidationPipe()) signInDto: SignInDto) {
    const [token, err] = await this.authService.signIn(signInDto);
    if (err) throw err;
    return token;
  }

  @Post('/sign-out')
  async signOut(@Body(new ValidationPipe()) refreshTokenDto: RefreshTokenDto) {
    const err = await this.authService.signOut(refreshTokenDto);
    if (err) throw err;
  }

  @Post('/sign-out-everywhere')
  async signOutEverywhere(
    @Body(new ValidationPipe()) refreshTokenDto: RefreshTokenDto,
  ) {
    const err = await this.authService.signOutEverywhere(refreshTokenDto);
    if (err) throw err;
  }

  @Post('/refresh-token')
  async refreshToken(
    @Body(new ValidationPipe()) refreshTokenDto: RefreshTokenDto,
  ) {
    const [token, err] = await this.authService.refreshToken(refreshTokenDto);
    if (err) throw err;
    return token;
  }
}
