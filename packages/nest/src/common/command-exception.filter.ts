import { ArgumentsHost, ExceptionFilter, Catch } from '@nestjs/common';

import { VkArgumentsHost } from 'nestjs-vk';
import { MessageContext } from 'vk-io';

import { AchievementsService } from '@app/achievements';

@Catch()
export class CommandExeptionFilter implements ExceptionFilter {
  constructor(private readonly achievementsService: AchievementsService) {}

  catch(exception: Error, host: ArgumentsHost) {
    const context = VkArgumentsHost.create(host);
    const ctx = context.getContext<MessageContext>();
    const { senderId } = ctx;

    if (senderId) void this.achievementsService.give(senderId, 'crash-tester');
  }
}
