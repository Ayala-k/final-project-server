const mongoose = require('mongoose');
const { config } = require("../config/secret")

main().catch(err => console.log(err));

async function main() {
    //await mongoose.connect(`mongodb+srv://${config.userDb}:${config.passDb}@cluster0.7nbv7ig.mongodb.net/FINAL_PROJECT`);
    await mongoose.connect(
        `mongodb+srv://${config.userDb}:${config.passDb}@cluster0.7nbv7ig.mongodb.net/FINAL_PROJECT`,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    );

    console.log("mongo connection")
}