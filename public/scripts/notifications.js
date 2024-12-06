export function showNotification(message, type = "success") {
    const container = document.getElementById("notification-container");

    const notification = document.createElement("div");
    notification.textContent = message;
    notification.className = `notification ${type}`;
    Object.assign(notification.style, {
        backgroundColor: type === "success" ? "#4caf50" : "#f44336",
        color: "#fff",
        padding: "10px 20px",
        margin: "30px 0",
        borderRadius: "5px",
        boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
        opacity: "0",
        transition: "opacity 0.3s ease",
    });

    container.appendChild(notification);
    setTimeout(() => (notification.style.opacity = "1"), 10);
    setTimeout(() => {
        notification.style.opacity = "0";
        setTimeout(() => container.removeChild(notification), 300);
    }, 3000);
    console.log(`${type}: ${message}`);
}
