import { Router } from "express";
import * as db from "../utils/db.js";
import { authenticate } from "../middleware/authenticate.js";
import { authorizeModification } from "../middleware/authorize.js";
import users from "../data/users.json" with { type: "json" };

const router = Router();

router.get("/:userId", authenticate, (req, res) => {
    const watchlist = db.getWatchlist(req.params.userId)
    res.status(200).json(watchlist);
})

// router.get("/:userId/Movies", authenticate, authorizeModification, (req, res) => {
//     res.status(200).json(db.getWatchlist(req.params.userId))
// })

router.post("/:userId/movies", authenticate, authorizeModification, (req, res) => {
    db.addMovie(req.params.userId, req.body)
    res.status(201).json({ message: "Movie added successfully!" })

})

router.put("/:userId/movies/:movieId", authenticate, authorizeModification, (req, res) => {
    db.updateMovie(req.params.userId, req.params.movieId, req.body)
    res.status(200).json({ message: "Movie updated successfully!" })
})

router.delete("/:userId/movies/:movieId", authenticate, authorizeModification, (req, res) => {
    db.deleteMovie(req.params.userId, req.params.movieId);
    res.status(200).json({
        message: "Movie deleted successfully!"
    });
})

export default router;