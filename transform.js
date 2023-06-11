#!/usr/bin/env osascript -l JavaScript

function run(argv) {
  const input = argv[0];

  const WORD = /[a-zA-Z0-9]+/g;
  const ARGUMENT = /(?:'|")([^'"]*)(?:'|")/g;
  const COMMAND_SEPARATOR = ' /';

  let items = [];

  const toPascalCase = (string = '') => {
    const words = string.match(WORD);
    return (words || [])
      .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
      .join('');
  };

  const toLowerCase = (string = '') => {
    return string.toLowerCase();
  };

  const toUpperCase = (string = '') => {
    return string.toUpperCase();
  };

  const toCamelCase = (string = '') => {
    const words = string.match(WORD);
    return (words || []).map((word, index) => {
      if (index === 0) {
        return `${word.charAt(0).toLowerCase()}${word.slice(1)}`;
      }
      return `${word.charAt(0).toUpperCase()}${word.slice(1)}`;
    }).join('');
  };

  const toSnakeCase = (string = '') => {
    const words = string.match(WORD);
    return (words || []).join('_');
  };

  const toTrimmed = (string = '') => {
    return string.trim();
  };

  const toSlug = (string = '', replacement = '-') => {
    const words = string.match(WORD);
    return (words || []).join(replacement);
  };

  const noArgCommands = {
    l: {
      name: 'Lowercase',
      transform: toLowerCase,
    },
    u: {
      name: 'Uppercase',
      transform: toUpperCase,
    },
    c: {
      name: 'Camelcase',
      transform: toCamelCase,
    },
    p: {
      name: 'Pascalcase',
      transform: toPascalCase,
    },
    s: {
      name: 'Snakecase',
      transform: toSnakeCase,
    },
    t: {
      name: 'Trim',
      transform: toTrimmed,
    },
  }

  const argCommands = {
    S: {
      name: 'Slugify',
      hint: `Chain syntax: ${COMMAND_SEPARATOR}S '<replacement>'`,
      transform: toSlug,
      args: 1,
    },
  };

  const allCommands = {
    ...noArgCommands,
    ...argCommands,
  };

  const argCommandsRx = Object.entries(argCommands).map(([key, description]) => {
    const argRx = '(?:\'|\")[^\'\"]*(?:\'|\")';
    return `${key} ${argRx.repeat(description.args)}`;
  })
  const COMMANDS_SEQUENCE = new RegExp(`[${Object.keys(noArgCommands).join('')}]{1}|${argCommandsRx.join('|')}`, 'g');

  const runTransforms = (input, commandsSequence) => {
    if (Array.isArray(commandsSequence) && commandsSequence.length > 0) {
      return commandsSequence.reduce((result, command) => {
        const transformer = allCommands[command[0]];
        if (transformer) {
          if (transformer.args && command.length > 1) {
            const commandArgs = [...command.matchAll(ARGUMENT)].map((argMatch) => argMatch[1]);
            return transformer.transform.apply(null, [result, ...commandArgs]);
          }
          return transformer.transform(result);
        }
        return result
      }, input);
    }

    return input;
  };

  const getCommandSequencePath = (commandsSequence) => {
    if (Array.isArray(commandsSequence) && commandsSequence.length > 0) {
      return commandsSequence.reduce((result, command) => {
        const transformer = allCommands[command[0]];
        if (transformer) {
          result.push(transformer.name);
        }
        return result
      }, []);
    }
  };

  const isMultilined = (string = '') => /\n+/.test(string);
  const inputSplitted = (input || '').split(COMMAND_SEPARATOR);

  const string = inputSplitted.length > 2
    ? inputSplitted.slice(0, inputSplitted.length - 1).join(COMMAND_SEPARATOR)
    : inputSplitted[0];
  const commandsSequence = inputSplitted[1] ? inputSplitted[1].match(COMMANDS_SEQUENCE) : undefined;

  if (commandsSequence) {
    const path = getCommandSequencePath(commandsSequence);
    const subtitle = path.join('→');
    const icon = {
      path: './Chained.png',
    };
    try {
      const chainResult = runTransforms(string, commandsSequence);
      items = [{
        uid: 'chained',
        title: isMultilined(chainResult) ? 'Multiline output' : chainResult,
        subtitle,
        arg: chainResult,
        icon,
      }];
    } catch {
      items = [{
        uid: 'error',
        title: 'Error',
        subtitle,
        arg: string,
        icon,
      }];
    }
  } else {
    items = Object.values(allCommands).map((command) => {
      try {
        const transformed = command.transform(string);

        return {
          uid: command.name.toLowerCase(),
          title: isMultilined(transformed) ? 'Multiline output' : transformed,
          subtitle: command.hint ? `${command.name}. ${command.hint}` : command.name,
          arg: transformed,
          icon: {
            path: `./${command.name}.png`,
          },
        };
      } catch {
        return {};
      }
    });
  }

  return JSON.stringify({
    items,
  });
}
