import { Module } from '@nestjs/common';

import { AchievementsService } from '@app/achievements';
import { DbService } from '@app/db';

import { ReplyUpdate } from './reply.update';

@Module({
  providers: [ReplyUpdate, AchievementsService, DbService],
})
export class ReplyModule {}
