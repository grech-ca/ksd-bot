import { applyDecorators } from '@nestjs/common';

import { Hears } from 'nestjs-vk';
import { defaults } from 'lodash';

import { CommandMetadata, CommandOptions } from './interfaces';

const CommandDecorator = (command: string | string[], commandOptions: CommandOptions) => {
  return function (target: Function) {
    const prev = Reflect.getMetadata('commands', target) || [];

    const commandMetaData: CommandMetadata = {
      ...commandOptions,
      variants: Array.isArray(command) ? command : [command],
    };

    Reflect.defineMetadata('commands', [...prev, commandMetaData], target);
  };
};

export const Command = (command: string | string[], commandOptions: CommandOptions = {}) => {
  const options = defaults(commandOptions, { implemented: true, commandSign: '_' });

  const commands = Array.isArray(command) ? command : [command];
  return applyDecorators(
    CommandDecorator(command, options),
    Hears(new RegExp(`\\${options.commandSign}(${commands.join('|')})(?= |$)`)),
  );
};
