import bcrypt from 'bcrypt';
import User from '../models/User.model.js';
import {genToken} from '../utils/token.js'; 
import {sendEmail} from '../utils/email.js';
export const signUp = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      mobile,
      role,
    } = req.body;

    const existingUser =
      await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      mobile,
      role,
    });

    const token =
      await genToken(newUser);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      message:
        "User created successfully",
        token, 
      user: newUser,
    });

  } catch (error) {
    return res.status(500).json({
      message:
        "Internal server error",
    });
  }
};
export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = await genToken(user);

    res.cookie("token", token, {
      secure: false,
      sameSite: "lax",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "User signed in successfully",
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};



export const googleSignin = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please sign up first.",
      });
    }

    const token = await genToken(user);

    res.cookie("token", token, {
      secure: false,
      sameSite: "lax",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Google login successful",
      token,
      user,
    });
  } catch (error) {
    console.error("GOOGLE SIGNIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// SIGNOUT

export const signOut = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });

    return res.status(200).json({
      success: true,
      message: "User signed out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const verifyOtp=async(req,res)=>{
    try {
        const {email,otp}=req.body;
        const user=await User.findOne({email});

        if(!user || user.resetOtp!==otp || user.otpExpiry<Date.now() ){
            return res.status(400).json({message:"Invalid or expired OTP"});
        }

        user.isOtpVerified=true;
        user.resetOtp=null;
        user.otpExpiry=null;

        await user.save();

        res.status(200).json({message:"OTP verified successfully"});
    } catch (error) {
        res.status(500).json({message:"Internal server error"});
    }
}
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    user.resetOtp = otp;
    user.otpExpiresAt = Date.now() + 10 * 60 * 1000;

    await user.save();

    await sendEmail(email, otp);

    return res.status(200).json({
      message: "OTP sent successfully"
    });
  } catch (error) {
    console.error("SEND OTP ERROR:", error);

    return res.status(500).json({
      message: error.message
    });
  }
};

export const googleSignup = async (req, res) => {
  try {
    const { fullName, email, mobile, role } = req.body;

    if (!mobile) {
      return res.status(400).json({
        success: false,
        message: "Mobile number is required",
      });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        fullName,
        email,
        mobile,
        role,
      });
    }

    const token = await genToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: "Google signup successful",
      token,
      user,
    });

  } catch (error) {
    console.error("GOOGLE SIGNUP ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const resetPassword=async(req,res)=>{
    try {
        const {email,newPassword}=req.body;
        const user=await User.findOne({email}); 
        if(!user || !user.isOtpVerified){
            return res.status(400).json({message:"OTP verification required"});
        }
        if(newPassword.length<6){   
            return res.status(400).json({message:"Password must be at least 6 characters"});
        }
        const hashedPassword=await bcrypt.hash(newPassword,10);
        user.password=hashedPassword;
        user.isOtpVerified=false;
        await user.save();
        res.status(200).json({message:"Password reset successfully"});
    } catch (error) {
        res.status(500).json({message:"Internal server error"});
    }   
}

/*export const googleAuth=async(req,res)=>{
    try {
        const {fullName,email,mobile}=req.body;
        const user=await User.findOne({email});
        if(!user){
            user = await User.create({
                fullName,
                email,
                mobile
            });
        }
        const token=await genToken(user);
        res.cookie("token",token,{
            secure:false,
            sameSite:"lax",
            maxAge:24*60*60*1000,
            httpOnly:true
        });
        return res.status(200).json(user);
    } catch (error) {
        res.status(500).json({message:"Internal server error"});    
    }
}*/