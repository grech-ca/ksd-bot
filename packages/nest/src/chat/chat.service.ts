import { Injectable } from '@nestjs/common';

import { VK } from 'vk-io';
import { InjectVkApi } from 'nestjs-vk';

const { KSD_ID } = process.env;

@Injectable()
export class ChatService {
  constructor(@InjectVkApi() private readonly vk: VK) {}

  send(message: string) {
    return this.vk.api.messages.send({
      peer_id: +KSD_ID,
      message,
      random_id: Date.now(),
    });
  }

  members() {
    return this.vk.api.messages.getConversationMembers({ peer_id: +KSD_ID });
  }

  kick(chat_id: number, user_id: number) {
    return this.vk.api.messages.removeChatUser({ chat_id, user_id });
  }
}
