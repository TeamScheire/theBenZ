# Prefix Trie TS

Smallest possible Trie implimintation written in Typescript.

## Features
- Prefix trie for autocomplete.
- Less than 800 bytes gzipped.
- Full typescript support.
- Trie is not case sensitive.

## Installation

`npm i prefix-trie-ts`

### Browser
- Include `dist/prefixTrie.min.js` on your page with a `script` tag.

### NodeJS
```js
const Trie = requie("prefix-trie-ts").Trie;
```

### Typescript
```js
import { Trie } from "prefix-trie-ts";
```

## Usage

```js
var trie = new Trie(["scott","jeb"]);
trie.addWord("john");
console.log(trie.getPrefix("j")) // <= ["john","jeb"]
```

## Methods

### Constructor
Optionally pass in the list of strings to search.
```js
var trie = new Trie(["name1","name2"...])
```

### Add Word
Add a word to the trie.
```js
trie.addWord("name3");
```

### Remove Word
Remove a word from the trie.
```js
trie.removeWord("name3");
```

### Get All Words
List all words in the word list.
```js
trie.getWords()
```

### Get Prefix
Search the trie for all words that begin with or match a given string. Returns an array of found strings.
```js
trie.getPrefix("jo")
```

### Export Trie Index
```js
let exported = trie.getIndex();
```

### Import Trie Index
```js
trie.setIndex(indexJSON);
```
