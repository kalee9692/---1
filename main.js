const drawButton = document.getElementById('draw-button');
const numberSpans = document.querySelectorAll('.number-group .number');
const bonusSpan = document.querySelector('.bonus-group .bonus');
const ballContainer = document.querySelector('.ball-container');

drawButton.addEventListener('click', () => {
    drawNumbers();
});

function createBall(number) {
    const ball = document.createElement('div');
    ball.classList.add('ball');
    ball.textContent = number;
    ball.style.backgroundColor = getColor(number);
    return ball;
}

function getColor(number) {
    if (number <= 10) {
        return '#fbc400'; // Yellow
    } else if (number <= 20) {
        return '#69c8f2'; // Blue
    } else if (number <= 30) {
        return '#ff7272'; // Red
    } else if (number <= 40) {
        return '#aaa'; // Gray
    } else {
        return '#b0d840'; // Green
    }
}

function drawNumbers() {
    ballContainer.innerHTML = '';
    // Create and animate balls
    for (let i = 0; i < 45; i++) {
        const ball = createBall(i + 1);
        ball.style.left = `${Math.random() * 80 + 10}%`;
        ball.style.top = `${Math.random() * 80 + 10}%`;
        ballContainer.appendChild(ball);
    }

    setTimeout(() => {
        const numbers = new Set();
        while (numbers.size < 7) {
            const randomNumber = Math.floor(Math.random() * 45) + 1;
            numbers.add(randomNumber);
        }

        const winningNumbers = Array.from(numbers);
        const bonusNumber = winningNumbers.pop();

        numberSpans.forEach((span, index) => {
            span.textContent = winningNumbers[index];
            span.style.backgroundColor = getColor(winningNumbers[index]);
        });

        bonusSpan.textContent = bonusNumber;
        bonusSpan.style.backgroundColor = getColor(bonusNumber);

        ballContainer.innerHTML = '';
    }, 3000); // Wait for 3 seconds for the animation to run
}
