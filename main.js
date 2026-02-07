// Matrix Background Effect
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
const matrixBg = document.getElementById('matrix-bg');
matrixBg.appendChild(canvas);

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890@#$%^&*()";
const fontSize = 16;
const columns = canvas.width / fontSize;
const drops = [];

for (let i = 0; i < columns; i++) {
    drops[i] = 1;
}

function draw() {
    ctx.fillStyle = "rgba(13, 2, 8, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#00ff41";
    ctx.font = fontSize + "px monospace";

    for (let i = 0; i < drops.length; i++) {
        const text = letters[Math.floor(Math.random() * letters.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

setInterval(draw, 33);

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Typewriter Effect
const typewriter = document.querySelector('.typewriter');
if (typewriter) {
    const text = typewriter.innerHTML;
    typewriter.innerHTML = '';
    let i = 0;

    function type() {
        if (i < text.length) {
            typewriter.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, 50);
        }
    }

    window.onload = type;
}
