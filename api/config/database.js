const mongoose = require("mongoose");

exports.connect = () => {


    mongoose.connect("mongodb+srv://dhyanisaksham12:kYXjUhoIGRj4LMx2@cluster0.li5lvxm.mongodb.net/blog-app" ,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(console.log("DB connection successfull"))
    .catch( (error) => {
        console.log("DB connection issue");
        console.error(error);
        process.exit(1);
    })

};