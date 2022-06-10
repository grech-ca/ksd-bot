import { Achievement } from '@prisma/client';

import { AchievementType } from './achievements.interface';

export const ACHIEVEMENT_TYPES = ['first-nickname', 'hey-huinya'] as const;

export const ACHIEVEMENTS: Record<AchievementType, Pick<Achievement, 'title' | 'description'>> = {
  'first-nickname': {
    title: '🏷️ Как там тебя зовут?',
    description: 'Указать себе ник',
  },
  'hey-huinya': {
    title: 'Фантомные боли',
    description: 'Надеяться что Миша когда-нибудь вернет эту команду',
  },
};
