import { getAuth } from "@clerk/express";
import { Request, Response, NextFunction } from "express";
import type { CustomJwtSessionClaims } from "@repo/types";

declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}

export const ShouldBeUser = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const auth = getAuth(req);
    const userId = auth.userId;

    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    req.userId = auth.userId;

    return next();
};
export const ShouldBeAdmin = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const auth = getAuth(req);
    const userId = auth.userId;

    if (!userId) {
        return res
            .status(401)
            .json({ message: "You are not Logged in!" });
    }

    const claims = auth.sessionClaims as CustomJwtSessionClaims;

    if (claims.metadata?.role !== "admin") {
        return res.status(403).send({ error: "Unauthorized!" });
    }

    req.userId = auth.userId;

    return next();
};
