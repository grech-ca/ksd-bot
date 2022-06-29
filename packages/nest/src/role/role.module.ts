import { Module } from '@nestjs/common';

import { UserService } from '@app/user';
import { DbService } from '@app/db';
import { ChatService } from '@app/chat';
import { AchievementsService } from '@app/achievements';

import { RoleService } from './role.service';

@Module({
  providers: [RoleService, DbService, UserService, ChatService, AchievementsService],
})
export class RoleModule {}
