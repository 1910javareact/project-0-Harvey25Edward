import { Role } from "./role"

export class User {
    userId: number       
	username: string     
	password: string      
	firstName: string    
	lastName: string     
	email: string        
    roles:Role[]        
    constructor(userId:number, username:string, password:string, firstName:string, lastName: string, email:string, roles:Role[]){
        this.userId = userId
        this.username = username
        this.password = password
        this.firstName = firstName
        this.lastName = lastName
        this.email = email
        this.roles = roles

    }
}