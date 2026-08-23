import { User } from "../models/User.js";
import { Project } from "../models/Project.js";
import {
  generateOtp,
  saveOtp,
  sendOtpEmail,
  verifyOtp,
} from "../utils/services.js";
import { signToken } from "../middleware/Auth.js";



async function issueAndSend(
  email,
  name,
  status,
  res,
  code = 201
) {
  try {

    const otp = generateOtp();

    console.log("🔐 Generated OTP:", otp);

    saveOtp(email, otp);

    await sendOtpEmail({
      to: email,
      name,
      code: otp,
      purpose: status,
    });

    console.log("✅ OTP email sent");

    return res.status(code).json({
      ok: true,
      email,
    });
  } catch (error) {
    console.error("❌ issueAndSend Error:", error);

    return res.status(500).json({
      ok: false,
      message: "Unable to send verification code",
    });
  }
}



// to register a user and send otp
export async function register(req, res, next) {

  try {
    const { name, email, password } = req.body;

    // 1. Required fields
    if (!name || !email || !password) {
      return res.status(404).json({
        message: "All fields are required",
      });
    }

    // 2. Name validation
    if (name.trim().length < 2) {
      return res.status(400).json({
        error: "Name must be at least 2 characters",
      });
    }

    // 3. Password validation
    if (password.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters",
      });
    }

    // 4. Normalize email
    const normalizedEmail = email.trim().toLowerCase();

    console.log("🔍 Checking existing user...");

    // 5. Check existing user
    const existing = await User.findOne({
      email: normalizedEmail,
    });

    console.log("👤 Existing user:", existing ? "YES" : "NO");

    if (existing) {
      console.log("⚠️ User already exists");

      if (existing.emailVerified) {
        return res.status(409).json({
          error: "Email already in use.",
        });
      }

      console.log("📧 User exists but email is not verified");
      console.log("📧 Calling issueAndSend...");

      return issueAndSend(
        normalizedEmail,
        existing.name,
        "signup",
        res,
        200
      );
    }

    // 6. Create new user
    console.log("👤 Creating new user...");

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: await User.hashPassword(password),
      emailVerified: false,
    });

    console.log("✅ User created:", user.email);

    // 7. Send verification OTP
    console.log("📧 Calling issueAndSend...");

    return issueAndSend(
      user.email,
      user.name,
      "signup",
      res,
      201
    );

  } catch (error) {
    console.error("❌ Register Error:", error);
    next(error);
  }
}



// verify the otp and make user verified
export async function verifyRegister(req, res, next) {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.status(400).json({
        error: "Email and code are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({
        error: "No account found with that email",
      });

    if (user.emailVerified) {
      return res.json({ ok: true, alreadyVerified: true });
    }

    const result = verifyOtp(email, code);
    if (!result.ok) return res.status(400).json({ error: result.reason });

    user.emailVerified = true;
    await user.save();
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
}



// to resend the otp or if user registers but forgets to verify
// we can reverify them
export async function resendRegister(req, res, next) {
  try {
    const email = (req.body.email || "").trim().toLowerCase();
    if (!email) return res.status(400).json({ error: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ error: "No account found with that email" });
    }

    if (user.emailVerified) {
      return res
        .status(400)
        .json({ error: "This email is already verified - just sign in." });
    }

    return issueAndSend(user.email, user.name, "signup", res, 200);
  } catch (error) {
    next(error);
  }
}



// to Login

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and Password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid Credentials" });
    }

    const ok = await user.verifyPassword(password);
    if (!ok) {
      return res.status(401).json({ error: "Invalid Credentials" });
    }

    if (!user.emailVerified) {
      return res.status(403).json({
        error:
          "Please verify your email first. check your inbox for the 6-digits code.",
        needsVerification: true,
        email: user.email,
      });
    }

    // to get token
    const token = signToken(user._id.toString());
    res.json({ token, user: user.toClient() });
  } catch (error) {
    next(error);
  }
}



// to get logged-in user profile
export function me(req, res) {
  res.json({ user: req.user.toClient() });
}



// to get contribution count.
// just like github graph.

export async function contribution(req, res, next) {
  try {
    const oneYearAgo = new Date();
    oneYearAgo.setUTCHours(0, 0, 0, 0);
    oneYearAgo.setUTCDate(oneYearAgo.getUTCDate() - 364);

    const projects = await Project.find({
      user: req.user._id,
      "messages.createdAt": { $gte: oneYearAgo },
    }).select("message");

    const counts = {};
    const key = (d) => new Date(d).toISOString().slice(0, 10);
    for (const p of projects) {
      for (const m of p.messages || []) {
        if (m.role === "user" && m.createdAt && m.createdAt >= oneYearAgo) {
          const k = key(m.createdAt);
          counts[k] = (counts[k] || 0) + 1;
        }
      }
    }

    const days = Object.entries(counts)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    const total = days.reduce((s, d) => s + d.count, 0);
    res.json({ days, total, from: key(oneYearAgo), to: key(new Date()) });
  } catch (error) {
    next(error);
  }
}


// to update profile
export async function updateProfile(req, res, next) {
    try {
        const name = req.body.name !== undefined ? String(req.body.name).trim() : undefined;
        if(name === undefined) {
            return res.status(400).json({error: "Nothing to update."})
        }

        if(name.length < 2 || name.length > 32) {
            return res.status(400).json({
                error: "Name must be of 2-32 characters."
            })
        }

        req.user.name = name;
        await req.user.save();
        res.json({user: req.user.toClient()})
    } catch (error) {
        next(error)
    }
}


// to change the current password for logged-in user
export async function changePassword(req, res, next) {
    try {
        const {current , nextPw} = req.body
        if(!current || nextPw.length < 6) {
            return res.status(400).json({error: "New password must be atleast 6 charactes."})
        }

        const ok = await req.user.verifyPassword(current);
        if(!ok) {
            return res.status(400).json({
                error: "Current Password is incorrect."
            })
        }

        req.user.passwordHash = await User.hashPassword(nextPw);
        await req.user.save();
        res.json({ok: true});
    } catch (error) {
        next(error)
    }
}



// to remove the logged-in user's accound
export async function deleteAccount(req, res, next) {
    try {
        await Project.deleteMany({user: req.user._id});
        await req.user.deleteOne();
        res.json({ok: true})
    } catch (error) {
        next(error)
    }
}