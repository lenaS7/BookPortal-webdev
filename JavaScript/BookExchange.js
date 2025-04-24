document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.animated');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.visibility = 'visible';
            }
        });
    }, {threshold: 0.1});
    
    animatedElements.forEach(element => {
        element.style.visibility = 'hidden';
        observer.observe(element);
    });
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});

function viewAvailableBooks() {
    const booksList = document.getElementById('books-list');
    booksList.innerHTML = '<p class="no-books">Loading available books... <i class="fas fa-spinner fa-spin"></i></p>';
    
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
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("bookForm");

    form.addEventListener("submit", function (e) {
        let isValid = true;
        clearErrors(); // إزالة الأخطاء السابقة

        // تحقق من الحقول واحدة واحدة
        const fields = [
            { id: "name", message: "Please enter your name." },
            { id: "email", message: "Please enter a valid email." },
            { id: "book-title", message: "Please enter the book title." },
            { id: "author", message: "Please enter the author's name." },
            { id: "category", message: "Please select a category." },
            { id: "publish-year", message: "Please enter a valid publication year." },
            { id: "condition", message: "Please select the book condition." },
            { id: "exchange-type", message: "Please select the exchange type." }
        ];

        fields.forEach(field => {
            const input = document.getElementById(field.id);
            if (!input || !input.value || input.value === "") {
                showError(input, field.message);
                isValid = false;
            }
        });

        if (!isValid) {
            e.preventDefault(); // منع الإرسال لو فيه أخطاء
        }
    });

    function showError(input, message) {
        const error = document.createElement("div");
        error.className = "field-error";
        error.style.color = "red";
        error.style.marginTop = "5px";
        error.textContent = "⚠️ " + message;
        input.parentNode.appendChild(error);
    }

    function clearErrors() {
        const oldErrors = document.querySelectorAll(".field-error");
        oldErrors.forEach(e => e.remove());
    }
});

function viewAvailableBooks() {
    try {
        // مثلاً: عرض الكتب المتوفرة - لاحقاً ممكن تربطه بـ backend
        const booksSection = document.getElementById("available-books");
        if (!booksSection) throw new Error("Couldn't find the 'available-books' section.");
        booksSection.scrollIntoView({ behavior: "smooth" });

        // إزالة أي رسالة خطأ سابقة
        const oldError = document.getElementById("error-message");
        if (oldError) oldError.remove();

    } catch (error) {
        // إنشاء رسالة خطأ حمراء
        const errorMessage = document.createElement("div");
        errorMessage.id = "error-message";
        errorMessage.textContent = "⚠️ " + error.message;
        errorMessage.style.color = "red";
        errorMessage.style.fontWeight = "bold";
        errorMessage.style.marginTop = "20px";
        errorMessage.style.textAlign = "center";

        // إضافتها بعد زر العرض
        const descriptionSection = document.getElementById("description");
        descriptionSection.appendChild(errorMessage);
    }
}
