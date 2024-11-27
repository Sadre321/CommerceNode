const mongoose = require("mongoose");
const config = require("../config");

(async()=>{
    try{
        await mongoose.connect(`mongodb+srv://${config.db.username}:${config.db.password}@cluster0.pgxr434.mongodb.net/${config.db.database}?retryWrites=true&w=majority&appName=Cluster0`, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Baglanti basari ile saglandi");
    }catch(err){
        console.log(err);
    }
})();

module.exports = mongoose; 