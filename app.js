import express from 'express';
import postRoute from "./routes/post.route.js";
import authRoute from "./routes/auth.route.js";
import testRoute from "./routes/test.route.js";
import cookieParser from "cookie-parser";
import mongoose from 'mongoose';
import cors from "cors";
const app = express();
app.use(cors({   origin: ["https://real-estate-frontend-project-kx4y.vercel.app"], methods: 'GET,POST,PUT,DELETE', credentials: true })); 
app.use(express.json());
app.use(cookieParser());

/*
id String unique @default(auto()) @map("_id") @db.ObjectId
email String  @unique
username String @unique
password String
avatar String?
createdAt DateTime @default(now())
*/ 





mongoose.connect("mongodb+srv://yogendra:duPwd@mycluster.u5ayq.mongodb.net/Real-Estate").then(
    () => {
        console.log("Connected to database you are good to go hello");
    }
);





app.use("/api/posts", postRoute);
app.use("/api/auth", authRoute);
app.use("/api/test", testRoute);

app.listen(3005, () => {
    console.log('Server is running on port 3005');
})

// app.use("/api/test", (req, res) => {
//     res.send("It's working");
// })

// app.use("/api/auth/register", (req, res) => {
//     res.send("Register");
// })
// app.use("/api/auth/login", (req, res) => {
//     res.send("Login");
// })
// app.use("/api/auth/logout", (req, res) => {
//     res.send("Logout");
// });
// // post requests
// app.use("api/posts/", (req, res) => {
//     res.send("Posts");
// });
// // get entire requests
// app.use("api/posts/", (req, res) => {
//     res.send("Posts");
// });
// // get single requests
// app.use("api/posts/:id", (req, res) => {
//     res.send("Posts get request done");
// });
export default app;
