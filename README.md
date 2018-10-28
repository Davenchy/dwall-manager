# DWall Manager V1.1.0
simple unsplash desktop wallpaper manager

- DWall Manager V2 is comming soon.

## Build From Source Code

- clone the project

`git clone https://github.com/Davenchy/dwall_manager.git`

- then install dependencies

```
    npm i
    npm i -D electron
    npm i -D electron-builder
```

for help about `electron-builder` use `build -h` or `electron-builder -h`

> note: `electron-builder` builds into the `/dist` directory

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

- New Dialog System
- Added Dialog Builder
- Added Alert Dialog
- Added Multi Dialog System
- Added About button
- Redirect all links to browser
- fix unsplash user copyrights bug

____

## Todo

- Get Ready For Dwall Manager Full Version 2 10%

----
- New IO System 0%
- New Settings System 0%
- Image Manager 0%
- Scripts Manager 0%
- Collections Manager 0%
- Caches Manager 0%
- Update Download Manager 0%

----

- create set random image as a wallpaper script 0%
- create documentaion 0%
- add load image from computer button 0%
- create icon for the app 0%
