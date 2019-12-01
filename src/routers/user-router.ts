import express from 'express'
import { authorization } from '../middleware/auth-middleware'
import { loggingMiddleware } from '../middleware/logging-middleware'
import { getUserById, updateUser, getAllUsers } from '../services/user-services'

export const userRouter = express.Router()
userRouter.get('', authorization([1]),
async (req, res) => {
    try {
        const users = await getAllUsers();
        res.json(users);
    } catch (e) {
        res.status(e.status).send(e.message);
    }

});

userRouter.get('/:userId', authorization([1], true),
async (req, res) => {
    const userId = +req.params.userId;
    if (isNaN(userId)) {
        res.status(400).send('Invalid Id');
    } else {
        try {
            const user = await getUserById(userId);
            res.json(user);
        } catch (e) {
            res.status(e.status).send(e.message);
        }
    }


});
userRouter.patch('',authorization([2]),loggingMiddleware , async (req,res) =>{


    try {
        let {body} = req
        let user = await updateUser(body)
        res.status(200).json(user)
    } catch(e) {
            res.status(e.status).send(e.message)
        } 
    
   

}) 