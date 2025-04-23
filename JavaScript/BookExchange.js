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