# virtual-keyboard

A simple virtual keyboard built with Vanilla JS and SASS. [Demo](https://codepen.io/AmraniCh/full/OJXwxxy).

## Usage

First include the distribution files in the `./dist` folder into your HTML page. 
Then initialize the keyboard with your preferences using the `Vkeyboard` object.

```javascript
VKeyboard({
    lang: 'en',
    charsOnly: false,
    caps: false
}).init();
```

## Supported languages

* English
* French
* Arabic

## Supported options

|        Option       |     Description 
|---------------------|------------------
| lang                | The keyboard typing language.
| charsOnly           | Hide the keyboard numbers.
| caps                | Enable the caps lock.

