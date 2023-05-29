import dotenv from 'dotenv';
dotenv.config();

export const config = {
    db : {
        url: process.env.DATABASE_URI,
        name: "App2000"
    },
    port: 3500
}