import { authorization } from "../middleware/auth-middleware"
import { getReimbursementByStatusId, postReimbersement, patchReimbersement, getReimbursementByUserId } from "../services/reimbursement-services"
import express from 'express'
export const reimbursementRouter = express.Router()

//finding reimbursements by status
reimbursementRouter.get('/status/:statusId', authorization([1]), 
    async (req, res) => {
        let statusId = +req.params.statusId
        if (isNaN(statusId)) {
            res.status(400).send('Invalid statusId')
        } else {
            try {
                let reimbursements = await getReimbursementByStatusId(statusId)
                res.json(reimbursements)
            } catch (e) {
                res.status(e.status).send(e.message)
            }
        }
    })

//get reimbursements by userId
reimbursementRouter.get('/author/userId/:userId', authorization([1], true),
    async (req, res) => {
        let userId = +req.params.userId
        if (isNaN(userId)) {
            res.status(400).send('Invalid userId')
        } else {
            try {
                let reimbursements = await getReimbursementByUserId(userId)
                res.json(reimbursements)
            } catch (e) {
                res.status(e.status).send(e.message)
            }
        }
    })

//submit a riembursement, date submitted will be handled in the database
//amount description and type are all that are required
reimbursementRouter.post('', authorization([1, 2, 3]), 
    async (req:any, res) => {
        let { body } = req
        let post = {
            author: req.session.user.userId,
            amount: body.amount,
            description: body.description,
            type: body.type
        }
        for (let key in post) {
            if (!post[key]) {
                res.status(400).send('Please include all fields')
            }
        }
        try {
            let newPost = await postReimbersement(post)
            res.status(201).json(newPost)
        } catch (e) {
            res.status(e.status).send(e.message)
        }
    })

//update a reimbursement
//only admins are allowed to update a request, and only approve or deny them
//only a status and reimbursementId is required
reimbursementRouter.patch('', authorization([1]), 
    async (req:any, res) => {
        let { body } = req
        let patch = {
            reimbursementId: body.reimbursementId,
            resolver: req.session.user.userId,
            status: body.status
        }
        for (let key in patch) {
            if (!patch[key]) {
                res.status(400).send('Please include a status and reimbursement Id')
            }
        }
        try {
            let newPost = await patchReimbersement(patch)
            res.status(201).json(newPost)
        } catch (e) {
            res.status(e.status).send(e.message)
        }
    })