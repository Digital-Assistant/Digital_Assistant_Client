# Jaro-Winkler in Typescript

The Jaro Winkler algorithm implementation 
- Used to find the similarity of the strings
- This package include Jaro and Jaro Winlker algorithm
- Two  algorithms can be called separately 

## Install

```bash
npm install -S jaro-winkler-typescript
```

## Usage

```
import {jaro, jaroWinkler} from "jaro-winkler-typescript";

jaro('ab', 'AB');
// 0

jaroWinkler('ab', 'AB');
// 0

// Non-case Sensitive

jaro('AB', 'ab', {caseSensitive : false});
// 1

jaroWinkler('ab', 'AB', {caseSensitive : false});
// 1
```