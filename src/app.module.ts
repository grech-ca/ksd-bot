import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { VkModule } from 'nestjs-vk';

import { CommandModule } from '@app/command';
import { DbService } from '@app/db';
import { AchievementsService } from '@app/achievements';
import { AppUpdate } from '@app/app.update';

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
    CommandModule,
  ],
  providers: [DbService, AchievementsService, AppUpdate],
})
export class AppModule {}
