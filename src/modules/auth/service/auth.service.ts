import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserSignupDto } from '../DTO/user-signup.dto';
import * as bcrypt from 'bcryptjs';
import { UserRepository } from '../repositories/user.repository';
import { UserLoginDto } from '../DTO/user-login.dto';
import { TOKEN } from '../interface/validate-token.interface';
import { RoleEnum } from '../enum/roles.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
  ) {}

  validateToken(token: string) {
    return this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET_KEY,
    });
  }

  generateToken(user: TOKEN) {
    const token = this.jwtService.sign(user, {
      secret: process.env.JWT_SECRET_KEY,
      expiresIn: '2h',
      algorithm: 'HS512',
    });
    return token;
  }

  async convertPasswordToHash(password: string) {
    return bcrypt.hash(password, 12);
  }

  async userSignupOrThrow(
    userDetails: UserSignupDto,
  ): Promise<UserSignupDto | never> {
    try {
      // password to hash conversion
      const passwordHash = await this.convertPasswordToHash(
        userDetails.password,
      );
      userDetails.password = passwordHash;
      userDetails.role = RoleEnum.USER;

      // storing in DB
      return await this.userRepository.create(userDetails);
    } catch (error) {
      throw new HttpException(
        'Failed to create user. Either username or email is existing',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async successOrFailedLogin(
    loginCreds: UserLoginDto,
  ): Promise<{ token: string } | never> {
    try {
      const userData = await this.userRepository.findOneByUsernameOrEmail(
        loginCreds.user,
      );
      if (!userData) {
        throw 'You are not registered';
      }
      const isPasswordCorrect = await bcrypt.compare(
        loginCreds.password,
        userData.password,
      );
      if (!isPasswordCorrect) {
        throw 'Incorrect password';
      }
      // jwt token
      const token = this.generateToken({
        firstname: userData.firstName,
        username: userData.username,
        email: userData.email,
        role: userData.role,
      });

      return { token };
    } catch (error) {
      throw new HttpException(error.message ?? error, HttpStatus.BAD_REQUEST);
    }
  }

  async successOrFailedLogout(_: string): Promise<boolean | never> {
    try {
      // blacklist token strategy
      return true;
    } catch (error) {
      throw new HttpException(error.message ?? error, HttpStatus.BAD_REQUEST);
    }
  }
}
