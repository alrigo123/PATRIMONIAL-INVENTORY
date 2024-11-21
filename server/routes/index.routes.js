import { Router } from "express";
import pool from '../db.js';
const router = Router();

router.get('/ping', async (req, res) => {
    const rows = await pool.query('SELECT 1+1 as result')
    console.log("Succesfully connected and", rows[0][0]);
    res.json({ message: rows[0], message2: "Successfully connected" })
})

export default router;