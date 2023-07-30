const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

router.post("/assign-complaint", async (req, res) => {
  const { complaintId, category } = req.body;

  try {
    const allowedCategories = [
      "faculty",
      "hall1",
      "hall3",
      "hall4",
      "girls-hostel",
    ];
    if (!allowedCategories.includes(category)) {
      return res.status(400).send("Invalid category.");
    }

    const Complaint = mongoose.model("Complaint");
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).send("Complaint not found.");
    }

    complaint.category = category;
    await complaint.save();
    if (!mongoose.models[category]) {
      const categorySchema = new mongoose.Schema(complaint.schema.obj);
      mongoose.model(category, categorySchema);
    }
    const CategoryModel = mongoose.model(category);
    const assignedComplaint = new CategoryModel(complaint.toObject());
    await assignedComplaint.save();

    console.log("Complaint assigned successfully:", assignedComplaint);
    res.send("Complaint assigned successfully.");
  } catch (error) {
    console.error("Error assigning complaint:", error);
    res.status(500).send("Error assigning complaint.");
  }
});

module.exports = router;
