#!/usr/bin/env osascript -l JavaScript

function run(argv) {
  const input = argv[0];

  const WORD = /[a-zA-Z0-9]+/g;
  const COMMAND_SEPARATOR = '/';

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

  const toKebapCase = (string = '') => {
    const words = string.match(WORD);
    return (words || []).join('-');
  };

  const toSnakeCase = (string = '') => {
    const words = string.match(WORD);
    return (words || []).join('_');
  };

  const toTrimmed = (string = '') => {
    return string.trim();
  };

  const toPrettyJSON = (string = '') => {
    try {
      return JSON.stringify(JSON.parse(string), null, 2);
    } catch {
      throw new Error('Invalid JSON');
    }
  };

  const commands = {
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
    k: {
      name: 'Kebapcase',
      transform: toKebapCase,
    },
    s: {
      name: 'Snakecase',
      transform: toSnakeCase,
    },
    t: {
      name: 'Trim',
      transform: toTrimmed,
    },
    j: {
      name: 'Prettify JSON',
      transform: toPrettyJSON,
    },
  };

  const runTransforms = (input, commandsSequence) => {
    if (Array.isArray(commandsSequence) && commandsSequence.length > 0) {
      try {
        const transformed = commandsSequence.reduce((result, command) => {
          const transformer = commands[command];
          if (transformer) {
            return transformer.transform(result);
          }
          return result
        }, input);
        return transformed;
      } catch {
        
      }
    }

    return [input, []];
  };

  const getCommandSequencePath = (commandsSequence) => {
    if (Array.isArray(commandsSequence) && commandsSequence.length > 0) {
      return commandsSequence.reduce((result, command) => {
        const transformer = commands[command];
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
  const commandsSequence = inputSplitted[1] ? inputSplitted[1].split('') : undefined;

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
    items = Object.values(commands).map((command) => {
      try {
        const transformed = command.transform(string);

        return {
          uid: command.name.toLowerCase(),
          title: isMultilined(transformed) ? 'Multiline output' : transformed,
          subtitle: command.name,
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
