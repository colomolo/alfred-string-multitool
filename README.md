![String Multitool](./icon.png)

# String Multitool

[Alfred](https://www.alfredapp.com/) workflow with handy string transforming tools.

## Usage
Use keyword `string` to init String Multitool. Provide string as an argument and select needed transformation from list.

## Chaining transformations
You can also chain transformations by providing transformation commands after `/` char.

For example:
```
Some string THat we need to use as variable Name! /lc
```

`/lc` command **l**owercases the string and then **c**amelcases it yielding the result:

```
someStringThatWeNeedToUseAsVariableName
```

## Commands
### Pascalcase `/p`
Capitalize each word and merge.

`The quick brown fox jumps over the lazy dog /p` → `TheQuickBrownFoxJumpsOverTheLazyDog`

### Lowercase `/l`
Lowercase all chars.

`SAY HELLO TO MY LITTLE FRIEND! /l` → `say hello to my little friend!`

### Uppercase `/u`
Uppercase all chars.

`Can you hear me Major Tom? /u` → `CAN YOU HEAR ME MAJOR TOM?`

### Camelcase `/c`
Convert string to camelcase and remove all non-word and non-digit chars.

`is error state! /c` → `isErrorState`

### Snakecase `/s`
Convert string to snakecase and remove all non-word and non-digit chars.

`is error state! /s` → `is_error_state`

### Trim `/t`
Remove space-like characters from start and end of the string.

`   Well, something is happening...  /t` → `Well, something is happening...`

### Slugify `/S 'replacer'`
Remove all non-word and non-digit chars and merge words with specified *replacer* string.

`http://foo.bar/baz/brrr /S '+'` → `http+foo+bar+baz+brrr`
