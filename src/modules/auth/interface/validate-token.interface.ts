import { RoleEnum } from '../enum/roles.enum';

export interface TOKEN {
  firstname: string;
  username: string;
  email: string;
  role: RoleEnum;
}
