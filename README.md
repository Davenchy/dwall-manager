# DWall Manager V1.1.0
Simple unsplash desktop wallpaper manager

[Download] (https://github.com/Davenchy/dwall_manager/releases)

## Build From Source Code

- clone the project

`git clone https://github.com/Davenchy/dwall_manager.git`

- then install dependencies

```
	npm install // install dependencies
	npm install electron-builder -g // install electron packager for packaging
	npm run webpack // build app logic from '/src' into '/app'
```

for help about `electron-builder` use `build -h` or `electron-builder -h`

> note: `electron-builder` builds into the `/dist` directory

> note: the __below__ build commands are tested on `linux mint 18.3`

____

### Build For Windows

- Windows: `build -w`

### Build For MAC OS

- MAC OS: `build -m`

### Build For Linux

- Linux: `build -l`

### Flags

- for x64 (default): `--x64`
- for 32bit: `--ia32`
- for amd64: `--amd64`
- and etc...
