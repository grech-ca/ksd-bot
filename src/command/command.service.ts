import { Injectable, UseFilters } from '@nestjs/common';

import { InjectVkApi } from 'nestjs-vk';
import { MessageContext, VK } from 'vk-io';
import { format } from 'date-fns';
import { ru as locale } from 'date-fns/locale';

import { args, random, refUser } from '@app/utils';
import { VkExceptionFilter } from '@app/common/vk-exception.filter';
import { DbService } from '@app/db';
import { AchievementsService } from '@app/achievements';

@Injectable()
@UseFilters(VkExceptionFilter)
export class CommandService {
  constructor(
    @InjectVkApi()
    private readonly vk: VK,
    private readonly db: DbService,
    private readonly achievementsService: AchievementsService,
  ) {}

  async who(ctx: MessageContext) {
    const { chatId, text } = ctx;
    const action = args(text).join(' ');

    const { profiles } = await this.vk.api.messages.getConversationMembers({ peer_id: 2000000000 + chatId });

    const { first_name, last_name, id } = random(profiles);

    void ctx.send(`${refUser(id, first_name, last_name)} ${action}`);
  }

  async whoAmI(ctx: MessageContext) {
    const { senderId, chatId } = ctx;

    const [{ id, first_name, last_name }] = await this.vk.api.users.get({ user_ids: [senderId] });
    const {
      nickname,
      _count: { achievements },
    } =
      (await this.db.user.findUnique({
        where: { id: senderId },
        include: {
          _count: {
            select: {
              achievements: true,
            },
          },
        },
      })) || {};

    const name = `${refUser(id, first_name, last_name)} ${nickname ? `[AKA ${nickname}]` : ''}`;

    const { items } = await this.vk.api.messages.getConversationMembers({ peer_id: 2000000000 + chatId });

    const { join_date } = items.find(({ member_id }) => member_id === senderId);

    const joinDate = format(new Date(join_date * 1000), 'PPP', { locale });

    void ctx.send(`
      ${name}

      Участник КСД с ${joinDate}
      🏆 Достижения: ${achievements}
    `);
  }

  async nickname(ctx: MessageContext) {
    const { senderId, text } = ctx;

    const nickname = args(text).join(' ');

    if (!nickname) return ctx.send('Укажите ник');

    await this.db.user.upsert({
      where: { id: senderId },
      update: { nickname },
      create: {
        id: senderId,
        nickname,
      },
    });

    void ctx.send(`Ник "${nickname}" установлен`);

    await this.achievementsService.give(senderId, 'first-nickname');
  }

  async achievements(ctx: MessageContext) {
    const { senderId } = ctx;

    const [{ first_name, last_name }] = await this.vk.api.users.get({ user_ids: [senderId] });

    const { nickname, achievements } = await this.db.user.findUnique({
      where: { id: senderId },
      select: {
        nickname: true,
        achievements: {
          select: {
            title: true,
            description: true,
            date: true,
          },
        },
      },
    });

    const achievementsList = achievements.map(({ title, description, date }, index) => {
      const dateString = format(date, 'dd.MM.yyyy');
      return `${index + 1}.${title} — ${description} [${dateString}]`;
    });

    void ctx.send(`
      🏆 Все достижения пользователя ${refUser(senderId, first_name, last_name, nickname)}:

      ${achievementsList.join('\n')}
    `);
  }
}
