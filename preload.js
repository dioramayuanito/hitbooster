// preload.js
// renderer process
const { ipcRenderer  } = require ("electron");

// All the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
  let siteURL = location.href;
  console.log('hitbooster window DOMContentLoaded siteURL', siteURL);
  if (siteURL.indexOf('file:') === 0) {
    const replaceText = (selector, text) => {
      const element = document.getElementById(selector)
      if (element) element.innerText = text
    }

    for (const dependency of ['chrome', 'node', 'electron']) {
      replaceText(`${dependency}-version`, process.versions[dependency])
    }
  }
});

let scrollLoop = 0;
let scrollSIHandler = null;

window.addEventListener('load', () => {
  let siteURL = location.href;
  console.log('hitbooster window onload siteURL', siteURL);
  if (siteURL.indexOf('file:') === -1) {
    let scenario = ipcRenderer.sendSync('getScenario');
    console.log('hitbooster window onload scenario', scenario);
    if (scenario === '0') {
      location.reload();
    } else if (scenario === '1') {
      var scrollSIHandler = setInterval(() => {
        if ((scrollLoop * 1000) > document.body.scrollHeight) {
          window.scrollTo(scrollLoop * 1000, document.body.scrollHeight);
          scrollLoop++;
        } else {
          scrollLoop = 0;
          clearInterval(scrollSIHandler);
          location.reload();
        }
      }, 500);
    }
  }
});