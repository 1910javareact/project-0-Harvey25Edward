import { PoolClient } from "pg"
import { connectionPool } from "."
import { Reimbursement } from "../models/reimbursement"
import { multiReimbursementDTOtoReimbursement, reimbursementDTOtoReimbursement } from "../util/reimbursementDto"

export async function daoGetReimbursementByStatusId(statusId: number){
    let client: PoolClient
    try{
        client = await connectionPool.connect()
        let result = await client.query('SELECT * FROM project0_reimbursement.reimbursement NATURAL JOIN project0_reimbursement.users_reimbursement_status NATURAL JOIN project0_reimbursement.users_reimbursement_type WHERE status_id = $1 ORDER BY date_submitted DESC',
        [statusId])
        if(result.rowCount === 0){
            throw 'No Reimbursements By That Status'
        }else{
            return multiReimbursementDTOtoReimbursement(result.rows)
        }
    } catch (e) {
        if(e === 'No Reimbursements By That Status'){
            throw {
                status: 404,
                message: 'No Reimbursements By That Status'
            }
        }else{
            throw{
                status:500,
                Message: 'something went wrong with the server, try again later'
            }
        }
        
    } finally {
        client.release()
    }
}

//find reimbursements by user id and return the array
export async function daoGetReimbursementByUserId(userId: number){
    let client: PoolClient
    try{
        client = await connectionPool.connect()
        let result = await client.query('SELECT * FROM project0_reimbursement.reimbursement NATURAL JOIN project0_reimbursement.users_reimbursement_status NATURAL JOIN project0_reimbursement.users_reimbursement_type WHERE author = $1 ORDER BY date_submitted DESC',
        [userId])
        if(result.rowCount === 0){
            throw 'No Reimbursements By That User'
        }else{
            return multiReimbursementDTOtoReimbursement(result.rows)
        }
    } catch (e) {
        if(e === 'No Reimbursements By That User'){
            throw {
                status: 404,
                message: 'No Reimbursements By That User'
            }
        }else{
            throw{
                status:500,
                Message: 'something went wrong with the server, try again later'
            }
        }
        
    } finally {
        client.release()
    }
}

//make a new reimbersement request
export async function daoPostReimbersement(post:Reimbursement) {
    let client: PoolClient;
    try {
        client = await connectionPool.connect();
        client.query('BEGIN');
        await client.query('INSERT INTO project0_reimbursement.reimbursement (author, amount, date_submitted, date_resolved, description, resolver, status, type) values ($1,$2,$3,$4,$5,null,1,$6)',
        [post.author, post.amount, Date.now() / 1000, 0, post.description, post.type]);
        const result = await client.query('SELECT * FROM project0_reimbursement.reimbursement WHERE author = $1 ORDER BY reimbursement_id DESC LIMIT 1 OFFSET 0',
        [post.author]);
        client.query('COMMIT');
        return reimbursementDTOtoReimbursement(result.rows);
    } catch (e) {
        client.query('ROLLBACK');
        console.log(e)
        throw{
            status: 500,
            message: 'Internal Server Error'
        };
    } finally {
        client.release();
    }
}

//get a reimbersement by it's id
export async function daoGetReimbursementByReimbursementId(reimbursementId: number){
    let client: PoolClient
    try{
        client = await connectionPool.connect()        
        let result = await client.query('SELECT * FROM project0_reimbursement.reimbursement WHERE reimbursement_id = $1',
        [reimbursementId])        
        if(result.rowCount === 0){
            throw 'Reimbursement Does Not Exist'
        }else{
            return reimbursementDTOtoReimbursement(result.rows)
        }
    }catch(e){
        if(e === 'Reimbursement Does Not Exist'){
            throw{
                status: 404,
                message: 'Reimbursement Does Not Exist'
            }
        }else{
            throw{
                status: 500,
                message: 'Internal Server Error'
            }
        }
    }finally{
        client.release()
    }
}

//replace a reimbersemnt by it's id
export async function daoUpdateReimbursement(reimbursementUpdate: Reimbursement){    
    let client: PoolClient
    try{
        client = await connectionPool.connect()
        await client.query('UPDATE project0_reimbursement.reimbursement SET date_resolved = $1, resolver = $2, status = $3 WHERE reimbursement_id = $4',
        [Date.now() / 1000 , reimbursementUpdate.resolver, reimbursementUpdate.status, reimbursementUpdate.reimbursementId]);
        return await daoGetReimbursementByReimbursementId(reimbursementUpdate.reimbursementId)
    }catch(e){console.log(e)
        if(e === 'Reimbursement Does Not Exist'){
            throw{
                status: 404,
                message: 'Reimbursement Does Not Exist'
            }
        }else{
            throw{
                status: 500,
                message: 'Internal Server Error'
            }
        }
    }finally{
        client.release()
    }
}