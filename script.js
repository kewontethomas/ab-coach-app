const weightInput = document.getElementById("weightInput");
const heightInput = document.getElementById("heightInput");
const energyLevel = document.getElementById("energyLevel");
const workoutTime = document.getElementById("workoutTime");
const dietQuality = document.getElementById("dietQuality");
const generateBtn = document.getElementById("generateBtn");
const completeBtn = document.getElementById("completeBtn");
const resetBtn = document.getElementById("resetBtn");
const reminderBtn = document.getElementById("reminderBtn");
const workoutResult = document.getElementById("workoutResult");
const progressText = document.getElementById("progressText");
const streakText = document.getElementById("streakText");
const completedNumber = document.getElementById("completedNumber");
const streakNumber = document.getElementById("streakNumber");
const lastWorkoutText = document.getElementById("lastWorkoutText");
const historyChart = document.getElementById("historyChart");
const statusMessage = document.getElementById("statusMessage");

const STORAGE_KEYS = {
    workoutsCompleted: "workoutsCompleted",
    currentStreak: "currentStreak",
    lastWorkoutDate: "lastWorkoutDate",
    workoutHistory: "workoutHistory",
    activeWorkout: "activeWorkout",
    reminderEnabled: "reminderEnabled"
};

const exerciseDatabase = {
    starter: {
        low: [
            { name: "Standing March", dose: "60 sec" },
            { name: "Seated Knee Lifts", dose: "8 each" },
            { name: "Wall Plank", dose: "15 sec" },
            { name: "Deep Breathing", dose: "5 reps" }
        ],
        medium: [
            { name: "Standing March", dose: "90 sec" },
            { name: "Seated Knee Lifts", dose: "10 each" },
            { name: "Modified Dead Bug", dose: "8 each" },
            { name: "Wall Plank", dose: "20 sec" }
        ],
        high: [
            { name: "Standing March", dose: "2 min" },
            { name: "Modified Mountain Climbers", dose: "10 each" },
            { name: "Dead Bug", dose: "10 each" },
            { name: "Knee Plank", dose: "20 sec" }
        ]
    },
    moderate: {
        low: [
            { name: "Crunches", dose: "10 reps" },
            { name: "Knee Raises", dose: "10 reps" },
            { name: "Plank", dose: "15 sec" },
            { name: "Walk Cooldown", dose: "2 min" }
        ],
        medium: [
            { name: "Crunches", dose: "18 reps" },
            { name: "Knee Raises", dose: "15 reps" },
            { name: "Dead Bug", dose: "10 each" },
            { name: "Plank", dose: "30 sec" }
        ],
        high: [
            { name: "Crunches", dose: "25 reps" },
            { name: "Leg Raises", dose: "12 reps" },
            { name: "Mountain Climbers", dose: "16 each" },
            { name: "Plank", dose: "40 sec" }
        ]
    },
    standard: {
        low: [
            { name: "Crunches", dose: "15 reps" },
            { name: "Dead Bug", dose: "10 each" },
            { name: "Plank", dose: "25 sec" },
            { name: "Walk Cooldown", dose: "2 min" }
        ],
        medium: [
            { name: "Crunches", dose: "25 reps" },
            { name: "Leg Raises", dose: "16 reps" },
            { name: "Mountain Climbers", dose: "20 each" },
            { name: "Plank", dose: "45 sec" }
        ],
        high: [
            { name: "Bicycle Crunches", dose: "25 each" },
            { name: "Leg Raises", dose: "20 reps" },
            { name: "Mountain Climbers", dose: "30 each" },
            { name: "Plank", dose: "60 sec" }
        ]
    }
};

let workoutsCompleted = Number(localStorage.getItem(STORAGE_KEYS.workoutsCompleted)) || 0;
let currentStreak = Number(localStorage.getItem(STORAGE_KEYS.currentStreak)) || 0;
let lastWorkoutDate = localStorage.getItem(STORAGE_KEYS.lastWorkoutDate);
let workoutHistory = loadHistory();
let activeWorkout = JSON.parse(localStorage.getItem(STORAGE_KEYS.activeWorkout)) || null;

updateDashboard();
drawHistoryChart();
restoreActiveWorkout();

function loadHistory() {
    const savedHistory = localStorage.getItem(STORAGE_KEYS.workoutHistory);

    if (savedHistory === null) {
        return [];
    }

    try {
        return JSON.parse(savedHistory);
    } catch (error) {
        return [];
    }
}

function saveHistory() {
    localStorage.setItem(STORAGE_KEYS.workoutHistory, JSON.stringify(workoutHistory));
}

function getDifficulty(weight) {
    if (weight >= 240) {
        return { key: "starter", label: "Starter Safe" };
    }

    if (weight >= 200) {
        return { key: "moderate", label: "Moderate" };
    }

    return { key: "standard", label: "Standard" };
}

function getMotivationMessage(diet) {
    if (diet === "rough") {
        return "One rough meal does not ruin your progress. Win the next choice.";
    }

    if (diet === "okay") {
        return "You're building better habits one day at a time.";
    }

    return "Great job fueling your body today. Use that momentum.";
}

function getWorkoutTitle(energy, time, difficultyLabel) {
    if (energy === "low" && time === 5) {
        return `${difficultyLabel} Quick Reset`;
    }

    if (energy === "low") {
        return `${difficultyLabel} Recovery Core`;
    }

    if (energy === "medium") {
        return `${difficultyLabel} Balanced Core`;
    }

    return `${difficultyLabel} Core Burn`;
}

function getMission(energy, time) {
    if (energy === "low") {
        return "Finish without chasing perfection. The win is showing up.";
    }

    if (time <= 10) {
        return "Move with focus. Keep transitions short and clean.";
    }

    return "Push with control. Quality reps beat rushed reps.";
}

function scaleExercises(exercises, time) {
    const limit = time === 5 ? 3 : time === 10 ? 4 : exercises.length;
    return exercises.slice(0, limit);
}

function estimateCalories(time, weight, energy) {
    const intensity = energy === "low" ? 0.045 : energy === "medium" ? 0.06 : 0.075;
    return Math.round(time * weight * intensity);
}

function generateWorkout() {
    const weight = Number(weightInput.value);
    const height = heightInput.value.trim();
    const energy = energyLevel.value;
    const time = Number(workoutTime.value);
    const diet = dietQuality.value;

    if (!weight || weight <= 0) {
        statusMessage.textContent = "Enter your current weight first so the app can adjust difficulty.";
        weightInput.focus();
        return;
    }

    const difficulty = getDifficulty(weight);
    const selectedExercises = scaleExercises(exerciseDatabase[difficulty.key][energy], time);
    const calories = estimateCalories(time, weight, energy);
    const workout = {
        id: Date.now(),
        title: getWorkoutTitle(energy, time, difficulty.label),
        difficulty: difficulty.label,
        mission: getMission(energy, time),
        motivation: getMotivationMessage(diet),
        exercises: selectedExercises,
        calories,
        time,
        weight,
        height,
        energy,
        diet,
        createdAt: new Date().toISOString()
    };

    activeWorkout = workout;
    localStorage.setItem(STORAGE_KEYS.activeWorkout, JSON.stringify(activeWorkout));
    renderWorkout(workout);
    statusMessage.textContent = "Plan generated. Complete it first, then tap Complete Workout.";
}

function renderWorkout(workout) {
    const exercisesHtml = workout.exercises.map(function (exercise) {
        return `
            <div class="exercise-item">
                <span class="exercise-name">${exercise.name}</span>
                <span class="exercise-dose">${exercise.dose}</span>
            </div>
        `;
    }).join("");

    workoutResult.classList.remove("empty-state");
    workoutResult.innerHTML = `
        <div class="workout-title-row">
            <div>
                <h2>${workout.title}</h2>
                <p>${workout.time} minutes • about ${workout.calories} calories</p>
            </div>
            <span class="badge">${workout.difficulty}</span>
        </div>

        <h3>Today's Mission</h3>
        <p>${workout.mission}</p>

        <div class="exercise-list">
            ${exercisesHtml}
        </div>

        <p class="motivation">${workout.motivation}</p>
        <p class="warning">Stop if anything feels painful, sharp, dizzy, or unsafe.</p>
    `;
}

function completeWorkout() {
    if (activeWorkout === null) {
        statusMessage.textContent = "Generate a workout first before marking one complete.";
        return;
    }

    const today = new Date().toDateString();

    workoutsCompleted = workoutsCompleted + 1;
    localStorage.setItem(STORAGE_KEYS.workoutsCompleted, workoutsCompleted);

    if (lastWorkoutDate !== today) {
        currentStreak = currentStreak + 1;
        lastWorkoutDate = today;
        localStorage.setItem(STORAGE_KEYS.currentStreak, currentStreak);
        localStorage.setItem(STORAGE_KEYS.lastWorkoutDate, lastWorkoutDate);
    }

    workoutHistory.push({
        date: today,
        title: activeWorkout.title,
        time: activeWorkout.time,
        difficulty: activeWorkout.difficulty,
        calories: activeWorkout.calories
    });

    saveHistory();
    localStorage.removeItem(STORAGE_KEYS.activeWorkout);
    activeWorkout = null;

    statusMessage.textContent = "Workout saved. That is a real rep toward consistency.";
    updateDashboard();
    drawHistoryChart();
}

function updateDashboard() {
    progressText.textContent = `Workouts completed: ${workoutsCompleted}`;
    streakText.textContent = `Current streak: ${currentStreak} days`;
    completedNumber.textContent = workoutsCompleted;
    streakNumber.textContent = currentStreak;
    lastWorkoutText.textContent = lastWorkoutDate ? "Today" : "—";
}

function drawHistoryChart() {
    const ctx = historyChart.getContext("2d");
    const width = historyChart.width;
    const height = historyChart.height;

    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = "rgba(148, 163, 184, 0.18)";
    ctx.fillRect(0, height - 24, width, 1);

    const lastSeven = workoutHistory.slice(-7);

    if (lastSeven.length === 0) {
        ctx.fillStyle = "#94a3b8";
        ctx.font = "14px Arial";
        ctx.fillText("Complete workouts to build your chart.", 20, 72);
        return;
    }

    const barGap = 10;
    const barWidth = (width - 40 - barGap * (lastSeven.length - 1)) / lastSeven.length;
    const maxMinutes = Math.max(...lastSeven.map(function (entry) { return entry.time; }), 20);

    lastSeven.forEach(function (entry, index) {
        const barHeight = Math.max(18, (entry.time / maxMinutes) * 90);
        const x = 20 + index * (barWidth + barGap);
        const y = height - 25 - barHeight;

        const gradient = ctx.createLinearGradient(0, y, 0, height);
        gradient.addColorStop(0, "#22c55e");
        gradient.addColorStop(1, "#38bdf8");

        ctx.fillStyle = gradient;
        roundRect(ctx, x, y, barWidth, barHeight, 8);
        ctx.fill();

        ctx.fillStyle = "#cbd5e1";
        ctx.font = "11px Arial";
        ctx.textAlign = "center";
        ctx.fillText(`${entry.time}m`, x + barWidth / 2, height - 8);
    });
}

function roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height);
    ctx.lineTo(x, y + height);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}

function restoreActiveWorkout() {
    if (activeWorkout !== null) {
        renderWorkout(activeWorkout);
        statusMessage.textContent = "You still have an unfinished workout ready.";
    }
}

function resetProgress() {
    const confirmReset = confirm("Reset workouts, streak, history, and active workout?");

    if (!confirmReset) {
        return;
    }

    localStorage.removeItem(STORAGE_KEYS.workoutsCompleted);
    localStorage.removeItem(STORAGE_KEYS.currentStreak);
    localStorage.removeItem(STORAGE_KEYS.lastWorkoutDate);
    localStorage.removeItem(STORAGE_KEYS.workoutHistory);
    localStorage.removeItem(STORAGE_KEYS.activeWorkout);

    workoutsCompleted = 0;
    currentStreak = 0;
    lastWorkoutDate = null;
    workoutHistory = [];
    activeWorkout = null;

    workoutResult.classList.add("empty-state");
    workoutResult.innerHTML = `
        <h2>Ready when you are.</h2>
        <p>Choose your real situation today. The app will keep the workout realistic.</p>
    `;

    statusMessage.textContent = "Progress reset.";
    updateDashboard();
    drawHistoryChart();
}

function requestReminderPermission() {
    if (!("Notification" in window)) {
        statusMessage.textContent = "This browser does not support notifications.";
        return;
    }

    Notification.requestPermission().then(function (permission) {
        if (permission === "granted") {
            localStorage.setItem(STORAGE_KEYS.reminderEnabled, "true");
            new Notification("Ab Coach reminder enabled", {
                body: "Open Ab Coach daily and complete one realistic core workout.",
                icon: "./icon-192.png"
            });
            statusMessage.textContent = "Reminder permission enabled. Open the app daily to stay on track.";
        } else {
            statusMessage.textContent = "Reminder permission was not enabled.";
        }
    });
}

generateBtn.addEventListener("click", generateWorkout);
completeBtn.addEventListener("click", completeWorkout);
resetBtn.addEventListener("click", resetProgress);
reminderBtn.addEventListener("click", requestReminderPermission);

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./service-worker.js").then(function () {
        console.log("Service Worker Registered");
    });
}
