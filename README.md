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

### Available transformation commands
**p**ascalcase  
**l**owercase  
**u**ppercase  
**c**amelcase  
**k**ebapcase  
**s**nakecase  
