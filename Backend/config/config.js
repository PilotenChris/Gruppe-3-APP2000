const env = process.env;

export const config = {
    db : {
        url: "mongodb://localhost:27017",
        name: "App2000"
    },
    port: env.PORT || 3030
}