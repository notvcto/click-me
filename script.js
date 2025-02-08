var canvas = document.getElementById("starfield");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var context = canvas.getContext("2d");
var stars = 700;
var colorrange = [240, 260, 280];
var starArray = [];

// Adjustable FPS cap
const targetFPS = 150;
const frameTime = 1000 / targetFPS; // Time per frame in milliseconds
let lastTime = performance.now();
let accumulatedTime = 0;

var isTabActive = true;
var animationFrameId = null;

document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'hidden') {
        isTabActive = false;
        cancelAnimationFrame(animationFrameId); // Completely stop the animation loop
    } else {
        isTabActive = true;
        lastTime = performance.now(); // Reset time tracking to avoid jumps
        animationFrameId = requestAnimationFrame(draw); // Resume animation
    }
});

// Function to get random values
function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Initialize stars with random opacity values
function generateStars() {
    starArray = []; // Clear previous stars
    for (var i = 0; i < stars; i++) {
        var x = Math.random() * canvas.offsetWidth;
        var y = Math.random() * canvas.offsetHeight;
        var radius = Math.random() * 1.2;
        var hue = colorrange[getRandom(0, colorrange.length - 1)];
        var sat = getRandom(50, 100);
        var opacity = Math.random();
        starArray.push({ x, y, radius, hue, sat, opacity });
    }
}

var frameNumber = 0;
var opacity = 0;
var secondOpacity = 0;
var thirdOpacity = 0;
var stopMessages = false;

var baseFrame = context.getImageData(0, 0, window.innerWidth, window.innerHeight);

function drawStars() {
    for (var i = 0; i < stars; i++) {
        var star = starArray[i];
        context.beginPath();
        context.arc(star.x, star.y, star.radius, 0, 360);
        context.fillStyle = "hsla(" + star.hue + ", " + star.sat + "%, 88%, " + star.opacity + ")";
        context.fill();
    }
}

function updateStars() {
    for (var i = 0; i < stars; i++) {
        if (Math.random() > 0.99) {
            starArray[i].opacity = Math.random();
        }
    }
}

const button1 = document.getElementById("valentinesButton1");
const button2 = document.getElementById("valentinesButton2");

button1.addEventListener("click", () => {
    button1.textContent = "DM me :3";
    setTimeout(() => {
        button1.textContent = "Yes ❤";
    }, 2000);
});

button2.addEventListener("click", () => {
    button2.textContent = "Aw :<";
    setTimeout(() => {
        button2.textContent = "💔";
    }, 2000);
});

function drawText() {
    var fontSize = Math.min(30, window.innerWidth / 24);
    context.font = fontSize + "px Comic Sans MS";
    context.textAlign = "center";
    context.shadowColor = "rgba(75, 0, 130, 1)";
    context.shadowBlur = 8;

    let messages = [
        "In this vast, infinite universe,",
        "of endless possibilities and countless moments,",
        "I found you, and you found me.",
        "Amongst the chaos, you are my constant.",
        "With every heartbeat, with every breath,",
        "I cherish the love we share.",
        "No matter the distance, no matter the time,",
        "My love for you remains unshaken, unwavering.",
        "You are the brightest star in my sky,",
        "And I will always be here, loving you."
    ];

    if (!stopMessages) {
        let index = Math.floor(frameNumber / 700) % messages.length;
        let fadeIn = frameNumber % 700 < 350;
        let fadeOut = frameNumber % 700 >= 350;

        context.fillStyle = `rgba(75, 0, 130, ${opacity})`;
        context.fillText(messages[index], canvas.width / 2, canvas.height / 2);

        if (fadeIn) opacity += 0.005;
        if (fadeOut) opacity -= 0.005;
    }

    if (frameNumber >= 7000) {
        stopMessages = true;
        context.fillStyle = `rgba(75, 0, 130, ${secondOpacity})`;
        context.fillText("I love you so much {name}, more than all the time and space in the universe can contain", canvas.width / 2, canvas.height / 2);
        secondOpacity += 0.01;
    }

    if (frameNumber >= 7250) {
        context.fillStyle = `rgba(75, 0, 130, ${thirdOpacity})`;
        context.fillText("Happy Valentine's Day <3", canvas.width / 2, canvas.height / 2 + 50);
        thirdOpacity += 0.01;

        if (button1.style.opacity < 1) {
            button1.style.opacity = (parseFloat(button1.style.opacity) + 0.05).toString();
        }
        if (button2.style.opacity < 1) {
            button2.style.opacity = (parseFloat(button2.style.opacity) + 0.05).toString();
        }

        button1.style.display = "block";
        button2.style.display = "block";
    }
}

// Initially set buttons to be invisible
button1.style.opacity = 0;
button2.style.opacity = 0;
button1.style.transition = "opacity 1s ease";
button2.style.transition = "opacity 1s ease";

// Function to detect fullscreen change
function handleFullscreenChange() {
    if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
        console.log('Fullscreen mode detected.');
        generateStars();  
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
}

// Event listener for fullscreen change
document.addEventListener("fullscreenchange", handleFullscreenChange);
document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
document.addEventListener("mozfullscreenchange", handleFullscreenChange);
document.addEventListener("msfullscreenchange", handleFullscreenChange);


// Function to redraw canvas on every frame with FPS cap
function draw(timestamp) {
    if (!isTabActive) return; // Skip drawing when the tab is inactive
    
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    accumulatedTime += deltaTime;

    while (accumulatedTime >= frameTime) {
        context.putImageData(baseFrame, 0, 0);
        drawStars();
        updateStars();
        drawText();

        frameNumber++;
        accumulatedTime -= frameTime;
    }

    requestAnimationFrame(draw);
}

window.addEventListener("resize", function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    baseFrame = context.getImageData(0, 0, window.innerWidth, window.innerHeight);
});

// Generate initial stars
generateStars();

// Start animation loop
requestAnimationFrame(draw);
