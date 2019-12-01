import { Pool } from "pg";
console.log({
    user: process.env['PROJECT0_USERNAME'],
    host: process.env['PROJECT0_HOST'],
    database: process.env['PROJECT0_DATABASE'],
    password: process.env['PROJECT0_PASSWORD'],
    port: 5432,
    max: 5,
});


export const connectionPool: Pool = new Pool({
    user: process.env['PROJECT0_USERNAME'],
    host: process.env['PROJECT0_HOST'],
    database: process.env['PROJECT0_DATABASE'],
    password: process.env['PROJECT0_PASSWORD'],
    port: 5432,
    max: 5,
});