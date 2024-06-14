import express,{Request,Response} from 'express';
const urlRoute = require("./routes/url");
const staticRouter = require("./routes/staticRouter");
const URL = require("./models/url");
const userRouter = require('./routes/user')
const {connectionMongoDB} = require('./connection');
const path = require("path");
import cookieParser from 'cookie-parser';
const {checkUserLogin} = require("./middlewares/auth");
const { createServer } = require('node:http');
const { Server } = require("socket.io");
const { join } = require('node:path');

const app = express();
const server = createServer(app);
const io = new Server(server);
const PORT = 8000;
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: false}));
app.set("view engine" , "ejs");
app.set("views",path.resolve("./src/views"));

app.use("/url",checkUserLogin, urlRoute);
app.use("/",staticRouter);

app.get("/", staticRouter);
io.on('connection', (socket:any) => {
    socket.on('chat message', (msg:any) => {
        io.emit('chat message', msg);
    });
  });

app.get('/chat', (req, res) => {
    res.sendFile(join(__dirname, '/public/index.html'));
  });

 

app.get("/url/:shortId",async(req:Request,res:Response)=>{
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({
        shortId,
    },{
        $push:{
            visitHistory:{
                timestamp:Date.now(),
            }
        }
    });
    res.redirect(entry.redirectUrl);
});

//const {logReqRes} = require('./middlewares');

connectionMongoDB('mongodb://localhost:27017/Project_1').then(()=>{
    console.log("mongoose connected");
}).catch((err:any)=>console.log(err));



app.use(express.urlencoded({extended:false}));

app.use("/api/users", userRouter);
//app.use(logReqRes("log.txt"));

    
app.listen(PORT, ():void=>{
    console.log(`Server Is Runnung... Port : ${PORT}`)
});