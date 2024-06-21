import { Injectable } from '@nestjs/common';

import { InjectVkApi } from 'nestjs-vk';
import { VK } from 'vk-io';

import { DbService } from '@app/db';
import { refUser } from '@app/utils';

import { AchievementType } from './achievements.interface';
import { ACHIEVEMENTS } from './achievements.constants';

const { KSD_ID } = process.env;

@Injectable()
export class AchievementsService {
  constructor(
    @InjectVkApi()
    private readonly vk: VK,
    private readonly db: DbService,
  ) {}

  async give(id: number, type: AchievementType) {
    const [vkUser] = await this.vk.api.users.get({
      user_ids: [id],
      fields: ['sex'],
    });

    if (!vkUser) return;

    const achievementExists = Boolean(
      await this.db.achievement.findFirst({
        where: { userId: id, type },
      }),
    );

    if (achievementExists) return;

    const achievement = ACHIEVEMENTS[type];

    const { nicknames } = await this.db.user.upsert({
      where: { id },
      update: {
        achievements: {
          create: {
            type,
            ...achievement,
          },
        },
      },
      create: {
        id,
        achievements: {
          create: {
            type,
            ...achievement,
          },
        },
      },
      select: {
        nicknames: {
          where: { active: true },
          select: { value: true },
        },
      },
    });

    const nickname = nicknames[0]?.value;

    const { first_name, last_name, sex } = vkUser;

    const verb = `получил${sex === 1 ? 'а' : ''}`;

    void this.vk.api.messages.send({
      peer_id: +KSD_ID,
      message: `🎉 ${refUser(id, first_name, last_name, nickname)} ${verb} достижение:

        ${achievement.title} — ${achievement.description}
      `,
      random_id: Date.now(),
    });
  }

  async take(id: number, type: AchievementType) {
    await this.db.achievement.deleteMany({ where: { userId: id, type } });
  }
}
