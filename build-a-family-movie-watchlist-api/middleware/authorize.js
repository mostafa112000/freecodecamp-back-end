export function authorizeModification(req, res, next) {
    if (!req.user) {
        return res.status(403).json({
            error: "Access denied"
        });
    }

    const isParent = req.user.role === "parent";

    const isChildModifyingOwnList =
        req.user.role === "child" &&
        String(req.user.id) === String(req.params.userId);

    if (isParent || isChildModifyingOwnList) {
        return next();
    }

    return res.status(403).json({
        error: "Access denied"
    });
}