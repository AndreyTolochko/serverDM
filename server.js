import AdminJS from "adminjs"
import AdminJSExpress from "@adminjs/express"
import * as AdminJSMongoose from "@adminjs/mongoose"
import adminOptions from "./src/adminjsOptions.js"
import express, { json, urlencoded } from "express"
import cookie from "cookie-parser"
import session from "express-session"
import connectDB from "./database.js"
import MongoStore from "connect-mongo"
import router from "./routes/mainPageRoutes.js"
import authRouter from "./routes/authRoutes.js"
import { config } from "dotenv"
import cors from "cors";
import path, { dirname } from "path"
import { fileURLToPath } from "node:url"
import checkoutRouter from "./routes/checkoutRoutes.js"
import corsOptions from './config/corsOptions.js'
import logger from "./middleware/logger.js"


config()
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const app = express()
app.use(logger)
app.use(cors(corsOptions))
app.use(json())
app.use(cookie())
app.use(express.static(path.join(__dirname,'public')))
const DEFAULT_ADMIN = {
  email: process.env.ADMIN_EMAIL,
  password: process.env.ADMIN_PASSWORD,
}
AdminJS.registerAdapter({
  Resource: AdminJSMongoose.Resource,
  Database: AdminJSMongoose.Database,
})

connectDB()
const admin = new AdminJS(adminOptions)

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
    }),
  })
)

const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
  admin,
  {
    authenticate: async (email, password) => {
      if (
        email === DEFAULT_ADMIN.email &&
        password === DEFAULT_ADMIN.password
      ) {
        return Promise.resolve(DEFAULT_ADMIN)
      }
      return null
    },
    cookieName: "adminjs",
    cookiePassword: process.env.COOKIE_SECRET,
  },
  null,
  {
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
    }),
  }
)
app.use("/", router)
app.use(admin.options.rootPath, adminRouter)
app.use("/api/auth", authRouter)
app.use("/api/checkout", checkoutRouter)
app.use(urlencoded({ extended: true }))

app.all('*', (req, res) => {
  res.status(404)
  if (req.accepts("html")) {
    res.sendFile(path.join(process.cwd() , "views", "404.html"))
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found" })
  } else {
    res.type("text").send("404 Not Found")
  }
})
app.listen(process.env.PORT, () => {
  console.log(
    `AdminJS started on ${process.env.DOMAIN}:${process.env.PORT}${admin.options.rootPath}`
  )
})
