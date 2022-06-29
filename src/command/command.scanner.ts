import { ExecutionContext, INestApplication, Injectable, Type } from '@nestjs/common';
import { MODULE_PATH } from '@nestjs/common/constants';
import { NestContainer } from '@nestjs/core';

export class CommandScanner {
  scanApplication(app: INestApplication) {
    const container = (app as any).container as NestContainer;
    const modules = [...container.getModules().values()];

    modules.forEach(({ metatype, relatedModules }) => {
      Array.from(relatedModules.values()).forEach(({ metatype }) => {
        console.log(metatype)
      });
    });
  }
}
