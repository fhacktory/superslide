var superSlideControl = (function(shower) {
  var superSlideControl = {};

  var slideNum = 1;
  var liveSlide = 1;
  var lastSlide;
  var presentationUrl;
  var presentation;
  var live = false;
  var btnNext;
  var btnPrev;
  var btnLive;
  var owner;

  var shower;

  function setLive(state) {
    var auth = presentation.getAuth();
    live = state;
    if(state === false) {
      btnLive.classList.add('live-off');
      btnLive.classList.remove('live-on');
    } else {
      btnLive.classList.add('live-on');
      btnLive.classList.remove('live-off');
    }
  }

  function changeSlide(newSlideNum) {
    slideNum = newSlideNum;
    var auth = presentation.getAuth();
    if(auth !== null && owner === auth.uid)
      presentation.update({slideNum : slideNum});
    shower.go(slideNum - 1);
  }

  function changeSlideMan(newSlideNum) {
    setLive(false);
    changeSlide(newSlideNum);
  }

  function prevSlide() {
    if(slideNum == 1) {
      return;
    }
    changeSlideMan(slideNum - 1);
    //shower.previous();
  }

  function nextSlide() {
    if(slideNum == lastSlide) {
      return;
    }
    changeSlideMan(slideNum + 1);
    //shower.next();
  }

  function listenKeypress() {
    document.addEventListener('keydown', function(e) {
      var currentSlideNumber = shower.getCurrentSlideNumber(),
        slide = shower.slideList[ currentSlideNumber !== -1 ? currentSlideNumber : 0 ],
        slideNumber;

      switch (e.which) {
        case 116: // F5 (Shift)
          e.preventDefault();
          if (shower.isListMode()) {
            slideNumber = e.shiftKey ? slide.number : 0;

            shower.go(slideNumber);
            shower.enterSlideMode();
            shower.showPresenterNotes(slideNumber);

            slide.timing && slide.initTimer(shower);
          } else {
            shower.enterListMode();
          }
        break;

        /*case 13: // Enter
          if (shower.isListMode() && -1 !== currentSlideNumber) {
            e.preventDefault();

            shower.enterSlideMode();
            shower.showPresenterNotes(currentSlideNumber);

            slide.timing && slide.initTimer(shower);
          }
        break;*/

        case 27: // Esc
          if (shower.isSlideMode()) {
            e.preventDefault();
            shower.enterListMode();
          }
        break;

        case 33: // PgUp
        case 38: // Up
        case 37: // Left
        case 72: // H
        case 75: // K
          if (e.altKey || e.ctrlKey || e.metaKey) { return; }
          e.preventDefault();
          prevSlide();
        break;

        case 34: // PgDown
        case 40: // Down
        case 39: // Right
        case 76: // L
        case 74: // J
          if (e.altKey || e.ctrlKey || e.metaKey) { return; }
          e.preventDefault();
          nextSlide();
        break;

        case 36: // Home
          e.preventDefault();
          //shower.first();
          changeSlide(1);
        break;

        case 35: // End
          e.preventDefault();
          //shower.last();
          changeSlide(lastSlide);
        break;

        case 9: // Tab (Shift)
        case 32: // Space (Shift)
          if (e.altKey || e.ctrlKey || e.metaKey) { return; }
          e.preventDefault();
          if(e.shiftKey) {
            prevSlide();
          } else {
            nextSlide();
          }
        break;

        default:
          // Behave as usual
      }
    }, false);
  }

  function listenMenu() {
    btnNext.addEventListener('click', function (){
      nextSlide();
    });
    btnPrev.addEventListener('click', function (){
      prevSlide();
    });
    btnLive.addEventListener('click', function (){
      if(!live) {
        setLive(true);
        changeSlide(liveSlide);
      }
    });
  }

  superSlideControl.init = function(opt) {
    btnNext = document.getElementById('btn-next');
    btnPrev = document.getElementById('btn-prev');
    btnLive = document.getElementById('btn-live');

    owner = opt.ownerUid;
    slideNum = opt.slideNum;
    lastSlide = opt.lastSlide;
    presentationUrl = opt.presentationUrl;
    presentation = new Firebase(presentationUrl);
    var auth = presentation.getAuth();
    if(auth !== null && owner === auth.uid) {
      presentation.update({slideNum : slideNum});
      btnLive.style.display = "none";
    }

    setLive(true);
    listenKeypress();
    listenMenu();

    presentation.on('child_changed', function(snapshot) {
      var num = parseInt(snapshot.val(),10);
      if(isNaN(num))
        return;
      liveSlide = num;
      if(live) {
        slideNum = num;
        changeSlide(slideNum);
      }
    });

  };

  return superSlideControl;

})(shower);
