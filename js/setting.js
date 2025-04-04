document.addEventListener('DOMContentLoaded', function() {
    // Xử lý chuyển tab
    const tabLinks = document.querySelectorAll('.nav-link');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            // Remove active class from all tabs and panes
            tabLinks.forEach(tab => tab.classList.remove('active'));
            tabPanes.forEach(pane => {
                pane.classList.remove('active');
                pane.classList.remove('show');
            });

            // Add active class to clicked tab and corresponding pane
            this.classList.add('active');
            const targetPane = document.querySelector(this.getAttribute('href'));
            targetPane.classList.add('active');
            targetPane.classList.add('show');
        });
    });

    // Activate first tab by default
    document.querySelector('.nav-link').click();
});