import { Router } from "express";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import { signToken } from "../utils/jwt.js";
import { authenticate } from "../middleware/authenticate.js";
import { blacklistToken } from "../utils/token-blacklist.js";
import { findByUsername, writeUsers } from "../utils/db.js";
import users from "../data/users.json" with { type: "json" };

const router = Router();

router.post("/register", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ msg: "Username and password are required" });
    }

    if (findByUsername(username)) {
        return res.status(409).json({ msg: "Username already exist" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const usersList = [...users];
    const newUser = {
        "id": randomUUID(),
        username,
        "role": "user",
        passwordHash
    }

    usersList.push(newUser);
    writeUsers(usersList);

    const token = signToken({
        id: newUser.id,
        username: newUser.username,
        role: newUser.role
    })

    res.status(201).json({ message: "User added successfully!", token })
})

router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ msg: "Username and password are required" });
    }

    const user = findByUsername(username);

    if (!user) {
        return res.status(401).json({ msg: "Invalid credentials." });
    }

    const match = await bcrypt.compare(password, user.passwordHash);

    if (!match) {
        return res.status(401).json({ msg: "Invalid credentials." });
    }


    const token = signToken({
        id: user.id,
        username: user.username,
        role: user.role
    })

    res.status(200).json({ message: "Login successful", token })

})

router.get("/profile", authenticate, (req, res) => {
    return res.json({ user: req.user })
})

router.post("/logout", (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    blacklistToken(token)
    return res.json({ message: "Logged out successfully" })
})

export default router;