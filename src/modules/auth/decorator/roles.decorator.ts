import { SetMetadata } from '@nestjs/common';
import { RoleEnum } from '../enum/roles.enum';

export const Role = (role: RoleEnum) => SetMetadata('role', role);
