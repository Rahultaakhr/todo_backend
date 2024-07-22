import dotenv from "dotenv";
import { app } from "./app.js";
import { dbConnection } from "./db/index.js";

dotenv.config()
const port =process.env.PORT || 3000
dbConnection().then(() => {
    app.listen(port, () => {
        console.log(`server is running at ${port}`);
    })
}).catch((error) => {
    console.log(error);
})
