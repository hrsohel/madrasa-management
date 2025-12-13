import express from "express";
import { UserRoutes } from "./user.route";
import { StudentRoutes } from "./student.route";
import { AdminRoutes } from "./Admin.route";
import {FeesRoute} from "./prePlannedFees.route"

const router = express.Router();

const moduleRoutes = [
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/students",
    route: StudentRoutes,
  },
  {
    path: "/admin",
    route: AdminRoutes,
  },
  {
    path: "/fees",
    route: FeesRoute,
  }
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
