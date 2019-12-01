import { User } from "../models/user";
import { daoGetAllUsers, daoGetUserById, daoGetUserByUsernameAndPassword, daoUpdateUser } from "../repositories/user-dao";



export async function getAllUsers(): Promise<User[]>{
  try {
      return await daoGetAllUsers();
  }  catch (e){
      throw e
  } 
}
export function getUserById(id:number): Promise<User> {
    console.log('')
   return daoGetUserById(id)
}
export function getUserByUsernameAndPassword(username : string, password : string):Promise<User>{
    return daoGetUserByUsernameAndPassword(username, password)
}
export async function updateUser(req: User){
    try{
        let user = await daoGetUserById(req.userId)
        for(let key in req){
            if(req[key] !== undefined && user.hasOwnProperty(key)){
                user[key] = req[key]
            }
        }
        await daoUpdateUser(user)
        return user
    }catch(e){
        throw e
    }
}