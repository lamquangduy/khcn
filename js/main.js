// ======= HÀM TẢI SIDEBAR ======//
async function loadSidebar() {
    try {
        const response = await fetch('/sidebar.html');
        if (!response.ok) throw new Error('Failed to load sidebar');

        const data = await response.text();
        document.getElementById('sidebar-placeholder').innerHTML = data;
        return true;
    } catch (error) {
        console.error('Sidebar loading error:', error);
        return false;
    }
}
// ======= HÀM TẢI HEADER ======//
async function loadHeader() {
    try {
        const response = await fetch('/header.html');
        if (!response.ok) throw new Error('Failed to load header');

        const data = await response.text();
        document.getElementById('header-placeholder').innerHTML = data;
        return true;
    } catch (error) {
        console.error('Header loading error:', error);
        return false;
    }
}

// ======= EVENT LISTENER ======//
document.addEventListener("DOMContentLoaded", async function () {
    try {
        // 1. Tải header
        const headerLoaded = await loadHeader();
        if (!headerLoaded) {
            throw new Error('Failed to load header');
        }

        // 2. Tải sidebar
        const sidebarLoaded = await loadSidebar();
        if (!sidebarLoaded) {
            throw new Error('Failed to load sidebar');
        }

        // 3. Khởi tạo các components
        initializeSidebar();
        setActiveMenu();

        // 4. Thiết lập event delegation cho menu items
        document.addEventListener('click', function (e) {
            const menuItem = e.target.closest('.menu-item[data-toggle]');
            if (menuItem) {
                e.preventDefault();
                e.stopPropagation();

                const targetId = menuItem.getAttribute('data-toggle');
                const submenu = document.getElementById(targetId);

                menuItem.classList.toggle('active');
                submenu.classList.toggle('active');
                const arrow = menuItem.querySelector('.arrow');
                if (arrow) arrow.classList.toggle('active');
            }
        });
    } catch (error) {
        console.error('Initialization error:', error);
    }
});


// Hàm khởi tạo sidebar
function initializeSidebar() {
    const menuItems = document.querySelectorAll(".menu-item[data-toggle]");

    menuItems.forEach(item => {
        item.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();

            const targetId = this.getAttribute("data-toggle");
            const submenu = document.getElementById(targetId);
            const arrow = this.querySelector(".arrow");

            // Kiểm tra level của menu item hiện tại
            const isLevel1 = this.parentElement.classList.contains("menu-group");

            if (isLevel1) {
                // Đóng tất cả các menu level 1 khác
                const allMenuGroups = document.querySelectorAll(".menu-group");
                allMenuGroups.forEach(group => {
                    const groupSubmenu = group.querySelector('.submenu');
                    const groupMenuItem = group.querySelector('.menu-item');
                    const groupArrow = groupMenuItem?.querySelector('.arrow');

                    if (groupMenuItem !== this) {
                        if (groupSubmenu) {
                            groupSubmenu.classList.remove('active');
                            // Đóng tất cả submenu con
                            const childSubmenus = groupSubmenu.querySelectorAll('.submenu');
                            childSubmenus.forEach(child => {
                                child.classList.remove('active');
                            });
                        }
                        if (groupArrow) {
                            groupArrow.classList.remove('active');
                        }
                    }
                });
            } else {
                // Xử lý cho level 2 và 3
                const siblings = this.parentElement.querySelectorAll('.submenu');
                siblings.forEach(sibling => {
                    if (sibling.id !== targetId && sibling.classList.contains('active')) {
                        sibling.classList.remove('active');
                        const siblingArrow = sibling.previousElementSibling.querySelector('.arrow');
                        if (siblingArrow) siblingArrow.classList.remove('active');
                    }
                });
            }

            // Toggle active class cho submenu và arrow hiện tại
            submenu.classList.toggle("active");
            if (arrow) arrow.classList.toggle("active");
        });
    });
}

// Hàm set active menu dựa trên URL hiện tại
function setActiveMenu() {
    let currentPath = window.location.pathname;
    console.log('Setting active menu for:', currentPath);

    // Chuẩn hóa current path
    if (currentPath === '/' || currentPath === '/dashboard') {
        currentPath = '/dashboard.html';
    } else {
        // Danh sách các prefix cần kiểm tra
        const prefixes = [
            '/data/research/project',
            '/data/research/work',
            '/data/research/topic',
            '/data/research/center',
            '/data/research/lab',
            '/data/tech/new',
            '/data/tech/product',
            '/data/tech/innovation',
            '/data/ip/patent',
            '/data/ip/solution',
            '/data/ip/trademark',
            '/data/standard/standard',
            '/data/standard/regulation',
            '/data/standard/inspection',
            '/data/enterprise/info',
            '/data/enterprise/product',
            '/data/human/expert',
            '/data/human/researcher',
            '/data/human/tech',
            '/data/postal/enterprise',
            '/data/postal/office',
            '/data/postal/service',
            '/data/telecom/infrastructure',
            '/data/telecom/subscriber',
            '/data/telecom/wifi',
            '/data/it/enterprise',
            '/data/it/product',
            '/data/it/human',
            // '/data/publishing/printing',
            // '/data/publishing/bookstore',
            // '/data/television/provider',
            // '/data/television/service',
            '/matter/research',
            '/matter/tech',
            '/matter/ip',
            '/matter/standard',
            '/matter/enterprise',
            '/matter/postal',
            '/matter/telecom',
            '/matter/it',
            // '/matter/publishing',
            // '/matter/television',
            '/report/organization',
            '/report/personnel',
            '/report/spending',
            '/report/task',
            '/report/international',
            '/report/postal',
            '/report/telecom',
            '/report/it',
            // '/report/publishing',
            // '/report/television',
            '/gis/research',
            '/gis/enterprise',
            '/gis/zone',
            '/gis/postal',
            '/gis/telecom',
            '/gis/wifi',
            '/dashboard',
            '/setting',

        ];

        // Kiểm tra và thêm .html nếu cần
        if (prefixes.some(prefix => currentPath.includes(prefix)) && !currentPath.endsWith('.html')) {
            currentPath += '.html';
        }
    }

    console.log('Normalized path:', currentPath);

    // Reset all active states first
    const allMenuItems = document.querySelectorAll('.menu-item');
    allMenuItems.forEach(item => {
        item.classList.remove('active');
    });

    // Find and set active menu item
    const menuItems = document.querySelectorAll('.menu-item[href]');
    menuItems.forEach(item => {
        const href = item.getAttribute('href');
        console.log('Checking menu item:', href);

        // So sánh path sau khi chuẩn hóa
        if (currentPath === href) {
            console.log('Found matching menu:', href);

            // Set active cho menu item hiện tại
            item.classList.add('active');

            // Set active cho các parent menu
            let parent = item.closest('.submenu');
            while (parent) {
                parent.classList.add('active');
                const parentToggle = document.querySelector(`[data-toggle="${parent.id}"]`);
                if (parentToggle) {
                    parentToggle.classList.add('active');
                    const arrow = parentToggle.querySelector('.arrow');
                    if (arrow) arrow.classList.add('active');
                }
                parent = parent.parentElement.closest('.submenu');
            }

            // Set active cho menu group nếu có
            const menuGroup = item.closest('.menu-group');
            if (menuGroup) {
                const groupToggle = menuGroup.querySelector('.menu-item[data-toggle]');
                if (groupToggle) {
                    groupToggle.classList.add('active');
                    const submenuId = groupToggle.getAttribute('data-toggle');
                    const submenu = document.getElementById(submenuId);
                    if (submenu) submenu.classList.add('active');
                }
            }
        }
    });
}

// Toggle sidebar
function toggleSidebar() {
    document.body.classList.toggle('sidebar-collapsed');
}

// Link tới SOS, ITS và chatbot HCTECH
document.addEventListener('DOMContentLoaded', function () {
    const floatingButtons = document.createElement('div');
    floatingButtons.className = 'floating-buttons';

    floatingButtons.innerHTML = `
        <a href="https://its.hctech.com.vn" target="_blank" class="floating-btn cctv-btn">
            <i class="fas fa-video"></i>
            <span>CCTV</span>
        </a>
        <a href="https://sos.hctech.com.vn" target="_blank" class="floating-btn sos-btn">
            <i class="fas fa-exclamation-circle"></i>
            <span>SOS</span>
        </a>
    `;

    document.body.appendChild(floatingButtons);

    // Load chat bot
    const chatScript = document.createElement('script');
    chatScript.src = 'https://ioc.hctech.com.vn/hcbot.min.js';
    chatScript.setAttribute('data-client-id', 'aZ99B0Ddnl5m');
    document.body.appendChild(chatScript);
});