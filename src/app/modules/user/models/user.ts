import { Roles } from './roles.enum';

export interface Login {
  email: string;
  password: string;
}

export interface Signup extends Login {
  username: string;
  role: Roles;
}

export interface User extends Signup {
  id: string;
}
