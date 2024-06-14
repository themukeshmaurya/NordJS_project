import { Request, Response } from 'express';
const User = require('../models/user');
import { v4 as uuidv4 } from 'uuid';
const {setUser,getUser} = require('../services/auth');

async function getAllUsers(req: Request, res: Response) {
    try {
        const allUsers = await User.find({});
        return res.json(allUsers);
    }
    catch (error) {
        // Handle errors
        console.error('Error creating user:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function getAllUsersWithDateRange(req: Request, res: Response) {
    try {
        const startDate = req.body.startDate;
        const endDate = req.body.endDate;
        // const query = {
        //     dateOfBirth: {
        //         $gte: startDate,
        //         $lte: endDate
        //     }
        // };
        const usersInRange = await User.aggregate([
            {
                $match: {
                    dateOfBirth: {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate)
                    }
                }
            }
        ]);

        //const usersInRange = await User.find(query);

        return res.json(usersInRange);
    }
    catch (error) {
        // Handle errors
        console.error('Error getting users within date range:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function userLogin(req:Request,res:Response){
    try{
        const email = req.body.email;
        const password = req.body.password;
        const user = await User.findOne({email,password});

        if(!user){
            return res.status(404).json({status: 'Invalid UserName and Password'});
        }

        const token = setUser(user);
        res.cookie('uid',token);
        res.status(200).json({status: 'User Login Successfully !',Cookie: token, Email:email});
    }
    catch(error){
        console.error('Error creating user:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function getUserById(req: Request, res: Response) {
    try {
        const user = await User.findById(req.params.id);
        return res.status(200).json(user);
    }
    catch (error) {
        // Handle errors
        console.error('Error creating user:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function addUserDetails(req: Request, res: Response) {
    try {

        const { first_name, last_name, email, jobTitle, gender,dateOfBirth,password } = req.body;
        if (!first_name || !last_name || !email || !jobTitle || !gender || !dateOfBirth || !password) {
            return res.status(400).json({ error: 'Missing required fields in the request body.' });
        }

        const image = req.file;
        const result = await User.create({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            password:req.body.password,
            jobTitle: req.body.jobTitle,
            gender: req.body.gender,
            userImage: [{
                fileName: image?.filename,
                path: image?.path
            }],
            dateOfBirth: req.body.dateOfBirth,
        });
        return res.status(201).json({ status: 'User ' + result.first_name + ' Successfully Created..', id: result._id });
    }
    catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function updateUserById(req: Request, res: Response) {
    try {
        await User.findByIdAndUpdate(req.params.id, { last_name: 'singh' });
        return res.json({ status: 'Patch : Working...' });
    }
    catch (error) {
        // Handle errors
        console.error('Error creating user:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function deleteUserById(req: Request, res: Response) {
    try {
        await User.findByIdAndDelete(req.params.id);
        return res.json({ status: 'Delete : User Successfully Deleted...' });
    }
    catch (error) {
        // Handle errors
        console.error('Error creating user:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

export = {
    getAllUsers,
    getUserById,
    addUserDetails,
    updateUserById,
    deleteUserById,
    userLogin,
    getAllUsersWithDateRange
};
