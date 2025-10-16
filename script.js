document.addEventListener('DOMContentLoaded', () => {
    // --- Get all the elements from the HTML ---
    const mainTimeDisplay = document.getElementById('mainTimeDisplay');
    const playPauseButton = document.getElementById('playPauseButton');
    const playPauseIcon = document.getElementById('playPauseIcon');
    const editButton = document.getElementById('editButton');
    const resetButton = document.getElementById('resetButton');
    const minimizeButton = document.querySelector('.minimize');
    const closeButton = document.querySelector('.close');
    const editModal = document.getElementById('editModal');
    const modalTimeInput = document.getElementById('modalTimeInput');
    const saveButton = document.getElementById('saveButton');
    const cancelButton = document.getElementById('cancelButton');
    const presetButtons = document.querySelectorAll('.preset-btn');

    // --- Timer state variables ---
    let totalSeconds = 30 * 60;
    let originalTime = 30 * 60;
    let timerInterval = null;
    let isPlaying = false;

    // --- Helper function to format time ---
    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;

        if (h > 0) {
            return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        } else {
            return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        }
    };

    // --- Core Timer Functions ---
    const updateDisplay = () => {
        mainTimeDisplay.textContent = formatTime(totalSeconds);
    };

    const startTimer = () => {
        if (isPlaying) return;
        isPlaying = true;
        playPauseIcon.src = 'assets/paucse button.svg';
        playPauseIcon.alt = 'Pause Icon';
        
        timerInterval = setInterval(() => {
            if (totalSeconds > 0) {
                totalSeconds--;
                updateDisplay();
            } else {
                clearInterval(timerInterval);
                // --- NEW: Play the sound ---
                const alarmSound = new Audio('assets/alarm.mp3'); // Make sure this path is correct
                alarmSound.play();
                // Reset the timer automatically
                resetTimer();
            }
        }, 1000);
    };

    const pauseTimer = () => {
        isPlaying = false;
        playPauseIcon.src = 'assets/Play Icon.svg'; 
        playPauseIcon.alt = 'Play Icon';
        clearInterval(timerInterval);
    };

    const resetTimer = () => {
        pauseTimer();
        totalSeconds = originalTime;
        updateDisplay();
    };

    // --- Event Listeners ---
    playPauseButton.addEventListener('click', () => {
        isPlaying ? pauseTimer() : startTimer();
    });

    resetButton.addEventListener('click', resetTimer);

    minimizeButton.addEventListener('click', () => {
        window.electronAPI.minimize();
    });

    closeButton.addEventListener('click', () => {
        window.electronAPI.close();
    });

    // --- Modal Logic ---
    editButton.addEventListener('click', () => {
        pauseTimer();
        modalTimeInput.value = formatTime(originalTime);
        editModal.classList.remove('hidden');
    });

    cancelButton.addEventListener('click', () => {
        editModal.classList.add('hidden');
    });

    saveButton.addEventListener('click', () => {
        const timeParts = modalTimeInput.value.split(':').map(part => parseInt(part, 10) || 0);
        
        let newTotalSeconds = 0;
        if (timeParts.length === 3) {
            newTotalSeconds = (timeParts[0] * 3600) + (timeParts[1] * 60) + timeParts[2];
        } else if (timeParts.length === 2) {
            newTotalSeconds = (timeParts[0] * 60) + timeParts[1];
        }

        if (newTotalSeconds > 0) {
            originalTime = newTotalSeconds;
            resetTimer();
        }
        
        editModal.classList.add('hidden');
    });

    presetButtons.forEach(button => {
        button.addEventListener('click', () => {
            const minutes = parseInt(button.dataset.minutes, 10);
            const seconds = minutes * 60;
            modalTimeInput.value = formatTime(seconds);
        });
    });

    // --- Initial setup ---
    updateDisplay();
});