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
let scrollHeight = 200;
let scrollInterval = 500;

window.addEventListener('load', () => {
  let siteURL = location.href;
  console.log('hitbooster window onload siteURL', siteURL);
  if (siteURL.indexOf('file:') === -1) {
    let scenario = ipcRenderer.sendSync('getScenario');
    console.log('hitbooster window onload scenario', scenario);
    if (scenario === '0') {
      console.log('hitbooster window onload scenario 0 reload');
      location.reload();
    } else if (scenario === '1') {
      var scrollSIHandler = setInterval(() => {
        if ((scrollLoop * scrollHeight) < document.body.scrollHeight) {
          window.scrollTo(0, scrollLoop * scrollHeight);
          scrollLoop++;
          console.log('hitbooster window onload scenario 1 scroll', scrollLoop);
        } else {
          window.scrollTo(0, 0);
          scrollLoop = 0;
          clearInterval(scrollSIHandler);
          console.log('hitbooster window onload scenario 1 end scroll');
          location.reload();
        }
      }, scrollInterval);
    }
  }
});