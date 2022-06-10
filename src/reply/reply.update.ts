import { UseFilters, Inject } from '@nestjs/common';

import { Ctx, Hears, Update, VK_HEAR_MANAGER, VK_SESSION_MANAGER } from 'nestjs-vk';
import { HearManager } from '@vk-io/hear';
import { MessageContext } from 'vk-io';
import { SessionManager } from '@vk-io/session';

import { VkExceptionFilter } from '@app/common/vk-exception.filter';
import { AchievementsService } from '@app/achievements';

@Update()
@UseFilters(VkExceptionFilter)
export class ReplyUpdate {
  constructor(
    @Inject(VK_HEAR_MANAGER)
    private readonly hearManagerProvider: HearManager<MessageContext>,
    @Inject(VK_SESSION_MANAGER)
    private readonly sessionManagerProvider: SessionManager,
    private readonly achievementsService: AchievementsService,
  ) {}

  @Hears(/^эй хуйня$/i)
  heyHuinya(@Ctx() ctx: MessageContext) {
    const { senderId } = ctx;
    void this.achievementsService.give(senderId, 'hey-huinya');
  }
}
