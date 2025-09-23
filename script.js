const formBox = document.getElementById("post-form")
const mainBox = document.querySelector(".main-container")
const postForm = document.getElementById("post-form")
const sendButton = document.getElementById("send-button")
const resetButton = document.getElementById("reset-button")


formBox.addEventListener("submit", (e) => {
    e.preventDefault()
    const formData = new FormData(formBox)
    const userTitle = formData.get("user-title")
    const userMessagae = formData.get("user-message")
    const presentTime = new Date()
    const postTime = presentTime.toLocaleTimeString()
    const ppp = document.createElement("p")
    ppp.textContent = postTime

    
    mainBox.appendChild(ppp)
    console.log(ppp)
    

    
})

// notes för imorgon

// lägg in all data som skickas av formuläret i en array, 




// Arrayen håller alla poster (t.ex. flera fält från ditt form).

// Varje post är ett objekt: { id, title, message, time, ... }.

// Vid submit: skapa ett objekt → pusha in i arrayen → spara arrayen i localStorage → rendera posten.

// Vid sidladdning: läs från localStorage → rendera alla.







// function createPost() {
//     const 
// }


// function createPost(userPost) {
//     const postDiv = document.createElement("div")
//     postDiv.id = "post-div"



//     const message = document.createElement("p")
//     message.id = "user-message"


// }