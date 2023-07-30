// document.getElementById('loginForm').addEventListener('submit', function(event) {
//     event.preventDefault(); // Prevent the form from submitting and page reload
//     const username = document.getElementById('username').value;
//     const password = document.getElementById('password').value;

//     // Send login data to the server
//     fetch('/login', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         username,
//         password,
//       }),
//     })
//     .then((response) => response.json())
//     .then((data) => {
//       if (data.loggedIn === true) {
//         if (data.isAdmin) {
//           window.location.href = '/admin.html'; // Redirect to admin page
//         } else {
//           window.location.href = '/complaint.html'; // Redirect to complaint form page
//         }
//       } else {
//         alert('Invalid username or password. Please try again.');
//       }
//     })
//     .catch((error) => {
//       console.error('Error:', error);
//     });
//   });

document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    console.log("Received login data:", { username, password });

    fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => {
        if (response.redirected) {
          window.location.href = response.url;
        } else {
          alert("Invalid credentials. Please try again.");
        }
      })
      .catch((error) => console.error("Error sending login data:", error));
  });
