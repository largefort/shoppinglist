document.getElementById("add-button").addEventListener("click", addItem);
document.getElementById("enable-notifications").addEventListener("click", enableNotifications);

let notificationPermission = false;

// Function to add items to the shopping list
function addItem() {
    const itemInput = document.getElementById("item-input");
    const itemsList = document.getElementById("items-list");

    if (itemInput.value.trim() !== "") {
        const li = document.createElement("li");
        li.textContent = itemInput.value;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Eyða";
        deleteButton.addEventListener("click", () => li.remove());

        li.appendChild(deleteButton);
        itemsList.appendChild(li);

        itemInput.value = "";
    }
}

// Function to set reminders for specific stores
function setReminder(store, hours) {
    const message = document.getElementById("reminder-message");
    message.textContent = `Mundu að fara í ${store} næst! Opið frá ${hours}.`;

    if (notificationPermission) {
        scheduleNotification(store, hours);
    }
}

// Enable notifications
function enableNotifications() {
    if (Notification.permission === "default") {
        Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
                notificationPermission = true;
                alert("Tilkynningar virkjaðar!");
            } else {
                alert("Tilkynningar hafnað.");
            }
        });
    } else if (Notification.permission === "granted") {
        notificationPermission = true;
        alert("Tilkynningar eru nú þegar virkjaðar.");
    } else {
        alert("Tilkynningar eru ekki leyfðar af vafranum.");
    }
}

// Schedule a notification for the store
function scheduleNotification(store, hours) {
    const items = Array.from(document.querySelectorAll("#items-list li")).map(
        (li) => li.textContent.replace("Eyða", "").trim()
    );

    const itemList = items.length > 0 ? `Vörur: ${items.join(", ")}` : "Engar vörur á listanum.";

    new Notification(`Innkaupalisti áminning`, {
        body: `Fara í ${store} áður en það lokar (${hours}). ${itemList}`,
        icon: "https://via.placeholder.com/128" // Replace with an actual icon URL
    });
}

// Background notification example (triggered after 5 minutes)
setInterval(() => {
    if (notificationPermission) {
        const items = Array.from(document.querySelectorAll("#items-list li")).map(
            (li) => li.textContent.replace("Eyða", "").trim()
        );

        if (items.length > 0) {
            new Notification("Tími til að versla!", {
                body: `Þú hefur eftirfarandi vörur á listanum: ${items.join(", ")}.`,
                icon: "https://via.placeholder.com/128" // Replace with an actual icon URL
            });
        }
    }
}, 300000); // 300,000ms = 5 minutes
