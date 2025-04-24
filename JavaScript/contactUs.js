document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const dataList = document.getElementById("dataList");

  // Clear the list on page load
  while (dataList.firstChild) {
    dataList.removeChild(dataList.lastChild);
  }

  // Handle form submission
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (validateForm()) {
      const formData = new FormData(form);
      const data = Object.fromEntries(formData);
      fetch("/submit-contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message) {
            alert("Data inserted successfully!");
            // Clear the list
            while (dataList.firstChild) {
              dataList.removeChild(dataList.lastChild);
            }
            // Add the current user's data (Fname and email) to the list
            let listItem = document.createElement("li");
            listItem.textContent = `${data.Fname} - ${data.email}`;
            dataList.appendChild(listItem);
            // Reset the form
            form.reset();
          } else {
            alert("Submission failed: " + JSON.stringify(data.errors));
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("An error occurred during submission. Please try again.");
        });
    }
  });

  // Validate all form fields (Frontend validation)
  function validateForm() {
    let isValid = true;
    clearErrors();

    const firstName = document.getElementById("Fname").value.trim();
    if (!firstName.match(/^[a-zA-Z]{2,12}$/)) {
      displayError("Fname", "First name must be 2-12 letters only.");
      isValid = false;
    }

    const lastName = document.getElementById("Lname").value.trim();
    if (!lastName.match(/^[a-zA-Z]{2,12}$/)) {
      displayError("Lname", "Last name must be 2-12 letters only.");
      isValid = false;
    }

    const gender = document.getElementById("gender").value;
    if (!gender || gender === "") {
      displayError("gender", "Please select a gender.");
      isValid = false;
    }

    const mobile = document.getElementById("mobile").value.trim();
    if (!mobile.match(/^[0-9]{10}$/)) {
      displayError("mobile", "Mobile must be exactly 10 digits.");
      isValid = false;
    }

    const dob = document.getElementById("DB").value;
    if (!dob) {
      displayError("DB", "Please select a valid date of birth.");
      isValid = false;
    } else {
      const dobDate = new Date(dob);
      const today = new Date();
      if (dobDate >= today) {
        displayError("DB", "Date of birth must be in the past.");
        isValid = false;
      }
    }

    const email = document.getElementById("email").value.trim();
    if (!email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
      displayError("email", "Please enter a valid email address.");
      isValid = false;
    }

    const language = document.getElementById("language").value;
    if (!language || language === "") {
      displayError("language", "Please select a language.");
      isValid = false;
    }

    return isValid;
  }

  // Display error message below the specified field
  function displayError(fieldId, message) {
    const field = document.getElementById(fieldId);
    let errorElement = field.nextElementSibling;

    if (!errorElement || !errorElement.classList.contains("error-message")) {
      errorElement = document.createElement("span");
      errorElement.className = "error-message";
      field.parentNode.appendChild(errorElement);
    }

    errorElement.textContent = message;
    errorElement.style.color = "red";
    errorElement.style.fontSize = "14px";
    errorElement.style.marginTop = "5px";
    errorElement.style.display = "block";
  }

  // Clear all error messages
  function clearErrors() {
    const errorElements = document.querySelectorAll(".error-message");
    errorElements.forEach((element) => element.remove());
  }
});