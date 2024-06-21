import { UseFilters, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Update, VK_HEAR_MANAGER, VK_SESSION_MANAGER, Ctx, Hears } from 'nestjs-vk';
import { MessageContext } from 'vk-io';
import { HearManager } from '@vk-io/hear';
import { SessionManager } from '@vk-io/session';

import { Roles } from '@app/decorators';
import { CommandExeptionFilter } from '@app/common/command-exception.filter';

import { CommandService } from './command.service';
import { Command } from './command.decorator';
import { CommandMetadata } from './interfaces';

@Injectable()
@Update()
@UseFilters(CommandExeptionFilter)
export class CommandUpdate {
  constructor(
    @Inject(VK_HEAR_MANAGER)
    private readonly hearManagerProvider: HearManager<MessageContext>,
    @Inject(VK_SESSION_MANAGER)
    private readonly sessionManagerProvider: SessionManager,
    private readonly commandService: CommandService,
    private readonly reflector: Reflector,
  ) {}

  @Command('кто', { description: 'Выбирает одного из пользователей' })
  who(@Ctx() ctx: MessageContext) {
    return this.commandService.who(ctx);
  }

  @Command(['ачивки', 'достижения'], { description: 'Выводит все достижения пользователя' })
  achievements(@Ctx() ctx: MessageContext) {
    return this.commandService.achievements(ctx);
  }

  @Command('ник', { description: 'Меняет ник пользователя' })
  nickname(@Ctx() ctx: MessageContext) {
    return this.commandService.nickname(ctx);
  }

  @Command('ники', { description: 'Выводит историю ников пользователя' })
  nicknames(@Ctx() ctx: MessageContext) {
    return this.commandService.nicknames(ctx);
  }

  @Command(['инфа', 'инфо', 'юзер'], { description: 'Показывает информацию о текущем или определенном пользователе' })
  info(@Ctx() ctx: MessageContext) {
    return this.commandService.info(ctx);
  }

  @Command(['команды', 'хелп', 'помощь'], { description: 'Показывает все существующие команды' })
  help(@Ctx() ctx: MessageContext) {
    const commands = Reflect.getMetadata('commands', this) as CommandMetadata[];
    return this.commandService.help(ctx, commands);
  }

  @Command('выбери', { description: 'Выбирает одно из перечисленных слов' })
  choose(@Ctx() ctx: MessageContext) {
    return this.commandService.choose(ctx);
  }

  @Command(['шанс', 'вероятность'], { description: 'Показывает вероятность утверждения' })
  chance(@Ctx() ctx: MessageContext) {
    return this.commandService.chance(ctx);
  }

  @Command(['правда', 'ложь', 'правдаложь', 'ложьправда'], { description: 'Говорит правда или нет' })
  truth(@Ctx() ctx: MessageContext) {
    return this.commandService.truth(ctx);
  }

  @Command(['данет', 'нетда'])
  yesno(@Ctx() ctx: MessageContext) {
    return this.commandService.yesno(ctx);
  }

  @Command(['роль', 'должность', 'права'], { commandSign: '+', description: 'Выдает роль указанному пользователю' })
  @Roles('Owner', 'Admin')
  grantRole(@Ctx() ctx: MessageContext) {
    return this.commandService.role(ctx);
  }

  @Command(['кик', 'выгнать', 'ухади'], { description: 'Выгоняет пользователя из беседы' })
  @Roles('Owner', 'Admin')
  kick(@Ctx() ctx: MessageContext) {
    return this.commandService.kick(ctx);
  }

  @Command(['свинка', 'пигпик', 'pigpic'], { description: 'Находит рандомную картинку свинки с сайта unsplash.com' })
  pigPic(@Ctx() ctx: MessageContext) {
    return this.commandService.pigPic(ctx);
  }

  @Hears(/^(_|\+)(.*)/)
  notFound(@Ctx() ctx: MessageContext) {
    const command = ctx.text.split(' ')[0].slice(1);

    const commands = Reflect.getMetadata('commands', this) as CommandMetadata[];

    const commandExists = commands.some(({ variants }) => variants.includes(command));

    if (!commandExists) void ctx.send('Такой команды нетю...');
  }
}
