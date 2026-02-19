const ACTUAL_DATA = [0.1, 0.2, 4.0, 11.0, 84.7];
const LABELS = ["Poorest 20%", "Second 20%", "Middle 20%", "Fourth 20%", "Richest 20%"];
let userDistribution = [0, 0, 0, 0, 0];

// Initialization
const startBtn = document.getElementById('start-btn');
const board = document.getElementById('board');
const remainingEl = document.getElementById('remaining');

startBtn.addEventListener('click', () => {
    document.getElementById('intro-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    renderPlates();
});

function renderPlates() {
    board.innerHTML = '';
    LABELS.forEach((label, i) => {
        const plate = document.createElement('div');
        plate.className = 'plate';
        plate.dataset.class = i;
        plate.style.setProperty('--percent', '0');
        plate.innerHTML = `
            <div class="pie-visual"></div>
            <small>${label}</small>
            <div><strong>$${userDistribution[i]}T</strong></div>
        `;
        
        // Drag events
        plate.addEventListener('dragover', (e) => e.preventDefault());
        plate.addEventListener('drop', (e) => {
            const val = parseInt(e.dataTransfer.getData('text'));
            updateWealth(i, val);
        });
        
        // Tap to remove
        plate.addEventListener('click', () => updateWealth(i, -5));
        
        board.appendChild(plate);
    });
}

function updateWealth(index, amount) {
    const currentTotal = userDistribution.reduce((a, b) => a + b, 0);
    if (amount > 0 && currentTotal + amount > 100) return;
    
    userDistribution[index] += amount;
    
    const plate = document.querySelector(`.plate[data-class="${index}"]`);
    
    // Add a "Pulse" animation class
    plate.classList.add('pulse');
    setTimeout(() => plate.classList.remove('pulse'), 300);

    // Update Pie and Logic
    plate.style.setProperty('--percent', userDistribution[index]);
    plate.querySelector('strong').innerText = `$${userDistribution[index]}T`;
    
    // Update top progress bar
    const newTotal = userDistribution.reduce((a, b) => a + b, 0);
    document.getElementById('p-bar').style.width = `${newTotal}%`;
    document.getElementById('remaining').innerText = 100 - newTotal;
    
    // Haptic feedback (Mobile only)
    if (window.navigator.vibrate) window.navigator.vibrate(10);
}

// Drag start for mobile/desktop
document.querySelectorAll('.slice-pill').forEach(pill => {
    pill.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text', e.target.dataset.value);
    });
});

// Scoring
document.getElementById('submitBtn').addEventListener('click', () => {
    let diff = userDistribution.reduce((acc, val, i) => acc + Math.abs(val - ACTUAL_DATA[i]), 0);
    let score = Math.max(0, 100 - diff).toFixed(1);
    
    document.getElementById('result-text').innerText = `Your accuracy: ${score}%. In reality, the Richest 20% hold nearly $85 Trillion!`;
    document.getElementById('modal').classList.remove('hidden');
});