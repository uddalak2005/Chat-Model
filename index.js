const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Chat = require("./models/chat.js");
const port = 3000;


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("views", path.join(__dirname, "views"));
app.set("view engiene", "ejs");

app.use(express.static(path.join(__dirname, "public")));

app.listen(port, () => {
    console.log(`app is listening on port ${port}`);
})

async function main() {
    await mongoose.connect("mongodb://localhost:27017/chats");
}

main()
    .then(() => {
        console.log("connection established");
    }
    ).catch((err) => {
        console.log(err);
    });

// let chat1 = new Chat({
//     from : "person1",
//     to: "person2",
//     // msg: "Hello", This key value pair will mot be inserted at the key name "msg" donot match the schema
//     message: "Hi!",
//     created_at : new Date()
// })

// chat1.save().then((res) => {
//     console.log(res);
// })


app.get("/", async (req, res) => {
    let chats = await Chat.find();
    // console.log(chats);
    res.render("index.ejs", { chats });
})

app.post("/send-chat", async (req, res) => {
    const { from, to, message } = req.body;
    console.log("New Message Received:", { from, to, message });
    let chat = new Chat({
        from: from,
        to: to,
        message: message,
        created_at: new Date()
    })

    const savedChat = await chat.save(); // Save to MongoDB and get the new docuemnt as return

    res.status(200).send(savedChat);
})

app.put("/update-message", async (req, res) => {
    const { _id, from, to, message } = req.body;
    console.log({ _id, from, to, message });
    let updatedChat = await Chat.findByIdAndUpdate(
        _id,
        { from: from, 
            to: to, 
            message: message, 
            created_at : new Date()
        },
        {runValidators : true, new: true}
    );
    console.log(updatedChat);
    res.status(200).send("Message updated succesfully");
})


app.delete("/delete-message/:id", async(req, res) => {
    const {id} = req.params;
    const deletedChat = await Chat.findByIdAndDelete(id);
    res.status(200).send("Message deleted successfully");
})
