import { daoGetReimbursementByStatusId, daoGetReimbursementByUserId, daoPostReimbersement, daoGetReimbursementByReimbursementId, daoUpdateReimbursement } from "../repositories/reimbursement-dao"




export function getReimbursementByStatusId(statusId: number) {
    try {
        return daoGetReimbursementByStatusId(statusId)
    } catch (e) {
        throw e
    }
}


export function getReimbursementByUserId(userId: number) {
    try {
        return daoGetReimbursementByUserId(userId)
    } catch (e) {
        throw e
    }

}

//call the daoPostReimbersement and return the post
export function postReimbersement(post) {
    try {
        return daoPostReimbersement(post)
    } catch (e) {
        throw e
    }

}

//call the daoPatchReimbersement and return the updated post
export async function patchReimbersement(patch) {
    try {
        const post = await daoGetReimbursementByReimbursementId(patch.reimbursementId);
        for (const key in post) {
            if (patch.hasOwnProperty(key)) {
                post[key] = patch[key];
            }
        }
        return await daoUpdateReimbursement(post);
    } catch (e) {
        throw e;
    }

}