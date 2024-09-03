import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { UserSignupDto } from '../DTO/user-signup.dto';
import { UserLoginDto } from '../DTO/user-login.dto';
import { JwtAuthGuard } from '../guard/token_authentication.guard';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() userDetails: UserSignupDto): Promise<UserSignupDto> {
    const user = await this.authService.userSignupOrThrow(userDetails);

    return user;
  }

  @Post('login')
  async login(@Body() loginCreds: UserLoginDto): Promise<{ token: string }> {
    const token = await this.authService.successOrFailedLogin(loginCreds);

    return token;
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: Request): Promise<string> {
    const token: string = req.headers.authorization.replace('Bearer ', '');
    const isLoggedOut = await this.authService.successOrFailedLogout(token);
    if (isLoggedOut) {
      return 'Logged out successfully!';
    }
  }
}
