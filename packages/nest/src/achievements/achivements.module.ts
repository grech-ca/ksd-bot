import { Module } from '@nestjs/common';

import { DbService } from '@app/db';

import { AchievementsService } from './achievements.service';

@Module({
  providers: [AchievementsService, DbService],
})
export class AchievementsModule {}
