const wallpaper = require('wallpaper');

const path = __dirname + "/src/wallpaper.jpg";

wallpaper.set(path).then((d) => {
    console.log(d);
    console.log(path)
}).catch((e) => {
    console.error(e);
})

// wallpaper.get().then(d => {
//     console.log(d)
// })
