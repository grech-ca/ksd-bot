import { Injectable } from '@nestjs/common';

import { DbService } from '@app/db';
import { UserService } from '@app/user';
import { ChatService } from '@app/chat';
import { refUser } from '@app/utils';
import { AchievementsService } from '@app/achievements';

import { Role } from './role.interface';
import { ROLE_NAMES } from './role.constants';

@Injectable()
export class RoleService {
  constructor(
    private readonly dbService: DbService,
    private readonly userService: UserService,
    private readonly chatService: ChatService,
    private readonly achievementsService: AchievementsService,
  ) {}

  async grant(userId: number, role: Role) {
    const { id, first_name, last_name, nicknames } = (await this.userService.findOrCreate(userId)) as any;

    await this.dbService.user.update({ where: { id: userId }, data: { role } });

    const nickname = nicknames.find(({ active }) => active);

    const username = refUser(id, first_name, last_name, nickname?.value);

    await this.chatService.send(`Пользователю ${username} выдана роль "${ROLE_NAMES[role]}"`);
    if (role === 'Moderator') await this.achievementsService.give(userId, 'gruppenfuhrer');
    if (role === 'Admin') await this.achievementsService.give(userId, 'uebermensch');
  }
}
