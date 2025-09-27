#!/usr/bin/env osascript -l JavaScript

import slugify from 'slugify';

function run(argv) {
  const input = argv[0];

  const ARGUMENT = /(?:'([^']*)'|"([^"]*)")/g;
  const COMMAND_SEPARATOR = ' /';
  const CYRILLIC_TO_LATIN_MAP = {
    а: 'a',
    б: 'b',
    в: 'v',
    г: 'g',
    д: 'd',
    е: 'e',
    ё: 'e',
    ж: 'zh',
    з: 'z',
    и: 'i',
    й: 'y',
    к: 'k',
    л: 'l',
    м: 'm',
    н: 'n',
    о: 'o',
    п: 'p',
    р: 'r',
    с: 's',
    т: 't',
    у: 'u',
    ф: 'f',
    х: 'h',
    ц: 'c',
    ч: 'ch',
    ш: 'sh',
    щ: 'sch',
    ъ: '',
    ы: 'y',
    ь: '',
    э: 'e',
    ю: 'yu',
    я: 'ya',
    є: 'ye',
    ґ: 'g',
    ї: 'yi',
    А: 'A',
    Б: 'B',
    В: 'V',
    Г: 'G',
    Д: 'D',
    Е: 'E',
    Ё: 'E',
    Ж: 'Zh',
    З: 'Z',
    И: 'I',
    Й: 'Y',
    К: 'K',
    Л: 'L',
    М: 'M',
    Н: 'N',
    О: 'O',
    П: 'P',
    Р: 'R',
    С: 'S',
    Т: 'T',
    У: 'U',
    Ф: 'F',
    Х: 'H',
    Ц: 'C',
    Ч: 'Ch',
    Ш: 'Sh',
    Щ: 'Sch',
    Ъ: '',
    Ы: 'Y',
    Ь: '',
    Э: 'E',
    Ю: 'Yu',
    Я: 'Ya',
    Є: 'Ye',
    Ґ: 'G',
    Ї: 'Yi',
  };
  const UMLAUTS_TO_LATIN_MAP = {
    ä: 'ae',
    ö: 'oe',
    ü: 'ue',
    Ä: 'Ae',
    Ö: 'Oe',
    Ü: 'Ue',
    ß: 'ss',
  };
  const EXTRAS_TO_LATIN_MAP = {
    ...CYRILLIC_TO_LATIN_MAP,
    ...UMLAUTS_TO_LATIN_MAP,
  };
  const WORD = new RegExp(`[a-zA-Z0-9${Object.keys(EXTRAS_TO_LATIN_MAP).join('')}]+`, 'g');

  let items = [];

  const toPascalCase = (string = '') => {
    const words = string.match(WORD);
    return (words || []).map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`).join('');
  };

  const toLowerCase = (string = '') => {
    return string.toLowerCase();
  };

  const toUpperCase = (string = '') => {
    return string.toUpperCase();
  };

  const toCamelCase = (string = '') => {
    const words = string.match(WORD);
    return (words || [])
      .map((word, index) => {
        if (index === 0) {
          return `${word.charAt(0).toLowerCase()}${word.slice(1)}`;
        }
        return `${word.charAt(0).toUpperCase()}${word.slice(1)}`;
      })
      .join('');
  };

  const toSnakeCase = (string = '') => {
    const words = string.match(WORD);
    return (words || []).join('_').toLowerCase();
  };

  const toTrimmed = (string = '') => {
    return string.trim();
  };

  const toCapitalized = (string = '') => {
    const wordChar = /[a-zA-Z_]/;
    let previousChar = '';
    let capitalized = '';

    for (let i = 0; i < string.length; i++) {
      const currentChar = string.charAt(i);
      capitalized +=
        !wordChar.test(previousChar) && wordChar.test(currentChar)
          ? currentChar.toLocaleUpperCase()
          : currentChar;
      previousChar = currentChar;
    }

    return capitalized;
  };

  const toSlug = (string = '', replacement = '-') => {
    return slugify(string, { replacement });
  };

  const toReplaced = (string = '', substring, replacement = '') => {
    return string.replaceAll(substring, replacement);
  };

  const toJSON = (string = '', indent = 2) => {
    return JSON.stringify(JSON.parse(string), null, indent === 't' ? '\t' : parseInt(indent));
  };

  const toEncodedURI = (string = '') => {
    return encodeURI(string);
  };

  const toDecodedURI = (string = '') => {
    return decodeURI(string);
  };

  const toReversed = (string = '') => {
    let reversed = '';
    for (let i = string.length - 1; i >= 0; i--) {
      reversed += string[i];
    }
    return reversed;
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
    a: {
      name: 'Capitalize',
      transform: toCapitalized,
    },
    e: {
      name: 'Encode URI',
      transform: toEncodedURI,
    },
    d: {
      name: 'Decode URI',
      transform: toDecodedURI,
    },
    r: {
      name: 'Reverse',
      transform: toReversed,
    },
  };

  const REQUIRED_ARGUMENT = ' (?:\'.*?\'|".*?")';
  const OPTIONAL_ARGUMENT = '(?: \'.*?\'| ".*?")?';

  const argCommands = {
    S: {
      name: 'Slugify',
      hint: `Takes one argument: ${COMMAND_SEPARATOR}S '<replacement>'`,
      transform: toSlug,
      args: 1,
      pattern: `S${OPTIONAL_ARGUMENT}`,
    },
    R: {
      name: 'Replace',
      hint: `Takes two arguments: ${COMMAND_SEPARATOR}R '<substring>' '<replacement>'`,
      transform: toReplaced,
      args: 2,
      pattern: `R${REQUIRED_ARGUMENT}${OPTIONAL_ARGUMENT}`,
    },
    J: {
      name: 'Format JSON',
      hint: `Takes one argument: ${COMMAND_SEPARATOR}J '<indent>'. Integer of indentation spaces or 't' for tab char`,
      transform: toJSON,
      args: 1,
      pattern: `J${OPTIONAL_ARGUMENT}`,
    },
  };

  const allCommands = {
    ...noArgCommands,
    ...argCommands,
  };

  const AVAILABLE_COMMANDS = new RegExp(
    `[${Object.keys(noArgCommands).join('')}]{1}|${Object.values(argCommands)
      .map(({ pattern }) => pattern)
      .join('|')}`,
    'g'
  );

  const runTransforms = (input, commandsSequence) => {
    if (Array.isArray(commandsSequence) && commandsSequence.length > 0) {
      return commandsSequence.reduce((result, command) => {
        const transformer = allCommands[command[0]];

        if (!transformer) {
          return result;
        }

        if (transformer.args && command.length > 1) {
          const commandArgs = [...command.matchAll(ARGUMENT)].map(
            (argMatch) => argMatch[1] ?? argMatch[2]
          ); // matching single or double quotes
          return transformer.transform.apply(null, [result, ...commandArgs]);
        }

        return transformer.transform(result);
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
        return result;
      }, []);
    }
  };

  const isMultilined = (string = '') => /\n+/.test(string);
  const inputSplitted = (input || '').split(COMMAND_SEPARATOR);

  const string =
    inputSplitted.length > 2
      ? inputSplitted.slice(0, inputSplitted.length - 1).join(COMMAND_SEPARATOR)
      : inputSplitted[0];
  const commandsSequence =
    inputSplitted.length > 1
      ? inputSplitted[inputSplitted.length - 1].match(AVAILABLE_COMMANDS)
      : null;

  if (commandsSequence) {
    const path = getCommandSequencePath(commandsSequence);
    const subtitle = path.join('→');
    const icon = {
      path: './Chained.png',
    };
    try {
      const chainResult = runTransforms(string, commandsSequence);
      items = [
        {
          uid: 'chained',
          title: isMultilined(chainResult) ? 'Multiline output' : chainResult,
          subtitle,
          arg: chainResult,
          icon,
        },
      ];
    } catch {
      items = [
        {
          uid: 'error',
          title: 'Could not process. Invalid value or param',
          subtitle,
          arg: string,
          icon,
        },
      ];
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
        return {
          uid: command.name.toLowerCase(),
          title: 'Could not process. Invalid value or param',
          subtitle: command.hint ? `${command.name}. ${command.hint}` : command.name,
          arg: string,
          icon: {
            path: `./${command.name}.png`,
          },
        };
      }
    });
  }

  return JSON.stringify({
    items,
  });
}

globalThis.run = run;
