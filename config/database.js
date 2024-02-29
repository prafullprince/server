const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = () => {
    mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifieedTopology: true,
    }).then(
        () => { console.log("db connection is successfull"); }
    ).catch(
        (error) => {
            console.log(error.message);
            process.exit(1);
        }
    )
}
