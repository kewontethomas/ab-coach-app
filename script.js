const weightInput = document.getElementById("weightInput");
const heightInput = document.getElementById("heightInput");

const energyLevel = document.getElementById("energyLevel");
const workoutTime = document.getElementById("workoutTime");
const dietQuality = document.getElementById("dietQuality");

const generateBtn = document.getElementById("generateBtn");
const completeBtn = document.getElementById("completeBtn");

const workoutResult = document.getElementById("workoutResult");

const progressText = document.getElementById("progressText");
const streakText = document.getElementById("streakText");

let workoutsCompleted = localStorage.getItem("workoutsCompleted");

if (workoutsCompleted === null) {

    workoutsCompleted = 0;

}

progressText.textContent = `Workouts completed: ${workoutsCompleted}`;

let currentStreak = localStorage.getItem("currentStreak");
let lastWorkoutDate = localStorage.getItem("lastWorkoutDate");

if (currentStreak === null) {
    currentStreak = 0;
}

streakText.textContent = `Current streak: ${currentStreak} days`;

generateBtn.addEventListener("click", function () {

    const weight = Number(weightInput.value);
    const height = heightInput.value;

    const energy = energyLevel.value;
    const time = Number(workoutTime.value);
    const diet = dietQuality.value;

    let workoutPlan = "";
    let difficulty = "";

    if (weight >= 240) {
        difficulty = "Starter Safe";
    } else if (weight >= 200) {
        difficulty = "Moderate";
    } else {
        difficulty = "Standard";
    }

    console.log(difficulty);

    let motivationMessage = "";

    if (diet === "rough") {

        motivationMessage = "One rough meal does not ruin your progress.";

    }

    else if (diet === "okay") {

        motivationMessage = "You're building better habits one day at a time."

    }

    else {

        motivationMessage = "Great job fueling your body today.";

    }

    console.log(motivationMessage);

    if (energy === "low") {

        if (time === 5) {

            workoutPlan = `
                <h2>${difficulty} Quick Recovery Core</h2>
                <h3>Today's Mission</h3>
                <p>Finish the workout without worrying about perfection.</p>
                <p>5 crunches</p>
                <p>10 second plank</p>
                <p>Small progress is still progress.</p>
                <p class="motivation">${motivationMessage}</p>
            `;

        }

        else {

            workoutPlan = `
                <h2>Recovery Core Day</h2>
                <p>5 minute walk</p>
                <p>10 crunches</p>
                <p>15 second plank</p>
                <p>Hydrate and stay consistent today.</p>
                <p class="motivation">${motivationMessage}</p>
            `;

        }

    }

    else if (energy === "medium") {

        workoutPlan = `
            <h2>Balanced Core Workout</h2>
            <p>20 crunches</p>
            <p>15 knee raises</p>
            <p>30 sec plank</p>
            <p>10 mountain climbers</p>
            <p>Stay focused and keep pushing.</p>
            <p class="motivation">${motivationMessage}</p>
        `;
    }

    else {

        workoutPlan = `
            <h2>Intense Ab Burn</h2>
            <p>30 crunches</p>
            <p>20 leg raises</p>
            <p>45 second plank</p>
            <p>20 mountain climbers</p>
            <p>High energy day. Push yourself.</p>
            <p class="motivation">${motivationMessage}</p>
        `;
    }

    workoutResult.innerHTML = workoutPlan;

});

completeBtn.addEventListener("click", function () {
    workoutsCompleted = Number(workoutsCompleted) + 1;
    localStorage.setItem("workoutsCompleted", workoutsCompleted);
    progressText.textContent = `Workouts completed: ${workoutsCompleted}`;

    const today = new Date().toDateString();

    if (lastWorkoutDate !== today) {
        currentStreak = Number(currentStreak) + 1;
        lastWorkoutDate = today;

        localStorage.setItem("currentStreak", currentStreak);
        localStorage.setItem("lastWorkoutDate", lastWorkoutDate);
    }

    streakText.textContent = `Current streak: ${currentStreak} days`;
});

if ("serviceWorker" in navigator) {

    navigator.serviceWorker.register("./service-worker.js")
        .then(function () {

            console.log("Service Worker Registered");

        });

}