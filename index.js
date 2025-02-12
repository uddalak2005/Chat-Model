const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Chat = require("./models/chat.js");
const port = 3000;


express.urlencoded({extended : true});


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
    console.log(chats);
    res.render("index.ejs", {chats});
})

// mongoose.connection.close();