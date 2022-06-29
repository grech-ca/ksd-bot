import { Role } from './role.interface';

export const ROLES = ['Owner', 'Admin', 'Moderator', 'User'] as const;

export const ROLE_NAMES: Record<Role, string> = {
  Owner: 'Владелец',
  Admin: 'Администратор',
  Moderator: 'Модератор',
  User: 'Пользователь',
};
