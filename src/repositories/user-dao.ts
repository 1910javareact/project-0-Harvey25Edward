import { PoolClient } from 'pg';

import { User } from '../models/user';
import { connectionPool } from '.';
import { userDto } from '../util/userDto';
import { multiUserDTOUser } from '../util/userDto';



export async function daoGetAllUsers():Promise<User[]>{
let client : PoolClient;
try{

    client = await connectionPool.connect();
    const result = await client.query('SELECT * FROM project0_reimbursement.users NATURAL JOIN project0_reimbursement.users_roles NATURAL JOIN project0_reimbursement.roles ORDER BY user_id')
return multiUserDTOUser(result.rows)
}catch(e) {
    console.log(e);
    throw {
        status:500,
        message:'Internal Server Error!'
    };
}finally {
    client && client.release();
}

}
export async function daoGetUserById(id:number):Promise<User>{
    let client:PoolClient;
    try{
        client = await connectionPool.connect();
        const result = await client.query('SELECT * FROM project0_reimbursement.users NATURAL JOIN project0_reimbursement.users_roles NATURAL JOIN project0_reimbursement.roles WHERE user_id = $1',
        [id]);
        if (result.rowCount > 0){
            return userDto(result.rows);
        } else {
            throw 'No such User';
        }
    
    } catch(e){
        if (e === 'No such User'){
            throw {
                status : 404,
                message : 'This User Does not Exist'
            }
        } else {
            throw{
                status : 500,
                message: 'Internal Server Error'
            }
        }
    }
}
export async function daoGetUserByUsernameAndPassword(username: string, password: string): Promise<User> {
    let client: PoolClient;
    try {
        client = await connectionPool.connect();

        const result = await client.query('SELECT * FROM project0_reimbursement.users NATURAL JOIN project0_reimbursement.users_roles NATURAL JOIN project0_reimbursement.roles WHERE username = $1 and password = $2',
            [username, password]);
        if (result.rowCount === 0) {
            throw 'Invalid Credentials';
        } else {
            return userDto(result.rows);
        }
    } catch (e) {
        console.log(e);

        if (e === 'Invalid Credentials') {
            throw{
                status: 401,
                message: 'Invalid Credentials'
            };
        } else {
            throw {
                status: 500,
                message: 'Internal Server Error'
            };
        }
    } finally {
        client && client.release();
    }
}
export async function daoUpdateUser(newUser: User) {
    let client: PoolClient;
    try {
        client = await connectionPool.connect();
        client.query('BEGIN');
        await client.query('update project0_reimbursement.users set username = $1, password = $2, first_name = $3, last_name = $4, email = $5 where user_id = $6',
            [newUser.username, newUser.password, newUser.firstName, newUser.lastName, newUser.email, newUser.userId]);
        await client.query('delete from project0_reimbursement.users_roles where user_id = $1',
            [newUser.userId]);
        for ( const role of newUser.roles) {
            await client.query('insert into project0_reimbursement.users_roles values ($1,$2)',
            [newUser.userId, role.roleId]);
        }
        client.query('COMMIT');
    } catch (e) {
        client.query('ROLLBACK');
        throw {
            status: 500,
            message: 'Internal Server Error'
        };
    } finally {
        client.release();
    }
}