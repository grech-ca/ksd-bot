import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { VkExecutionContext } from 'nestjs-vk';
import { Context } from 'vk-io';

import { UserService } from '@app/user';
import { ChatService } from '@app/chat';

import { Role } from './role.interface';
import { ROLE_NAMES } from './role.constants';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly reflector: Reflector,
    private readonly chatService: ChatService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const ctx = VkExecutionContext.create(context).getContext<Context>();
    const senderId: number = ctx.senderId;

    const roles = this.reflector.get<Role[]>('roles', context.getHandler());

    if (!roles) return true;

    const { role } = await this.userService.findOrCreate(senderId);

    const hasAccess = roles.includes(role as Role);

    const allowedRoles = roles.map(roleKey => ROLE_NAMES[roleKey]).join(', ');

    if (!hasAccess) {
      await this.chatService.send(`Эта команда доступна у следующих ролей: ${allowedRoles}`);
    }

    return hasAccess;
  }
}
