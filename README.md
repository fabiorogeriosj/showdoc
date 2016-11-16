
# showdoc
================

Simple documentation generator for static server with, or no, live code!

[![npm Package](https://img.shields.io/npm/v/showdoc.svg?style=flat-square)](https://www.npmjs.org/package/showdoc)

## Installation
---

```
npm install showdoc -g
```

## Using
---

### Generator

By default the `showdoc` find all files in `./**/*.md` and output to `./showdoc` folder. You can change the default params when exec command or creating `showdoc.json`.  
`Showdoc` generate HTML doc only the files it contains the `parameter tags`:  

```
[showdoc_index]: (int) TO INDEX DOC MENU
[showdoc_id]: (int/string) KEY DOC ITEM TO LINK
[showdoc_group]: (int/string) KEY OF PARENT DOC

```

#### Example

**INDEX.md**:
```
# This is my index example
For this .md the showdoc not generate the HTML, because there isen't parameter tags!
```
**DOC1.md**
```
[showdoc_index]: 1
[showdoc_id]: components

# Docs components here
Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
```
**DOC2.md**
```
[showdoc_index]: 2
[showdoc_group]: components
# Doc is child of DOC1.md, because we use showdoc_group to link id parent
Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum2.
```

Let's illustrate that the above files are in the docs folder, so the command would look like:

```
showdoc generate --path ./docs
```

See the showdoc in action [here](https://github.com/fabiorogeriosj/mockapp/tree/master/docs)

[!example.png]


### License
-------

(MIT License)
