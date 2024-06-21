import { createApi } from 'unsplash-js';

export const createUnsplashApiFactory = () => {
  return createApi({ accessKey: process.env.UNSPLASH_TOKEN });
};
