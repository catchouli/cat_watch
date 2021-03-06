// Constants
// Screen definition
const Screen_Clock = 0;
const Screen_Second = 1;
const Screen_Third = 2;
const Screen_Max = Screen_Third + 1;

// Screen resolution
const Screen_Width = 240;
const Screen_Height = 160;

// Image constants
const ZealBgWidth = 64;

// The months
const Months = [ "January", "February", "March", "April", "May",
                 "June", "July", "August", "September", "October",
                 "November", "December" ];

// App state
let _screen = Screen_Clock;
let _lastScreenChangeTime = getTime();

// Button handlers
setWatch(() => {
  _screen = (Screen_Max + _screen - 1) % Screen_Max;
  _lastScreenChangeTime = getTime();
  redraw();
}, BTN4, {repeat:true});

setWatch(() => {
  _screen = (_screen + 1) % Screen_Max;
  _lastScreenChangeTime = getTime();
  redraw();
}, BTN5, {repeat:true});

// Redraw the screen
function redraw() {
  g.reset();

  // Update timer
  let time = getTime();

  // Draw background
  drawZealBackground(time);

  // Draw screens
  switch (_screen) {
    case Screen_Clock:
      drawClock();
      break;
  }

  // Draw screen headings
  drawHeading(time);

  // Draw widgets
  Bangle.drawWidgets();

  // Flip the double buffer
  g.flip();
}

// Draw the background
function drawZealBackground(time, dt) {
  // Work out clouds scrolling
  let bgScroll = (-time * 3) % ZealBgWidth;

  // Draw background
  for (let i = 0; i < 5; ++i)
  {
    g.drawImage(require("Storage").read("cat_watch_zeal_bg.img"),i*ZealBgWidth + bgScroll,0);
  }

  // Draw zeal
  g.drawImage(require("Storage").read("cat_watch_zeal.img"),0,0);
}

// Draw the screen heading
function drawHeading(time) {
  // Draw screen heading for a few seconds after changing screens
  if (time - _lastScreenChangeTime < 3) {
    g.setFont("Vector",25);
    g.drawString(getScreenHeading(),80,30);
  }
}

// Draw clock
function drawClock() {
  let X = 60;
  let Y = 75;

  var d = new Date();
  var h = d.getHours(), m = d.getMinutes(), s = d.getSeconds();
  var day = d.getDate(), month = Months[d.getMonth()], year = d.getFullYear();

  g.reset();
  g.setFont("Vector",35);
  g.drawString(`${h}:${m<10?"0":""}${m}:${s<10?"0":""}${s}`, X, Y);
  g.setFont("Vector",20);
  g.drawString(`${day} ${month} ${year}`, X+10, Y+40);
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
function getScreenHeading() {
  switch (_screen) {
    case Screen_Clock:
      return "Clock";
    case Screen_Second:
      return "Second";
    case Screen_Third:
      return "Third";
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