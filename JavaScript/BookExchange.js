document.addEventListener("DOMContentLoaded", function () {
  const animatedElements = document.querySelectorAll(".animated");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.visibility = "visible";
        }
      });
    },
    { threshold: 0.1 }
  );

  animatedElements.forEach((element) => {
    element.style.visibility = "hidden";
    observer.observe(element);
  });

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute("href")).scrollIntoView({
        behavior: "smooth",
      });
    });
  });

  const form = document.getElementById("bookForm");
  const dataList = document.createElement("ul");
  dataList.id = "dataList";
  form.parentNode.insertBefore(dataList, form.nextSibling);

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
      fetch("http://localhost:3001/submit-book", {
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
            // Add the current user's data (book-title, email, category) to the list
            let listItem = document.createElement("li");
            listItem.textContent = `${data.bookTitle} - ${data.email} - ${data.category}`;
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

    const name = document.getElementById("name").value.trim();
    if (!name) {
      displayError("name", "Please enter your name.");
      isValid = false;
    }

    const email = document.getElementById("email").value.trim();
    if (!email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
      displayError("email", "Please enter a valid email.");
      isValid = false;
    }

    const bookTitle = document.getElementById("book-title").value.trim();
    if (!bookTitle) {
      displayError("book-title", "Please enter the book title.");
      isValid = false;
    }

    const author = document.getElementById("author").value.trim();
    if (!author) {
      displayError("author", "Please enter the author's name.");
      isValid = false;
    }

    const category = document.getElementById("category").value;
    if (!category || category === "") {
      displayError("category", "Please select a category.");
      isValid = false;
    }

    const publishYear = document.getElementById("publish-year").value;
    if (!publishYear || publishYear < 1900 || publishYear > 2025) {
      displayError("publish-year", "Please enter a valid publication year.");
      isValid = false;
    }

    const condition = document.getElementById("condition").value;
    if (!condition || condition === "") {
      displayError("condition", "Please select the book condition.");
      isValid = false;
    }

    const exchangeType = document.getElementById("exchange-type").value;
    if (!exchangeType || exchangeType === "") {
      displayError("exchange-type", "Please select the exchange type.");
      isValid = false;
    }

    return isValid;
  }

  // Display error message below the specified field
  function displayError(fieldId, message) {
    const field = document.getElementById(fieldId);
    let errorElement = field.nextElementSibling;

    if (!errorElement || !errorElement.classList.contains("error-message")) {
      errorElement = document.createElement("div");
      errorElement.className = "error-message";
      field.parentNode.appendChild(errorElement);
    }

    errorElement.textContent = "Alert  " + message;
    errorElement.style.color = "red";
    errorElement.style.marginTop = "5px";
  }

  // Clear all error messages
  function clearErrors() {
    const errorElements = document.querySelectorAll(".error-message");
    errorElements.forEach((element) => element.remove());
  }
});

function viewAvailableBooks() {
  const booksList = document.getElementById("books-list");
  booksList.innerHTML =
    '<p class="no-books">Loading available books... <i class="fas fa-spinner fa-spin"></i></p>';

  setTimeout(() => {
    booksList.innerHTML = `
            <div class="book-card">
                <div class="book-cover">
                    <img src="../Media/book4.jpg" alt="Chemistry Textbook">
                    <span class="exchange-badge">For Lending</span>
                </div>
                <div class="book-details">
                    <h3 class="book-title">Organic Chemistry</h3>
                    <p class="book-author">Paula Yurkanis Bruice</p>
                    <div class="book-meta">
                        <span>2020</span>
                        <span>Science</span>
                    </div>
                    <span class="book-condition condition-good">Good Condition</span>
                </div>
            </div>
            
            <div class="book-card">
                <div class="book-cover">
                    <img src="../Media/book5.jpg" alt="Literature Textbook">
                    <span class="exchange-badge">For Borrowing</span>
                </div>
                <div class="book-details">
                    <h3 class="book-title">The Norton Anthology of English Literature</h3>
                    <p class="book-author">Stephen Greenblatt</p>
                    <div class="book-meta">
                        <span>2018</span>
                        <span>Literature</span>
                    </div>
                    <span class="book-condition condition-used">Used</span>
                </div>
            </div>
            
            <div class="book-card">
                <div class="book-cover">
                    <img src="../Media/book6.jpg" alt="Economics Textbook">
                    <span class="exchange-badge">Requested</span>
                </div>
                <div class="book-details">
                    <h3 class="book-title">Principles of Economics</h3>
                    <p class="book-author">N. Gregory Mankiw</p>
                    <div class="book-meta">
                        <span>2021</span>
                        <span>Business</span>
                    </div>
                    <span class="book-condition condition-new">New</span>
                </div>
            </div>
        `;
  }, 1500);
}
