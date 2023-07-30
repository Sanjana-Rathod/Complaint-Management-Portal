const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const complaintSchema = require("./models/complaint");
const Complaint = mongoose.model("Complaint", complaintSchema);

function adminDeleteRoutes() {
  router.delete("/delete-complaint/:complaintId", async (req, res) => {
    const { complaintId } = req.params;

    try {
      const deletedComplaint = await Complaint.findByIdAndDelete(complaintId);

      if (!deletedComplaint) {
        return res.status(404).send("Complaint not found.");
      }
      console.log("Complaint deleted successfully:", deletedComplaint);
      res.send("Complaint deleted successfully.");
    } catch (error) {
      console.error("Error deleting complaint:", error);
      res.status(500).send("Error deleting complaint.");
    }
  });

  return router;
}

module.exports = adminDeleteRoutes;
