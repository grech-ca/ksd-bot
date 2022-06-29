import { Achievement } from '@prisma/client';
import * as emoji from 'node-emoji';

import { AchievementType } from './achievements.interface';

export const ACHIEVEMENT_TYPES = [
  'first-nickname',
  'hey-huinya',
  'no-achievements',
  'rightless',
  'gruppenfuhrer',
  'uebermensch',
  'crash-tester',
  'revoked',
] as const;

export const ACHIEVEMENTS: Record<AchievementType, Pick<Achievement, 'title' | 'description'>> = {
  'first-nickname': {
    title: '🏷️ Как там тебя зовут?',
    description: 'Указать себе ник',
  },
  'hey-huinya': {
    title: '👻 Фантомные боли',
    description: 'Надеяться что Миша когда-нибудь вернет эту команду',
  },
  'no-achievements': {
    title: '🏆 Утешительный приз',
    description: 'Осознать, что ничего не добился...',
  },
  rightless: {
    title: '🚫 Бесправный',
    description: 'Бот решил за тебя, кем ты будешь',
  },
  gruppenfuhrer: {
    title: `${emoji.get('cop')} Группенфюрер`,
    description: 'Получить права модератора',
  },
  uebermensch: {
    title: `${emoji.get('male-pilot')} Übermensch`,
    description: 'Стать одним из самых доверенных лиц',
  },
  'crash-tester': {
    title: `${emoji.get('hammer')} Краш тестер`,
    description: 'Сломать Чмоню',
  },
  revoked: {
    title: `${emoji.get('worried')} No rights?`,
    description: 'Понизиться',
  },
};
