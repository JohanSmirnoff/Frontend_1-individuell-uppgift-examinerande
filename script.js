const formBox = document.getElementById("post-form")
const mainDiv = document.querySelector(".main-container")
// const postForm = document.getElementById("post-form")
const sendButton = document.getElementById("send-button")
const resetButton = document.getElementById("reset-button")

const blogPosts = []

// En funktion för att skicka in userinput i en array, (trimma till små bokstäver) 
function addUserInput(input) {
    return {
        id: crypto.randomUUID(),
        author: input.get("user-name"),
        title: input.get("user-title"),
        message: input.get("user-message"),
        timestamp: new Date().toLocaleTimeString()
    }
}

function renderUserInput(blogPost) {
    const blogDiv = document.createElement("div")
    blogDiv.className = "blog-container"

    const userName = document.createElement("p")
    const userTitle = document.createElement("p")
    const userMessage = document.createElement("p")
    const timeStamp = document.createElement("p")

    userName.textContent = blogPost.author
    userTitle.textContent = blogPost.title
    userMessage.textContent = blogPost.message
    timeStamp.textContent = blogPost.timestamp
    
    blogDiv.append(userName, userTitle, userMessage, timeStamp)
    mainDiv.appendChild(blogDiv)
}


formBox.addEventListener("submit", (e) => {
    e.preventDefault()
    const formInput = new FormData(formBox)
    const author = formInput.get("user-name")
    const title = formInput.get("user-title")
    const message = formInput.get("user-message")
    
    const createdBlogPost = addUserInput(formInput)
    blogPosts.push(createdBlogPost)
    renderUserInput(createdBlogPost)
    
    formBox.reset()
    console.log(blogPosts)
})










// notes för imorgon

// lägg in all data som skickas av formuläret i en array, 




// Arrayen håller alla poster (t.ex. flera fält från ditt form).

// Varje post är ett objekt: { id, title, message, time, ... }.

// Vid submit: skapa ett objekt → pusha in i arrayen → spara arrayen i localStorage → rendera posten.

// Vid sidladdning: läs från localStorage → rendera alla.