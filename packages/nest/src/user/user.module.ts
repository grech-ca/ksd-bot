import { Module } from '@nestjs/common';

import { DbService } from '@app/db';
import { ChatService } from '@app/chat';

import { UserService } from './user.service';

@Module({
  providers: [UserService, DbService, ChatService],
  exports: [UserService],
})
export class UserModule {}
