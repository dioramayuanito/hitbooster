// preload.js
// renderer process
const { ipcRenderer  } = require ("electron");

let scrollLoop = 0;
let scrollSIHandler = null;
let scrollHeight = 250;
let scrollInterval = 750;
let reloadTimeout = 2000;

let pvuvDV = 0;
let videoMaxTime = 10;
let onDVReload = false;


window.dvLoaded = function(player) {
  console.log('hitbooster dvLoaded');
  pvuvDV = ipcRenderer.sendSync('getPvuv');
  console.log('hitbooster dvLoaded pvuvDV', pvuvDV);
  videoMaxTime = ipcRenderer.sendSync('getVideoMaxTime');
  console.log('hitbooster dvLoaded videoMaxTime', videoMaxTime);
  player.on('timeupdate', function() {
    if (videoMaxTime <= player.currentTime()) {
      if (onDVReload === false) {
        onDVReload = true;
        console.log('hitbooster dvLoaded timeupdate reload');
        if (pvuvDV === '1') {
          clearStorage();
        }
        location.reload(true);
      }
    }
  });
}

/*window.onDetikVideoLoaded = function(player) {
  window.dvLoaded(player);
}*/

window.onDetikVideoParams = function() {
  console.log('hitbooster onDetikVideoParams is working');
  let params = detikVideo.scriptSrcParams();
  if ((detikVideo.vars.scriptSrcParams !== null) && (typeof detikVideo.vars.scriptSrcParams === 'object')) {
    console.log('hitbooster onDetikVideoParams is loading dvLoaded function');
    params.detikVideoLoadedCallback = window.dvLoaded;
  }
  return params;
}

function clearStorage() {
  try {
    console.log('hitbooster clearStorage');
    cookieStore.getAll().then(cookies => cookies.forEach(cookie => {
      console.log('Cookie deleted:', cookie);
      cookieStore.delete(cookie.name);
    }));
    localStorage.clear();
    sessionStorage.clear();
  } catch (ex) {
    console.log('hitbooster clearStorage got an error', ex);
  }
};

window.addEventListener('DOMContentLoaded', () => {
  if (typeof detikVideo !== 'object') {
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
      let name = require('./package.json').name;
      const element = document.getElementById('app-name')
      if (element) element.innerText = name;
      let version = require('./package.json').version;
      const element2 = document.getElementById('app-version')
      if (element2) element2.innerText = version;
    } else {
      // for siteURL
      let scenario = ipcRenderer.sendSync('getScenario');
      let pvuv = ipcRenderer.sendSync('getPvuv');
      let counter = ipcRenderer.sendSync('getCounter');
      document.title = '(' + counter.toString() + ') ' + document.title;
      //console.log('hitbooster window DOMContentLoaded scenario', scenario);
      if (scenario === '2') {
        setTimeout(() => {
          console.log('hitbooster window DOMContentLoaded scenario 2 reload');
          if (pvuv === '1') {
            clearStorage();
          }
          ipcRenderer.send('incCounter');
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
              if (pvuv === '1') {
                clearStorage();
              }
              ipcRenderer.send('incCounter');
              location.reload(true);
            }, reloadTimeout);
          }
        }, scrollInterval);
      }
    }
  }
});

window.addEventListener('load', () => {
  if (typeof detikVideo !== 'object') {
    let siteURL = location.href;
    console.log('hitbooster window load siteURL', siteURL);
    if (siteURL.indexOf('file:') === -1) {
      // for siteURL
      let scenario = ipcRenderer.sendSync('getScenario');
      let pvuv = ipcRenderer.sendSync('getPvuv');
      //console.log('hitbooster window load scenario', scenario);
      if (scenario === '0') {
        setTimeout(() => {
          console.log('hitbooster window load scenario 0 reload');
          if (pvuv === '1') {
            clearStorage();
          }
          ipcRenderer.send('incCounter');
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
              if (pvuv === '1') {
                clearStorage();
              }
              ipcRenderer.send('incCounter');
              location.reload(true);
            }, reloadTimeout);
          }
        }, scrollInterval);
      }
    }
  }
});