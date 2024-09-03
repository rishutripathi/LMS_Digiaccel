import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const role =
      this.reflector.get<string>('role', context.getHandler()) ||
      this.reflector.get<string>('role', context.getClass());
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return role === user.role.toLowerCase();
  }
}
