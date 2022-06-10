import { UseFilters, Inject } from '@nestjs/common';

import { toLower } from 'lodash';
import { Update, VK_HEAR_MANAGER, VK_SESSION_MANAGER, Hears, Ctx } from 'nestjs-vk';
import { MessageContext } from 'vk-io';
import { HearManager } from '@vk-io/hear';
import { SessionManager } from '@vk-io/session';

import { VkExceptionFilter } from '@app/common/vk-exception.filter';

import { CommandService } from './command.service';

@Update()
@UseFilters(VkExceptionFilter)
export class CommandUpdate {
  constructor(
    @Inject(VK_HEAR_MANAGER)
    private readonly hearManagerProvider: HearManager<MessageContext>,
    @Inject(VK_SESSION_MANAGER)
    private readonly sessionManagerProvider: SessionManager,
    @Inject(CommandService)
    private readonly commandService: CommandService,
  ) {}

  @Hears(/^_[а-яёa-z]*/i)
  command(@Ctx() ctx: MessageContext) {
    const [command] = toLower(ctx.text).slice(1).split(/ /);

    switch (command) {
      case 'кто':
        return this.commandService.who(ctx);
      case 'я':
        return this.commandService.whoAmI(ctx);
      case 'ник':
        return this.commandService.nickname(ctx);
      case 'ачивки':
      case 'достижения':
        return this.commandService.achievements(ctx);
      default:
        void ctx.send('Такой команды нетю...');
    }
  }
}
