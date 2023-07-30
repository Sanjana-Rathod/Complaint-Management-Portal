document
  .getElementById("complaintForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    console.log("Form submitted");
    const complaint = document.getElementById("complaint").value;
    const cookies = document.cookie.split("; ");
    let loggedIn = false;
    let username = "anonymous";

    for (const cookie of cookies) {
      const [name, value] = cookie.split("=");
      if (name === "loggedIn" && value === "true") {
        loggedIn = true;
        break;
      }
    }

    if (loggedIn) {
      for (const cookie of cookies) {
        const [name, value] = cookie.split("=");
        if (name === "username") {
          username = value;
          break;
        }
      }
    }

    console.log("Received complaint data:", { username, complaint });

    const newComplaint = {
      username,
      complaint,
    };

    fetch("/submit-complaint", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newComplaint),
    })
      .then((response) => response.text())
      .then((data) => {
        alert(data);
        document.getElementById("complaint").value = "";
      })
      .catch((error) => console.error("Error sending complaint:", error));
  });
