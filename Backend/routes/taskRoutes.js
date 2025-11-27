import express from "express";
import Task from "../models/Task.js";
import ActivityLog from "../models/ActivityLog.js";
import { protect } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";

const router = express.Router();

// helper to log activity
const logActivity = async ({ taskId, userId, action, details }) => {
  try {
    await ActivityLog.create({
      task: taskId,
      user: userId,
      action,
      details,
    });
  } catch (err) {
    console.error("Activity log error:", err);
  }
};

// POST /api/tasks   (manager only) - create
router.post("/", protect, requireRole("manager"), async (req, res) => {
  try {
    const { title, description, assignedTo, dueDate, priority } = req.body;

    if (!title || !assignedTo) {
      return res.status(400).json({ message: "Title and assignedTo are required" });
    }

    const task = await Task.create({
      title,
      description,
      assignedTo,
      dueDate,
      priority,
      createdBy: req.user._id,
    });

    await logActivity({
      taskId: task._id,
      userId: req.user._id,
      action: "created",
      details: `Task created & assigned to user ${assignedTo}`,
    });

    res.status(201).json(task);
  } catch (err) {
    console.error("Create task error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/tasks?type=assigned|created&page=1&limit=10
router.get("/", protect, async (req, res) => {
  try {
    const { page = 1, limit = 10, type } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const filter = {};

    if (req.user.role === "manager") {
      if (type === "created") {
        filter.createdBy = req.user._id;
      } else if (type === "assigned") {
        filter.assignedTo = req.user._id;
      } else {
        filter.$or = [{ createdBy: req.user._id }, { assignedTo: req.user._id }];
      }
    } else {
      filter.assignedTo = req.user._id;
    }

    const [tasks, total] = await Promise.all([
      Task.find(filter)
        .populate("createdBy", "name email")
        .populate("assignedTo", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Task.countDocuments(filter),
    ]);

    res.json({
      tasks,
      page: Number(page),
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("Get tasks error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/tasks/:id  (manager only) - full update
router.put("/:id", protect, requireRole("manager"), async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!task) return res.status(404).json({ message: "Task not found" });

    await logActivity({
      taskId: task._id,
      userId: req.user._id,
      action: "updated",
      details: "Task updated by manager",
    });

    res.json(task);
  } catch (err) {
    console.error("Update task error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/tasks/:id/status  (assigned user or manager)
router.put("/:id/status", protect, async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!["todo", "in_progress", "completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const isOwner =
      task.createdBy.toString() === req.user._id.toString() ||
      task.assignedTo.toString() === req.user._id.toString();

    if (!isOwner) {
      return res.status(403).json({ message: "Not allowed to update this task" });
    }

    task.status = status;
    await task.save();

    await logActivity({
      taskId: task._id,
      userId: req.user._id,
      action: "status_changed",
      details: `Status changed to ${status}`,
    });

    const populated = await task
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email");

    res.json(populated);
  } catch (err) {
    console.error("Status change error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/tasks/:id  (manager only)
router.delete("/:id", protect, requireRole("manager"), async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findByIdAndDelete(id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    await logActivity({
      taskId: task._id,
      userId: req.user._id,
      action: "deleted",
      details: "Task deleted by manager",
    });

    res.json({ message: "Task deleted" });
  } catch (err) {
    console.error("Delete task error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
