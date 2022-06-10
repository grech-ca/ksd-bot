import { Module } from '@nestjs/common';

import { DbService } from '@app/db';
import { AchievementsService } from '@app/achievements';

import { CommandService } from './command.service';
import { CommandUpdate } from './command.update';

@Module({
  providers: [CommandUpdate, CommandService, DbService, AchievementsService],
})
export class CommandModule {}
