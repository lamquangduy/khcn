let allServices = [];
let filteredServices = [];
const tableName = 'khcn_data_postal_service'; // Tên bảng trong Supabase
let currentPage = 1;
const itemsPerPage = 10;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    loadServices();
    initializeEventListeners();
});

// ===== EVENT LISTENERS =====
function initializeEventListeners() {
    // Filter event listeners
     document.getElementById('serviceType').addEventListener('change', () => {
        currentPage = 1;
        filterServices();
    });
     document.getElementById('serviceScope').addEventListener('change', () => {
        currentPage = 1;
        filterServices();
    });
    document.getElementById('searchInput').addEventListener('input', () => {
        currentPage = 1;
        filterServices();
    });
}

// ===== DATA LOADING =====
async function loadServices() {
    try {
        showLoading();
       const response = await fetch(`https://data.vunhat2009.workers.dev/${tableName}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch data from ${tableName}`);
        }
        allServices = await response.json();
        // Sắp xếp theo id
        allServices.sort((a, b) => {
            const idA = parseInt(a.id.slice(2), 10);
            const idB = parseInt(b.id.slice(2), 10);
            return idA - idB;
        });
        filteredServices = [...allServices]; // Initialize filtered data
        displayServices();
    } catch (error) {
        console.error('Error loading services:', error);
        alert('Không thể tải dữ liệu dịch vụ. Vui lòng thử lại sau.');
    } finally {
        hideLoading();
    }
}

// ===== DISPLAY FUNCTIONS =====
function displayServices() {
    const tbody = document.getElementById('servicesTableBody');
     const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredServices.length);
    const displayedData = filteredServices.slice(startIndex, endIndex);
    tbody.innerHTML = '';

    displayedData.forEach((service, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
             <td>${startIndex + index + 1}</td>
            <td>${service.name}</td>
            <td>${formatServiceType(service.type)}</td>
            <td>${formatServiceScope(service.scope)}</td>
            <td>${service.startdate}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-action btn-view" onclick="viewService('${service.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-action btn-edit" onclick="editService('${service.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-action btn-delete" onclick="deleteService('${service.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
     updatePagination();
}

// ===== FILTER FUNCTIONS =====
async function filterServices() {
    try {
        showLoading();
         const filters = {
            type: document.getElementById('serviceType').value,
            scope: document.getElementById('serviceScope').value,
             search: document.getElementById('searchInput').value.toLowerCase()
        };

        filteredServices = allServices.filter(service => {
            let matches = true;

            if (filters.type && service.type !== filters.type) matches = false;
            if (filters.scope && service.scope !== filters.scope) matches = false;
             if (filters.search) {
                const searchMatch =
                    service.name.toLowerCase().includes(filters.search);
                if (!searchMatch) matches = false;
            }

            return matches;
       });

        displayServices();
    } catch (error) {
        console.error('Lỗi khi lọc dữ liệu dịch vụ:', error);
        alert('Có lỗi xảy ra khi lọc dữ liệu dịch vụ');
    } finally {
         hideLoading();
    }
}

// ===== CRUD OPERATIONS =====
function viewService(id) {
    const service = allServices.find(s => s.id === id);
    if (!service) {
        alert('Không tìm thấy thông tin dịch vụ');
        return;
    }

    const modalContent = `
        <div class="modal-header">
            <h5 class="modal-title">Chi tiết dịch vụ</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
            <div class="row mb-3">
                <div class="col-md-6">
                    <label class="fw-bold">Mã dịch vụ:</label>
                    <p>${service.id}</p>
                </div>
             </div>
            <div class="mb-3">
                <label class="fw-bold">Tên dịch vụ:</label>
                <p>${service.name}</p>
            </div>
            <div class="row mb-3">
                <div class="col-md-6">
                    <label class="fw-bold">Loại hình:</label>
                    <p>${formatServiceType(service.type)}</p>
                </div>
                <div class="col-md-6">
                    <label class="fw-bold">Phạm vi hoạt động:</label>
                    <p>${formatServiceScope(service.scope)}</p>
                </div>
            </div>
            <div class="mb-3">
                <label class="fw-bold">Ngày bắt đầu:</label>
                <p>${service.startdate}</p>
            </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
        </div>
    `;

    const modalElement = document.getElementById('serviceModal');
    modalElement.querySelector('.modal-content').innerHTML = modalContent;

    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

async function addNewService() {
    const modalContent = `
        <div class="modal-header">
            <h5 class="modal-title">Thêm mới dịch vụ</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
            <form id="addServiceForm" class="needs-validation" novalidate>
                <!-- Tên dịch vụ -->
                <div class="mb-3">
                    <label class="form-label required">Tên dịch vụ</label>
                    <input type="text" class="form-control" name="name" required>
                    <div class="invalid-feedback">Vui lòng nhập tên dịch vụ</div>
                </div>

                <!-- Loại hình -->
                <div class="mb-3">
                    <label class="form-label required">Loại hình</label>
                    <select class="form-select" name="type" required>
                        <option value="">Chọn loại hình</option>
                        <option value="letter">Thư</option>
                        <option value="parcel">Gói, kiện</option>
                        <option value="express">Chuyển phát nhanh</option>
                    </select>
                    <div class="invalid-feedback">Vui lòng chọn loại hình</div>
                </div>

                <!-- Phạm vi hoạt động -->
                <div class="mb-3">
                    <label class="form-label required">Phạm vi hoạt động</label>
                    <select class="form-select" name="scope" required>
                        <option value="">Chọn phạm vi</option>
                        <option value="local">Nội tỉnh</option>
                        <option value="interprovincial">Liên tỉnh</option>
                         <option value="international">Quốc tế</option>
                    </select>
                    <div class="invalid-feedback">Vui lòng chọn phạm vi</div>
                </div>

                <!-- Ngày bắt đầu -->
                <div class="mb-3">
                    <label class="form-label">Ngày bắt đầu</label>
                    <input type="date" class="form-control" name="startDate">
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
            <button type="button" class="btn btn-primary" onclick="saveNewService()">
                <i class="fas fa-save me-1"></i>Lưu
            </button>
        </div>
    `;

    const modalElement = document.getElementById('serviceModal');
    modalElement.querySelector('.modal-content').innerHTML = modalContent;

    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

async function saveNewService() {
    try {
        const form = document.getElementById('addServiceForm');
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }
         showLoading();

        // Tạo ID mới
        const newId = generateNextServiceId();

        const formData = {
            id: newId, // Sử dụng ID mới
            name: form.querySelector('[name="name"]').value,
            type: form.querySelector('[name="type"]').value,
            scope: form.querySelector('[name="scope"]').value,
            startdate: form.querySelector('[name="startDate"]').value
        };
         const response = await fetch(`https://data.vunhat2009.workers.dev/${tableName}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData),
            mode: 'cors'
         });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
       await loadServices(); // Tải lại dữ liệu
        const modalElement = document.getElementById('serviceModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
         modal.hide();

       alert('Thêm mới dịch vụ thành công!');

    } catch (error) {
        console.error('Lỗi khi thêm mới:', error);
        alert('Có lỗi xảy ra khi thêm mới dịch vụ');
    } finally {
        hideLoading();
    }
}

function generateNextServiceId() {
    if (!allServices || allServices.length === 0) {
        return "DV001";
    }
    const lastId = allServices[allServices.length - 1].id;
    const numericPart = parseInt(lastId.slice(2), 10);
    const nextNumericPart = numericPart + 1;
    return `DV${String(nextNumericPart).padStart(3, '0')}`;
}

function editService(id) {
    const service = allServices.find(s => s.id === id);
    if (!service) {
        alert('Không tìm thấy thông tin dịch vụ');
        return;
    }

    // Định dạng ngày tháng nếu cần
    let startDateValue = service.startdate;
    if (startDateValue) {
        // Kiểm tra xem nó đã ở đúng định dạng chưa, nếu không thì định dạng
        if (!/^\d{4}-\d{2}-\d{2}$/.test(startDateValue)) { // đơn giản regex kiểm tra yyyy-MM-dd
            const date = new Date(service.startdate);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            startDateValue = `${year}-${month}-${day}`;
        }
    } else {
        startDateValue = ''; // Hoặc một giá trị mặc định, ví dụ: ngày hôm nay
    }

    const modalContent = `
        <div class="modal-header">
            <h5 class="modal-title">Chỉnh sửa thông tin dịch vụ</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
            <form id="editServiceForm" class="needs-validation" novalidate>
                <input type="hidden" name="id" value="${service.id}">

                <!-- Tên dịch vụ -->
                <div class="mb-3">
                    <label class="form-label required">Tên dịch vụ</label>
                    <input type="text" class="form-control" name="name" value="${service.name}" required>
                     <div class="invalid-feedback">Vui lòng nhập tên dịch vụ</div>
                </div>

                <!-- Loại hình -->
                <div class="mb-3">
                    <label class="form-label required">Loại hình</label>
                    <select class="form-select" name="type" required>
                       <option value="letter" ${service.type === 'letter' ? 'selected' : ''}>Thư</option>
                        <option value="parcel" ${service.type === 'parcel' ? 'selected' : ''}>Gói, kiện</option>
                        <option value="express" ${service.type === 'express' ? 'selected' : ''}>Chuyển phát nhanh</option>
                    </select>
                    <div class="invalid-feedback">Vui lòng chọn loại hình</div>
                </div>

                <!-- Phạm vi hoạt động -->
                <div class="mb-3">
                    <label class="form-label required">Phạm vi hoạt động</label>
                    <select class="form-select" name="scope" required>
                        <option value="local" ${service.scope === 'local' ? 'selected' : ''}>Nội tỉnh</option>
                        <option value="interprovincial" ${service.scope === 'interprovincial' ? 'selected' : ''}>Liên tỉnh</option>
                        <option value="international" ${service.scope === 'international' ? 'selected' : ''}>Quốc tế</option>
                   </select>
                    <div class="invalid-feedback">Vui lòng chọn phạm vi</div>
                </div>

                <!-- Ngày bắt đầu -->
                <div class="mb-3">
                    <label class="form-label">Ngày bắt đầu</label>
                    <input type="date" class="form-control" name="startDate" value="${startDateValue}">
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
            <button type="button" class="btn btn-primary" onclick="saveEditedService('${service.id}')">
                <i class="fas fa-save me-1"></i>Lưu thay đổi
            </button>
        </div>
    `;

    const modalElement = document.getElementById('serviceModal');
    modalElement.querySelector('.modal-content').innerHTML = modalContent;

    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

// Hàm xử lý lưu thông tin đã chỉnh sửa
async function saveEditedService(id) {
    try {
        const form = document.getElementById('editServiceForm');
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }
        showLoading();

        //Log element trước khi lấy value
        console.log("Giá trị startDate trước khi gửi:", form.querySelector('[name="startDate"]').value);
        const formData = {
            id: id,
            name: form.querySelector('[name="name"]').value,
            type: form.querySelector('[name="type"]').value,
            scope: form.querySelector('[name="scope"]').value,
            startdate: form.querySelector('[name="startDate"]').value
        };

        const response = await fetch(`https://data.vunhat2009.workers.dev/${tableName}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        await loadServices(); // Tải lại dữ liệu
           // Lọc lại dữ liệu đã chỉnh sửa
         const filters = {
            type: document.getElementById('serviceType').value,
            scope: document.getElementById('serviceScope').value,
             search: document.getElementById('searchInput').value.toLowerCase()
        };

        filteredServices = allServices.filter(service => {
            let matches = true;

            if (filters.type && service.type !== filters.type) matches = false;
            if (filters.scope && service.scope !== filters.scope) matches = false;
             if (filters.search) {
                const searchMatch =
                    service.name.toLowerCase().includes(filters.search);
                if (!searchMatch) matches = false;
            }

            return matches;
       });
        displayServices();

        const modalElement = document.getElementById('serviceModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();

        alert('Cập nhật thông tin dịch vụ thành công!');
    } catch (error) {
        console.error('Lỗi khi cập nhật:', error);
        alert('Có lỗi xảy ra khi cập nhật thông tin dịch vụ');
    } finally {
        hideLoading();
    }
}

// DELETE - Xóa dịch vụ
async function deleteService(id) {
    try {
        const service = allServices.find(s => s.id === id);
        if (!service) {
            alert('Không tìm thấy thông tin dịch vụ');
            return;
        }

        if (!confirm(`Bạn có chắc chắn muốn xóa dịch vụ sau?\n\n` +
            `- Tên dịch vụ: ${service.name}\n` +
           `- Loại hình: ${formatServiceType(service.type)}\n` +
             `- Phạm vi: ${formatServiceScope(service.scope)}`)) {
           return;
        }

       showLoading();

          const response = await fetch(`https://data.vunhat2009.workers.dev/${tableName}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id })
         });
        if (!response.ok) {
            throw new Error('Network response was not ok');
         }
         await loadServices(); // Tải lại dữ liệu

        alert('Xóa dịch vụ thành công!');
   } catch (error) {
        console.error('Lỗi khi xóa:', error);
        alert('Có lỗi xảy ra khi xóa dịch vụ');
    } finally {
        hideLoading();
    }
}

// ===== UTILITY FUNCTIONS =====
function formatServiceType(type) {
    const types = {
        letter: 'Thư',
        parcel: 'Gói, kiện',
        express: 'Chuyển phát nhanh'
    };
    return types[type] || type;
}

function formatServiceScope(scope) {
    const scopes = {
        local: 'Nội tỉnh',
        interprovincial: 'Liên tỉnh',
        international: 'Quốc tế'
    };
    return scopes[scope] || scope;
}
function showLoading() {
    document.getElementById('loading-spinner').classList.remove('d-none');
}

function hideLoading() {
    document.getElementById('loading-spinner').classList.add('d-none');
}
// ===== PAGINATION FUNCTIONS =====
function updatePagination() {
    const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
    const paginationElement = document.getElementById('pagination');
    const paginationInfo = document.getElementById('paginationInfo');

    // Cập nhật thông tin phân trang
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, filteredServices.length);
    paginationInfo.textContent = `Hiển thị ${startItem}-${endItem} trong tổng số ${filteredServices.length} dịch vụ`;

    let paginationHtml = getPaginationHtml(totalPages);
    paginationElement.innerHTML = paginationHtml;
}

// Tạo HTML cho phân trang
function getPaginationHtml(totalPages) {
    let html = '';

    // Nút Previous
    html += `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <button class="page-link" onclick="changePage(${currentPage - 1})">
                <i class="fas fa-chevron-left"></i>
            </button>
        </li>
    `;

    // Các nút số trang
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            html += `
                <li class="page-item ${currentPage === i ? 'active' : ''}">
                    <button class="page-link" onclick="changePage(${i})">${i}</button>
                </li>
            `;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            html += `
                <li class="page-item disabled">
                    <span class="page-link">...</span>
                </li>
            `;
        }
    }

    // Nút Next
    html += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <button class="page-link" onclick="changePage(${currentPage + 1})">
                <i class="fas fa-chevron-right"></i>
            </button>
        </li>
    `;

    return html;
}

// Đổi trang
function changePage(page) {
    const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        displayServices();
    }
}