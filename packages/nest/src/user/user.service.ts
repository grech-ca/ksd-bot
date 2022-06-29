import { Injectable } from '@nestjs/common';

import { Achievement, Nickname, User as PrismaUser } from '@prisma/client';
import { InjectVkApi } from 'nestjs-vk';
import { VK } from 'vk-io';

import { DbService } from '@app/db';

interface User extends PrismaUser {
  nicknames: Nickname[];
  achievements: Achievement[];
}

@Injectable()
export class UserService {
  constructor(
    @InjectVkApi()
    private readonly vk: VK,
    private readonly db: DbService,
  ) {}

  async findOrCreate(senderId: number): Promise<User> {
    const select = {
      id: true,
      description: true,
      role: true,
      achievements: true,
      createdAt: true,
      updatedAt: true,
      nicknames: true,
    } as const;

    const vkUser = (await this.vk.api.users.get({ user_ids: [senderId] }))[0] as User;
    let dbUser = await this.db.user.findUnique({ where: { id: senderId }, select });

    if (!vkUser) throw new Error('Пользователь не найден');

    if (!dbUser) dbUser = await this.db.user.create({ data: { id: senderId }, select });

    return { ...vkUser, ...dbUser };
  }
}
