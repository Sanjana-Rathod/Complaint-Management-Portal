document.addEventListener("DOMContentLoaded", () => {
  fetchComplaints();
});

function fetchComplaints() {
  fetch("/gh/complaints", {
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
  if (complaints.length === 0) {
    const noComplaintsMessage = document.createElement("p");
    noComplaintsMessage.textContent = "There are no new complaints.";
    complaintsContainer.appendChild(noComplaintsMessage);
    return;
  }

  complaints.forEach((complaint) => {
    const complaintItem = document.createElement("div");
    complaintItem.innerHTML = `
        <p><strong>Username:</strong> ${complaint.username}</p>
        <p><strong>Complaint:</strong> ${complaint.complaint}</p>
        <select id="status-${complaint._id}">
          <option value="On Progress" selected>On Progress</option>
          <option value="Solved">Solved</option>
        </select>
        <button onclick="submitStatus('${complaint._id}')">Submit</button>
        <br>  
        <hr> 
        <br>
      `;

    complaintsContainer.appendChild(complaintItem);
  });
}

function submitStatus(complaintId) {
  const statusSelect = document.getElementById(`status-${complaintId}`);
  const status = statusSelect.value;

  if (status === "Solved") {
    deleteComplaint(complaintId);
    return;
  }

  const data = {
    complaintId,
    status,
  };

  fetch(`/gh/status/${complaintId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        alert("Status updated to On progress");
        console.log("Complaint status updated successfully:", data);
        fetchComplaints();
      } else {
        console.error("Error updating complaint status:", data.error);
      }
    })
    .catch((error) => {
      console.error("Error updating complaint status:", error);
    });
}

function deleteComplaint(complaintId) {
  fetch(`/gh/delete-complaint/${complaintId}`, {
    method: "DELETE",
  })
    .then((response) => response.text())
    .then((message) => {
      console.log(message);
      fetchComplaints();
      alert("Complaint resolved successfully, deleted from the list");
    })
    .catch((error) => {
      console.error("Error deleting complaint:", error);
    });
}
