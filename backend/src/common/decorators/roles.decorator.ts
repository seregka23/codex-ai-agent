import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export type UserRole = 'ADMIN' | 'EDITOR' | 'REVIEWER' | 'USER';
export const Roles = (...roles: UserRole[]): MethodDecorator & ClassDecorator => SetMetadata(ROLES_KEY, roles);
