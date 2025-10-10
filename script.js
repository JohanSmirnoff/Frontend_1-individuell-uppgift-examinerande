const userBox = document.getElementById("user-form")
const formBox = document.getElementById("post-form")
const mainDiv = document.querySelector(".main-container")
const sendButton = document.getElementById("send-button")
const resetButton = document.getElementById("reset-button")
const githubIcon = document.getElementById("github-icon")

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

githubIcon.addEventListener("click", () => {
    githubIcon.classList.add("spin-icon")
    githubIcon.addEventListener("animationend", () => {
        githubIcon.classList.remove("spin-icon")
    })
})

// Först ta bort gamla och rendera ut nya posts

// KANSKE ÄNDRA DENNA FUNKTION TILL .replaceChildren I FRAMTIDEN
function renderAllPosts() {
    mainDiv.querySelectorAll(".blog-container").forEach(element => element.remove())
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
function addBlogInput(blogInfo) {
    return {
        id: crypto.randomUUID(),
        author: currentUser,
        title: blogInfo.get("user-title"),
        message: blogInfo.get("user-message"),
        timestamp: new Date().toLocaleTimeString(),
        likedBy: []
    }
}

// Funktion för att rendera och skapa alla element som behövs för att få nån output i HTML
function renderBlogInput(blogPost) {
    blogPost.likedBy ??= [];

    const blogDiv = document.createElement("div")
    blogDiv.className = "blog-container"

    const blogHeaderDiv = document.createElement("div")
    blogHeaderDiv.className = "blog-header-container"

    const removePostButton = document.createElement("button")
    removePostButton.className = "remove-post-button"
    removePostButton.type = "button"
    removePostButton.dataset.id = blogPost.id
    removePostButton.textContent = "X"
    removePostButton.hidden = blogPost.author !== currentUser

    const blogArticleDiv = document.createElement("div")
    blogArticleDiv.className = "blog-article-container"
    
    const timeStamp = document.createElement("p")
    const userName = document.createElement("p")
    const userTitle = document.createElement("p")
    const userMessage = document.createElement("p")

    const blogFooterDiv = document.createElement("div")
    blogFooterDiv.className = "blog-footer-container"

    const likeButton = document.createElement("button")
    likeButton.type = "button"
    likeButton.className = "like-button"
    likeButton.textContent = `<3: ${blogPost.likedBy.length}`

    const commentButton = document.createElement("button")
    commentButton.type = "button"
    commentButton.className = "comment-button"
    commentButton.textContent = " Visa kommentarer"

    userName.textContent = `Användare: ${blogPost.author}`
    userTitle.textContent = `Titel: ${blogPost.title}`
    userMessage.textContent = blogPost.message
    timeStamp.textContent = blogPost.timestamp

    // Eventlistener för removePostButton-knappen inuti renderBlogInput
    removePostButton.addEventListener("click", () => {
        if (blogPost.author !== currentUser) {
            alert("Du kan inte ta bort andras inlägg, duh!")
            return
        }
        const postIndex = blogPosts.findIndex(p => p.id === blogPost.id)
        if (postIndex === -1) return
        if (!confirm("Vill du verkligen ta bort ditt inlägget?")) return
        blogPosts.splice(postIndex, 1)
        saveStorage()
        renderAllPosts()
    })

    // Event för likes, använder blogPost.likedBy.indexOf för att leta efter currentUser i arrayen. Push om ej hittad, annars splice
    likeButton.addEventListener("click", () => {
        if (!currentUser) {
            alert("Fyll i ett användarnamn och tryck enter innan du like:ar")
            return
        }
        const likes = blogPost.likedBy.indexOf(currentUser)
        if (likes === -1) {
            blogPost.likedBy.push(currentUser)
        } else {
            blogPost.likedBy.splice(likes, 1)
        }
        saveStorage()
        renderAllPosts()
    })

    // Event för att visa kommentarer.
    commentButton.addEventListener("click", () => {
        
    })

    blogHeaderDiv.prepend(timeStamp, removePostButton)
    blogArticleDiv.prepend(userName, userTitle, userMessage)
    blogFooterDiv.prepend(likeButton, commentButton)
    blogDiv.prepend(blogHeaderDiv, blogArticleDiv, blogFooterDiv)
    mainDiv.prepend(blogDiv)
}

// En till funktion för att trigga submit i formuläret vid keydown "enter" och alla fält är ifyllda.
formBox.addEventListener("keydown", (e) => {
    if (e.key == "Enter" && e.target.tagName === "TEXTAREA") {
        e.preventDefault()
        formBox.requestSubmit()
    }
})

// Event för namnrutan
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
    renderAllPosts()
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
console.log(blogPosts)




