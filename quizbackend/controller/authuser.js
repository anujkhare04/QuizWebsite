const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const usermodel = require("../model/auth");
const { sendResetEmail } = require("../service/mailservice");
const crypto = require("crypto");
const Redis = require("ioredis");

let redisClient = null;
let redisReady = false;
const memoryCache = new Map();

function setMemory(key, value, ttlSec) {
  memoryCache.set(key, { value, expireAt: Date.now() + ttlSec * 1000 });
}

function getMemory(key) {
  const entry = memoryCache.get(key);
  if (!entry) return null;
  if (entry.expireAt && Date.now() > entry.expireAt) {
    memoryCache.delete(key);
    return null;
  }
  return entry.value;
}

function delMemory(key) {
  memoryCache.delete(key);
}

try {
  redisClient = new Redis({
    lazyConnect: true,
    enableReadyCheck: true,
    maxRetriesPerRequest: 1,
    retryStrategy: (times) => {
      if (times > 3) return null;
      return Math.min(times * 200, 1000);
    },
  });

  redisClient.on("ready", () => {
    redisReady = true;
    console.log("Redis connected and ready");
  });

  redisClient.on("error", (err) => {
    if (redisReady) {
      console.warn("Redis error:", err.message);
    }
    redisReady = false;
  });

  redisClient.on("end", () => {
    redisReady = false;
  });

  redisClient.connect().catch(() => {
    redisReady = false;
    console.log("Redis unavailable - using in-memory cache fallback");
  });
} catch (e) {
  redisReady = false;
  redisClient = null;
  console.log("Redis init skipped - using in-memory cache fallback");
}

const cache = {
  async get(key) {
    if (redisReady && redisClient) {
      try {
        return await redisClient.get(key);
      } catch (_) {}
    }
    return getMemory(key);
  },
  async set(key, value, mode, ttl) {
    const ttlSec = mode === "EX" && typeof ttl === "number" ? ttl : 3600;
    if (redisReady && redisClient) {
      try {
        await redisClient.set(key, value, "EX", ttlSec);
        return;
      } catch (_) {}
    }
    setMemory(key, value, ttlSec);
  },
  async del(key) {
    if (redisReady && redisClient) {
      try {
        await redisClient.del(key);
      } catch (_) {}
    }
    delMemory(key);
  },
};

const getCookieOptions = (req) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  path: "/",
  maxAge: 24 * 60 * 60 * 1000,
  domain: process.env.NODE_ENV === "production" ? req.hostname : undefined,
});

module.exports.regsiteruser = async (req, res) => {
  console.log(req.body);

  try {
    const {
      email,
      password,
      username,
      fullname: { firstname, lastname, middlename },

    } = req.body;

    const user = await usermodel.findOne({
      $or: [{ email }, { username }],
    });

    if (user) {
      console.log("⚠️ Duplicate user found:", user.email, user.username);
      return res.status(400).json({ message: "User already existed" });
    }

    const hashpassword = await bcrypt.hash(password, 10);

    const Regsiteruser = await usermodel.create({
      email,
      username,
      password: hashpassword,
      fullname: {
        firstname,
        lastname,
        middlename,
      },

    });

    const token = jwt.sign(
      { id: Regsiteruser._id, email: Regsiteruser.email },
      process.env.JWT_SECRET_KEY
    );

    res.cookie("token", token, getCookieOptions(req));

    return res.json({
      message: "User register successfully",
      Regsiteruser,
      token,
    });
  } catch (err) {
    return res.status(500).json({
      message: "server error",
      error: err.message,
    });
  }
};

module.exports.loginuser = async (req, res) => {
  try {
    const { password, username ,email } = req.body;

    if (!username || !password ) {
      return res.status(400).json({
        message: "username and password are required",
      });
    }

    const user = await usermodel.findOne({
      $or: [{ username }],
    });

    if (!user) {
      return res.status(400).json({
        message: "user not found!",
      });
    }

    const isvalid = await bcrypt.compare(password, user.password);

    if (!isvalid) {
      return res.status(401).json({
        message: "invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET_KEY
    );


    
    res.cookie("token", token, getCookieOptions(req));

    return res.json({
      message: "user logged in !",
      user,
      token,
    });
  } catch (err) {
    return res.status(500).json({
      message: "server error",
      error: err.message,
    });
  }
};


module.exports.logout = async (req, res) => {
  try {
    let token = req.cookies.token;
    if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    console.log(token);

    if (!token) {
      return res.status(404).json({
        message: "Token not found",
      });
    }

    res.clearCookie("token", getCookieOptions(req));

    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};


module.exports.profile = async (req, res) => {

  console.log("=== PROFILE ROUTE EXECUTED ===");
  try {
    const userid = req.userId; 

    
    const start = process.hrtime.bigint();

    const cacheKey = `user:profile:${userid}`;
     const cachedProfile = await cache.get(cacheKey);

       const end = process.hrtime.bigint();

  console.log(`Cache GET: ${Number(end - start) / 1e6} ms`);

     if (cachedProfile) {
      console.log("⚡ Cache Hit!");
      return res.status(200).json(JSON.parse(cachedProfile));
    }
    console.log("❌ Cache Miss! Fetching from MongoDB...");

  

    const user = await usermodel.findById(userid).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const responseData = {
      message: "profile fetched",
      user,
    };

    await cache.set(cacheKey, JSON.stringify(responseData), "EX", 3600);

    return res.status(200).json(responseData);
  } catch (error) {
    console.log("Error in profile route:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports.updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await usermodel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { username, firstname, lastname, middlename } = req.body || {};

    if (typeof username === "string" && username.trim()) {
      const nextUsername = username.trim();
      const existingUsername = await usermodel.findOne({
        username: nextUsername,
        _id: { $ne: userId },
      });
      if (existingUsername) {
        return res.status(400).json({ message: "Username already taken" });
      }
      user.username = nextUsername;
    }

    user.fullname = user.fullname || {};
    if (typeof firstname === "string" && firstname.trim()) user.fullname.firstname = firstname.trim();
    if (typeof lastname === "string" && lastname.trim()) user.fullname.lastname = lastname.trim();
    if (typeof middlename === "string") user.fullname.middlename = middlename.trim();

    if (req.file && req.file.buffer) {
      const mimeType = req.file.mimetype || "image/jpeg";
      const base64 = req.file.buffer.toString("base64");
      user.img = `data:${mimeType};base64,${base64}`;
    }

    await user.save();
    const safeUser = await usermodel.findById(userId).select("-password");

    const cacheKey = `user:profile:${userId}`;
    await cache.del(cacheKey);

    return res.status(200).json({
      message: "Profile updated successfully",
      user: safeUser,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update profile", error: error.message });
  }
};
module.exports.forgotPassword= async (req, res) => {
  try {
    const { email } = req.body;

    const user = await usermodel.findOne({ email });
   
    
   
    if (!user) {
      return res.json({ msg: "If email exists, reset link sent" });
    }

    const token = crypto.randomBytes(32).toString("hex");

    user.resetToken = token;
    user.resetTokenExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    try {
      await sendResetEmail(user.email, token, user.username);
    } catch (mailError) {
      user.resetToken = undefined;
      user.resetTokenExpire = undefined;
      await user.save();
      return res.status(503).json({ msg: "Unable to send reset email. Please try again later." });
    }

    res.json({ msg: "Reset link sent to email" });

  } catch (err) {
    res.status(500).json({ msg: "Error sending reset email" });
  }
};

module.exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (typeof newPassword !== "string" || newPassword.length < 6) {
      return res.status(400).json({ msg: "Password must be at least 6 characters" });
    }

    const user = await usermodel.findOne({
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ msg: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;

    await user.save();

    res.json({ msg: "Password reset successful" });

  } catch (err) {
    res.status(500).json({ msg: "Error resetting password" });
  }
};
