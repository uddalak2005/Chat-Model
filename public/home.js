const chats = document.getElementsByClassName("chat");


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




function finaliseEdit(card) {
    let to = card.querySelector(".card-header");
    let from = card.querySelector(".card-title");
    let message = card.querySelector(".card-text");

    let formField_from = document.querySelector("#from");
    let formField_to = document.querySelector("#to");
    let formField_message = document.querySelector("#message");
    let actionButton = document.querySelector("#action");

    from.innerText = from.innerText.split(":")[0] + "  " + formField_from.value;
    to.innerText = to.innerText.split(":")[0] + "  " + formField_to.value;
    message.innerText = formField_message.value;

    card.classList.remove("bg-primary-subtle");

    let updated = {
        from: from.innerText,
        to: to.innerText,
        message: message.innerText
    }

    axios.post("/update-message", updated)
        .then((res) => {
            if (res.status === 200) {

                formField_from.value = "";
                formField_to.value = "";
                formField_message.value = "";

                showFloatingAlert("Message updated successfully!", "success");
            }
        }).catch(err => {
            console.log(err);
        })



}

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


function addWithoutReload(chat){

    let div = `<div class="card m-2 chat" style="width: 18rem;">
                <div class="card-header">
                    To : ${chat.to}}
                </div>
                <div class="card-body">
                    <h5 class="card-title">From : ${chat.from}
                    </h5>
                    <p class="card-text">
                        ${chat.message}
                    </p>
                    <div class="d-flex gap-3">
                        <a href="#" class="btn btn-primary" class="edit">Edit</a>
                        <a href="#" class="btn btn-danger" class="del">Delete</a>
                    </div>
                </div>
            </div>`

    let container = document.querySelector(".chatContainer");
    container.insertAdjacentHTML("beforeend", div);
}


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
                addWithoutReload(chat)
                showFloatingAlert(`Message sent to ${chat.to}`, "success");
                
                formField_from.value = "";
                formField_to.value = "";
                formField_message.value = "";

            }
        }).catch(err => {
            console.log(err);
        })



}

Array.from(chats).forEach((e) => {
    let edit = e.getElementsByTagName("a")[0];
    edit.addEventListener("click", (event) => {
        // console.log(event.target.closest(".card"));
        editMessage(event.target.closest(".card"));
    })
})

let actionButton = document.querySelector("#action");

actionButton.addEventListener("click", (event) => {
    event.preventDefault();
    sendMessage();
})
