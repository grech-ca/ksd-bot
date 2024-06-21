import { Module } from '@nestjs/common';

import { DbService } from '@app/db';
import { AchievementsService } from '@app/achievements';
import { ChatService } from '@app/chat';
import { UserService } from '@app/user';
import { RoleService } from '@app/role';

import { CommandService } from './command.service';
import { CommandUpdate } from './command.update';

@Module({
  providers: [CommandService, CommandUpdate, DbService, AchievementsService, ChatService, UserService, RoleService],
})
export class CommandModule {}
