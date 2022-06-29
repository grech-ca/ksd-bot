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
    // void this.vk.api.messages.send({
    //   peer_id: +KSD_ID,
    //   message: 'Пока Чмоня спал его код переписали',
    //   random_id: Date.now(),
    // });

    // [
    //   'SIGHUP',
    //   'SIGINT',
    //   'SIGQUIT',
    //   'SIGILL',
    //   'SIGTRAP',
    //   'SIGABRT',
    //   'SIGBUS',
    //   'SIGFPE',
    //   'SIGUSR1',
    //   'SIGSEGV',
    //   'SIGUSR2',
    //   'SIGTERM',
    // ].forEach(sig => {
    //   process.on(sig, () => {
    //     void this.vk.api.messages
    //       .send({
    //         peer_id: +KSD_ID,
    //         message: 'Я спать',
    //         random_id: Date.now(),
    //       })
    //       .then(() => process.exit());
    //   });
    // });
  }
}
