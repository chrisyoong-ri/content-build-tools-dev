/**
 * Weborama Smart Billboard - JS Only
 * Code to position and animate the smart billboard on different sites.
 * @author Weborama NL
 * @version 2.0.0
 * 2017-10-06
 */

/** ----------- Global Settings & Vars ----------- */

/** Smart aligned? Use site-specifications database? If false, default Alignment values will be used. */
var smartAlign = true;
/** Alignment. Accepted values: banner, top, center, bottom, left, right, #ID */
var vertical = 'banner';
var horizontal = 'center';
/** Size */
var collapsedWidth = 100;
var collapsedHeight = 40;
var expandedWidth = 970;
var expandedHeight = 250;
/** States */
var currentWidth; // set this to expandedWidth in onPreloadComplete (to get the settings of html)
var currentHeight; // set this to expandedHeight in onPreloadComplete (to get the settings of html)
var targetHeight; var targetWidth; var animationInterval;
/** Assets */
var closeImage = '//media.adrcdn.com/ad-resources/weborama_close_88x88.png';
var openImage = '//media.adrcdn.com/ad-resources/weborama_open_88x88.png';
var adHasVideo = false;
var videoPlayer; var videoElement;
/** Json */
var initLoadScript = false;
var siteObject = {};
var jsonLoaded = false;
var jsonSource = '//cntr.adrcntr.com/sitespecs/?site=';
/** Cookies */
var campaignID; var cookie;

/** ----------- Video  ----------- */

/** Add event handlers for the video player.
 *  The functions onVideoPlaying, onVideoPause and onVideoEnded are called when the matching event is triggerd.
 *  These functions are in the HTML */
function videoEventsHandler(e) {
  var ct = videoElement.currentTime;
  var dur = videoElement.duration;
  var per = Math.floor((100 / videoElement.duration) * videoElement.currentTime);
  switch (e.type) {
    case 'playing':
      // video is playing.
      onVideoPlaying();
      break;
    case 'pause':
      // video is paused.
      onVideoPause();
      break;
    case 'timeupdate':
      // video updates the currentTime.
      break;
    case 'ended':
      // video has ended.
      onVideoEnded();
      break;
    case 'volumechange':
      // video volume has changed
      // relevent variable. videoElement.muted.
      break;
    default: console.warn('Weborama: Received no valid event');
  }
}

/** Play the video */
function videoPlay() {
  if (!adHasVideo) {
    return;
  }
  if (videoElement.ended) {
    videoElement.currentTime = 0;
  }
  videoElement.play();
}

/** Pause the video */
function videoPause() {
  if (!adHasVideo) {
    return;
  }
  videoElement.pause();
}

/** Replay the video */
function videoReplay() {
  if (!adHasVideo) {
    return;
  }
  videoElement.currentTime = 0;
  videoElement.play();
}

/** Mute the video */
function videoMute() {
  if (!adHasVideo) {
    return;
  }
  if (videoElement.muted) {
    videoElement.muted = false;
  } else {
    videoElement.muted = true;
  }
}

/** Add event listeners for the video player */
function addVideoEventListeners() {
  videoElement.addEventListener('playing', videoEventsHandler);
  videoElement.addEventListener('pause', videoEventsHandler);
  videoElement.addEventListener('timeupdate', videoEventsHandler);
  videoElement.addEventListener('ended', videoEventsHandler);
  videoElement.addEventListener('volumechange', videoEventsHandler);
}

/** createVideoPlayer is called when the variable adHasVideo is set to true in the HTML.
 *  The settings videoWidth, videoHeight, videoPoster and videoSource should be set in the HTML */
function createVideoPlayer() {
  var settings = {
    width: videoWidth,
    height: videoHeight,
    // used for event names. Only alphanumerical characters and underscores are allowed. Defaults to 'video'.
    reference: 'video',
    prependTo: document.getElementById('video-container'), // alternatively, use appendTo
    controls: 'auto', // true, false, 'auto', 'play', 'mute', 'playmute'
    click: 'default', // exit click on the video
    poster: videoPoster,
    loop: false, // defaults to false
    autoplay: false, // defaults to false
    muted: false, // it's recommended to omit this parameter
    videoFiles: [{
      src: videoSource,
      type: 'video/mp4'
    }]
  };

  videoPlayer = new screenad.video.VideoPlayer(settings);
  videoElement = videoPlayer.getVideoElement();
  setTimeout(addVideoEventListeners, 200);
}

/** ----------- Smart Billboard  ----------- */

/** Set the height of banner or the pushdown div.
 *  If cookies are enabled and the tergetHeight equals the collapsedHeight
 *  (the ad should open in collapsed view),
 *  We won't resize the banner or pushdown div larger then necessary */
function setPushdownHeight() {
  if (cookie === 1 && targetHeight === collapsedHeight) {
    currentHeight = collapsedHeight;
    currentWidth = collapsedWidth;
  }
  if (vertical !== 'banner') {
    screenad.executeScript('document.getElementById(\'weborama_pushdown_div\').style.height = \'' +
      currentHeight + 'px\'');
  } else {
    screenad.resize(screenad.bannerwidth, currentHeight, 'banner');
  }
  screenad.position();
}

/** For a smoother flow, we animate the expanded to collapsed view
 *  When the animation is done, we call onCollapseComplete or onExpandComplete that are located in the HTML */
function animatePushdown() {
  if (targetHeight > currentHeight) {
    currentHeight += Math.ceil((targetHeight - currentHeight) / 3);
  } else {
    currentHeight -= Math.ceil((currentHeight - targetHeight) / 2);
  }
  if (targetWidth > currentWidth) {
    currentWidth += Math.ceil((targetWidth - currentWidth) / 3);
  } else {
    currentWidth -= Math.ceil((currentWidth - targetWidth) / 2);
  }
  if (currentHeight === targetHeight && currentWidth === targetWidth) {
    // Finished Animating
    clearInterval(animationInterval);
    if (!screenad.isShowing) {
      screenad.show();
    }
    if (currentHeight === collapsedHeight) {
      screenad.setClip(expandedWidth - collapsedWidth, 'auto', 'auto', collapsedHeight);
      setPushdownHeight();
      try { onCollapseComplete(); } catch (e) { console.error(e, 'Weborama: "onCollapseComplete" handler not found.'); }
    } else {
      screenad.setClip('auto', 'auto', 'auto', 'auto');
      setPushdownHeight();
      try { onExpandComplete(); } catch (e) { console.error(e, 'Weborama: "onExpandComplete" handler not found.'); }
    }
  } else {
    // Still Animating
    screenad.setClip(expandedWidth - currentWidth, 'auto', 'auto', currentHeight);
    setPushdownHeight();
  }
}

/** The interval to create the smooth animation from animatePushdown */
function startPushAnimation() {
  clearInterval(animationInterval);
  animationInterval = setInterval(animatePushdown, 60);
}

/** collapseAd is called when the user clicks on the collapse Button
 *  the onCollapseStart function is also called which is located in the HTML.
 *  The video is paused if necessary and the collapse button gets toggled to the openImage.
 *  The targetHeight en targetWidth is changed for the animation in startPushAnimation.
 *  A cookie is set if the function exists in the parent page */
function collapseAd() {
  try { onCollapseStart(); } catch (e) { console.error(e, 'Weborama: "onCollapseStart" handler not found.'); }
  if (adHasVideo) {
    videoPause();
  }
  targetHeight = collapsedHeight;
  targetWidth = collapsedWidth;
  startPushAnimation();
  if (campaignID !== '') {
    screenad.executeScript('if (typeof WeboSetCookie == \'function\') { WeboSetCookie(1,24); }');
  }
}

/** expandAd is called when the user clicks on the open Button
 *  the onExpandStart function is also called which is located in the HTML.
 *  The collapse button gets toggled to the closeImage.
 *  The targetHeight en targetWidth is changed for the animation in startPushAnimation.
 *  A cookie is set if the function exists in the parent page */
function expandAd() {
  try { onExpandStart(); } catch (e) { console.error(e, 'Weborama: "onExpandStart" handler not found.'); }
  targetHeight = expandedHeight;
  targetWidth = expandedWidth;
  startPushAnimation();
  if (campaignID !== '') {
    screenad.executeScript('if (typeof WeboSetCookie == \'function\') { WeboSetCookie(0,24); }');
  }
}

/** Change view depending on cookie */
function getCookie(cc) {
  cookie = cc;
  if (cookie === 1) {
    collapseAd();
  } else {
    expandAd();
  }
}

/** After functions are added to the parent page, call WeboGetCookie to check if a cookie a available */
function cookieCreated() {
  screenad.executeScript('WeboGetCookie();', getCookie);
}

/** Start writing code (function in the parent page) to write and get cookies */
function handleCookie() {
  var insertScript;
  if (!initLoadScript) {
    initLoadScript = true;
    insertScript = 'var ele = document.createElement(\'script\');' +
    'var oHead = document.getElementsByTagName(\'head\')[0];' +
    'ele.type = \'text/javascript\';' +
    'var scr = \'function WeboSetCookie (value, cookieDuration) {' +
      'adrCap = parseInt(value);' +
      'adrID = ' + campaignID + ';' +
      'var today = new Date();' +
      'var year = today.getYear();' +
      'if (year < 2000) year = year + 1900;' +
      'document.cookie = adrID +\"=\"+ adrCap;' +
      'expires = new Date(year,today.getMonth(),today.getDate() + cookieDuration).toGMTString()+\";path=/;\";' +
      '}' +
      'function WeboGetCookie() {' +
        'adrID = ' + campaignID + ';' +
        'adrCap = document.cookie.match(\"(^|;) ?' + campaignID + '=([^;]*)(;|$)\");' +
        'adrCap = (adrCap)?parseInt(unescape(adrCap[2])):0;' +
        'return adrCap;' +
      '}\';' +
      'ele.text = scr;' +
      'oHead.appendChild(ele);';
    screenad.executeScript(insertScript, cookieCreated);
  }
}

/** Check if we are in the previewer and if traffic has set the cookie variable
 *  If we are live with no cookie we just set the pushdown height and show the ad */
function cookieCheck() {
  var url = (window.location !== window.parent.location) ? document.referrer : document.location;
  if (!screenad.isPreviewer && screenad.vars.scrcampaignid !== undefined && screenad.vars.scrcookie === 'true') {
    // Live with cookie
    campaignID = screenad.vars.scrcampaignid;
    handleCookie();
  } else if (screenad.isPreviewer && (url.indexOf('adrime_watcher') > -1) || (url.indexOf('webo_watcher') > -1)) {
    // Preview for weborama to check if the cookies work
    campaignID = '12345';
    handleCookie();
  } else {
    // Previewing in the previewer or Live no cookie
    setPushdownHeight();
    if (!screenad.isShowing) {
      screenad.show();
    }
  }
}

/** When the ad is shown (screenad.show) call onAdStart which is in the HTML */
function onScreenadShow() {
  screenad.removeEventListener(screenad.SHOW, onScreenadShow);
  try { onAdStart(); } catch (e) { console.error(e, 'Weborama: "onAdStar" handler not found.'); }
}

/** Add the listeners for the ad, controling the collapse/expand button */
function addEventListeners() {
  screenad.addEventListener(screenad.SHOW, onScreenadShow);
  if (document.getElementById('close-open-button')) {
    document.getElementById('close-open-button').addEventListener('click', function handleOpenClose() {
      if (currentHeight === expandedHeight) {
        collapseAd();
        document.getElementById('close-open-button')
          .setAttribute('src', '//media.adrcdn.com/ad-resources/weborama_open_88x88.png');
      } else if (currentHeight === collapsedHeight) {
        expandAd();
        document.getElementById('close-open-button')
          .setAttribute('src', '//media.adrcdn.com/ad-resources/weborama_close_88x88.png');
      }
    });
  }
}

/** Align the ad depending on the sitespecs */
function alignAd() {
  screenad.setSticky(false);
  if (siteObject.zindex !== undefined && siteObject.zindex.length > 0) {
    screenad.setZIndex(siteObject.zindex);
  }
  screenad.setAlignment(horizontal, vertical);
  screenad.setOffset(isNaN(siteObject.offsetx) ? 0 : siteObject.offsetx, isNaN(siteObject.offsety)
    ? 0 : siteObject.offsety);
  screenad.position();

  addEventListeners();
  if (adHasVideo) {
    createVideoPlayer();
  }
  cookieCheck();
}

/** Apply retrieved sitespecs data, prepare a pushdown div */
function processSiteSpecs() {
  var insertScript;
  var insertLine;
  var cleanID;
  // If no siteObject data required or obtained, no overwritting
  if (siteObject.halign !== '' && siteObject.halign !== undefined) {
    horizontal = siteObject.halign;
  }
  if (siteObject.valign !== '' && siteObject.valign !== undefined) {
    vertical = siteObject.valign;
  }
  // If not vertically aligned with banner
  if (vertical !== 'banner') {
    // Insert "weborama_pushdown_div" (not in-page, no billoard ad-slot available)
    switch (vertical) {
      case 'top':
        insertLine = 'document.getElementsByTagName(\'body\')[0].insertBefore(' +
          'scr_tmpID, document.getElementsByTagName(\'body\')[0].childNodes[0]);';
        break;
      case 'content':
        insertLine = 'var _wrap = document.getElementById(\'' + siteObject.contentId + '\').parentNode;' +
          ' _wrap.insertBefore(scr_tmpID, document.getElementById(\'' + siteObject.contentId + '\'));';
        break;
      case 'header':
        insertLine = 'var _wrap = document.getElementById(\'' + siteObject.headerId + '\').parentNode;' +
        ' _wrap.insertBefore(scr_tmpID, document.getElementById(\'' + siteObject.headerId + '\'));';
        break;
      case 'wrapper':
        insertLine = 'var _wrap = document.getElementById(\'' + siteObject.wrapperId + '\').parentNode;' +
        ' _wrap.insertBefore(scr_tmpID, document.getElementById(\'' + siteObject.wrapperId + '\'));';
        break;
      default:
        if (vertical.indexOf('#') !== -1) {
          // Align to specified ID (if not using wrapper, header or content id)
          cleanID = vertical.replace('#', '');
          insertLine = 'var _wrap = document.getElementById(\'' + cleanID + '\').parentNode;' +
            ' _wrap.insertBefore(scr_tmpID, document.getElementById(\'' + cleanID + '\'));';
        } else {
          // On top of website as fallback plan
          insertLine = 'document.getElementsByTagName(\'body\')[0].insertBefore(' +
            'scr_tmpID, document.getElementsByTagName(\'body\')[0].childNodes[0]);';
        }
        break;
    }
    // Correct possible entities
    if (siteObject.extrajs !== '' && siteObject.extrajs !== undefined) {
      if (siteObject.extrajs.indexOf('&lt;') !== -1) {
        siteObject.extrajs = siteObject.extrajs.replace(/&lt;/g, '<');
        siteObject.extrajs = siteObject.extrajs.replace(/&gt;/g, '>');
      }
      insertLine += 'try{ ' + siteObject.extrajs + ' }catch(e){}';
    }
    // Insert 'weborama_pushdown_div' script
    insertScript = 'var divID = \'weborama_pushdown_div\';' +
      'scr_tmpID = document.createElement(\'div\');' +
      'scr_tmpID.style.margin       = \'4px\';' +
      'scr_tmpID.style.padding      = \'0px\';' +
      'scr_tmpID.style.clear        = \'both\';' +
      'scr_tmpID.id                 = divID ;' +
      insertLine;
    screenad.executeScript(insertScript);
    // We use horizontal align (an ID) to insert 'weborama_pushdown_div', horizontal align: "#weborama_pushdown_div"
    vertical = '#weborama_pushdown_div';

  // Vertically aligned with banner (default)
  } else {
    // Correct possible entities
    try {
      if (siteObject.extrajs !== '' && siteObject.extrajs !== undefined) {
        if (siteObject.extrajs.indexOf('&lt;') !== -1) {
          siteObject.extrajs = siteObject.extrajs.replace(/&lt;/g, '<');
          siteObject.extrajs = siteObject.extrajs.replace(/&gt;/g, '>');
        }
        // Note: Template specific variations apply.
        // You may want to run this "executeScript" line later on in another context.
        screenad.executeScript(siteObject.extrajs);
      }
    } catch (e) {
      console.error('Weborama: siteObject is empty or undefined');
    }
  }
  // Timeout to run extrajs code on the parent site.
  // ToDo: should remove timeout, add in executeScript return and in catch maybe?
  setTimeout(alignAd, 200);
}

/** Receives current location and loads site-specs data */
function getSiteSpecs(location) {
  var json; var key;
  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType('application/json');
  xobj.open('GET', ('//cntr.adrcntr.com/sitespecs/?site=' + location), true);
  xobj.onreadystatechange = function onReadyStateChange() {
    if (xobj.readyState === 4 && xobj.status === 200) {
      json = JSON.parse(xobj.responseText);
      for (key in json.site) {
        if (siteObject[key]) {
          siteObject[key] = json.site[key];
        }
      }
      jsonLoaded = true;
      processSiteSpecs();
    }
  };
  xobj.onerror = function onError(e) {
    console.error('Weborama: JSON Load Error: ', e.status);
    screenad.show();
    addEventListeners();
    if (adHasVideo) {
      createVideoPlayer();
    }
  };
  xobj.send(null);
}

/** Traffic can set the var scrhasvideo, it will override the setting in the html */
function setVarsFromTraffic() {
  if (screenad.vars.scrhasvideo !== undefined) {
    adHasVideo = screenad.vars.scrhasvideo;
  }
}

/** Initialize the position of the ad (layer) and hide it */
function initAlignment() {
  screenad.setAlignment('center', 'banner');
  screenad.setSize(expandedWidth, expandedHeight);
  screenad.hide();
  screenad.position();
}

/** ----------- Initial -----------
 *  onDocumentReady is a function in the HTML to indicate that document is loaded,
 *  this does not mean that the ad is ready.
 *  initAlignment, will start to initialize the position of the ad (layer) and hide it
 *  setVarsFromTraffic, will (re)set if the ad has video (scrhasvideo from traffic)
 *  executeScript getSiteSpecs, will get the url of the site the ad is in
 *  and call the accompanying specifications in json
 */
function initBillboard() {
  currentWidth = expandedWidth;
  currentHeight = expandedHeight;
  initAlignment();
  setVarsFromTraffic();
  if (smartAlign) {
    screenad.executeScript('document.location', getSiteSpecs);
  } else {
    processSiteSpecs();
  }
}

screenad.onPreloadComplete = function onPreloadComplete() {
  initBillboard();
  try { onDocumentReady(); } catch (e) { console.error(e, '"onDocumentReady" handler not found.'); }
};
