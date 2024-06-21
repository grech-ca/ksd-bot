import { SetMetadata } from '@nestjs/common';

import { Role } from './role.interface';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
