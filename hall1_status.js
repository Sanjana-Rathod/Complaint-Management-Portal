const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const complaintSchema = require("./models/complaint");
// const Complaint = mongoose.model('Complaint', complaintSchema);

const Hall1Complaint = mongoose.model("hall1", complaintSchema);

router.put("/status/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  Hall1Complaint.findByIdAndUpdate(
    id,
    { status },
    { new: true },
    (err, updatedComplaint) => {
      if (err) {
        console.error("Error updating complaint status:", err);
        return res
          .status(500)
          .json({ error: "Error updating complaint status." });
      }

      console.log("Complaint status updated successfully:", updatedComplaint);
      res.json({ success: true, data: updatedComplaint });
    }
  );
});

router.delete("/delete-complaint/:id", (req, res) => {
  const { id } = req.params;

  Hall1Complaint.findByIdAndRemove(id, (err, deletedComplaint) => {
    if (err) {
      console.error("Error deleting complaint:", err);
      return res.status(500).json({ error: "Error deleting complaint." });
    }

    if (!deletedComplaint) {
      return res.status(404).json({ error: "Complaint not found." });
    }

    console.log(
      "Complaint resolved successfully, deleted from the list::",
      deletedComplaint
    );
    res.json({ success: true, data: deletedComplaint });
  });
});

module.exports = router;
