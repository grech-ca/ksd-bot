import { Inject } from '@nestjs/common';

import { UNSPLASH_API_NAME } from './unsplash.constants';

export const InjectUnsplashApi = (): ParameterDecorator => Inject(UNSPLASH_API_NAME);
