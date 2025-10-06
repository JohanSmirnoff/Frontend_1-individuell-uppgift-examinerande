const userBox = document.getElementById("user-form")
const formBox = document.getElementById("post-form")
const mainDiv = document.querySelector(".main-container")
const sendButton = document.getElementById("send-button")
const resetButton = document.getElementById("reset-button")

const blogPosts = []
let currentUser = ""

// Start på localstorage
const BLOG_STORAGE = "blogPosts"
const USER_STORAGE = "currentUser"

// Spara localStorage
function saveStorage() {
    localStorage.setItem(BLOG_STORAGE, JSON.stringify(blogPosts))
    localStorage.setItem(USER_STORAGE, currentUser)
}

// Ladda localStorage
function loadStorage() {
    blogPosts.length = 0
    const savedPosts = JSON.parse(localStorage.getItem(BLOG_STORAGE) || "[]")
    blogPosts.push(...savedPosts)
    currentUser = localStorage.getItem(USER_STORAGE) || ""
}

// Först ta bort gamla och rendera ut nya posts
function renderAllPosts() {
    document.querySelectorAll(".blog-container").forEach(element => element.remove())
    blogPosts.slice().forEach(renderBlogInput)
    if (currentUser) renderUserInput({author: currentUser})
}


// Funktion för att bara sätta username
function addUserInput(addUserName) {
    return {
        author: addUserName.get("user-name").toString().trim()
    }
}

// Funktion för att rendera bara username
function renderUserInput(renderUserName) {
    let userDisplay = document.getElementById("user-display")
    if (!userDisplay) {
        userDisplay = document.createElement("p")
        userDisplay.id ="user-display"
        userBox.appendChild(userDisplay)
    }
    userDisplay.textContent = renderUserName.author
}

// En funktion för att skicka in userinput i arrayen blogPosts, (trimma till små bokstäver senare?) 
function addBlogInput(addBlogInfo) {
    return {
        id: crypto.randomUUID(),
        author: currentUser,
        title: addBlogInfo.get("user-title"),
        message: addBlogInfo.get("user-message"),
        timestamp: new Date().toLocaleTimeString()
    }
}

// Funktion för att rendera och skapa alla element som behövs för att få nån output i HTML
function renderBlogInput(renderBlogPost) {
    const blogDiv = document.createElement("div")
    blogDiv.className = "blog-container"

    const timeStamp = document.createElement("p")
    const userName = document.createElement("p")
    const userTitle = document.createElement("p")
    const userMessage = document.createElement("p")

    userName.textContent = `Användare: ${renderBlogPost.author}`
    userTitle.textContent = `Titel: ${renderBlogPost.title}`
    userMessage.textContent = renderBlogPost.message
    timeStamp.textContent = renderBlogPost.timestamp
    
    mainDiv.prepend(blogDiv)
    blogDiv.prepend(timeStamp, userName, userTitle, userMessage)
}

// En till funktion för att trigga submit i formuläret vid keydown "enter" och alla fält är ifyllda.
formBox.addEventListener("keydown", (e) => {
    if (e.key == "Enter" && e.target.tagName === "TEXTAREA") {
        e.preventDefault()
        formBox.requestSubmit()
    }
})

// Event för namerutan
userBox.addEventListener("submit", (e) => {
    e.preventDefault() 
    const userInput = new FormData(userBox)
    const author = userInput.get("user-name")
    const createdUserName = addUserInput(userInput)
    if (!author) {
        alert("Skriv in ett användarnamn")
        return
    }
    if (author.toLocaleLowerCase() === currentUser.toLocaleLowerCase()) {
        alert("Du har skrivit in samma namn igen")
        return
    }
    currentUser = (createdUserName.author)
    renderUserInput({author: currentUser})
    saveStorage()
    userBox.reset()
})

// Eventlistener för formuläret du fyller i för själva inläggen
formBox.addEventListener("submit", (e) => {
    e.preventDefault()
    const formInput = new FormData(formBox)
    const author = formInput.get("user-name")
    const title = (formInput.get("user-title") || "")
    const message = (formInput.get("user-message") || "")
    
    if (!currentUser) {
        alert("Skriv in ett användarnamn uppe i högra hörnet och tryck enter för att spara det.")
        return
    }
    const createdBlogPost = addBlogInput(formInput)
    blogPosts.push(createdBlogPost)
    renderBlogInput(createdBlogPost)
    saveStorage()
    formBox.reset()
    console.log(blogPosts)
})

loadStorage()
renderAllPosts()





// Vid submit: skapa ett objekt → pusha in i arrayen → spara arrayen i localStorage → rendera posten.

// Vid sidladdning: läs från localStorage → rendera alla.