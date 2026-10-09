const STORAGE_KEY = "blueEscapeRoomProgress";

// PROGRESS FUNCTIONS

const getProgress = () => {
    const savedProgress = Number.parseInt(localStorage.getItem(STORAGE_KEY), 10);

    if (Number.isNaN(savedProgress)) {
        return 0;
    }

    return Math.min(Math.max(savedProgress, 0), 3);
};

const setProgress = (progress) => {
    progress = Math.min(Math.max(progress, 0), 3);
    localStorage.setItem(STORAGE_KEY, progress);
};

const completeChallenge = (challengeNumber) => {
    const currentProgress = getProgress();
    
    if (challengeNumber > currentProgress) {
        setProgress(challengeNumber);
    }
};

window.completeChallenge = completeChallenge;

// PAGE SETUP

document.addEventListener("DOMContentLoaded", function () {

    // HOME PAGE

    const challenges = document.querySelectorAll(".challenge");

    if (challenges.length > 0) {
        const progress = getProgress();

        challenges.forEach(function (challenge) {
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
        });

        // CLICKING A CHALLENGE

        challenges.forEach(function (challenge) {
            
            challenge.addEventListener("click", function () {
                
                if (!challenge.classList.contains("active")) {
                    return;
                }

                const challengeNumber = Number(challenge.dataset.challenge);
                window.location.href = `challenge${challengeNumber}.html`;
            });
        });
    }

    // CHALLENGE 1 - SQL PUZZLE

    const sqlBlocks = document.querySelectorAll(".sql-block");

    // If there are no SQL blocks, this is not Challenge 1.

    if (sqlBlocks.length > 0) {
        const querySlots = document.querySelectorAll(".query-slot");
        const sqlBlockContainer = document.getElementById("sqlBlocks");
        const runQueryButton = document.getElementById("runQuery");
        const resetQueryButton = document.getElementById("resetQuery");
        const queryMessage = document.getElementById("queryMessage");
        const successPopup = document.getElementById("successPopup");
        const closePopup = document.getElementById("closePopup");
        const continueButton = document.getElementById("continueButton");

        const correctOrder = [
            "SELECT",
            "*",
            "FROM",
            "RIVALS"
        ];

        let draggedBlock = null;

        // DRAGGING

        sqlBlocks.forEach(function (block) {
            block.addEventListener("dragstart", function (event) {
                draggedBlock = block;
                event.dataTransfer.effectAllowed = "move";
                event.dataTransfer.setData("text/plain", block.dataset.value);
                block.style.opacity = "0.5";
            });

            block.addEventListener("dragend", function () {
                block.style.opacity = "1";
                draggedBlock = null;
            });
        });

        // DROP ZONES
        querySlots.forEach(function (slot) {
            slot.addEventListener("dragover", function (event) {
                event.preventDefault();
                event.dataTransfer.dropEffect = "move";
                slot.classList.add("drag-over");
            });

            slot.addEventListener("dragleave", function () {
                slot.classList.remove("drag-over");
            });

            slot.addEventListener("drop", function (event) {
                event.preventDefault();
                slot.classList.remove("drag-over");

                if (!draggedBlock) {
                    return;
                }

                const existingBlock = slot.querySelector(".sql-block");
                
                if (existingBlock) {
                    sqlBlockContainer.appendChild(existingBlock);
                }

                slot.appendChild(draggedBlock);
                const placeholder = slot.querySelector("span");

                if (placeholder) {
                    placeholder.remove();
                }
            });
        });

        // RESET SQL PUZZLE

        if (resetQueryButton) {

            resetQueryButton.addEventListener("click", function () {

                document.querySelectorAll(".query-slot .sql-block").forEach(function (block) {
                    sqlBlockContainer.appendChild(block);
                });

                querySlots.forEach(function (slot) {
                    slot.innerHTML = "<span>Drop here</span>";
                });

                queryMessage.textContent = "";
                queryMessage.className = "query-message";
            });
        }

        // CHECK SQL QUERY

        if (runQueryButton) {
            runQueryButton.addEventListener("click", function () {
                const currentOrder = [];

                querySlots.forEach(function (slot) {
                    const block = slot.querySelector(".sql-block");

                    if (block) {
                        currentOrder.push(block.dataset.value);
                    }
                });

                if (currentOrder.length !== 4) {
                    queryMessage.textContent = "The query is incomplete. Place all four blocks first.";
                    queryMessage.className = "query-message error";
                    return;
                }

                const isCorrect = currentOrder.every(function (value, index) {
                    return (value === correctOrder[index]);
                });

                if (isCorrect) {
                    queryMessage.textContent = "✓ Query executed successfully!";
                    queryMessage.className = "query-message success";
                    setTimeout(function () {
                        if (successPopup) {
                            successPopup.classList.add("show");
                        }
                    }, 500);
                } else {
                    queryMessage.textContent = "✗ Invalid query. Check the order of the commands.";
                    queryMessage.className = "query-message error";
                }
            });
        }

        // CLOSE SQL POPUP

        if (closePopup) {
            closePopup.addEventListener("click", function () {
                successPopup.classList.remove("show");
            });
        }

        // CONTINUE FROM CHALLENGE 1

        if (continueButton) {
            continueButton.addEventListener("click", function () {
                completeChallenge(1);
                window.location.href = "index.html";
            });
        }
    }

    // CHALLENGE 2 - PASSWORD PUZZLE

    const passwordItems = document.querySelectorAll(".password-item");

    // If there are no password items, this is not Challenge 2.
    if (passwordItems.length > 0) {
        const passwordDropZones = document.querySelectorAll(".password-drop-zone");
        const passwordOptions = document.getElementById("passwordOptions");
        const checkPasswordsButton = document.getElementById("checkPasswords");
        const resetPasswordsButton = document.getElementById("resetPasswords");
        const passwordMessage = document.getElementById("passwordMessage");
        const passwordSuccessPopup = document.getElementById("passwordSuccessPopup");
        const closePasswordPopup = document.getElementById("closePasswordPopup");
        const continuePasswordButton = document.getElementById("continuePasswordButton");

        let draggedPassword = null;

        // DRAGGING PASSWORDS

        passwordItems.forEach(function (password) {
            password.addEventListener("dragstart", function (event) {
                draggedPassword = password;
                event.dataTransfer.effectAllowed = "move";
                event.dataTransfer.setData("text/plain", password.dataset.password);
                password.style.opacity = "0.5";
            });

            password.addEventListener("dragend", function () {
                password.style.opacity = "1";
                draggedPassword = null;
            });
        });

        // PASSWORD DROP ZONES
        passwordDropZones.forEach(function (dropZone) {
            
            dropZone.addEventListener("dragover", function (event) {
                event.preventDefault();
                event.dataTransfer.dropEffect = "move";
                dropZone.classList.add("drag-over");
            });

            dropZone.addEventListener("dragleave", function () {
                dropZone.classList.remove("drag-over");
            });

            dropZone.addEventListener("drop", function (event) {
                event.preventDefault();
                dropZone.classList.remove("drag-over");
                
                if (!draggedPassword) {
                    return;
                }

                // Move the password into this security-level column.
                dropZone.appendChild(draggedPassword);

                // Remove the "Drop passwords here" message after the first password is dropped.
                const dropMessage = dropZone.querySelector(".drop-message");

                if (dropMessage) {
                    dropMessage.remove();
                }
            });
        });

        // CHECK PASSWORDS

        if (checkPasswordsButton) {
            checkPasswordsButton.addEventListener("click", function () {
                let allCorrect = true;
                let totalPlaced = 0;

                passwordDropZones.forEach(function (dropZone) {
                    const column = dropZone.closest(".password-column");
                    const correctLevel = column.dataset.level;
                    const passwords = dropZone.querySelectorAll(".password-item");
                    
                    passwords.forEach(function (password) {
                        totalPlaced++;
                        const actualLevel = password.dataset.level;

                        if (actualLevel !== correctLevel) {
                            allCorrect = false;
                        }
                    });
                });

                // Make sure every password was placed somewhere.
                if (totalPlaced !== passwordItems.length) {
                    passwordMessage.textContent = "Please place every password into a security level.";
                    passwordMessage.className = "query-message error";
                    return;
                }

                if (allCorrect) {
                    passwordMessage.textContent = "✓ All passwords are correctly classified!";
                    passwordMessage.className = "query-message success";
                    setTimeout(function () {
                        if (passwordSuccessPopup) {
                            passwordSuccessPopup.classList.add("show");
                        }
                    }, 500);
                } else {
                    passwordMessage.textContent = "✗ Some passwords are in the wrong security level. Check the password strength again.";
                    passwordMessage.className = "query-message error";
                }
            });
        }

        // RESET PASSWORD PUZZLE
        
        if (resetPasswordsButton) {
            resetPasswordsButton.addEventListener("click", function () {
                
                // Put all passwords back into the password box.
                passwordItems.forEach(function (password) {
                    passwordOptions.appendChild(password);
                });

                // Restore the drop-zone messages.
                passwordDropZones.forEach(function (dropZone) {
                    dropZone.innerHTML = `<p class="drop-message">Drop passwords here</p>`;
                });

                passwordMessage.textContent = "";
                passwordMessage.className = "query-message";
            });
        }

        // CLOSE PASSWORD POPUP

        if (closePasswordPopup) {
            closePasswordPopup.addEventListener("click", function () {
                passwordSuccessPopup.classList.remove("show");
            });
        }

        // CONTINUE TO CHALLENGE 3

        if (continuePasswordButton) {
            continuePasswordButton.addEventListener("click", function () {
                completeChallenge(2);
                window.location.href = "index.html";
            });
        }
    }
    // CHALLENGE 3 - PHISHING OR REAL

    const messageCards = document.querySelectorAll(".message-card");

    // Only run this code on Challenge 3.
    if (messageCards.length > 0) {
        const messageList = document.getElementById("messageList");
        const messageDropZones = document.querySelectorAll(".message-drop-zone");
        const checkMessagesButton = document.getElementById("checkMessages");
        const resetMessagesButton = document.getElementById("resetMessages");
        const messageResult = document.getElementById("messageResult");
        const messageSuccessPopup = document.getElementById("messageSuccessPopup");
        const closeMessagePopup = document.getElementById("closeMessagePopup");
        const continueMessageButton = document.getElementById("continueMessageButton");

        let draggedMessage = null;

        // MAKE MESSAGES DRAGGABLE

        messageCards.forEach(function (card) {
            card.addEventListener("dragstart", function (event) {
                draggedMessage = card;
                event.dataTransfer.effectAllowed = "move";
                event.dataTransfer.setData("text/plain", card.dataset.answer);
                card.classList.add("dragging");
            });

            card.addEventListener("dragend", function () {
                card.classList.remove("dragging");
                draggedMessage = null;
            });
        });

        // MAKE THE PHISHING AND REAL PANELS DROP TARGETS

        messageDropZones.forEach(function (dropZone) {
            dropZone.addEventListener("dragover", function (event) {
                event.preventDefault();
                event.dataTransfer.dropEffect = "move";
                dropZone.classList.add("drag-over");
            });

            dropZone.addEventListener("dragleave", function (event) {
                if (!dropZone.contains(event.relatedTarget)) {
                    dropZone.classList.remove("drag-over");
                }
            });

            dropZone.addEventListener("drop", function (event) {
                event.preventDefault();
                dropZone.classList.remove("drag-over");

                if (!draggedMessage) {
                    return;
                }

                // Move the entire message card into the selected panel.
                dropZone.appendChild(draggedMessage);

                // Remove the empty-panel instruction.
                const dropMessage = dropZone.querySelector(".drop-message");

                if (dropMessage) {
                    dropMessage.remove();
                }

                messageResult.textContent = "";
                messageResult.className = "query-message";
            });
        });

        // CHECK THE ANSWERS

        if (checkMessagesButton) {
            checkMessagesButton.addEventListener("click", function () {
                let totalPlaced = 0;
                let allCorrect = true;

                messageDropZones.forEach(function (dropZone) {
                    const selectedCategory = dropZone.dataset.category;
                    const cards = dropZone.querySelectorAll(".message-card");

                    cards.forEach(function (card) {
                        totalPlaced++;

                        if (card.dataset.answer !== selectedCategory) {
                            allCorrect = false;
                        }
                    });
                });

                // Make sure every message has been sorted.
                if (totalPlaced !== messageCards.length) {
                    messageResult.textContent = "Please sort all three messages into the Phishing or Real column.";
                    messageResult.className = "query-message error";
                    return;
                }

                if (allCorrect) {
                    messageResult.textContent = "✓ Correct! You identified every message successfully.";
                    messageResult.className = "query-message success";

                    setTimeout(function () {
                        if (messageSuccessPopup) {
                            messageSuccessPopup.classList.add("show");
                        }
                    }, 500);
                } else {
                    messageResult.textContent = "✗ Not quite! Check the sender and the message for suspicious requests or offers.";
                    messageResult.className = "query-message error";
                }
            });
        }

        // RESET THE PUZZLE

        if (resetMessagesButton) {
            resetMessagesButton.addEventListener("click", function () {
                
                // Return all messages to Blue's inbox.
                messageCards.forEach(function (card) {
                    messageList.appendChild(card);
                });

                // Restore the empty-column instructions.
                messageDropZones.forEach(function (dropZone) {
                    dropZone.innerHTML = `<p class="drop-message">Drop messages here</p>`;
                });

                messageResult.textContent = "";
                messageResult.className = "query-message";

                if (messageSuccessPopup) {
                    messageSuccessPopup.classList.remove("show");
                }
            });
        }

        // CLOSE THE SUCCESS POPUP

        if (closeMessagePopup) {
            closeMessagePopup.addEventListener("click", function () {
                messageSuccessPopup.classList.remove("show");
            });
        }

        // COMPLETE CHALLENGE 3

        if (continueMessageButton) {
            continueMessageButton.addEventListener("click", function () {
                completeChallenge(3);
                window.location.href = "index.html";
            });
        }
    }
});
