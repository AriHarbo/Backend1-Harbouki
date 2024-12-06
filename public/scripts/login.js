import { showNotification } from './notifications.js';

const selector = document.querySelector("#login")

selector.addEventListener("click", async ()=>{
    try {
        event.preventDefault()
        const data = {
            email: document.querySelector("#email").value,
            password: document.querySelector("#password").value
        }
        const options = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data),
        }
        let response = await fetch("http://localhost:8080/api/sessions/login", options)
        response = await response.json()
        localStorage.setItem("token", response.token)
        showNotification("You have logged in successfully!", "success")
        window.location.href = "/home"
    } catch (error) {
        alert(error.message)
    }
})