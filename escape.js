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

// The correct SQL query
const correctOrder = [
    "SELECT",
    "*",
    "FROM",
    "RIVALS"
];

// Get the important page elements for challenge 1
const sqlBlocks = document.querySelectorAll(".sql-block");
const querySlots = document.querySelectorAll(".query-slot");
const sqlBlockContainer = document.getElementById("sqlBlocks");
const runQueryButton = document.getElementById("runQuery");
const resetQueryButton = document.getElementById("resetQuery");
const queryMessage = document.getElementById("queryMessage");
const successPopup = document.getElementById("successPopup");
const closePopup = document.getElementById("closePopup");
const continueButton = document.getElementById("continueButton");

// DRAGGING

let draggedBlock = null;

// When the player starts dragging a block
sqlBlocks.forEach(function (block) {
    block.addEventListener("dragstart", function (event) {
        draggedBlock = block;
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", block.dataset.value);
        block.style.opacity = "0.5";
    });

    // When dragging ends
    block.addEventListener("dragend", function () {
        block.style.opacity = "1";
        draggedBlock = null;
    });
});

// DROP ZONES

querySlots.forEach(function (slot) {
    
    // Allow something to be dragged over the slot
    slot.addEventListener("dragover", function (event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
        slot.classList.add("drag-over");
    });

    // Remove highlight
    slot.addEventListener("dragleave", function () {
        slot.classList.remove("drag-over");
    });

    // When a block is dropped
    slot.addEventListener("drop", function (event) {
        event.preventDefault();
        slot.classList.remove("drag-over");
        
        if (!draggedBlock) {
            return;
        }

        /* If this slot already contains a block, return that block to the original
        block area. */
        const existingBlock = slot.querySelector(".sql-block");

        if (existingBlock) {
            sqlBlockContainer.appendChild(existingBlock);
        }

        // Put the dragged block inside the slot
        slot.appendChild(draggedBlock);

        // Clear "Drop here"
        const placeholder = slot.querySelector("span");
        if (placeholder) {
            placeholder.remove();
        }
    });
});

// RESET

resetQueryButton.addEventListener("click", function () {
    resetPuzzle();
});

const resetPuzzle = () => {
    // Put every block back into the original block container.
    document.querySelectorAll(".query-slot .sql-block").forEach(function (block) {
        sqlBlockContainer.appendChild(block);
    });

    // Restore the "Drop here" text inside each slot.
    querySlots.forEach(function (slot) {
        slot.innerHTML = "<span>Drop here</span>";
    });

    queryMessage.textContent = "";
    queryMessage.className = "query-message";
};

// CHECK QUERY
runQueryButton.addEventListener("click", function () {
    const currentOrder = [];

    // Look at each slot from left to right
    querySlots.forEach(function (slot) {
        const block = slot.querySelector(".sql-block");
        if (block) {
            currentOrder.push(block.dataset.value);
        }
    });

    // Make sure all four blocks were placed
    if (currentOrder.length !== 4) {
        queryMessage.textContent = "The query is incomplete. Place all four blocks first.";
        queryMessage.className = "query-message error";
        return;
    }

    // Check whether the order is correct
    const isCorrect = currentOrder.every(function (value, index) {
        return value === correctOrder[index];
    });

    if (isCorrect) {
        queryMessage.textContent = "✓ Query executed successfully!";
        queryMessage.className = "query-message success";

        // Give the player a tiny delay before popup
        setTimeout(function () {
            showSuccessPopup();
        }, 500);
    } else {
        queryMessage.textContent = "✗ Invalid query. Check the order of the commands.";
        queryMessage.className = "query-message error";
    }
});

// SUCCESS

const showSuccessPopup = () => {
    successPopup.classList.add("show");
}

// CONTINUE TO NEXT CHALLENGE
continueButton.addEventListener("click", function () {
    
    // Save Challenge 1 as completed
    const currentProgress = Number.parseInt(localStorage.getItem(STORAGE_KEY), 10);

    // Only update the progress if the player hasn't already completed the challenge.
    if (Number.isNaN(currentProgress) || currentProgress < 1) {
        localStorage.setItem(STORAGE_KEY, "1");
    }

    // Go back to the home page. Challenge 2 should now be active.
    window.location.href = "index.html";
});
