// Constants
// Screen definition
const Screen_Clock = 0;
const Screen_Second = 1;
const Screen_Three = 2;
const Screen_Max = Screen_Three + 1;

// Screen resolution
const Screen_Width = 240;
const Screen_Height = 240;

// Image constants
const ZealBgWidth = 64;

// App state
let _screen = Screen_Clock;

// Button handlers
setWatch(() => {
  _screen = (Screen_Max + _screen - 1) % Screen_Max;
  buzz();
  redraw();
}, BTN4, {repeat:true});

setWatch(() => {
  _screen = (_screen + 1) % Screen_Max;
  buzz();
  redraw();
}, BTN5, {repeat:true});

// Redraw the screen
function redraw() {
  // Update timer
  let time = getTime();

  // Draw background
  drawZealBackground(time);

  // Draw widgets
  Bangle.drawWidgets();

  // Flip the double buffer
  g.flip();
}

// Draw the background
function drawZealBackground(time, dt) {
  // Work out clouds scrolling
  let bgScroll = (-time * 5.5) % ZealBgWidth;

  // Draw background
  for (let i = 0; i < 5; ++i)
  {
    g.drawImage(require("Storage").read("cat_watch_zeal_bg.png"),i*ZealBgWidth + bgScroll,0);
  }

  // Draw zeal
  g.drawImage(require("Storage").read("cat_watch_zeal.img"),0,0);
}

// Buzz if not already buzzing
function buzz() {
  try {
    Bangle.buzz();
  }
  catch (e) {
  }
}

// Get the screen text
function getScreenText() {
  switch (_screen) {
    case Screen_Clock:
      return "Clock";
    case Screen_Second:
      return "Second";
    case Screen_Three:
      return "Three";
    default:
      return "unknown screen";
  }
}

// Get the time in fractional seconds
function getTime() {
  return new Date().getTime() / 1000;
}

// Startup
g.clear();
Bangle.loadWidgets();
Bangle.setLCDMode("doublebuffered");
redraw();
setInterval(redraw, 1000);