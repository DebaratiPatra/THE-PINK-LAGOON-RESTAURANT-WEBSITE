import express from "express";
import { createBooking, getBookings, deleteBooking, updateBooking } from "../controllers/bookingController.js";

const router = express.Router();

router.post("/", createBooking);
router.get("/", getBookings);
router.delete("/:id", deleteBooking);
router.put("/:id", updateBooking);

export default router;
