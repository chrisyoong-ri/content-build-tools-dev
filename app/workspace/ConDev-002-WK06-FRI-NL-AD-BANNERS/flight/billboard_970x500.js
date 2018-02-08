/**
 * Weborama Smart Billboard
 * Code to position and animate the smart billboard on different sites.
 * @author Weborama NL
 * @version 1.0.3
 * 2016-04-19
 */

/** ----------- Settings & Global vars ----------- */

/** Alignment */
var vertical = 'top', horizontal = 'center';
/** Size */
var collapsedWidth = 100, collapsedHeight = 40,
  expandedWidth = 970, expandedHeight = 500;
/** States */
var currentWidth = expandedWidth, currentHeight = expandedHeight,
  targetHeight, targetWidth, animationInterval;
/** Assets */
var closeImage = '//media.adrcdn.com/ad-resources/weborama_close_88x88.png',
  openImage = '//media.adrcdn.com/ad-resources/weborama_open_88x88.png',
  adHasVideo = false, videoPlayer, videoElement;
/** Json */
var initLoadScript = false, siteObject = {}, jsonLoaded = false,
  jsonSource = '//cntr.adrcntr.com/sitespecs/?site=';
/** Cookies */
var campaignID, cookie;

/** ----------- Control Ad ----------- */
/** Initialize the position of the ad (layer) and hide it */
function initAlignment() {
  screenad.setAlignment('center', 'banner');
  screenad.setSize(970, 500);
  screenad.hide();
  screenad.position();
}

/** Traffic can set the var scrhasvideo, it will override the setting in the html */
function setVarsFromTraffic() {
  if (screenad.vars.scrhasvideo !== undefined) {
    adHasVideo = screenad.vars.scrhasvideo;
  }
}

/** When the ad is shown (screenad.show) call onAdStart which is in the HTML */
function onScreenadShow() {
  screenad.removeEventListener(screenad.SHOW, onScreenadShow);
  onAdStart();
}

/** Add the listeners for the ad, controling the collapse/expand button */
function addEventListeners() {
  screenad.addEventListener(screenad.SHOW, onScreenadShow);

  $('#collapseButton').on('click', function() {
    if (currentHeight == expandedHeight) {
      collapseAd();
    } else if (currentHeight == collapsedHeight) {
      expandAd();
    }
  });
}

/** ----------- Resize & Animate Ad ----------- */
/** Set the height of banner or the pushdown div.
 *  If cookies are enabled and the tergetHeight equals the collapsedHeight
 *  (the ad should open in collapsed view),
 *  We won't resize the banner or pushdown div larger then necessary */
function setPushdownHeight() {
  if (cookie == 1 && targetHeight == collapsedHeight) {
    currentHeight = collapsedHeight;
    currentWidth = collapsedWidth;
  }
  if (vertical != 'banner') {
    screenad.executeScript('document.getElementById(\'weborama_pushdown_div\').style.height = \'' + currentHeight + 'px\'');
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
  if (currentHeight == targetHeight && currentWidth == targetWidth) {
    // Finished Animating
    clearInterval(animationInterval);
    if (!screenad.isShowing) {
      screenad.show();
    }
    if (currentHeight == collapsedHeight) {
      screenad.setClip(expandedWidth - collapsedWidth, 'auto', 'auto', collapsedHeight);
      setPushdownHeight();
      onCollapseComplete();
    } else {
      screenad.setClip('auto', 'auto', 'auto', 'auto');
      setPushdownHeight();
      onExpandComplete();
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
  onCollapseStart();
  if (adHasVideo) {
    videoPause();
  }
  $('#collapseButton').attr('src', openImage);
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
  onExpandStart();
  $('#collapseButton').attr('src', closeImage);
  targetHeight = expandedHeight;
  targetWidth = expandedWidth;
  startPushAnimation();
  if (campaignID !== '') {
    screenad.executeScript('if (typeof WeboSetCookie == \'function\') { WeboSetCookie(0,24); }');
  }
}

/** ----------- Cookies ----------- */
/** Change view depending on cookie */
function getCookie(cc) {
  cookie = cc;
  if (cookie == 1) {
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
  if (!initLoadScript) {
    initLoadScript = true;
    var insertScript = 'var ele = document.createElement(\'script\');' +
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
  var url = (window.location != window.parent.location) ? document.referrer : document.location;
  if (!screenad.isPreviewer && screenad.vars.scrcampaignid !== undefined && screenad.vars.scrcookie == 'true') {
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

/** Align the ad depending on the sitespecs */
function alignAd() {
  screenad.setSticky(false);
  if (siteObject.zindex !== undefined && siteObject.zindex.length > 0) {
    screenad.setZIndex(siteObject.zindex);
  }
  screenad.setAlignment(horizontal, vertical);
  screenad.setOffset(siteObject.offsetx, siteObject.offsety);
  screenad.position();
  addEventListeners();
  if (adHasVideo) {
    createVideoPlayer();
  }
  cookieCheck();
}

/** Apply retrieved sitespecs data, prepare a pushdown div */
function processSiteSpecs() {
  horizontal = siteObject.halign;
  vertical = siteObject.valign;

  if (vertical != 'banner') {
    // Insert "weborama_pushdown_div" (not in-page, no billoard ad-slot available)
    var insertScript;
    var insertLine;
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
        if (vertical.indexOf('#') != -1) {
          //Align to specified ID (if not using wrapper, header or content id)
          var cleanID = vertical.replace('#', '');
          insertLine = 'var _wrap = document.getElementById(\'' + cleanID + '\').parentNode;' +
            ' _wrap.insertBefore(scr_tmpID, document.getElementById(\'' + cleanID + '\'));';
        } else {
          //On top of website as fallback plan
          insertLine = 'document.getElementsByTagName(\'body\')[0].insertBefore(' +
            'scr_tmpID, document.getElementsByTagName(\'body\')[0].childNodes[0]);';
        }
        break;
    }
    // Correct possible entities
    if (siteObject.extrajs !== '' && siteObject.extrajs !== undefined) {
      if (siteObject.extrajs.indexOf('&lt;') != -1) {
        siteObject.extrajs = siteObject.extrajs.replace(/&lt;/g, '<');
        siteObject.extrajs = siteObject.extrajs.replace(/&gt;/g, '>');
      }
      insertLine += 'try{ ' + siteObject.extrajs + ' }catch(e){}';
    }
    //Insert 'weborama_pushdown_div' script
    insertScript = 'var divID = \'weborama_pushdown_div\';' +
      'scr_tmpID = document.createElement(\'div\');' +
      'scr_tmpID.style.margin       = \'4px\';' +
      'scr_tmpID.style.padding      = \'0px\';' +
      'scr_tmpID.style.clear        = \'both\';' +
      'scr_tmpID.id                 = divID ;' +
      insertLine;
    screenad.executeScript(insertScript);
    //We use horizontal align (an ID) to insert 'weborama_pushdown_div', horizontal align: "#weborama_pushdown_div"
    vertical = '#weborama_pushdown_div';

  } else {
    // Correct possible entities
    if (siteObject.extrajs !== '' && siteObject.extrajs !== undefined) {
      if (siteObject.extrajs.indexOf('&lt;') != -1) {
        siteObject.extrajs = siteObject.extrajs.replace(/&lt;/g, '<');
        siteObject.extrajs = siteObject.extrajs.replace(/&gt;/g, '>');
      }
      // Note: Template specific variations apply.
      // You may want to run this "executeScript" line later on in another context.
      screenad.executeScript(siteObject.extrajs);
    }
  }
  //Timeout to run extrajs code on the parent site.
  setTimeout(alignAd, 200);
}

/** Get the site specs from cntr.adrcntr.com/sitespecs/?site=
 *  on succes, processSiteSpecs;
 *  on error, log the error and just show the ad center banner as indicated in initAlignment.
 *  Add the listeners and create video where necessary
 */
function getSiteSpecs(loc) {
  jQuery.ajax({
    type: 'GET',
    url: jsonSource + loc,
    dataType: 'json',
    success: function(json) {
      // Retrieve all site properties
      for (var key in json.site) {
        siteObject[key] = json.site[key];
      }
      jsonLoaded = true;
      processSiteSpecs();
    },
    error: function(e) {
      // show the ad, center banner
      console.log('Error: ' + e);
      screenad.show();
      addEventListeners();
      if (adHasVideo) {
        createVideoPlayer();
      }
    }
  });
}

/** ----------- Video  ----------- */
/** createVideoPlayer is called when the variable adHasVideo is set to true in the HTML.
 *  The settings videoWidth, videoHeight, videoPoster and videoSource should be set in the HTML */
function createVideoPlayer() {
  var settings = {
    width: videoWidth,
    height: videoHeight,
    reference: 'video', // used for event names. Only alphanumerical characters and underscores are allowed. Defaults to 'video'.
    prependTo: document.getElementById('videoContainer'), // alternatively, use appendTo
    controls: 'custom', // true, false, 'custom', 'play', 'mute', 'playmute'
    customControlsClass: 'light', // 'light', 'dark', 'YOUR_CLASSNAME_HERE'
    click: 'default', // exit click on the video
    poster: videoPoster,
    loop: false, // defaults to false
    autoplay: false, // defaults to false (only works on desktop)
    muted: false, // it's recommended to omit this parameter *
    videoFiles: [{
      'src': videoSource,
      'type': 'video/mp4'
    }]
  };

  videoPlayer = new screenad.video.VideoPlayer(settings);
  videoElement = videoPlayer.getVideoElement();
  setTimeout(addVideoEventListeners, 200);
}

/** Add event listeners for the video player */
function addVideoEventListeners() {
  videoElement.addEventListener('playing', videoEventsHandler);
  videoElement.addEventListener('pause', videoEventsHandler);
  videoElement.addEventListener('timeupdate', videoEventsHandler);
  videoElement.addEventListener('ended', videoEventsHandler);
  videoElement.addEventListener('volumechange', videoEventsHandler);
}

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

/** ----------- Initial -----------
 *  onDocumentReady is a function in the HTML to indicate that document is loaded, this does not mean that the ad is ready.
 *  initAlignment, will start to initialize the position of the ad (layer) and hide it
 *  setVarsFromTraffic, will (re)set if the ad has video (scrhasvideo from traffic)
 *  executeScript getSiteSpecs, will get the url of the site the ad is in and call the accompanying specifications in json
 */
screenad.onPreloadComplete = function() {
  onDocumentReady();
  initAlignment();
  setVarsFromTraffic();
  screenad.executeScript('document.location', getSiteSpecs);
};

// jscs:disable
/* jshint ignore:start */
/** ----------- IE Fix for external loading ----------- */
window.XDomainRequest&&jQuery.ajaxTransport(function(o){if(o.crossDomain&&o.async){o.timeout&&(o.xdrTimeout=o.timeout,delete o.timeout);
var n;return{send:function(t,e){function r(o,t,r,u){n.onload=n.onerror=n.ontimeout=jQuery.noop,n=void 0,e(o,t,r,u)}n=new XDomainRequest,n.onload=function(){r(200,"OK",{text:n.responseText},"Content-Type: "+n.contentType)},n.onerror=function(){r(404,"Not Found")},n.onprogress=jQuery.noop,n.ontimeout=function(){r(0,"timeout")},n.timeout=o.xdrTimeout||Number.MAX_VALUE,n.open(o.type,o.url),n.send(o.hasContent&&o.data||null)},abort:function(){n&&(n.onerror=jQuery.noop,n.abort())}}}});
