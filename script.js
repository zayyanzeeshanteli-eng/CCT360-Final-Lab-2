// =====================================================================
// Lab 2: Events in Motion - Night Room
// CCT 360 - [Your Name]
//
// CHECKLIST FOR THE GRADER
// Events (user actions that change the page):
//   1. MOUSE click      -> lamp turns on/off, room brightens
//   2. MOUSE mousemove  -> a firefly follows the cursor, mouse position shown
//   3. MOUSE mouseover / mouseout -> the cat reacts and says "Meow!"
//   4. KEYBOARD keydown -> 1-4 change the sky, R/G/B add books, C clears
//   5. WINDOW resize    -> window size shown, layout switches to compact
//   6. WINDOW scroll    -> progress bar fills, scroll amount shown
//
// DOM: document.getElementById, document.getElementsByClassName,
//      document.querySelector, element.innerHTML, element.style.property,
//      element.addEventListener, element.onclick, inline onclick
//
// BOM: window.innerWidth / innerHeight, window.scrollY, localStorage,
//      navigator.userAgent, window.location, window.history, window.open
// =====================================================================


// ---------- 1. GET THE HTML ELEMENTS (DOM) ----------
// document.getElementById looks through the HTML for the element with that id
let room = document.getElementById("room");
let lamp = document.getElementById("lamp");
let skyWindow = document.getElementById("skyWindow");
let skyIcon = document.getElementById("skyIcon");
let stars = document.getElementById("stars");
let shelf = document.getElementById("shelf");
let cat = document.getElementById("cat");
let catSays = document.getElementById("catSays");
let firefly = document.getElementById("firefly");
let progressBar = document.getElementById("progressBar");
let mainArea = document.getElementById("main");
let panel = document.getElementById("panel");

// status text in the side panel
let lampStatus = document.getElementById("lampStatus");
let skyStatus = document.getElementById("skyStatus");
let lastKey = document.getElementById("lastKey");
let mousePos = document.getElementById("mousePos");
let shelfMessage = document.getElementById("shelfMessage");
let windowSize = document.getElementById("windowSize");
let layoutStatus = document.getElementById("layoutStatus");
let scrollStatus = document.getElementById("scrollStatus");
let browserInfo = document.getElementById("browserInfo");
let historyInfo = document.getElementById("historyInfo");
let locationText = document.getElementById("locationText");
let inspireButton = document.getElementById("inspireButton");
let backButton = document.getElementById("backButton");

// document.querySelector also finds elements (here by id, using #)
let eventLog = document.querySelector("#eventLog");


// ---------- 2. VARIABLES THAT REMEMBER THE STATE ----------
let lampOn = false;        // is the lamp on? (true or false)
let currentSky = "night";  // which sky is showing right now
let logCount = 0;          // how many messages are in the event log

// the 3 books the shelf starts with (used when we clear the shelf)
let startingBooks = '<div class="book red"></div><div class="book green"></div><div class="book blue"></div>';


// ---------- EVENT LOG ----------
// Adds a message to the top of the Event Log so you can see each event happen.
function logEvent(message) {
  logCount = logCount + 1;

  // keep the log short: after 6 messages, start fresh
  if (logCount > 6) {
    eventLog.innerHTML = "";
    logCount = 1;
  }

  eventLog.innerHTML = "<p>&bull; " + message + "</p>" + eventLog.innerHTML;
}


// ---------- EVENT 1: MOUSE CLICK - turn the lamp on/off ----------
// DOM: innerHTML + style.backgroundColor (lowerCamelCase!)
function toggleLamp() {
  if (lampOn == false) {
    lampOn = true;
    room.style.backgroundColor = "#514653";   // room gets brighter
    lamp.style.backgroundColor = "#ffd58a";   // lamp glows gold
    lamp.style.borderColor = "#ffd58a";
    lampStatus.innerHTML = "Lamp: <strong>ON</strong>";
    logEvent("click: lamp turned ON");
  } else {
    lampOn = false;
    room.style.backgroundColor = "#252a40";   // back to dark
    lamp.style.backgroundColor = "#3a3f58";
    lamp.style.borderColor = "#6b4a3a";
    lampStatus.innerHTML = "Lamp: <strong>OFF</strong>";
    logEvent("click: lamp turned OFF");
  }

  saveState(); // remember the lamp in localStorage
}

lamp.addEventListener("click", toggleLamp);


// ---------- EVENT 2: MOUSEMOVE - a firefly follows the mouse ----------
// event.clientX and event.clientY tell us where the mouse is
function moveFirefly(event) {
  // +15 puts the firefly next to the cursor instead of under it
  firefly.style.left = (event.clientX + 15) + "px";
  firefly.style.top = (event.clientY + 15) + "px";

  mousePos.innerHTML = "Mouse: " + event.clientX + ", " + event.clientY;
}

document.addEventListener("mousemove", moveFirefly);


// ---------- EVENT 3: MOUSEOVER / MOUSEOUT - the cat reacts ----------
function catHello() {
  cat.innerHTML = "😺";
  catSays.innerHTML = "Meow!";
  logEvent("mouseover: the cat says hi");
}

function catBye() {
  cat.innerHTML = "🐈";
  catSays.innerHTML = "";
}

cat.addEventListener("mouseover", catHello);
cat.addEventListener("mouseout", catBye);


// ---------- EVENT 4: KEYBOARD - change the sky and add books ----------

// Changes the colour of the sky in the window.
// Called by the keys 1-4 AND by the buttons in the side panel.
function setSky(time) {
  if (time == "sunrise") {
    skyWindow.style.backgroundColor = "#f4a37a";
    skyIcon.innerHTML = "🌅";
    stars.innerHTML = "";
    skyStatus.innerHTML = "Sky: Sunrise";
  } else if (time == "day") {
    skyWindow.style.backgroundColor = "#8ecae6";
    skyIcon.innerHTML = "☀️";
    stars.innerHTML = "";
    skyStatus.innerHTML = "Sky: Day";
  } else if (time == "sunset") {
    skyWindow.style.backgroundColor = "#c8607a";
    skyIcon.innerHTML = "🌇";
    stars.innerHTML = "";
    skyStatus.innerHTML = "Sky: Sunset";
  } else {
    skyWindow.style.backgroundColor = "#0b0e2a";
    skyIcon.innerHTML = "🌙";
    stars.innerHTML = "✦ &nbsp; ✧ &nbsp; ✦";
    skyStatus.innerHTML = "Sky: Night";
    time = "night";
  }

  currentSky = time;
  logEvent("sky changed to " + time);
  saveState(); // remember the sky in localStorage
}

// Adds a new book to the shelf (max 12 books).
function addBook(color) {
  // getElementsByClassName finds ALL elements with class "book"; .length counts them
  let count = document.getElementsByClassName("book").length;

  if (count >= 12) {
    shelfMessage.innerHTML = "The shelf is full! Press C to clear.";
  } else {
    // add the new book's HTML to the end of the shelf
    shelf.innerHTML = shelf.innerHTML + '<div class="book ' + color + '"></div>';
    shelfMessage.innerHTML = "Books: " + (count + 1);
    logEvent("added a " + color + " book");
  }
}

// Removes the added books and puts back the 3 starting books.
function clearBooks() {
  shelf.innerHTML = startingBooks;
  shelfMessage.innerHTML = "Books: 3";
  logEvent("shelf cleared");
}

// Runs every time a key is pressed.
function handleKey(event) {
  lastKey.innerHTML = "Last key: <strong>" + event.key + "</strong>";

  if (event.key == "1") {
    setSky("sunrise");
  } else if (event.key == "2") {
    setSky("day");
  } else if (event.key == "3") {
    setSky("sunset");
  } else if (event.key == "4") {
    setSky("night");
  } else if (event.key == "r" || event.key == "R") {
    addBook("red");
  } else if (event.key == "g" || event.key == "G") {
    addBook("green");
  } else if (event.key == "b" || event.key == "B") {
    addBook("blue");
  } else if (event.key == "c" || event.key == "C") {
    clearBooks();
  }
}

document.addEventListener("keydown", handleKey);


// ---------- EVENT 5: WINDOW RESIZE (BOM) - window size + compact layout ----------
function handleResize() {
  // window.innerWidth / innerHeight = the size of the browser window
  windowSize.innerHTML = "Window: " + window.innerWidth + " x " + window.innerHeight;

  if (window.innerWidth < 700) {
    // small screen: stack the room and the panel (flexbox column)
    mainArea.style.flexDirection = "column";
    mainArea.style.alignItems = "stretch";
    panel.style.width = "auto";
    skyWindow.style.width = "100px";
    shelf.style.width = "120px";
    layoutStatus.innerHTML = "Layout: <strong>Compact</strong>";
  } else {
    // big screen: room and panel side by side (flexbox row)
    mainArea.style.flexDirection = "row";
    mainArea.style.alignItems = "flex-start";
    panel.style.width = "280px";
    skyWindow.style.width = "200px";
    shelf.style.width = "240px";
    layoutStatus.innerHTML = "Layout: Wide";
  }
}

window.addEventListener("resize", handleResize);


// ---------- EVENT 6: WINDOW SCROLL (BOM) - progress bar ----------
function handleScroll() {
  // how far the page CAN scroll = full page height - the visible window height
  let scrollable = document.documentElement.scrollHeight - window.innerHeight;

  // how far we HAVE scrolled, as a percentage
  let percent = (window.scrollY / scrollable) * 100;

  progressBar.style.width = percent + "%";
  scrollStatus.innerHTML = "Scrolled: " + window.scrollY + "px";
}

window.addEventListener("scroll", handleScroll);


// ---------- BOM: localStorage - remember the lamp and sky ----------
// localStorage keeps small pieces of text in the browser, even after a reload.
function saveState() {
  localStorage.setItem("lampOn", lampOn);
  localStorage.setItem("sky", currentSky);
}

function loadState() {
  let savedLamp = localStorage.getItem("lampOn");
  let savedSky = localStorage.getItem("sky");

  if (savedSky != null) {
    setSky(savedSky);
  } else {
    setSky("night");
  }

  // localStorage stores text, so we compare with the text "true"
  if (savedLamp == "true") {
    toggleLamp();
  }
}


// ---------- BOM: navigator, location, history, window.open ----------
// navigator.userAgent = information about the browser being used
browserInfo.innerHTML = "<strong>Your browser:</strong> " + navigator.userAgent;

// window.location.href = the web address of this page
locationText.innerHTML = window.location.href;

// window.history.length = how many pages are in this tab's history
historyInfo.innerHTML = "Pages in this tab's history: " + window.history.length;

// window.history.back() = go back one page (like the browser's back button)
backButton.addEventListener("click", function () {
  window.history.back();
});

// .onclick = function() {...}  (the second way we learned to handle a click)
// window.open() opens a web page in a new tab
inspireButton.onclick = function () {
  window.open("https://patatap.com", "_blank");
  logEvent("click: opened Patatap");
};


// ---------- START THE PAGE ----------
// run these once when the page loads
loadState();
handleResize();
handleScroll();
console.log("Lab 2 loaded");
