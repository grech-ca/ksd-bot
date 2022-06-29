import { Injectable } from '@nestjs/common';

import { InjectVkApi } from 'nestjs-vk';
import { MessageContext, VK } from 'vk-io';
import { format } from 'date-fns';
import { ru as locale } from 'date-fns/locale';
import { incline } from 'lvovich';
import * as emoji from 'node-emoji';
import { uniq } from 'lodash';

import { args, random, refUser, chance, getMentions } from '@app/utils';
import { DbService } from '@app/db';
import { AchievementsService } from '@app/achievements';
import { NICKNAMES } from '@app/data';
import { ChatService } from '@app/chat';
import { UserService } from '@app/user';
import { ROLES, ROLE_NAMES, Role, RoleService } from '@app/role';
import { InjectUnsplashApi, UnsplashApi } from '@app/unsplash';

import { CommandMetadata } from './interfaces';

const got = import('got');

@Injectable()
export class CommandService {
  constructor(
    @InjectVkApi()
    private readonly vk: VK,
    private readonly db: DbService,
    private readonly achievementsService: AchievementsService,
    private readonly chatService: ChatService,
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    @InjectUnsplashApi()
    private readonly unsplash: UnsplashApi,
  ) {}

  async who(ctx: MessageContext) {
    const { text } = ctx;
    const action = args(text).join(' ');

    const { profiles } = await this.chatService.members();

    const { first_name, last_name, id } = random(profiles);

    void ctx.send(`${refUser(id, first_name, last_name)} ${action}`);
  }

  async nickname(ctx: MessageContext) {
    const { senderId, text } = ctx;

    const anotherNickname = chance(1);

    const dbNicknames = (await this.db.nickname.findMany({ select: { value: true } })).map(({ value }) => value);

    const nicknames = uniq([...dbNicknames, ...NICKNAMES]);

    const nickname = anotherNickname ? random(nicknames) : args(text).join(' ');

    if (!nickname) return ctx.reply('Укажите ник');

    await this.db.nickname.updateMany({
      where: { active: true, userId: senderId },
      data: { active: false },
    });

    await this.db.nickname.create({
      data: {
        user: { connect: { id: senderId } },
        value: nickname,
      },
    });

    void ctx.reply(anotherNickname ? `Пожалуй, ты будешь "${nickname}"` : `Ник "${nickname}" установлен`);

    if (anotherNickname) await this.achievementsService.give(senderId, 'rightless');
    await this.achievementsService.give(senderId, 'first-nickname');
  }

  async nicknames(ctx: MessageContext) {
    const { senderId, text } = ctx;

    const [userMention] = args(text);

    const [mentionId] = getMentions(userMention);

    const userId = mentionId ?? senderId;

    const [{ first_name, last_name }] = await this.vk.api.users.get({ user_ids: [userId] });

    const nicknames = await this.db.nickname.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
      select: {
        value: true,
        active: true,
        createdAt: true,
      },
    });

    const sortedNicknames = nicknames.sort((a, b) => {
      if (a.active) return -1;
      if (b.active) return 1;
      return 0;
    });

    const nicknameList = sortedNicknames
      .map(({ value, active, createdAt }, index) => {
        const num = index + 1;
        const activeText = active ? '(текущий)' : '';
        const date = format(createdAt, 'dd.MM.yyy');

        return `${num}.${value} ${activeText} [${date}]`;
      })
      .join('\n');

    const { first, last } = incline({ first: first_name, last: last_name }, 'genitive');

    const icon = emoji.get('label');

    void ctx.send([`${icon} Никнеймы ${first} ${last}:`, nicknameList].join('\n\n'));
  }

  async achievements(ctx: MessageContext) {
    const { senderId, text } = ctx;

    const [userMention] = args(text);

    const [mentionId] = getMentions(userMention);

    const userId = mentionId ?? senderId;

    const {
      nicknames: [nickname],
      first_name,
      last_name,
      achievements,
    } = (await this.userService.findOrCreate(userId)) as any;

    const achievementsList = achievements.map(({ title, description, date }, index) => {
      const dateString = format(date, 'dd.MM.yyyy');
      return `${index + 1}.${title} — ${description} [${dateString}]`;
    });

    if (achievementsList.length) {
      const icon = emoji.get('trophy');

      const username = refUser(userId, first_name, last_name, nickname?.value);

      void ctx.send([`${icon} Все достижения пользователя ${username}`, achievementsList.join('\n')].join('\n\n'));
    } else {
      await ctx.reply('🤯 У вас нет достижений');

      void this.achievementsService.give(userId, 'no-achievements');
    }
  }

  async info(ctx: MessageContext) {
    const { text, senderId, chatId } = ctx;

    const [matchedId] = getMentions(text);

    const id = matchedId ?? senderId;

    const [{ first_name, last_name }] = await this.vk.api.users.get({ user_ids: [id] });
    const {
      nicknames: [{ value: nickname }],
      role,
      achievements,
    } = await this.userService.findOrCreate(id);

    const name = `${refUser(id, first_name, last_name)} ${nickname ? `[AKA ${nickname}]` : ''}`;

    const { items } = await this.vk.api.messages.getConversationMembers({ peer_id: 2000000000 + chatId });

    const { join_date } = items.find(({ member_id }) => member_id === id);
    const user = await this.db.user.findUnique({ where: { id }, select: { createdAt: true } });

    const joinDate = format(user ? user.createdAt : new Date(join_date * 1000), 'PPP', { locale });

    const icon = emoji.get('trophy');

    void ctx.send(
      [
        name,
        `Роль: ${ROLE_NAMES[role as Role]}`,
        `Участник КСД с ${joinDate}`,
        `${icon} Достижения: ${achievements.length}`,
      ].join('\n\n'),
    );
  }

  help(ctx: MessageContext, commands: CommandMetadata[]) {
    const commandsList = commands
      .filter(({ implemented }) => implemented)
      .map(({ variants: [command, ...variants], description, commandSign }, index) => {
        const num = index + 1;
        const variantsString = variants.length ? `(или ${variants.join(', ')})` : '';
        const descriptionString = description ? `— ${description}` : '';
        return `${num}. ${commandSign}${command} ${variantsString} ${descriptionString}`;
      });

    const icon = emoji.get('page_with_curl');

    void ctx.send([`${icon} Список доступных команд:`, commandsList.join('\n')].join('\n\n'));
  }

  choose(ctx: MessageContext) {
    const variants = args(ctx.text).filter(word => word != 'или');

    if (!variants.length) return ctx.reply('А что выбирать-то?');
    void ctx.reply(`Я думаю, ${random(variants)}`);
  }

  chance(ctx: MessageContext) {
    void ctx.reply(`Я думаю, вероятность ${(Math.random() * 100).toFixed(1)}%`);
  }

  truth(ctx: MessageContext) {
    void ctx.reply(`Я думаю, ${chance() ? 'правда' : 'ложь'}`);
  }

  yesno(ctx: MessageContext) {
    void ctx.reply(`Я думаю, ${chance() ? 'да' : 'нет'}`);
  }

  async role(ctx: MessageContext) {
    const [userMention, role] = args(ctx.text);

    const [userId] = getMentions(userMention);

    if (!userId) return ctx.reply('Укажите пользователя');
    if (!role) return ctx.reply('Укажите роль');
    if (!ROLES.includes(role as Role)) return ctx.reply('Роль не существует');

    await this.roleService.grant(userId, role as Role);
  }

  async kick(ctx: MessageContext) {
    const { senderId } = ctx;

    const [userMention] = args(ctx.text);

    const [userId] = getMentions(userMention);

    if (userId === senderId) return ctx.reply('Вы не можете кикнуть себя');

    if (!userId) return ctx.reply('Укажите пользователя');

    await this.chatService.kick(ctx.chatId, userId);
  }

  async pigPic(ctx: MessageContext) {
    const photo = await this.unsplash.photos.getRandom({ query: 'pig' });
    const photoUrl = (Array.isArray(photo.response) ? photo.response[0] : photo.response).urls.raw;
    const photoStream = (await got).default.stream(photoUrl);

    ctx.sendPhotos({ value: photoStream });
  }
}
