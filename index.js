(function () {
  var clickTimeout = 1000; // msec
  var scrollTimeout = 1000; // msec
  var addedUsers = JSON.parse( localStorage.getItem('ln.added-users') ) || {};
  var needStop = false;
  var scrollTimes = 0;

  function startScrollPhose(doneCb) {
    scrollAndCheck(scrollTimeout, false, doneCb);
  }

  function scrollAndCheck(msec, prevCheck, cb) {
    var prevScrollHeight = getScrollHeight();

    if (needStop) {
      return;
    }

    scrollDown();
    setTimeout(function () {
      if ( prevScrollHeight < getScrollHeight() ) {
        scrollTimes++;
        scrollAndCheck(scrollTimeout, false, cb);
      } else {
        if (prevCheck) {
          cb();
        } else {
          scrollAndCheck(scrollTimeout * 2, true, cb)
        }
      }
    }, msec);
  }

  function getScrollHeight() {
    return document.body.scrollHeight;
  }

  function connectAllOnTheScreen(done) {
    var cards = jQuery('.card-wrapper');

    affecedOnThePage = 0;

    nextClick(cards, 0, done);
  }

  function nextClick(cards, i, done) {
    var card = cards[i];

    if (i < cards.length) {
      click(card, nextClick.bind(null, cards, i + 1, done) );
    } else {
      done();
    }
  }

  function click(card, next) {
    var name = card.querySelector('.name');
    var btn = card.querySelector('.bt-request-buffed');
    var link = card.querySelector('a');
    var id = getParameterByName('id', link.href);

    // console.log('addedUsers[id] = ' + addedUsers[id]);
    if (!addedUsers[id]) {
      setTimeout(function() {

        if (name) {
          addedUsers[id] = name.innerText;
          console.log('Request to ' + name.innerText);
        }
        if (btn) {
          jQuery(btn).trigger('click');
        }

        if (needStop) {
          return;
        } else {
          next();
        }
      }, clickTimeout);
    } else {
      next();
    }
  }

  function done() {
    localStorage.setItem('ln.added-users', JSON.stringify(addedUsers) );
      console.log('Page done!');
      console.log('Next page in ' + scrollTimeout / 1000 + ' sec.');
    // if (affecedOnThePage === 0) {
    //   scrollDown();
    // }
    //  else {
    //   console.log('Done!');
    // }
    setTimeout(function () {
      connectAllOnTheScreen(done);
    }, scrollTimeout);
  }

  function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  function scrollDown() {
    window.scrollTo(0,document.body.scrollHeight);
  }

  window.clearLS = function () {
    localStorage.setItem('ln.added-users', null);
  }

  window.start = function () {
    needStop = false;

    startScrollPhose(function () {
      console.log('Scroll phase done!');
      console.log('Scroll counter: ' + scrollTimes);

      console.log('Starting clicking...');
      connectAllOnTheScreen(done);
    });
    // connectAllOnTheScreen(done);
  }

  window.stop = function () {
    needStop = true;
  }
})();