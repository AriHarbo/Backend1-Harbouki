const url = "http://localhost:8080/api/sessions/online";
const opts = {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "token": localStorage.getItem("token")  // Verifica si el token está presente
    }
};

async function verifyOnline() {
    try {
        // Verifica si el token está presente antes de hacer la solicitud
        const token = localStorage.getItem("token");
        if (!token) {
            console.log("No token found in localStorage.");
            return;  // Si no hay token, no hacemos la solicitud
        }

        let response = await fetch(url, opts);

        // Verifica si la respuesta fue exitosa
        if (!response.ok) {
            console.log("Failed to verify online status. Status:", response.status);
            return;
        }

        let data = await response.json();
        console.log("Response Data: ", data);  // Verifica qué datos devuelve la API

        const { isOnline } = data;
        console.log("User is online:", isOnline);  // Loguea si está online

        const navbar = document.querySelector("#navbar");

        if (isOnline) {
            navbar.innerHTML = "";
            const homeLink = createNavLink("/home", "Home");
            const cartLink = createNavLink("/cart", "Ver carrito");
            const logoutLink = createNavLink("#", "Cerrar sesión");

            logoutLink.addEventListener("click", () => {
                localStorage.removeItem("token");
                window.location.reload();
            });

            navbar.append(homeLink, cartLink, logoutLink);
        } else {
            console.log("User is not online");
        }

    } catch (error) {
        console.error("Error verifying online status:", error);
    }
}

// Función auxiliar para crear enlaces del navbar
function createNavLink(href, text) {
    const link = document.createElement("a");
    link.href = href;
    link.textContent = text;
    return link;
}

verifyOnline();
