let allCases = [];
let filteredCases = [];
const tableName = 'khcn_matter_enterprise';
let currentPage = 1;
const itemsPerPage = 10;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    loadCases();
    initializeEventListeners();
});

// ===== EVENT LISTENERS =====
function initializeEventListeners() {
    document.getElementById('caseType').addEventListener('change', () => {
        currentPage = 1;
        filterCases();
    });
    document.getElementById('status').addEventListener('change', () => {
        currentPage = 1;
        filterCases();
    });
    document.getElementById('dateFilter').addEventListener('change', () => {
        currentPage = 1;
        filterCases();
    });
    document.getElementById('department').addEventListener('change', () => {
        currentPage = 1;
        filterCases();
    });
    document.getElementById('priority').addEventListener('change', () => {
        currentPage = 1;
        filterCases();
    });
    document.getElementById('source').addEventListener('change', () => {
        currentPage = 1;
        filterCases();
    });
}

// ===== DATA LOADING =====
async function loadCases() {
    try {
        showLoading();
        const response = await fetch(`https://data.vunhat2009.workers.dev/${tableName}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch data from ${tableName}`);
        }
        allCases = await response.json();
        // Sắp xếp theo id
        allCases.sort((a, b) => {
            const idA = parseInt(a.id.slice(2), 10);
            const idB = parseInt(b.id.slice(2), 10);
            return idA - idB;
        });
        filteredCases = [...allCases]; // Initialize filtered data
        displayCases();
    } catch (error) {
        console.error('Error loading cases:', error);
        alert('Không thể tải dữ liệu sự vụ. Vui lòng thử lại sau.');
    } finally {
        hideLoading();
    }
}

// ===== DISPLAY FUNCTIONS =====
function displayCases() {
    const tbody = document.getElementById('casesTableBody');
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredCases.length);
    const displayedData = filteredCases.slice(startIndex, endIndex);
    tbody.innerHTML = '';

    displayedData.forEach((case_, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${startIndex + index + 1}</td>
            <td>${case_.title}</td>
            <td>${formatCaseType(case_.case_type)}</td>
            <td>${formatDate(case_.discovery_date)}</td>
            <td>${formatPriority(case_.priority)}</td>
            <td>${formatStatus(case_.status)}</td>
            <td>${case_.department}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-action btn-view" onclick="viewCase('${case_.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-action btn-edit" onclick="editCase('${case_.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-action btn-delete" onclick="deleteCase('${case_.id}')">
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
async function filterCases() {
    try {
        showLoading();
        const filters = {
            type: document.getElementById('caseType').value,
            status: document.getElementById('status').value,
            date: document.getElementById('dateFilter').value,
            department: document.getElementById('department').value,
            priority: document.getElementById('priority').value,
            source: document.getElementById('source').value
        };

        filteredCases = allCases.filter(case_ => {
            let matches = true;

            if (filters.type && case_.case_type !== filters.type) matches = false;
            if (filters.status && case_.status !== filters.status) matches = false;
            if (filters.priority && case_.priority !== filters.priority) matches = false;
            if (filters.source && case_.source !== filters.source) matches = false;

            if (filters.date) {
                const filterDate = new Date(filters.date).setHours(0,0,0,0);
                const caseDate = new Date(case_.discovery_date).setHours(0,0,0,0);
                if (filterDate !== caseDate) matches = false;
            }

            if (filters.department) {
                const deptMap = {
                    'dept1': 'Phòng Quản lý DN',
                    'dept2': 'Thanh tra Sở KHCN',
                    'dept3': 'Phòng Kế hoạch - Tài chính'
                };
                if (case_.department !== deptMap[filters.department]) matches = false;
            }
            return matches;
        });

        displayCases();
    } catch (error) {
        console.error('Lỗi khi lọc dữ liệu:', error);
        alert('Có lỗi xảy ra khi lọc dữ liệu');
    } finally {
        hideLoading();
    }
}

// ===== CRUD OPERATIONS =====
function viewCase(id) {
    const caseData = allCases.find(c => c.id === id);
    if (!caseData) {
        alert('Không tìm thấy thông tin sự vụ');
        return;
    }

    const modalContent = `
        <div class="modal-header">
            <h5 class="modal-title">Chi tiết sự vụ</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
            <div class="row mb-3">
                <div class="col-md-6">
                    <label class="fw-bold">Mã số:</label>
                    <p>${caseData.id}</p>
                </div>
                <div class="col-md-6">
                    <label class="fw-bold">Trạng thái:</label>
                    <p>${formatStatus(caseData.status)}</p>
                </div>
            </div>
            <div class="mb-3">
                <label class="fw-bold">Tiêu đề:</label>
                <p>${caseData.title}</p>
            </div>
            <div class="row mb-3">
                <div class="col-md-6">
                    <label class="fw-bold">Loại sự vụ:</label>
                    <p>${formatCaseType(caseData.case_type)}</p>
                </div>
                <div class="col-md-6">
                    <label class="fw-bold">Mức độ ưu tiên:</label>
                    <p>${formatPriority(caseData.priority)}</p>
                </div>
            </div>
            <div class="row mb-3">
                <div class="col-md-6">
                    <label class="fw-bold">Ngày phát hiện:</label>
                    <p>${formatDate(caseData.discovery_date)}</p>
                </div>
                <div class="col-md-6">
                    <label class="fw-bold">Nguồn phản ánh:</label>
                    <p>${formatSource(caseData.source)}</p>
                </div>
            </div>
            <div class="mb-3">
                <label class="fw-bold">Vị trí:</label>
                <p>${caseData.location}</p>
            </div>
            <div class="mb-3">
                <label class="fw-bold">Đơn vị xử lý:</label>
                <p>${caseData.department}</p>
            </div>
            <div class="mb-3">
                <label class="fw-bold">Mô tả:</label>
                <p>${caseData.description}</p>
            </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
        </div>
    `;

    const modalElement = document.getElementById('caseModal');
    modalElement.querySelector('.modal-content').innerHTML = modalContent;

    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

function addNewCase() {
    const newId = generateNextId();
    const modalContent = `
        <div class="modal-header">
            <h5 class="modal-title">Thêm mới sự vụ doanh nghiệp KHCN</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
            <form id="addCaseForm" class="needs-validation" novalidate>
                <div class="mb-3">
                    <label class="form-label required">Mã số</label>
                    <input type="text" class="form-control" name="id" value="${newId}" readonly>
                </div>
                <!-- Thông tin cơ bản -->
                <div class="mb-3">
                    <label class="form-label required">Tiêu đề sự vụ</label>
                    <input type="text" class="form-control" name="title" required>
                    <div class="invalid-feedback">Vui lòng nhập tiêu đề sự vụ</div>
                </div>

                <!-- Thông tin phân loại -->
                <div class="row mb-3">
                    <div class="col-md-6">
                        <label class="form-label required">Loại sự vụ</label>
                        <select class="form-select" name="type" required>
                            <option value="">Chọn loại sự vụ</option>
                            <option value="info">Thông tin doanh nghiệp</option>
                            <option value="product">Sản phẩm dịch vụ</option>
                            <option value="other">Khác</option>
                        </select>
                        <div class="invalid-feedback">Vui lòng chọn loại sự vụ</div>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label required">Mức độ ưu tiên</label>
                        <select class="form-select" name="priority" required>
                            <option value="">Chọn mức độ</option>
                            <option value="high">Cao</option>
                            <option value="medium">Trung bình</option>
                            <option value="low">Thấp</option>
                        </select>
                        <div class="invalid-feedback">Vui lòng chọn mức độ ưu tiên</div>
                    </div>
                </div>

                <!-- Thông tin thời gian và nguồn -->
                <div class="row mb-3">
                    <div class="col-md-6">
                        <label class="form-label required">Ngày phát hiện</label>
                        <input type="date" class="form-control" name="discoverydate" required>
                        <div class="invalid-feedback">Vui lòng chọn ngày phát hiện</div>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label required">Nguồn phản ánh</label>
                        <select class="form-select" name="source" required>
                            <option value="">Chọn nguồn phản ánh</option>
                            <option value="citizen">Phản ánh người dân</option>
                            <option value="report">Báo cáo định kỳ</option>
                            <option value="agency">Phản ánh cơ quan</option>
                            <option value="monitoring">Hệ thống giám sát</option>
                        </select>
                        <div class="invalid-feedback">Vui lòng chọn nguồn phản ánh</div>
                    </div>
                </div>

                <!-- Thông tin xử lý -->
                <div class="row mb-3">
                    <div class="col-md-6">
                        <label class="form-label required">Đơn vị xử lý</label>
                        <select class="form-select" name="department" required>
                            <option value="">Chọn đơn vị xử lý</option>
                            <option value="Phòng Quản lý DN">Phòng Quản lý DN</option>
                            <option value="Thanh tra Sở KHCN">Thanh tra Sở KHCN</option>
                            <option value="Phòng Kế hoạch - Tài chính">Phòng Kế hoạch - Tài chính</option>
                        </select>
                        <div class="invalid-feedback">Vui lòng chọn đơn vị xử lý</div>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label required">Trạng thái</label>
                        <select class="form-select" name="status" required>
                            <option value="new">Mới tiếp nhận</option>
                            <option value="processing">Đang xử lý</option>
                            <option value="resolved">Đã giải quyết</option>
                            <option value="closed">Đã đóng</option>
                        </select>
                        <div class="invalid-feedback">Vui lòng chọn trạng thái</div>
                    </div>
                </div>

                <!-- Thông tin vị trí và mô tả -->
                <div class="mb-3">
                    <label class="form-label required">Vị trí</label>
                    <input type="text" class="form-control" name="location" required>
                    <div class="invalid-feedback">Vui lòng nhập vị trí</div>
                </div>
                <div class="mb-3">
                    <label class="form-label">Mô tả chi tiết</label>
                    <textarea class="form-control" name="description" rows="3"></textarea>
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
            <button type="button" class="btn btn-primary" onclick="saveNewCase()">
                <i class="fas fa-save me-1"></i>Lưu
            </button>
        </div>
    `;

    const modalElement = document.getElementById('caseModal');
    modalElement.querySelector('.modal-content').innerHTML = modalContent;

    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

async function saveNewCase() {
    try {
        const form = document.getElementById('addCaseForm');
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }

        showLoading();
        const formData = {
            id: document.querySelector('#addCaseForm [name="id"]').value,
            title: form.querySelector('[name="title"]').value,
            case_type: form.querySelector('[name="type"]').value,
            discovery_date: form.querySelector('[name="discoverydate"]').value,
            priority: form.querySelector('[name="priority"]').value,
            status: form.querySelector('[name="status"]').value,
            department: form.querySelector('[name="department"]').value,
            source: form.querySelector('[name="source"]').value,
            location: form.querySelector('[name="location"]').value,
            description: form.querySelector('[name="description"]').value,
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
            const errorText = await response.text();
            throw new Error(`Network response was not ok: ${response.status} - ${errorText}`);
        }
        await loadCases();
        const modalElement = document.getElementById('caseModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();
        alert('Thêm mới sự vụ thành công!');
    } catch (error) {
        console.error('Lỗi khi thêm mới:', error);
        alert(`Có lỗi xảy ra khi thêm mới sự vụ: ${error.message}`);
    } finally {
        hideLoading();
    }
}

function editCase(id) {
    const caseData = allCases.find(c => c.id === id);
    if (!caseData) {
        alert('Không tìm thấy thông tin sự vụ');
        return;
    }

    const modalContent = `
        <div class="modal-header">
            <h5 class="modal-title">Chỉnh sửa sự vụ</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
            <form id="editCaseForm" class="needs-validation" novalidate>
                <input type="hidden" name="id" value="${caseData.id}">
                <!-- Các trường dữ liệu cơ bản -->
                <div class="mb-3">
                    <label class="form-label required">Tiêu đề sự vụ</label>
                    <input type="text" class="form-control" name="title"
                           value="${caseData.title}" required
                           data-bs-toggle="tooltip"
                           title="Nhập tiêu đề mô tả ngắn gọn sự vụ">
                    <div class="invalid-feedback">Vui lòng nhập tiêu đề sự vụ</div>
                </div>

                <!-- Thông tin phân loại -->
                <div class="row mb-3">
                    <div class="col-md-6">
                        <label class="form-label required">Loại sự vụ</label>
                        <select class="form-select" name="type" required>
                            <option value="info" ${caseData.case_type === 'info' ? 'selected' : ''}>Thông tin doanh nghiệp</option>
                            <option value="product" ${caseData.case_type === 'product' ? 'selected' : ''}>Sản phẩm dịch vụ</option>
                            <option value="other" ${caseData.case_type === 'other' ? 'selected' : ''}>Khác</option>
                        </select>
                        <div class="invalid-feedback">Vui lòng chọn loại sự vụ</div>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label required">Trạng thái</label>
                        <select class="form-select" name="status" required>
                            <option value="new" ${caseData.status === 'new' ? 'selected' : ''}>Mới tiếp nhận</option>
                            <option value="processing" ${caseData.status === 'processing' ? 'selected' : ''}>Đang xử lý</option>
                            <option value="resolved" ${caseData.status === 'resolved' ? 'selected' : ''}>Đã giải quyết</option>
                            <option value="closed" ${caseData.status === 'closed' ? 'selected' : ''}>Đã đóng</option>
                        </select>
                        <div class="invalid-feedback">Vui lòng chọn trạng thái</div>
                    </div>
                </div>

                <!-- Thông tin thời gian và mức độ -->
                <div class="row mb-3">
                    <div class="col-md-6">
                        <label class="form-label required">Ngày phát hiện</label>
                        <input type="date" class="form-control" name="discoverydate"
                               value="${caseData.discovery_date}" required
                               max="${new Date().toISOString().split('T')[0]}">
                        <div class="invalid-feedback">Vui lòng chọn ngày phát hiện hợp lệ</div>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label required">Mức độ ưu tiên</label>
                        <select class="form-select" name="priority" required>
                            <option value="high" ${caseData.priority === 'high' ? 'selected' : ''}>Cao</option>
                            <option value="medium" ${caseData.priority === 'medium' ? 'selected' : ''}>Trung bình</option>
                            <option value="low" ${caseData.priority === 'low' ? 'selected' : ''}>Thấp</option>
                        </select>
                        <div class="invalid-feedback">Vui lòng chọn mức độ ưu tiên</div>
                    </div>
                </div>

                <!-- Thông tin xử lý -->
                <div class="row mb-3">
                    <div class="col-md-6">
                        <label class="form-label required">Đơn vị xử lý</label>
                        <select class="form-select" name="department" required>
                            <option value="Phòng Quản lý DN" ${caseData.department === 'Phòng Quản lý DN' ? 'selected' : ''}>Phòng Quản lý DN</option>
                            <option value="Thanh tra Sở KHCN" ${caseData.department === 'Thanh tra Sở KHCN' ? 'selected' : ''}>Thanh tra Sở KHCN</option>
                            <option value="Phòng Kế hoạch - Tài chính" ${caseData.department === 'Phòng Kế hoạch - Tài chính' ? 'selected' : ''}>Phòng Kế hoạch - Tài chính</option>
                        </select>
                        <div class="invalid-feedback">Vui lòng chọn đơn vị xử lý</div>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label required">Nguồn phản ánh</label>
                        <select class="form-select" name="source" required>
                            <option value="citizen" ${caseData.source === 'citizen' ? 'selected' : ''}>Phản ánh người dân</option>
                            <option value="report" ${caseData.source === 'report' ? 'selected' : ''}>Báo cáo định kỳ</option>
                            <option value="agency" ${caseData.source === 'agency' ? 'selected' : ''}>Phản ánh cơ quan</option>
                            <option value="monitoring" ${caseData.source === 'monitoring' ? 'selected' : ''}>Hệ thống giám sát</option>
                        </select>
                        <div class="invalid-feedback">Vui lòng chọn nguồn phản ánh</div>
                    </div>
                </div>

                <!-- Thông tin vị trí và mô tả -->
                <div class="mb-3">
                    <label class="form-label required">Vị trí</label>
                    <input type="text" class="form-control" name="location"
                           value="${caseData.location}" required>
                    <div class="invalid-feedback">Vui lòng nhập vị trí</div>
                </div>
                <div class="mb-3">
                    <label class="form-label">Mô tả chi tiết</label>
                    <textarea class="form-control" name="description"
                             rows="3">${caseData.description}</textarea>
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
            <button type="button" class="btn btn-primary" onclick="saveEditedCase('${caseData.id}')">
                <i class="fas fa-save me-1"></i>Lưu thay đổi
            </button>
        </div>
    `;

    const modalElement = document.getElementById('caseModal');
    modalElement.querySelector('.modal-content').innerHTML = modalContent;

    const modal = new bootstrap.Modal(modalElement);
    modal.show();
    // Khởi tạo tooltips
    const tooltips = modalElement.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltips.forEach(tooltip => new bootstrap.Tooltip(tooltip));
}

async function saveEditedCase(id) {
    try {
        const form = document.getElementById('editCaseForm');
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }

        showLoading();

        const formData = {
            id: id,
            title: form.querySelector('[name="title"]').value,
            case_type: form.querySelector('[name="type"]').value,
            discovery_date: form.querySelector('[name="discoverydate"]').value,
            priority: form.querySelector('[name="priority"]').value,
            status: form.querySelector('[name="status"]').value,
            department: form.querySelector('[name="department"]').value,
            source: form.querySelector('[name="source"]').value,
            location: form.querySelector('[name="location"]').value,
            description: form.querySelector('[name="description"]').value,
        };
        const response = await fetch(`https://data.vunhat2009.workers.dev/${tableName}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData),
            mode: 'cors'
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Network response was not ok: ${response.status} - ${errorText}`);
        }
        await loadCases();
        const modalElement = document.getElementById('caseModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();
        alert('Cập nhật sự vụ thành công!');
    } catch (error) {
        console.error('Lỗi khi cập nhật:', error);
        alert('Có lỗi xảy ra khi cập nhật sự vụ');
    } finally {
        hideLoading();
    }
}


async function deleteCase(id) {
    try {
        const caseData = allCases.find(c => c.id === id);
        if (!caseData) {
            alert('Không tìm thấy thông tin sự vụ');
            return;
        }

        // Hiển thị dialog xác nhận với thông tin chi tiết
        if (!confirm(`Bạn có chắc chắn muốn xóa sự vụ sau?\n\n` +
            `- Mã số: ${caseData.id}\n` +
            `- Tiêu đề: ${caseData.title}\n` +
            `- Loại sự vụ: ${formatCaseType(caseData.type)}\n` +
            `- Vị trí: ${caseData.location}`)) {
            return;
        }

        showLoading();

        const response = await fetch(`https://data.vunhat2009.workers.dev/${tableName}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id }),
            mode: 'cors'
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        await loadCases();
        // Thông báo thành công
        alert('Xóa sự vụ thành công!');
    } catch (error) {
        console.error('Lỗi khi xóa:', error);
        alert('Có lỗi xảy ra khi xóa sự vụ!');
    } finally {
        hideLoading();
    }
}


// ===== PAGINATION FUNCTIONS =====
function updatePagination() {
    const totalPages = Math.ceil(filteredCases.length / itemsPerPage);
    const paginationElement = document.getElementById('pagination');
    const paginationInfo = document.getElementById('paginationInfo');
    if(!paginationElement) return;

    // Cập nhật thông tin phân trang
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, filteredCases.length);
    paginationInfo.textContent = `Hiển thị ${startItem}-${endItem} trong tổng số ${filteredCases.length} sự vụ`;

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
    const totalPages = Math.ceil(filteredCases.length / itemsPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        displayCases();
    }
}


// ===== UTILITY FUNCTIONS =====
function formatCaseType(type) {
    const types = {
        info: 'Thông tin doanh nghiệp',
        product: 'Sản phẩm dịch vụ',
        other: 'Khác'
    };
    return types[type] || type;
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('vi-VN');
}

function formatStatus(status) {
    const statusClasses = {
        new: 'status-new',
        processing: 'status-processing',
        resolved: 'status-resolved',
        closed: 'status-closed'
    };

    const statusLabels = {
        new: 'Mới tiếp nhận',
        processing: 'Đang xử lý',
        resolved: 'Đã giải quyết',
        closed: 'Đã đóng'
    };
    return `<span class="status-badge ${statusClasses[status]}">${statusLabels[status]}</span>`;
}

function formatPriority(priority) {
    const priorityClasses = {
        high: 'priority-high',
        medium: 'priority-medium',
        low: 'priority-low'
    };

    const priorityLabels = {
        high: 'Cao',
        medium: 'Trung bình',
        low: 'Thấp'
    };
    return `<span class="priority-badge ${priorityClasses[priority]}">${priorityLabels[priority]}</span>`;
}

function formatSource(source) {
    const sources = {
        citizen: 'Phản ánh người dân',
        report: 'Báo cáo định kỳ',
        agency: 'Phản ánh cơ quan',
        monitoring: 'Hệ thống giám sát'
    };
    return sources[source] || source;
}


function showLoading() {
    document.getElementById('loading-spinner').classList.remove('d-none');
}

function hideLoading() {
    document.getElementById('loading-spinner').classList.add('d-none');
}

function generateNextId() {
    if (!allCases || allCases.length === 0) {
        return "DN001";
    }
    const lastId = allCases[allCases.length - 1].id;
    const numericPart = parseInt(lastId.slice(2), 10);
    const nextNumericPart = numericPart + 1;
    return `DN${String(nextNumericPart).padStart(3, '0')}`;
}