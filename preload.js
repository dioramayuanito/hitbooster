// preload.js
// renderer process
const { ipcRenderer  } = require ("electron");

let scrollLoop = 0;
let scrollSIHandler = null;
let scrollHeight = 250;
let scrollInterval = 750;
let reloadTimeout = 2000;

window.addEventListener('DOMContentLoaded', () => {
  let siteURL = location.href;
  console.log('hitbooster window DOMContentLoaded siteURL', siteURL);
  if (siteURL.indexOf('file:') === 0) {
    // for index.html
    const replaceText = (selector, text) => {
      const element = document.getElementById(selector)
      if (element) element.innerText = text
    }
    for (const dependency of ['chrome', 'node', 'electron']) {
      replaceText(`${dependency}-version`, process.versions[dependency])
    }
  } else {
    // for siteURL
    let scenario = ipcRenderer.sendSync('getScenario');
    //console.log('hitbooster window DOMContentLoaded scenario', scenario);
    if (scenario === '2') {
      setTimeout(() => {
        console.log('hitbooster window DOMContentLoaded scenario 2 reload');
        location.reload(true);
      }, reloadTimeout);
    } else if (scenario === '3') {
      var scrollSIHandler = setInterval(() => {
        if ((scrollLoop * scrollHeight) < document.body.scrollHeight) {
          window.scrollTo({left:0, top:scrollLoop * scrollHeight, behavior:'smooth'});
          scrollLoop++;
          console.log('hitbooster window DOMContentLoaded scenario 3 scroll', scrollLoop);
        } else {
          scrollLoop = 0;
          clearInterval(scrollSIHandler);
          window.scrollTo({left:0, top:0});
          console.log('hitbooster window DOMContentLoaded scenario 3 end scroll');
          setTimeout(() => {
            console.log('hitbooster window load scenario 3 reload');
            location.reload(true);
          }, reloadTimeout);
        }
      }, scrollInterval);
    }
  }
});

window.addEventListener('load', () => {
  let siteURL = location.href;
  console.log('hitbooster window load siteURL', siteURL);
  if (siteURL.indexOf('file:') === -1) {
    // for siteURL
    let scenario = ipcRenderer.sendSync('getScenario');
    //console.log('hitbooster window load scenario', scenario);
    if (scenario === '0') {
      setTimeout(() => {
        console.log('hitbooster window load scenario 0 reload');
        location.reload(true);
      }, reloadTimeout);
    } else if (scenario === '1') {
      var scrollSIHandler = setInterval(() => {
        if ((scrollLoop * scrollHeight) < document.body.scrollHeight) {
          window.scrollTo({left:0, top:scrollLoop * scrollHeight, behavior:'smooth'});
          scrollLoop++;
          console.log('hitbooster window load scenario 1 scroll', scrollLoop);
        } else {
          scrollLoop = 0;
          clearInterval(scrollSIHandler);
          window.scrollTo({left:0, top:0});
          console.log('hitbooster window load scenario 1 end scroll');
          setTimeout(() => {
            console.log('hitbooster window load scenario 1 reload');
            location.reload(true);
          }, reloadTimeout);
        }
      }, scrollInterval);
    }
  }
});