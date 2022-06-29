import { Provider, DynamicModule, Inject, Global, Module } from '@nestjs/common';

import { createUnsplashApiFactory } from './create-unsplash-api-factory.utils';
import { UNSPLASH_API_NAME } from './unsplash.constants';

@Global()
@Module({})
export class UnsplashModule {
  constructor(
    @Inject(UNSPLASH_API_NAME)
    private readonly unsplashApiName: string,
  ) {}

  public static forRoot(): DynamicModule {
    const unsplashApiName = UNSPLASH_API_NAME;

    const unsplashApiNameProvider: Provider = {
      provide: UNSPLASH_API_NAME,
      useValue: unsplashApiName,
    };

    const unsplashApiProvider: Provider = {
      provide: unsplashApiName,
      useFactory: () => createUnsplashApiFactory(),
    };

    const providers: Provider[] = [unsplashApiNameProvider, unsplashApiProvider];

    return {
      module: UnsplashModule,
      providers: providers,
      exports: providers,
    };
  }
}
