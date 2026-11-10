import { verifyToken } from "../utils/jwt.js";
import { isBlacklisted } from "../utils/token-blacklist.js";

export function authenticate(req, res, next){
    const auth = req.headers.authorization;

    if (!auth || !(auth.startsWith("Bearer "))) {
        return res.status(401).json({ "error": "No token provided." });            
    }

    const token = auth.split(" ")[1];

    if(isBlacklisted(token)){
        return res.status(401).json({"message": "Token has been invalidated. Log in again."})
    }

    const decoded = verifyToken(token);

    if(!decoded){
        return res.status(401).json({ "error": "Invalid or expired token." })
    }

    req.user = decoded;
    next();
}

