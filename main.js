// Code found in https://github.com/electron/electron/issues/20459

const electron = require('electron');

const desktopCapturer = electron.desktopCapturer;
const remote = electron.remote;
const electronScreen = electron.screen;

const fs = require('fs');
const path = require('path');
const os = require('os');

var screenShotPath = '';

let getScreenCapture = function() {
    const timeoutScheduled = Date.now();
    const thumbSize = determineScreenshot();
    // console.log(thumbSize.height);
    // console.log(thumbSize.width);
    let options = { types: ['screen'], thumbnailSize: thumbSize };
    
    // console.log(desktopCapturer)
    desktopCapturer.getSources(options).then( (sources) => {
        sources.forEach(function (source) {
            screenShotPath = path.join(__dirname, '/screenshots/screenshot_' + timeoutScheduled + '.jpeg');
            console.log(screenShotPath);
            fs.writeFile(screenShotPath, source.thumbnail.toPNG(), function (err) {
                if (err) return console.log(err.message);
            });
        });
        console.log('Captured')
    }).catch((e) => {
        console.log(e)
    })
}

setInterval(
    function () {
        getScreenCapture();
    },
    60000
);

function determineScreenshot() {
    const screensize = electronScreen.getPrimaryDisplay().workAreaSize;
    const maxDimension = Math.max(screensize.width, screensize.height);
    // console.log(maxDimension);
    
    return {
        width: maxDimension,
        height: maxDimension
    }
}
