import mongoose from 'mongoose';
mongoose.set("strictQuery", true);

async function connectionMongoDB(url:string){
    return mongoose.connect(url);
}

module.exports ={
    connectionMongoDB,
};