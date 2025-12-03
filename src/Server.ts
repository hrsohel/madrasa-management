import express, { Application, NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import http from "http"
import dotenv from "dotenv"
import { Routes } from "../routes/student.route";
import { mongooseErrorHandler } from "./middlewares/mongoose.error";
dotenv.config()

const router = new Routes()

class Server {
    private app: Application
    private server?: http.Server
    private PORT: number

    constructor() {
        this.app = express()
        this.PORT = Number(process.env.PORT) || 5000
        this.configureMiddleware()
        this.configureRoutes()
        this.configureErrorHandling()
    }

    private configureMiddleware(): void {
        this.app.use(express.json({ limit: "10mb" }))
        this.app.use(express.urlencoded({ extended: true }))
    }

    private configureRoutes(): void {
        this.app.get("/health", (req: Request, res: Response) => {
            res.status(200).json({
                status: "OK",
                uptime: process.uptime(),
                timestamps: new Date().toISOString()
            })
        })
        this.app.use("/api/v1", router.getRouter())
    }

    private configureErrorHandling(): void {
        // this.app.use('*', (req: Request, res: Response) => {
        //     res.status(404).json({
        //         status: 404,
        //         success: false,
        //         message: "Route not found",
        //         path: req.originalUrl,
        //         data: [],
        //     });
        // });
        
        this.app.use(mongooseErrorHandler)

        this.app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
            console.error("Unhandled Error:", error);

            res.status(500).json({
                status: 500,
                success: false,
                message: error.message || "Internal Server Error",
                data: [],
            });
        });
    }

    public startServer(): void {
        this.server = this.app.listen(this.PORT, () => console.log(`Server listening at http://localhost:${this.PORT}`))
    }
    public startMongoDB(): void {
        mongoose.connect(process.env.MONGO_URL as string)
            .then(() => console.log("Database connected successfully."))
            .catch(error => console.log("Database error: ", error))
    }

    public getApp(): Application {
        return this.app
    }

    public stop(): void {
        if (this.server) {
            this.server.close(() => {
                console.log('Server stopped');
            });
        }
    }
}

export default Server