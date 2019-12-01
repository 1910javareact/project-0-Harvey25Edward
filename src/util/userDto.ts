import { UserDTO } from "../dtos/user-dto";
import { User } from "../models/user";
export function userDto(users: UserDTO[]): User {
    const roles = [];
    for (const user of users) {
        roles.push({
            roleId: user.role_id,
            role: user.role_title
        });
    }
    return new User(users[0].user_id, users[0].username, users[0].password, users[0].first_name, users[0].last_name, users[0].email,roles);
}

// takes in multiple UserDTO's and turn them into multiple users with arrays of roles
export function multiUserDTOUser(users: UserDTO[]): User[] {
    let currentUser: UserDTO[] = [];
    const result: User[] = [];
    for (const user of users) {
        if (currentUser.length === 0) {
            currentUser.push(user);
        } else if (currentUser[0].user_id === user.user_id) {
            currentUser.push(user);
        } else {
            result.push(userDto(currentUser));
            currentUser = [];
            currentUser.push(user);
        }
    }
    result.push(userDto(currentUser));
    return result;
}