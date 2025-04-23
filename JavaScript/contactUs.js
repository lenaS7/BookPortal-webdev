// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");

  // Handle form submission
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (validateForm()) {
      const formData = new FormData(form);
      fetch("http://localhost:3000/submit-contact", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message) {
            alert("Form submitted successfully!");
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

  // Validate all form fields
  function validateForm() {
    let isValid = true;
    clearErrors();

    // First Name validation
    const firstName = document.getElementById("Fname").value.trim();
    if (!firstName.match(/^[a-zA-Z]{2,12}$/)) {
      displayError("Fname", "First name must be 2-12 letters only.");
      isValid = false;
    }

    // Last Name validation
    const lastName = document.getElementById("Lname").value.trim();
    if (!lastName.match(/^[a-zA-Z]{2,12}$/)) {
      displayError("Lname", "Last name must be 2-12 letters only.");
      isValid = false;
    }

    // Gender validation
    const gender = document.getElementById("gender").value;
    if (!gender || gender === "") {
      displayError("gender", "Please select a gender.");
      isValid = false;
    }

    // Mobile validation
    const mobile = document.getElementById("mobile").value.trim();
    if (!mobile.match(/^[0-9]{10}$/)) {
      displayError("mobile", "Mobile must be exactly 10 digits.");
      isValid = false;
    }

    // Date of Birth validation
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

    // Email validation
    const email = document.getElementById("email").value.trim();
    if (!email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
      displayError("email", "Please enter a valid email address.");
      isValid = false;
    }

    // Language validation
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

  // ✅ Check if JavaScript is working
  // console.log("✅ JavaScript is working!");
});