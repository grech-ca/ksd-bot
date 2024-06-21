import { VK } from 'vk-io';
import 'dotenv/config';

const { KSD_ID, TOKEN } = process.env;

const vk = new VK({ token: TOKEN });

void vk.api.messages.send({
  peer_id: +KSD_ID,
  message: 'Пока Чмоня спал его код переписали',
  random_id: Date.now(),
});
