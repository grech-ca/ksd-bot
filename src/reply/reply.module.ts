import { Module } from '@nestjs/common';

import { ReplyUpdate } from './reply.update';

@Module({
  providers: [ReplyUpdate],
})
export class ReplyModule {}
