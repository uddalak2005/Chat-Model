const mongoose = require("mongoose");
const Chat = require('./chat.js');
const { faker } = require('@faker-js/faker'); // ✅ Correct import

let generateRandomData = () => {
    return {
        from: faker.person.firstName(), // ✅ Correct usage
        to: faker.person.firstName(),
        message: faker.lorem.sentence(), // Changed to a single sentence
        created_at: faker.date.anytime()
    }
}

main().then(() => {
    console.log("connection established");
}).catch((err) => console.log(err));

async function main() {
    await mongoose.connect("mongodb://localhost:27017/chats");
}

let allChats = [
    {
        from: "Jon",
        to: "Ela",
        message: "Hello Elaa, it's nice to meet you",
        created_at: new Date()
    }
];

for (let i = 1; i < 5; i++) {
    allChats.push(generateRandomData());
}

// ✅ Ensure the function is called properly
Chat.insertMany(allChats).then((res) => {
    console.log("Data inserted:", res);
    mongoose.connection.close(); // Close connection after inserting
}).catch((err) => {
    console.error("Error inserting data:", err);
});
