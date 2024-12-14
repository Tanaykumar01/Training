import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
const verifyJWT = async (req, _, next) => {
    try {
        const token = req.cookies.accessToken || req.headers("Authorization")?.replace("Bearer ", "");
        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }
        
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded?._id).select("-password -refreshToken");
        if (!user) {
            throw new ApiError(401, "Invalid token");
        }
        req.user = user;
        next();
    } catch (error) {
        throw new (401, error?.message || "Invalid access token");
    }
};

export { verifyJWT };