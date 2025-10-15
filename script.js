const userBox = document.getElementById("user-form")
const formBox = document.getElementById("post-form")
const mainDiv = document.querySelector(".main-container")
const sendButton = document.getElementById("send-button")
const resetButton = document.getElementById("reset-button")
const githubIcon = document.getElementById("github-icon")

const blogPosts = []
let currentUser = ""

// Variabler på localstorage
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

// Animation på github-ikonen
githubIcon.addEventListener("click", () => {
    githubIcon.classList.add("spin-icon")
    githubIcon.addEventListener("animationend", () => {
        githubIcon.classList.remove("spin-icon")
    }, { once: true})
})

// Rendera om allt innehåll
function renderAllPosts() {
    mainDiv.querySelectorAll(".blog-container").forEach(element => element.remove())
    blogPosts.slice().forEach(renderBlogInput)
    if (currentUser) renderUserInput({author: currentUser})
}

// Två funktioner för att visa och dölja kommentarsrutan
function showDiv(div) {
    div.style.height = div.scrollHeight + "px"
    div.dataset.open = "true"
    div.addEventListener("transitionend", function end(e) {
        if (e.propertyName !== "height") return
        div.style.height = "auto"
        div.removeEventListener("transitionend", end)
    })
}

function hideDiv(div) {
    if (div.style.height === "auto") {
        div.style.height = div.scrollHeight + "px"
    }
    requestAnimationFrame(() => {
        div.style.height = "0px"
        div.dataset.open = "false"
    })
}

// Funktion för att updatera like-knappen med en classlist toggle
function updateLike(button, post, currentUser) {
    const count = post.likedBy.length
    const haveLiked = currentUser && post.likedBy.includes(currentUser)

    button.classList.toggle("liked", Boolean(haveLiked))
    button.setAttribute("aria-pressed", String(Boolean(haveLiked)))

    const countEl = button.querySelector(".count")
    if (countEl) countEl.textContent = String(count)
}

// Funktion för att bara sätta username i hörnet
function addUserInput(addUserName) {
    return {
        author: String(addUserName.get("user-name") ?? "").trim()
    }
}

// Funktion för att rendera bara username
function renderUserInput(renderUserName) {
    let userDisplay = document.getElementById("user-display")
    if (!userDisplay) {
        userDisplay = document.createElement("p")
        userDisplay.id = "user-display"
        userBox.appendChild(userDisplay)
    }
    userDisplay.textContent = renderUserName.author
}

// En funktion för att skicka in userinput i arrayen blogPosts
function addBlogInput(blogInfo) {
    const title = String(blogInfo.get("user-title") ?? "").trim()
    const message = String(blogInfo.get("user-message") ?? "").trim()
    
    return {
        id: crypto.randomUUID(),
        author: currentUser,
        title,
        message,
        timestamp: new Date().toLocaleString(),
        likedBy: [],
        comments: []
    }
}

// Funktion för att rendera och skapa alla element som behövs för att få nån output i HTML
function renderBlogInput(blogPost) {
    blogPost.likedBy ??= [];
    blogPost.comments ??= [];

    // Själva blogginlägget
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
    userMessage.className = "user-message"

    const blogFooterDiv = document.createElement("div")
    blogFooterDiv.className = "blog-footer-container"

    const likeButton = document.createElement("button")
    likeButton.type = "button"
    likeButton.className = "like-button"
    likeButton.setAttribute("aria-pressed", "false");
    likeButton.innerHTML = `
        <svg class="heart" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
        <span class="count">0</span>`
    
    updateLike(likeButton, blogPost, currentUser)

    const commentButton = document.createElement("button")
    commentButton.type = "button"
    commentButton.className = "comment-button"
    commentButton.textContent = "Visa kommentarer"

    //Start på kommentarerna
    const commentDiv = document.createElement("div")
    commentDiv.className = "comments-container"
    commentDiv.dataset.open = "false"
    commentDiv.style.height = "0px"
    
    const commentSectionDiv = document.createElement("div")
    commentSectionDiv.className = "user-comments-container"

    const commentList = document.createElement("ul")
    commentList.className = "comment-list" 

    blogPost.comments.forEach(comment => commentList.appendChild(renderCommentInput(blogPost, comment)))

    // Start på form för kommentarerna
    const commentFormDiv = document.createElement("div")
    commentFormDiv.className = "comment-form-container"

    const commentForm = document.createElement("form")
    commentForm.className = "comment-form"

    const commentLabel = document.createElement("label")
    commentLabel.textContent = "Kommentar"

    const commentTextInput = document.createElement("textarea")
    commentTextInput.setAttribute("aria-label", "Kommentar")
    commentTextInput.rows = "2"
    commentTextInput.className = "text-area"
    commentTextInput.placeholder = "Skriv din kommentar..."
    commentTextInput.required = true

    const postCommentButton = document.createElement("button")
    postCommentButton.type = "submit"
    postCommentButton.className = "post-comment-button"
    postCommentButton.textContent = "Skicka"

    userName.textContent = `Användare: ${blogPost.author}`
    userTitle.textContent = `Titel: ${blogPost.title}`
    userMessage.textContent = blogPost.message
    timeStamp.textContent = blogPost.timestamp

    // Event för removePostButton-knappen, använder blogPosts.findIndex för att leta i arrayen. splice för att ta bort
    removePostButton.addEventListener("click", () => {
        if (blogPost.author !== currentUser) {
            alert("Du kan inte ta bort andras inlägg, duh!")
            return
        }
        const postIndex = blogPosts.findIndex(p => p.id === blogPost.id)
        if (postIndex === -1) return
        if (!confirm("Vill du verkligen ta bort ditt inlägg?")) return
        blogPosts.splice(postIndex, 1)
        saveStorage()
        renderAllPosts()
    })

    // Event för likes, använder blogPost.likedBy.indexOf för att leta efter currentUser i arrayen likedBy. Push om ej hittad, annars splice
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
        updateLike(likeButton, blogPost, currentUser)
        saveStorage()
    })

    // Event för att köra funktionerna för visa/dölja commentDiven.
    commentButton.addEventListener("click", () => {
        const isOpen = commentDiv.dataset.open === "true"
        if (isOpen) {
            commentButton.textContent = "Visa kommentarer"
            hideDiv(commentDiv)
        } else {
            commentButton.textContent = "Dölj kommentarer"
            showDiv(commentDiv)
        }
    })

    // Submit event för kommentarer, pushar till arrayen. Sista delen ändrar om height på rutan om den är öppen.
    commentForm.addEventListener("submit", (e) => {
        e.preventDefault()
        if (!currentUser) {
            alert("Skriv in ett användarnamn INNAN du kommenterar...")
            return
        }
        const textOutput = commentTextInput.value.trim()
        if (!textOutput) return
        const newComment = {
            id: crypto.randomUUID(),
            author: currentUser,
            textOutput,
            timestamp: new Date().toLocaleString()
        }

        blogPost.comments.push(newComment)
        commentList.prepend(renderCommentInput(blogPost, newComment))
        saveStorage()
        commentForm.reset()

        if (commentDiv.dataset.open === "true") {
            commentDiv.style.height = "auto"
            const height = commentDiv.scrollHeight
            commentDiv.style.height = height + "px"
        }
    })

    blogHeaderDiv.prepend(timeStamp, removePostButton)
    blogArticleDiv.prepend(userName, userTitle, userMessage)
    blogFooterDiv.prepend(likeButton, commentButton)
    
    commentSectionDiv.appendChild(commentList)
    commentForm.append(commentLabel, commentTextInput, postCommentButton)
    commentFormDiv.appendChild(commentForm)
    commentDiv.append(commentSectionDiv, commentFormDiv)

    blogDiv.append(blogHeaderDiv, blogArticleDiv, commentDiv, blogFooterDiv)

    mainDiv.prepend(blogDiv)
}

// Funktion för att rendera kommentarerna, removeComment-event fungerar på samma sätt som removePost-event
function renderCommentInput(post, comment) {
    post.comments ??= []
    const userComment = document.createElement("li")
    userComment.className = "user-comment"
    userComment.dataset.id = comment.id

    const commentText = document.createElement("span")
    commentText.textContent = `${comment.timestamp} - ${comment.author}: ${comment.textOutput}`
    
    const removeCommentButton = document.createElement("button")
    removeCommentButton.className = "remove-comment-button"
    removeCommentButton.type = "button"
    removeCommentButton.textContent = "X"
    removeCommentButton.hidden = comment.author !== currentUser

    removeCommentButton.addEventListener("click", () => {
        if (comment.author !== currentUser) {
            alert("Yo! Du kan inte ta bort andras kommentarer!")
            return
        }
        const commentIndex = post.comments.findIndex(i => i.id === comment.id)
        if (commentIndex === -1) return
        if (!confirm("Vill du verkligen ta bort din kommentar?")) return
        post.comments.splice(commentIndex, 1)
        userComment.remove()
        saveStorage()
    })

    userComment.append(commentText, removeCommentButton)
    return userComment
}

// En till funktion för att trigga submit i formuläret vid keydown "enter" och alla fält är ifyllda, shift+enter gör fortfarande radbrytning.
formBox.addEventListener("keydown", (e) => {
    if (e.key == "Enter" && e.target.tagName === "TEXTAREA" && !e.shiftKey) {
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
    if (!currentUser) {
        alert("Skriv in ett användarnamn uppe i högra hörnet och tryck enter för att spara det.")
        return
    }
    const formInput = new FormData(formBox)
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