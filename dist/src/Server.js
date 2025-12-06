"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const student_route_1 = require("../routes/student.route");
const mongoose_error_1 = require("./middlewares/mongoose.error");
dotenv_1.default.config();
const cors_1 = __importDefault(require("cors"));
const router = new student_route_1.Routes();
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.PORT = Number(process.env.PORT) || 5000;
        this.configureMiddleware();
        this.configureRoutes();
        this.configureErrorHandling();
    }
    configureMiddleware() {
        this.app.use((0, cors_1.default)({
            origin: "*"
        }));
        this.app.use(express_1.default.json({ limit: "10mb" }));
        this.app.use(express_1.default.urlencoded({ extended: true }));
        this.app.use('/uploads', express_1.default.static('uploads'));
    }
    configureRoutes() {
        this.app.get("/health", (req, res) => {
            res.status(200).json({
                status: "OK",
                uptime: process.uptime(),
                timestamps: new Date().toISOString()
            });
        });
        this.app.use("/api/v1", router.getRouter());
    }
    configureErrorHandling() {
        // this.app.use('*', (req: Request, res: Response) => {
        //     res.status(404).json({
        //         status: 404,
        //         success: false,
        //         message: "Route not found",
        //         path: req.originalUrl,
        //         data: [],
        //     });
        // });
        this.app.use(mongoose_error_1.mongooseErrorHandler);
        this.app.use((error, req, res, next) => {
            console.error("Unhandled Error:", error);
            res.status(500).json({
                status: 500,
                success: false,
                message: error.message || "Internal Server Error",
                data: [],
            });
        });
    }
    startServer() {
        this.server = this.app.listen(this.PORT, () => console.log(`Server listening at http://localhost:${this.PORT}`));
    }
    startMongoDB() {
        mongoose_1.default.connect(process.env.MONGO_URL)
            .then(() => console.log("Database connected successfully."))
            .catch(error => console.log("Database error: ", error));
    }
    getApp() {
        return this.app;
    }
    stop() {
        if (this.server) {
            this.server.close(() => {
                console.log('Server stopped');
            });
        }
    }
}
exports.default = Server;
