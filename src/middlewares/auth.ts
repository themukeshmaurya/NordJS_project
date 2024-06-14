import { Request,Response,NextFunction } from "express";
import path from "path";
const {getUser} = require("../services/auth");
async function checkUserLogin(req:Request,res:Response,next:NextFunction) {
    const userId = req.cookies?.uid;
    const user = getUser(userId);
    
    if(!userId || !user){
        return res.status(404).json({status:'This user is not authorize'});
    }

    req.cookies.user = user;
    next();
}

module.exports = {
    checkUserLogin,
}