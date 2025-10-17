const express = require("express");
const userModel = require("./models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const authMiddleware = require("./middlewares/auth.middleware");
const mqtt = require("mqtt");
const rateLimit = require("express-rate-limit")

const app = express();
app.use(express.json());
app.use(cookieParser());

const loginLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 3,
    message: {
        message: "Too many login attempts. Try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use("/api/login", loginLimiter)

const mqttClient = mqtt.connect(process.env.MQTT_BROKER, {
    clientId: "wakeonwan-" + Math.random().toString(16).substr(2, 8),
    username: process.env.MQTT_USER,
    password: process.env.MQTT_PASS
})

mqttClient.on("connect", () => console.log("Connected to MQTT broker"))
mqttClient.on("error", (err) => console.error("MQTT error:", err))


// app.post("/api/register", async (req, res) => {
//     const { username, password } = req.body

//     const user = await userModel.create({
//         username,
//         password: await bcrypt.hash(password, 10)
//     })

//     res.status(201).json({
//         message: "User created successfully!",
//         user
//     })
// })

app.post("/api/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: "Username and Password are required!",
        });
    }

    const user = await userModel.findOne({
        username,
    });

    if (!user) {
        return res.status(404).json({
            message: "User not Found!",
        });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(401).json({
            message: "Password Invalid!",
        });
    }

    const token = jwt.sign(
        {
            id: user._id,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1h",
        }
    );

    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 1000 * 60 * 60,
    });

    res.status(200).json({
        message: "User Logged in",
    });
});

app.post("/api/logout", (req, res) => {
    res.clearCookie("token");
    res.status(200).json({
        message: "User Logged out",
    });
});

app.post("/api/power", authMiddleware, async (req, res) => {
    try {
        mqttClient.publish("pc/power/command", "TURN_ON");

        await userModel.findByIdAndUpdate(req.user.id, {
            lastPowerSignal: new Date(),
        })

        res.status(200).json({
            message: "Power signal sent",
        });
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: "Failed to send power signal",
        });
    }
})

module.exports = app;
