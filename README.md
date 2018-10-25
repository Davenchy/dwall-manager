# DWall Manager
simple unsplash desktop wallpaper manager


## Build From Source Code

- install dependencies

```
    npm i
    npm i -D electron
    npm i -D electron-builder
```

- for help about `electron-builder` use `build -h` or `electron-builder -h`

> note: electron-builder builds into the `/dist` directory

> note: the __below__ build commands are tested on `linux mint 18.3`

____

### Build For Windows

- Windows: `build -w dir`
- Windows (MSI): `build -w msi`
- Windows (NSIS): `build -w nsis`
- Windows (ZIP): `build -w zip`

### Build For MAC OS

- MAC OS: `build -m dir`
- MAC OS (ZIP): `build -m zip`
- MAC OS (TAR): `build -m tar.gz`

### Build For Linux

- Linux: `build -l dir`
- Linux (Debian): `build -l deb`
- Linux (AppImage): `build -l appimage`
- Linux (Snap): `build -l snap`
- Linux (ZIP): `build -l zip`
- Linux (TAR): `build -l tar.gz`

### ARCH Flags

- for x64 (default): `--x64`
- for 32bit: `--ia32`
- for amd64: `--amd64`
- and etc...

____

## Latest Changes

- fix set wallpaper as desktop wallpaper

____

## Todo

- add scripts system 5%
- add set random image as a wallpaper 0%
- add time range for each collection [to set random image as a wallpaper] 0%
- add documentaion 0%
- add load image from computer button 0%
- create icon for the app 0%
