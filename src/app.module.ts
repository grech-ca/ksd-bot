import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import { VkModule } from 'nestjs-vk';

import { CommandModule } from '@app/command';
import { DbService } from '@app/db';
import { AchievementsModule } from '@app/achievements';
import { AppUpdate } from '@app/app.update';
import { ReplyModule } from '@app/reply';
import { RoleGuard, RoleModule } from '@app/role';
import { ChatModule } from '@app/chat';
import { UserModule } from '@app/user';
import { UnsplashModule } from '@app/unsplash';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot(),
    VkModule.forRoot({
      token: process.env.TOKEN,
      options: {
        pollingGroupId: +process.env.GROUP_ID,
        apiMode: 'sequential',
      },
    }),
    UnsplashModule.forRoot(),
    CommandModule,
    ReplyModule,
    AchievementsModule,
    ChatModule,
    UserModule,
    RoleModule,
  ],
  providers: [
    DbService,
    AppUpdate,
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class AppModule {}
