import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Define User Schema
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true
  },
});

// Hash password before saving the user
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.isPasswordCorrect = async function (password){
    return bcrypt.compareSync(password , this.password);
}

UserSchema.methods.generateAccessToken = function(){
    return jwt.sign({
        _id : this._id,
        email : this.email,
        username : this.username,
        fullName : this.fullName
    } , process.env.ACCESS_TOKEN_SECRET , {expiresIn : process.env.ACCESS_TOKEN_EXPIRY});
}

UserSchema.methods.generateRefreshToken = function(){
    return jwt.sign({
        _id : this._id
    } , process.env.REFRESH_TOKEN_SECRET , {expiresIn : process.env.REFRESH_TOKEN_EXPIRY});
}

const User = mongoose.model('User', UserSchema);

export default User;