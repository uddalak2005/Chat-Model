const chats = document.getElementsByClassName("chat");

//Accessing the actio button for the main send message route
let actionButton = document.querySelector("#action");

actionButton.addEventListener("click", (event) => {
    event.preventDefault();
    let txt = event.target.innerText;
    if (txt === "Send") {
        sendMessage();
    } 
});


//Looping for edit button
Array.from(chats).forEach((e) => {
    let edit = e.getElementsByTagName("a")[0];
    edit.addEventListener("click", (event) => {
        // console.log(event.target.closest(".card"));
        editMessage(event.target.closest(".card"));
    })
})

//looping for delete button
Array.from(chats).forEach((e) => {
    let del = e.getElementsByTagName("a")[1];
    del.addEventListener("click", (event) => {
        console.log(event.target.closest(".card"));
        deleteMessage(event.target.closest(".card"));
    })
})

// to show different alert in homescreen.
function showFloatingAlert(message, type = "success") {
    // Create the alert div
    const alertDiv = document.createElement("div");
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
    alertDiv.style.zIndex = "1050"; // Ensure it's above everything
    alertDiv.style.minWidth = "250px"; // Optional width adjustment
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    // Append alert to the body (so it floats)
    document.body.appendChild(alertDiv);

    // Auto-dismiss after 3 seconds
    setTimeout(() => {
        alertDiv.classList.remove("show"); // Start fade-out effect
        setTimeout(() => alertDiv.remove(), 500); // Remove after fade-out
    }, 3000);
}



//sending the edit message request to backend
function finaliseEdit(card) {

    let to = card.querySelector(".card-header");
    let from = card.querySelector(".card-title");
    let message = card.querySelector(".card-text");


    let formField_from = document.querySelector("#from");
    let formField_to = document.querySelector("#to");
    let formField_message = document.querySelector("#message");


    let id = card.dataset.chatId

    console.log(id);



    let updated = {
        _id: id,
        from: formField_from.value,
        to: formField_to.value,
        message: formField_message.value
    }

    console.log(updated);

    axios.put("/update-message", updated)
        .then((res) => {
            if (res.status === 200) {

                from.innerText = from.innerText.split(":")[0] + " : " + formField_from.value;
                to.innerText = to.innerText.split(":")[0] + " : " + formField_to.value;
                message.innerText = formField_message.value;

                card.classList.remove("bg-primary-subtle");

                formField_from.value = "";
                formField_to.value = "";
                formField_message.value = "";

                showFloatingAlert("Message updated successfully!", "success");
            }
        }).catch(err => {
            console.log(err);
        })

}


//function to edit an exsisting message
function editMessage(card) {
    let to = card.querySelector(".card-header").innerText.split(":")[1].trim();
    let from = card.querySelector(".card-title").innerText.split(":")[1].trim();
    let message = card.querySelector(".card-text").innerText.trim();

    let formField_from = document.querySelector("#from");
    let formField_to = document.querySelector("#to");
    let formField_message = document.querySelector("#message");
    let actionButton = document.querySelector("#action");

    formField_from.value = from;
    formField_to.value = to;
    formField_message.value = message;
    actionButton.innerText = "Update"
    actionButton.classList.remove("btn-success");
    actionButton.classList.add("btn-warning");

    card.classList.add("bg-primary-subtle");

    actionButton.addEventListener("click", (event) => {
        finaliseEdit(card);
    })

}



//used by function to send message by adding the new message to DOM without actually reloading the page
function addWithoutReload(chat) {
    let div = document.createElement("div");
    div.className = "card m-2 chat";
    div.style.width = "18rem";
    div.dataset.chatId = chat._id;  // Attach the chat _id to the div

    div.innerHTML = `
        <div class="card-header">
            To : ${chat.to}
        </div>
        <div class="card-body">
            <h5 class="card-title">From : ${chat.from}</h5>
            <p class="card-text">${chat.message}</p>
            <div class="d-flex gap-3">
                <a href="#" class="btn btn-primary edit">Edit</a>
                <a href="#" class="btn btn-danger del">Delete</a>
            </div>
        </div>
    `;

    let container = document.querySelector(".chatContainer");
    container.appendChild(div); // Append new chat card to the container

    let edit = div.querySelector(".edit"); // Get the "Edit" button correctly
    let del = div.querySelector(".del");  // Get the "Delete" button correctly

    // Event listeners for "Edit" and "Delete" actions
    edit.addEventListener("click", (event) => {
        editMessage(event.target.closest(".card")); // Pass the closest card to the editMessage function
    });

    del.addEventListener("click", (event) => {
        console.log(event.target.closest(".card"));
        deleteMessage(event.target.closest(".card")); // Pass the closest card to the deleteMessage function
    });
}




//function to send a message
function sendMessage() {
    let formField_from = document.querySelector("#from");
    let formField_to = document.querySelector("#to");
    let formField_message = document.querySelector("#message");

    if (formField_from.value === "" || formField_to.value === "") {
        showFloatingAlert("Sender and Reciever cannot me empty!", "danger");
    }

    let chat = {
        from: formField_from.value,
        to: formField_to.value,
        message: formField_message.value
    }

    axios.post("/send-chat", chat)
        .then((res) => {
            if (res.status === 200) {
                console.log(res.data)
                addWithoutReload(res.data);
                showFloatingAlert(`Message sent to ${chat.to}`, "success");

                formField_from.value = "";
                formField_to.value = "";
                formField_message.value = "";



            }
        }).catch(err => {
            console.log(err);
        })
}

//function to delete a message
function deleteMessage(card) {
    let id = card.dataset.chatId;
    console.log(id);

    axios.delete(`/delete-message/${id}`)
        .then((res) => {
            console.log(res);
            if (res.status === 200) {
                card.remove();
            }
        }).catch((err) => console.error("Error deleting message:", err));
}






