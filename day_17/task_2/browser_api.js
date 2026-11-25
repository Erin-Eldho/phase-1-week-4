// 1. Clipboard API - Copy all code blocks
function initCodeCopy() {
    document.querySelectorAll("pre code").forEach(code => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "copy-code-button";
        button.textContent = "Copy";
        button.addEventListener("click", async () => {
            try {
                await navigator.clipboard.writeText(code.innerText);
                button.textContent = "Copied!";
                setTimeout(() => {
                    button.textContent = "Copy";
                }, 2000);
            } catch (error) {
                button.textContent = "Copy failed";
                console.error("Clipboard error:", error);
            }
        });
        code.parentElement.appendChild(button);
    });
}


// 2. Notification API - Request permission
function initNotifications() {
    const button = document.getElementById("enable-notifications");
    if (!button) return;
    if (!("Notification" in window)) {
        button.disabled = true;
        button.textContent = "Notifications not supported";
        return;
    }
    button.addEventListener("click", async () => {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
            button.textContent = "Notifications Enabled";
        } else {
            button.textContent = "Notifications Not Enabled";
        }
    });
}

// Show notification after successful form submission
export function showSuccessNotification() {
    if (
        "Notification" in window &&
        Notification.permission === "granted"
    ) {
        new Notification("Black Pearl Solutions", {
            body: "Your message has been submitted successfully!"
        });
    }
}


// 3. Geolocation API - Detect city
function initGeolocation() {
    const locationInput = document.getElementById("location");
    const locationStatus = document.getElementById("location-status");
    if (!locationInput || !locationStatus) return;
    if (!navigator.geolocation) {
        locationStatus.textContent = "Geolocation is not supported.";
        return;
    }
    navigator.geolocation.getCurrentPosition(
        async position => {
            const { latitude, longitude } = position.coords;
            try {
                const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
                if (!response.ok) {
                    throw new Error("Unable to retrieve city.");
                }
                const data = await response.json();
                const city = data.city || data.locality;
                if (city) {
                    locationInput.value = city;
                    locationStatus.textContent = "Location detected.";
                } else {
                    locationStatus.textContent = "City not found. Enter manually.";
                }
            } catch (error) {
                locationStatus.textContent = "Unable to detect city. Enter manually.";
                console.error("Geolocation error:", error);
            }
        },
        error => {
            if (error.code === error.PERMISSION_DENIED) {
                locationStatus.textContent =
                    "Permission denied. Enter your city manually.";
            } else {
                locationStatus.textContent =
                    "Unable to detect location. Enter manually.";
            }
        }
    );
}


// 4. Web Share API with clipboard fallback
function initShare() {
    const button = document.getElementById("share-page");
    const status = document.getElementById("share-status");
    if (!button || !status) return;
    button.addEventListener("click", async () => {
        const shareData = {
            title: document.title,
            text: "Check out this page!",
            url: window.location.href
        };
        try {
            if (navigator.share) {
                await navigator.share(shareData);
                status.textContent = "Page shared successfully.";
            } else {
                await navigator.clipboard.writeText(shareData.url);
                status.textContent = "Page URL copied to clipboard.";
            }
        } catch (error) {
            if (error.name !== "AbortError") {
                status.textContent = "Unable to share the page.";
                console.error("Share error:", error);
            }
        }
    });
}

export function initBrowserAPIs() {
    initCodeCopy();
    initNotifications();
    initGeolocation();
    initShare();
}
