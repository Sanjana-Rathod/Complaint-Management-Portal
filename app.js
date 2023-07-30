const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

mongoose.connect("mongodb://127.0.0.1:27017/complaint-portal", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB database.");
});
const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const complaintSchema = require("./models/complaint");
const Complaint = mongoose.model("Complaint", complaintSchema);

const hall1 = mongoose.model("hall1", complaintSchema);
const hall3 = mongoose.model("hall3", complaintSchema);
const hall4 = mongoose.model("hall4", complaintSchema);
const gh = mongoose.model("girls-hostel", complaintSchema);
const faculty = mongoose.model("faculty", complaintSchema);

const adminAssignRoutes = require("./admin_assign");
const adminDeleteRoutes = require("./admin_delete");
app.use("/admin", adminAssignRoutes);
app.use("/admin", adminDeleteRoutes(Complaint));

const hall1StatusRoutes = require("./hall1_status");
app.use("/hall1", hall1StatusRoutes);
const hall3StatusRoutes = require("./hall3_status");
app.use("/hall3", hall3StatusRoutes);
const hall4StatusRoutes = require("./hall4_status");
app.use("/hall4", hall4StatusRoutes);
const ghStatusRoutes = require("./gh_status");
app.use("/gh", ghStatusRoutes);
const facultiesStatusRoutes = require("./faculties_status");
app.use("/faculties", facultiesStatusRoutes);

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.redirect(303, "/login");
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  console.log("Received login data:", { username, password });

  const adminUsername = "admin";
  const adminPassword = "admin";
  const hall1Username = "hall1";
  const hall1Password = "hall1";

  res.cookie("username", username);
  if (username === adminUsername && password === adminPassword) {
    res.cookie("loggedIn", "true");
    res.cookie("isAdmin", "true");
    res.redirect(303, "/admin.html");
  } else if (username === hall1Username && password === hall1Password) {
    res.cookie("loggedIn", "true");
    res.cookie("isHall1", "true");
    res.redirect(303, "/hall1.html");
  } else if (username === "hall3" && password === "hall3") {
    res.cookie("loggedIn", "true");
    res.cookie("isHall3", "true");
    res.redirect(303, "/hall3.html");
  } else if (username === "hall4" && password === "hall4") {
    res.cookie("loggedIn", "true");
    res.cookie("isHall4", "true");
    res.redirect(303, "/hall4.html");
  } else if (username === "gh" && password === "gh") {
    res.cookie("loggedIn", "true");
    res.cookie("isGirlsHostel", "true");
    res.redirect(303, "/gh.html");
  } else if (username === "faculty" && password === "faculty") {
    res.cookie("loggedIn", "true");
    res.cookie("isFaculty", "true");
    res.redirect(303, "/faculty.html");
  } else {
    const newUser = new User({
      username,
      password,
    });

    newUser
      .save()
      .then(() => {
        res.redirect(303, "/complaint.html");
      })
      .catch((error) => {
        console.error("Error saving user data:", error);
        res.status(500).send("Error saving user data.");
      });
  }
});

app.post("/submit-complaint", (req, res) => {
  const { complaint, username } = req.body;
  console.log("Received complaint data:", { username, complaint });

  const newComplaint = new Complaint({
    username,
    complaint,
    PostedOn: new Date(),
  });

  newComplaint
    .save()
    .then(() => {
      console.log("Complaint data saved successfully.");
      res.send("Complaint data saved successfully.");
    })
    .catch((error) => {
      console.error("Error saving complaint data:", error);
      res.status(500).send("Error saving complaint data.");
    });
});

app.get("/admin/complaints", (req, res) => {
  Complaint.find({}, (err, complaints) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching complaints" });
    }
    const complaintsWithCategory = complaints.map((complaint) => {
      return {
        ...complaint.toObject(),
        category: "",
      };
    });

    res.json(complaintsWithCategory);
  });
});
app.get("/hall1/complaints", (req, res) => {
  hall1.find({}, (err, complaints) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching complaints" });
    }
    const complaintsWithCategory = complaints.map((complaint) => {
      return {
        ...complaint.toObject(),
        category: "",
      };
    });

    res.json(complaintsWithCategory);
  });
});
app.get("/hall3/complaints", (req, res) => {
  hall3.find({}, (err, complaints) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching complaints" });
    }
    const complaintsWithCategory = complaints.map((complaint) => {
      return {
        ...complaint.toObject(),
        category: "",
      };
    });

    res.json(complaintsWithCategory);
  });
});
app.get("/hall4/complaints", (req, res) => {
  hall4.find({}, (err, complaints) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching complaints" });
    }

    const complaintsWithCategory = complaints.map((complaint) => {
      return {
        ...complaint.toObject(),
        category: "",
      };
    });

    res.json(complaintsWithCategory);
  });
});
app.get("/gh/complaints", (req, res) => {
  gh.find({}, (err, complaints) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching complaints" });
    }
    const complaintsWithCategory = complaints.map((complaint) => {
      return {
        ...complaint.toObject(),
        category: "",
      };
    });

    res.json(complaintsWithCategory);
  });
});
app.get("/faculties/complaints", (req, res) => {
  faculty.find({}, (err, complaints) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching complaints" });
    }
    const complaintsWithCategory = complaints.map((complaint) => {
      return {
        ...complaint.toObject(),
        category: "",
      };
    });

    res.json(complaintsWithCategory);
  });
});

app.get("/complaint", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "complaint.html"));
});

app.post("/admin/assign-complaint", (req, res) => {
  const { complaintId, category } = req.body;
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
  Complaint.findByIdAndUpdate(
    complaintId,
    { category },
    { new: true },
    (err, updatedComplaint) => {
      if (err) {
        console.error("Error assigning complaint:", err);
        return res.status(500).send("Error assigning complaint.");
      }

      console.log("Complaint assigned successfully:", updatedComplaint);
      res.send("Complaint assigned successfully.");
    }
  );
});
app.get("/hall1/complaints", (req, res) => {
  hall1.find({}, (err, complaints) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching complaints" });
    }
    const complaintsWithStatus = complaints.map((complaint) => {
      return {
        ...complaint.toObject(),
        status: "",
      };
    });

    res.json(complaintsWithStatus);
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
