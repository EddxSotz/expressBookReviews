import express, { json } from 'express';
import { verify } from 'jsonwebtoken';
import session from 'express-session';
import { authenticated as customer_routes } from './router/auth_users.js';
import { general as genl_routes } from './router/general.js';

const app = express();

app.use(json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){

    if (req.session.authorization) {
        const token = req.session.authorization.accessToken;

        // Verify JWT token
        verify(token, "access", (err, user) => {
            if (!err) {
                req.user = user;
                next(); // Proceed to the next middleware
            } else {
                return res.status(403).json({ message: "User not authenticated" });
            }
        });
    } else {
        return res.status(403).json({ message: "User not logged in" });
    }

});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
