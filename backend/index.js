const express = require("express");
const compression = require("compression");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const dotenv = require("dotenv");
const connectDb = require("./config/db");
const AuthRoutes = require("./modules/auth/auth.route");
const { mailIsworking } = require("./config/mail.config");
const OtpRoutes = require("./modules/otp/otp.route");
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();
app.use(cookieParser());
const PORT = process.env.PORT || 9090;
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);
app.use(compression());
function sanitizeObject(obj) {
  for (const key in obj) {
    if (typeof obj[key] === "string") {
      obj[key] = xss(obj[key]);
    } else if (typeof obj[key] === "object") {
      sanitizeObject(obj[key]);
    }
  }
}

app.use((req, res, next) => {
  if (req.body && typeof req.body === "object") {
    sanitizeObject(req.body);
  }
  next();
});
app.use((req, res, next) => {
  if (["POST", "PUT", "PATCH"].includes(req.method) && req.body) {
    mongoSanitize.sanitize(req.body);
  }
  next();
});
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}
app.use(helmet());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  }),
);
const allowedOrigins = process.env.ALLOWED_ORIGIN.split(",");
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    methods: ["GET", "POST", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

connectDb();
mailIsworking();

app.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "Server is healthy" });
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Internal Server Error",
  });
});

app.use("/api/auth", AuthRoutes);
app.use("/api/auth/otp", OtpRoutes);

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT} at ${new Date().toLocaleString()}`,
  );
});
