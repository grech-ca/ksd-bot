import { OnModuleInit } from '@nestjs/common';

import { InjectVkApi } from 'nestjs-vk';
import { VK } from 'vk-io';

const { KSD_ID } = process.env;

export class AppUpdate implements OnModuleInit {
  constructor(
    @InjectVkApi()
    private readonly vk: VK,
  ) {}

  onModuleInit() {
    void this.vk.api.messages.send({
      peer_id: +KSD_ID,
      message: 'Я проснулся',
      random_id: Date.now(),
    });
  }
}
