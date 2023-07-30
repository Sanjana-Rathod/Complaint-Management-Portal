document.addEventListener("DOMContentLoaded", () => {
  fetchComplaints();
});

function fetchComplaints() {
  fetch("/admin/complaints", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      displayComplaints(data);
    })
    .catch((error) => {
      console.error("Error fetching complaints:", error);
    });
}

function displayComplaints(complaints) {
  const complaintsContainer = document.getElementById("complaintsContainer");

  complaintsContainer.innerHTML = "";

  complaints
    .forEach((complaint) => {
      const complaintItem = document.createElement("div");
      complaintItem.innerHTML = `
        <p><strong>Username:</strong> ${complaint.username}</p>
        <p><strong>Complaint:</strong> ${complaint.complaint}</p>
        <select id="category-${complaint._id}">
        <option value="Select" selected>Assign To</option>
        <option value="faculty">Faculty</option>
        <option value="hall1">Hall 1</option>
        <option value="hall3">Hall 3</option>
        <option value="hall4">Hall 4</option>
        <option value="girls-hostel">Girls Hostel</option>
      </select>
      <button onclick="assignComplaint('${complaint._id}')">Submit</button>
      <button onclick="deleteComplaint('${complaint._id}')">Delete</button>
      <br>  
        <hr> 
        <br>
        `;

      complaintsContainer.appendChild(complaintItem);
    })
    .catch((error) => {
      console.error("Error fetching complaints:", error);
    });
}
function assignComplaint(complaintId) {
  const categorySelect = document.getElementById(`category-${complaintId}`);
  const category = categorySelect.value;

  const data = {
    complaintId,
    category,
  };
  if (category === "Select") {
    alert("Please select an option from the dropdown.");
    return;
  }

  fetch("/admin/assign-complaint", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.text())
    .then((message) => {
      console.log(message);
      alert(`Complaint assigned to ${category} successfully!`);
      fetchComplaints();
    })
    .catch((error) => {
      console.error("Error assigning complaint:", error);
    });
}
function deleteComplaint(complaintId) {
  fetch(`/admin/delete-complaint/${complaintId}`, {
    method: "DELETE",
  })
    .then((response) => response.text())
    .then((message) => {
      console.log(message);
      fetchComplaints();
      alert("Complaint deleted succesfully");
    })
    .catch((error) => {
      console.error("Error deleting complaint:", error);
    });
}
