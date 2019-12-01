
export function authorization(roleIds: number[], userId?: boolean) {
    return (req, res, next) => {
        let auth = false;

        if (!req.session.user) {
            res.status(400).send('Please log in');
            return;
        }

        // check if there role has authorization
        for ( const role of req.session.user.roles) {
            if (roleIds.includes(role.roleId)) {
                auth = true;
            }
        }

        // check if userId is the same as what they're trying to access
        // put false or don't enter second param if you don't want to check user id
        if (userId) {
            const id = +req.params.userId;
            if (!isNaN(id)) {
                if (req.session.user.userId === id) {
                    auth = true;
                }
            }
        }

        if (auth) {
            next();
        } else {
            res.status(401).send('The incoming token has expired');
        }
    };
}