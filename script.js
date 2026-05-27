const $ = (id) => document.getElementById(id);

const weightInput = $("weightInput");
const heightInput = $("heightInput");
const waistInput = $("waistInput");
const goalInput = $("goalInput");
const energyLevel = $("energyLevel");
const workoutTime = $("workoutTime");
const dietQuality = $("dietQuality");
const sorenessLevel = $("sorenessLevel");
const generateBtn = $("generateBtn");
const completeBtn = $("completeBtn");
const saveProfileBtn = $("saveProfileBtn");
const resetBtn = $("resetBtn");
const reminderBtn = $("reminderBtn");
const checkInBtn = $("checkInBtn");
const exportBtn = $("exportBtn");
const importBtn = $("importBtn");
const importFile = $("importFile");
const workoutResult = $("workoutResult");
const progressText = $("progressText");
const streakText = $("streakText");
const completedNumber = $("completedNumber");
const streakNumber = $("streakNumber");
const levelNumber = $("levelNumber");
const xpText = $("xpText");
const nextLevelText = $("nextLevelText");
const xpFill = $("xpFill");
const lastWorkoutText = $("lastWorkoutText");
const bodyChangeText = $("bodyChangeText");
const historyChart = $("historyChart");
const historyList = $("historyList");
const achievementList = $("achievementList");
const statusMessage = $("statusMessage");
const coachNote = $("coachNote");
const reminderTimeInput = $("reminderTimeInput");
const tabWorkoutBtn = $("tabWorkoutBtn");
const tabProgressBtn = $("tabProgressBtn");
const tabSettingsBtn = $("tabSettingsBtn");
const workoutPanel = $("workoutPanel");
const progressPanel = $("progressPanel");
const settingsPanel = $("settingsPanel");

const STORAGE_KEYS = {
    workoutsCompleted: "workoutsCompleted",
    currentStreak: "currentStreak",
    lastWorkoutDate: "lastWorkoutDate",
    workoutHistory: "workoutHistory",
    bodyHistory: "bodyHistory",
    activeWorkout: "activeWorkout",
    profile: "profile",
    reminderEnabled: "reminderEnabled",
    reminderTime: "reminderTime"
};

const exerciseDatabase = {
    starter: {
        low: [
            { name: "Standing March", dose: "60 sec", note: "Warm your body up without floor pressure." },
            { name: "Seated Knee Lifts", dose: "8 each", note: "Slow reps. Brace your core." },
            { name: "Wall Plank", dose: "15 sec", note: "Hands on wall, body straight." },
            { name: "Deep Breathing", dose: "5 reps", note: "Reset and recover." }
        ],
        medium: [
            { name: "Standing March", dose: "90 sec", note: "Keep posture tall." },
            { name: "Seated Knee Lifts", dose: "10 each", note: "Lift with control." },
            { name: "Modified Dead Bug", dose: "8 each", note: "Keep lower back stable." },
            { name: "Wall Plank", dose: "20 sec", note: "Controlled breathing." },
            { name: "Walk Cooldown", dose: "2 min", note: "Finish easy." }
        ],
        high: [
            { name: "Standing March", dose: "2 min", note: "Push the pace slightly." },
            { name: "Modified Mountain Climbers", dose: "10 each", note: "Hands on chair/counter if needed." },
            { name: "Dead Bug", dose: "10 each", note: "Slow and clean." },
            { name: "Knee Plank", dose: "20 sec", note: "No back sagging." },
            { name: "Walk Cooldown", dose: "2 min", note: "Breathe down." }
        ]
    },
    moderate: {
        low: [
            { name: "Crunches", dose: "10 reps", note: "Small range is fine." },
            { name: "Knee Raises", dose: "10 reps", note: "Control the lowering." },
            { name: "Plank", dose: "15 sec", note: "Quality over time." },
            { name: "Walk Cooldown", dose: "2 min", note: "Keep the win simple." }
        ],
        medium: [
            { name: "Crunches", dose: "18 reps", note: "Exhale up." },
            { name: "Knee Raises", dose: "15 reps", note: "No swinging." },
            { name: "Dead Bug", dose: "10 each", note: "Core stays tight." },
            { name: "Plank", dose: "30 sec", note: "Stop before form breaks." },
            { name: "Standing March", dose: "90 sec", note: "Finish strong." }
        ],
        high: [
            { name: "Crunches", dose: "25 reps", note: "Smooth tempo." },
            { name: "Leg Raises", dose: "12 reps", note: "Bend knees if needed." },
            { name: "Mountain Climbers", dose: "16 each", note: "Controlled pace." },
            { name: "Plank", dose: "40 sec", note: "Brace and breathe." },
            { name: "Walk Cooldown", dose: "2 min", note: "Recover." }
        ]
    },
    standard: {
        low: [
            { name: "Crunches", dose: "15 reps", note: "Easy pace." },
            { name: "Dead Bug", dose: "10 each", note: "Stay controlled." },
            { name: "Plank", dose: "25 sec", note: "Strong position." },
            { name: "Walk Cooldown", dose: "2 min", note: "Consistency day." }
        ],
        medium: [
            { name: "Crunches", dose: "25 reps", note: "Full control." },
            { name: "Leg Raises", dose: "16 reps", note: "No lower back pain." },
            { name: "Mountain Climbers", dose: "20 each", note: "Keep hips steady." },
            { name: "Plank", dose: "45 sec", note: "Earn the hold." },
            { name: "Dead Bug", dose: "12 each", note: "Finish clean." }
        ],
        high: [
            { name: "Bicycle Crunches", dose: "25 each", note: "Rotate with control." },
            { name: "Leg Raises", dose: "20 reps", note: "Modify if back arches." },
            { name: "Mountain Climbers", dose: "30 each", note: "Athletic pace." },
            { name: "Plank", dose: "60 sec", note: "Breathe through it." },
            { name: "Hollow Hold", dose: "20 sec", note: "Scale with bent knees." }
        ]
    }
};

const achievements = [
    { id: "first", label: "First Rep", detail: "Complete 1 workout", test: (s) => s.completed >= 1 },
    { id: "three", label: "3 Wins", detail: "Complete 3 workouts", test: (s) => s.completed >= 3 },
    { id: "seven", label: "7 Strong", detail: "Complete 7 workouts", test: (s) => s.completed >= 7 },
    { id: "streak3", label: "Streak Starter", detail: "Reach a 3 day streak", test: (s) => s.streak >= 3 },
    { id: "streak7", label: "Locked In", detail: "Reach a 7 day streak", test: (s) => s.streak >= 7 },
    { id: "twenty", label: "Core Builder", detail: "Complete 20 workouts", test: (s) => s.completed >= 20 }
];

let workoutsCompleted = Number(localStorage.getItem(STORAGE_KEYS.workoutsCompleted)) || 0;
let currentStreak = Number(localStorage.getItem(STORAGE_KEYS.currentStreak)) || 0;
let lastWorkoutDate = localStorage.getItem(STORAGE_KEYS.lastWorkoutDate);
let workoutHistory = loadArray(STORAGE_KEYS.workoutHistory);
let bodyHistory = loadArray(STORAGE_KEYS.bodyHistory);
let activeWorkout = loadObject(STORAGE_KEYS.activeWorkout);
let profile = loadObject(STORAGE_KEYS.profile) || {};

restoreProfile();
updateDashboard();
drawHistoryChart();
renderHistoryList();
renderAchievements();
restoreActiveWorkout();
updateCoachNote();

function loadArray(key) {
    try {
        return JSON.parse(localStorage.getItem(key)) || [];
    } catch (error) {
        return [];
    }
}

function loadObject(key) {
    try {
        return JSON.parse(localStorage.getItem(key));
    } catch (error) {
        return null;
    }
}

function saveArray(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function saveProfile() {
    profile = {
        weight: weightInput.value,
        height: heightInput.value,
        waist: waistInput.value,
        goal: goalInput.value,
        reminderTime: reminderTimeInput.value
    };

    localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile));
    localStorage.setItem(STORAGE_KEYS.reminderTime, reminderTimeInput.value);
    statusMessage.textContent = "Profile saved. Future workouts will start with your usual info.";
}

function restoreProfile() {
    if (profile.weight) weightInput.value = profile.weight;
    if (profile.height) heightInput.value = profile.height;
    if (profile.waist) waistInput.value = profile.waist;
    if (profile.goal) goalInput.value = profile.goal;
    reminderTimeInput.value = localStorage.getItem(STORAGE_KEYS.reminderTime) || profile.reminderTime || "19:00";
}

function getDifficulty(weight, soreness) {
    if (soreness === "high") {
        return { key: "starter", label: "Recovery Safe" };
    }

    if (weight >= 240) {
        return { key: "starter", label: "Starter Safe" };
    }

    if (weight >= 200) {
        return { key: "moderate", label: "Moderate" };
    }

    return { key: "standard", label: "Standard" };
}

function getMotivationMessage(diet, goal) {
    if (diet === "rough") {
        return "One rough meal does not ruin progress. Win the next choice: water, protein, and a short walk.";
    }

    if (goal === "visibleAbs") {
        return "Visible abs come from repeated boring wins. Today is one of them.";
    }

    if (diet === "good") {
        return "Great job fueling your body today. Use that momentum.";
    }

    return "You're building better habits one day at a time.";
}

function getWorkoutTitle(energy, time, difficultyLabel, soreness) {
    if (soreness === "high") return `${difficultyLabel} Mobility Core`;
    if (energy === "low" && time === 5) return `${difficultyLabel} Quick Reset`;
    if (energy === "low") return `${difficultyLabel} Recovery Core`;
    if (energy === "medium") return `${difficultyLabel} Balanced Core`;
    return `${difficultyLabel} Core Burn`;
}

function getMission(energy, time, soreness, goal) {
    if (soreness === "high") return "Protect your body. Move gently and keep the streak alive.";
    if (energy === "low") return "Finish without chasing perfection. The win is showing up.";
    if (time <= 10) return "Move with focus. Keep transitions short and clean.";
    if (goal === "fatloss") return "Core work plus daily movement is the combo. Finish strong, then walk if possible.";
    return "Push with control. Quality reps beat rushed reps.";
}

function getNutritionTarget(diet, goal) {
    if (diet === "rough") return "Next meal: protein first, water, and fruit or vegetables. Do not punish yourself.";
    if (goal === "fatloss" || goal === "visibleAbs") return "Aim for protein, water, and a slight calorie deficit today.";
    return "Fuel recovery with protein and enough water.";
}

function scaleExercises(exercises, time, soreness) {
    if (soreness === "high") return exercises.slice(0, 3);
    const limit = time === 5 ? 3 : time === 10 ? 4 : time >= 20 ? exercises.length : 4;
    return exercises.slice(0, limit);
}

function estimateCalories(time, weight, energy, soreness) {
    const intensity = soreness === "high" ? 0.035 : energy === "low" ? 0.045 : energy === "medium" ? 0.06 : 0.075;
    return Math.max(10, Math.round(time * weight * intensity));
}

function calculateXp(workout) {
    let xp = 20;
    xp += workout.time;
    if (workout.energy === "high") xp += 10;
    if (workout.diet === "good") xp += 5;
    return xp;
}

function generateWorkout() {
    const weight = Number(weightInput.value);
    const height = heightInput.value.trim();
    const waist = Number(waistInput.value) || null;
    const goal = goalInput.value;
    const energy = energyLevel.value;
    const time = Number(workoutTime.value);
    const diet = dietQuality.value;
    const soreness = sorenessLevel.value;

    if (!weight || weight <= 0) {
        statusMessage.textContent = "Enter your current weight first so the app can adjust difficulty.";
        weightInput.focus();
        return;
    }

    const difficulty = getDifficulty(weight, soreness);
    const selectedExercises = scaleExercises(exerciseDatabase[difficulty.key][energy], time, soreness);
    const calories = estimateCalories(time, weight, energy, soreness);

    const workout = {
        id: Date.now(),
        title: getWorkoutTitle(energy, time, difficulty.label, soreness),
        difficulty: difficulty.label,
        mission: getMission(energy, time, soreness, goal),
        nutrition: getNutritionTarget(diet, goal),
        motivation: getMotivationMessage(diet, goal),
        exercises: selectedExercises,
        calories,
        time,
        weight,
        waist,
        height,
        goal,
        energy,
        diet,
        soreness,
        xp: 0,
        createdAt: new Date().toISOString()
    };

    workout.xp = calculateXp(workout);
    activeWorkout = workout;
    localStorage.setItem(STORAGE_KEYS.activeWorkout, JSON.stringify(activeWorkout));
    renderWorkout(workout);
    updateCoachNote();
    statusMessage.textContent = "Plan generated. Complete it first, then tap Complete Workout.";
}

function renderWorkout(workout) {
    const exercisesHtml = workout.exercises.map(function (exercise, index) {
        return `
            <div class="exercise-item">
                <div>
                    <span class="exercise-name">${index + 1}. ${exercise.name}</span>
                    <small>${exercise.note}</small>
                </div>
                <span class="exercise-dose">${exercise.dose}</span>
            </div>
        `;
    }).join("");

    workoutResult.classList.remove("empty-state");
    workoutResult.innerHTML = `
        <div class="workout-title-row">
            <div>
                <h2>${workout.title}</h2>
                <p>${workout.time} minutes • about ${workout.calories} calories • +${workout.xp} XP</p>
            </div>
            <span class="badge">${workout.difficulty}</span>
        </div>

        <h3>Today's Mission</h3>
        <p>${workout.mission}</p>

        <div class="exercise-list">${exercisesHtml}</div>

        <div class="tip-box">
            <strong>Nutrition focus:</strong>
            <p>${workout.nutrition}</p>
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
    workoutsCompleted += 1;
    localStorage.setItem(STORAGE_KEYS.workoutsCompleted, workoutsCompleted);

    if (lastWorkoutDate !== today) {
        currentStreak += 1;
        lastWorkoutDate = today;
        localStorage.setItem(STORAGE_KEYS.currentStreak, currentStreak);
        localStorage.setItem(STORAGE_KEYS.lastWorkoutDate, lastWorkoutDate);
    }

    const completedWorkout = {
        ...activeWorkout,
        completedAt: new Date().toISOString(),
        date: today
    };

    workoutHistory.push(completedWorkout);
    saveArray(STORAGE_KEYS.workoutHistory, workoutHistory);

    if (activeWorkout.weight || activeWorkout.waist) {
        addBodyEntry(activeWorkout.weight, activeWorkout.waist, false);
    }

    localStorage.removeItem(STORAGE_KEYS.activeWorkout);
    activeWorkout = null;

    statusMessage.textContent = `Workout saved. +${completedWorkout.xp} XP. That is a real rep toward consistency.`;
    updateDashboard();
    drawHistoryChart();
    renderHistoryList();
    renderAchievements();
}

function addBodyEntry(weight, waist, showMessage = true) {
    const today = new Date().toDateString();
    const existingIndex = bodyHistory.findIndex((entry) => entry.date === today);
    const entry = { date: today, weight: Number(weight) || null, waist: Number(waist) || null };

    if (existingIndex >= 0) {
        bodyHistory[existingIndex] = entry;
    } else {
        bodyHistory.push(entry);
    }

    saveArray(STORAGE_KEYS.bodyHistory, bodyHistory);
    if (showMessage) statusMessage.textContent = "Check-in saved.";
}

function addManualCheckIn() {
    const weight = Number(weightInput.value);
    const waist = Number(waistInput.value) || null;

    if (!weight) {
        statusMessage.textContent = "Enter your current weight before adding a check-in.";
        return;
    }

    addBodyEntry(weight, waist, true);
    updateDashboard();
}

function getTotalXp() {
    return workoutHistory.reduce((total, workout) => total + (Number(workout.xp) || 25), 0);
}

function getLevelInfo() {
    const totalXp = getTotalXp();
    const level = Math.floor(totalXp / 100) + 1;
    const currentLevelXp = totalXp % 100;
    const remaining = 100 - currentLevelXp;
    return { totalXp, level, currentLevelXp, remaining };
}

function updateDashboard() {
    const levelInfo = getLevelInfo();
    progressText.textContent = `Workouts completed: ${workoutsCompleted}`;
    streakText.textContent = `Current streak: ${currentStreak} days`;
    completedNumber.textContent = workoutsCompleted;
    streakNumber.textContent = currentStreak;
    levelNumber.textContent = levelInfo.level;
    xpText.textContent = `${levelInfo.totalXp} XP`;
    nextLevelText.textContent = `${levelInfo.remaining} XP to Level ${levelInfo.level + 1}`;
    xpFill.style.width = `${levelInfo.currentLevelXp}%`;
    lastWorkoutText.textContent = lastWorkoutDate ? `Last workout: ${lastWorkoutDate}` : "Last workout: —";
    updateBodyTrend();
}

function updateBodyTrend() {
    const valid = bodyHistory.filter((entry) => entry.weight);
    if (valid.length < 2) {
        bodyChangeText.textContent = "Body trend: Add check-ins to see progress.";
        return;
    }

    const first = valid[0];
    const latest = valid[valid.length - 1];
    const difference = (latest.weight - first.weight).toFixed(1);
    const direction = difference < 0 ? "down" : difference > 0 ? "up" : "steady";
    bodyChangeText.textContent = `Body trend: ${Math.abs(difference)} lbs ${direction} since first check-in.`;
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
        ctx.textAlign = "left";
        ctx.fillText("Complete workouts to build your chart.", 18, 78);
        return;
    }

    const barGap = 10;
    const barWidth = (width - 40 - barGap * (lastSeven.length - 1)) / lastSeven.length;
    const maxMinutes = Math.max(...lastSeven.map((entry) => entry.time), 25);

    lastSeven.forEach(function (entry, index) {
        const barHeight = Math.max(18, (entry.time / maxMinutes) * 96);
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

function renderHistoryList() {
    const recent = workoutHistory.slice(-8).reverse();

    if (recent.length === 0) {
        historyList.innerHTML = `<p class="helper-text">No completed workouts yet.</p>`;
        return;
    }

    historyList.innerHTML = recent.map((entry) => `
        <div class="history-item">
            <div>
                <strong>${entry.title}</strong>
                <small>${entry.date}</small>
            </div>
            <span>${entry.time}m • +${entry.xp || 25} XP</span>
        </div>
    `).join("");
}

function renderAchievements() {
    const state = { completed: workoutsCompleted, streak: currentStreak };
    achievementList.innerHTML = achievements.map((achievement) => {
        const unlocked = achievement.test(state);
        return `
            <article class="achievement ${unlocked ? "unlocked" : ""}">
                <span>${unlocked ? "🏆" : "🔒"}</span>
                <strong>${achievement.label}</strong>
                <small>${achievement.detail}</small>
            </article>
        `;
    }).join("");
}

function restoreActiveWorkout() {
    if (activeWorkout !== null) {
        renderWorkout(activeWorkout);
        statusMessage.textContent = "You still have an unfinished workout ready.";
    }
}

function updateCoachNote() {
    const streak = currentStreak;
    const diet = dietQuality.value;
    const soreness = sorenessLevel.value;

    if (soreness === "high") {
        coachNote.textContent = "High soreness means recovery counts. Keep movement gentle today.";
    } else if (streak >= 7) {
        coachNote.textContent = "You are proving consistency. Now protect the habit: do not let perfect become the enemy of done.";
    } else if (diet === "rough") {
        coachNote.textContent = "Do not restart tomorrow. Make the next choice better today.";
    } else {
        coachNote.textContent = "Abs are revealed by consistency: core work, walking, protein, water, sleep, and patience.";
    }
}

function resetProgress() {
    const confirmReset = confirm("Reset workouts, streak, history, body check-ins, profile, and active workout?");
    if (!confirmReset) return;

    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
    workoutsCompleted = 0;
    currentStreak = 0;
    lastWorkoutDate = null;
    workoutHistory = [];
    bodyHistory = [];
    activeWorkout = null;
    profile = {};

    workoutResult.classList.add("empty-state");
    workoutResult.innerHTML = `<h2>Ready when you are.</h2><p>Choose your real situation today. The app will keep the workout realistic.</p>`;
    statusMessage.textContent = "Everything reset.";
    updateDashboard();
    drawHistoryChart();
    renderHistoryList();
    renderAchievements();
}

function requestReminderPermission() {
    localStorage.setItem(STORAGE_KEYS.reminderTime, reminderTimeInput.value);

    if (!("Notification" in window)) {
        statusMessage.textContent = "This browser does not support notifications.";
        return;
    }

    Notification.requestPermission().then(function (permission) {
        if (permission === "granted") {
            localStorage.setItem(STORAGE_KEYS.reminderEnabled, "true");
            new Notification("Ab Coach reminder enabled", {
                body: `Reminder time saved for ${reminderTimeInput.value}. Open Ab Coach daily to complete your core workout.`,
                icon: "./icon-192.png"
            });
            statusMessage.textContent = "Reminder permission enabled. Reminder time saved.";
        } else {
            statusMessage.textContent = "Reminder permission was not enabled.";
        }
    });
}

function exportData() {
    const data = {
        version: 4,
        exportedAt: new Date().toISOString(),
        workoutsCompleted,
        currentStreak,
        lastWorkoutDate,
        workoutHistory,
        bodyHistory,
        profile
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "ab-coach-backup.json";
    link.click();
    URL.revokeObjectURL(url);
}

function importDataFromFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function () {
        try {
            const data = JSON.parse(reader.result);
            workoutsCompleted = Number(data.workoutsCompleted) || 0;
            currentStreak = Number(data.currentStreak) || 0;
            lastWorkoutDate = data.lastWorkoutDate || null;
            workoutHistory = Array.isArray(data.workoutHistory) ? data.workoutHistory : [];
            bodyHistory = Array.isArray(data.bodyHistory) ? data.bodyHistory : [];
            profile = data.profile || {};

            localStorage.setItem(STORAGE_KEYS.workoutsCompleted, workoutsCompleted);
            localStorage.setItem(STORAGE_KEYS.currentStreak, currentStreak);
            if (lastWorkoutDate) localStorage.setItem(STORAGE_KEYS.lastWorkoutDate, lastWorkoutDate);
            saveArray(STORAGE_KEYS.workoutHistory, workoutHistory);
            saveArray(STORAGE_KEYS.bodyHistory, bodyHistory);
            localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile));

            restoreProfile();
            updateDashboard();
            drawHistoryChart();
            renderHistoryList();
            renderAchievements();
            statusMessage.textContent = "Backup imported successfully.";
        } catch (error) {
            statusMessage.textContent = "Import failed. Make sure this is an Ab Coach backup file.";
        }
    };
    reader.readAsText(file);
}

function showPanel(panelName) {
    const panels = [workoutPanel, progressPanel, settingsPanel];
    const buttons = [tabWorkoutBtn, tabProgressBtn, tabSettingsBtn];
    panels.forEach((panel) => panel.classList.remove("active-panel"));
    buttons.forEach((button) => button.classList.remove("active"));

    if (panelName === "progress") {
        progressPanel.classList.add("active-panel");
        tabProgressBtn.classList.add("active");
    } else if (panelName === "settings") {
        settingsPanel.classList.add("active-panel");
        tabSettingsBtn.classList.add("active");
    } else {
        workoutPanel.classList.add("active-panel");
        tabWorkoutBtn.classList.add("active");
    }
}

generateBtn.addEventListener("click", generateWorkout);
completeBtn.addEventListener("click", completeWorkout);
saveProfileBtn.addEventListener("click", saveProfile);
resetBtn.addEventListener("click", resetProgress);
reminderBtn.addEventListener("click", requestReminderPermission);
checkInBtn.addEventListener("click", addManualCheckIn);
exportBtn.addEventListener("click", exportData);
importBtn.addEventListener("click", () => importFile.click());
importFile.addEventListener("change", importDataFromFile);
tabWorkoutBtn.addEventListener("click", () => showPanel("workout"));
tabProgressBtn.addEventListener("click", () => showPanel("progress"));
tabSettingsBtn.addEventListener("click", () => showPanel("settings"));
[dietQuality, sorenessLevel].forEach((input) => input.addEventListener("change", updateCoachNote));

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./service-worker.js").then(function () {
        console.log("Service Worker Registered");
    });
}
