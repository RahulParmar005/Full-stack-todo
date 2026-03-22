import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { protect } from "../middleware/auth.js";
import pool from "../config/db.js";

/*
 * ROUTES (prefixed /api/auth):
 * POST /register - Create user (body: name, email, password) → user + JWT cookie
 * POST /login - Login (body: email, password) → user + JWT cookie
 * GET /me - Get current user (protected) → {user}
 * POST /logout - Logout (protected) → clear cookie
 * 
 * Todos (protected, user-specific):
 * POST /me/todos - Create (body: description, [completed]) → todo
 * GET /me/todos - List → {todo: [...]}
 * PUT /me/todos/:id - Update (body: description, completed) → todo
 * DELETE /me/todos/:id - Delete → success + todo
 */

const router = express.Router();
const saltRound = 10;

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    maxAge: 30 * 24 * 60 * 60 * 1000
}

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d"
    });
};

// Register user
router.post("/register", async (req, res) => {
    const {name, email, password} = req.body;

    if(!name || !email || !password) {
        return res.status(400).json({message: "Please provide all required fields"});
    }

    const userExist = await pool.query("SELECT * FROM users WHERE email = $1;", [email]);

    if(userExist.rows.length > 0) {
        return res.status(400).json({message: "User already exists, please login"});
    }

    const hashedPassword = await bcrypt.hash(password, saltRound);

    const newUser = await pool.query(
        "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email;", 
        [name, email, hashedPassword]
    );

    const token = generateToken(newUser.rows[0].id);

    res.cookie("token", token, cookieOptions);

    return res.status(200).json({user: newUser.rows[0]})
});

// Login user
router.post("/login", async (req, res) => {
    const {email, password} = req.body;

    if(!email || !password) {
        return res.status(400).json({message: "Please provide all required fields"});
    }

    const user = await pool.query("SELECT * FROM users WHERE email = $1;", [email]);
    
    if(user.rows.length === 0) {
        return res.status(400).json({message: "User doesn't exist"});
    }

    const userData = user.rows[0];

    const isMatch = await bcrypt.compare(password, userData.password);
    if(!isMatch) {
        return res.status(400).json({message: "Invalid password"});
    }

    const token = generateToken(userData.id);
    res.cookie("token", token, cookieOptions);

    res.json({user: {id: userData.id, name: userData.name, email: userData.email}});
});

// Get current user (for session check)
router.get("/me", protect, async (req, res) => {
    res.json({ user: req.user });
});

// Logout user
router.post("/logout", protect, async (req, res) => {
    res.cookie("token", "", {...cookieOptions, maxAge: 1});
    res.json({message: "Logged out successfully"});
});

// insert todo
router.post("/me/todos", protect, async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Authentication required" });
        }

        const { description, completed } = req.body;
        if(!description) {
            return res.status(400).json({ message: "Description is required" });
        }
        const newTodo = await pool.query(
            "INSERT INTO todos (user_id, description, completed) VALUES ($1, $2, $3) RETURNING *;",
            [req.user.id, description, completed || false]
        );
        res.json(newTodo.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server Error" });
    }
});

// Get all todos for authenticated user
router.get("/me/todos", protect, async (req, res) => {
    try {
        if(!req.user) {
            return res.status(401).json({ message: "Authentication required" });
        }

        const userId = req.user.id;
        const userTodos = await pool.query("SELECT * FROM todos WHERE user_id = $1;", [userId]);
        res.json({todo: userTodos.rows});
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server Error" });
    }
});

// edit todos
router.put("/me/todos/:id", protect, async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Authentication required" });
        }

        const { id } = req.params;
        const { description, completed } = req.body;
        
        if (completed !== undefined && typeof completed !== 'boolean') {
            return res.status(400).json({ message: "Completed must be a boolean" });
        }

        let query = "UPDATE todos SET";
        const params = [];
        let paramIndex = 1;

        if (description !== undefined) {
            query += ` description = $${paramIndex}`;
            params.push(description);
            paramIndex++;
        }
        if (completed !== undefined) {
            if (paramIndex > 1) query += ",";
            query += ` completed = $${paramIndex}`;
            params.push(completed);
            paramIndex++;
        }
        query += ` WHERE id = $${paramIndex} AND user_id = $${++paramIndex} RETURNING *;`;
        params.push(id);
        params.push(req.user.id);

        const editData = await pool.query(query, params);

        if (editData.rows.length === 0) {
            return res.status(404).json({ message: "Todo not found or access denied" });
        }

        res.json({
            message: "Todo updated successfully",
            todo: editData.rows[0]
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server Error" });
    }
});

// delete todos
router.delete("/me/todos/:id", protect, async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Authentication required" });
        }

        const { id } = req.params;

        const deletedTodo = await pool.query(
            "DELETE FROM todos WHERE id = $1 AND user_id = $2 RETURNING *;",
            [id, req.user.id]
        );

        if (deletedTodo.rowCount === 0) {
            return res.status(404).json({ message: "Todo not found or access denied" });
        }

        res.json({
            message: "Todo deleted successfully",
            todo: deletedTodo.rows[0]
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server Error" });
    }
});

export default router;

