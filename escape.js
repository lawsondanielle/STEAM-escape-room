const STORAGE_KEY = "blueEscapeRoomProgress";

// Get current progress on challenge completion

const getProgress = () => {
    
    const savedProgress = Number.parseInt(localStorage.getItem(STORAGE_KEY), 10);

    if (Number.isNaN(savedProgress)) {
        return 0;
    }

    return Math.min(Math.max(savedProgress, 0), 3);

};

// Save progress after challenges are completed

const setProgress = (progress) => {

    progress = Math.min(Math.max(progress, 0), 3);
    localStorage.setItem(STORAGE_KEY, progress);

};

// Complete a challenge
const completeChallenge = (challengeNumber) => {

    const currentProgress = getProgress();

    /* This if conditional is to make sure that if the user decides to revisit a
    challenge, the progress doesn't go backwards */
    if (challengeNumber > currentProgress) {
        setProgress(challengeNumber);
    }

};

// Make the function available to the challenge pages.
window.completeChallenge = completeChallenge;

// Set up the home page
document.addEventListener(
    "DOMContentLoaded",
    function () {
        const progress = getProgress();
        const challenges = document.querySelectorAll(".challenge");

        challenges.forEach(
            function (challenge) {
                const challengeNumber = Number(challenge.dataset.challenge);

                // COMPLETED CHALLENGE
                if (challengeNumber <= progress) {
                    challenge.classList.add("complete");
                    challenge.classList.remove("active");
                    challenge.classList.remove("locked");
                    challenge.disabled = true;
                }

                // NEXT AVAILABLE CHALLENGE
                else if (challengeNumber === progress + 1) {
                    challenge.classList.add("active");
                    challenge.classList.remove("locked");
                    challenge.disabled = false;
                }

                // FUTURE CHALLENGE
                else {
                    challenge.classList.add("locked");
                    challenge.classList.remove("active");
                    challenge.disabled = true;
                }
            }
        );

        // Clicking a challenge
        challenges.forEach(
            function (challenge) {
                challenge.addEventListener("click", function () {
                    // Don't do anything if the challenge isn't currently available.
                    if (!challenge.classList.contains("active")) {
                        return;
                    }

                    const challengeNumber = Number(challenge.dataset.challenge);

                    // Send player to appropriate challenge page.
                    window.location.href = `challenge${challengeNumber}.html`;
                });
            }
        );
    }
);