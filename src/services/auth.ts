import jwt from 'jsonwebtoken';
const sessionIdToUsermap = new Map();
const secretKey = 'ufbdcdhcdjdvcdhbudgufbhf5464f';


function setUser(user:any){
    //sessionIdToUsermap.set(id,user);
    const payload = {
        ...user,
    };
    return jwt.sign({
        _id: user._id,
        email: user.email, 
    },secretKey);
}

function getUser(token:any) {
    if(!token) return null;
    return jwt.verify(token,secretKey);
}

module.exports ={
    setUser,
    getUser,
}