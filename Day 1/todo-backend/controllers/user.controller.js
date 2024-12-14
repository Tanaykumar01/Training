import User from "../models/User.model.js";


const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Error while generating tokens");
    }
}

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (User.findOne({ email })) {
            return res.status(400).json({ message: "User already exists" });
        }
        const user = await User.create({ name, email, password });
        user.save();

        return res.status(201).json({
            user: {
                name: user.name,
                email: user.email,
                id: user._id
            }
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });

    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = await User.findOne({
            $or: [{ email }, { username }]
        });
        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }
        const isPasswordMatched = await user.isPasswordCorrect(password);
        if (!isPasswordMatched) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);
        const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

        const options = {
            httpOnly: true,
            secure: true
        }

        return res.status(200).cookie("refreshToken", refreshToken, options).cookie("accessToken", accessToken, options).json({
            user: loggedInUser,
            accessToken,
            refreshToken
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

}

export { registerUser , loginUser};