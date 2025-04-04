let allSubscribers = [];
let filteredSubscribers = [];
const tableName = 'khcn_data_telecom_subscriber';
let currentPage = 2;
const itemsPerPage = 10;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function () {
    loadSubscribers();
    initializeEventListeners();
});

// ===== EVENT LISTENERS =====
function initializeEventListeners() {
    document.getElementById('subscriberType').addEventListener('change', () => {
        currentPage = 1;
        filterSubscribers();
    });
    document.getElementById('subscriberOperator').addEventListener('change', () => {
        currentPage = 1;
        filterSubscribers();
    });
    document.getElementById('subscriberPlan').addEventListener('change', () => {
        currentPage = 1;
        filterSubscribers();
    });
    document.getElementById('searchInput').addEventListener('input', () => {
        currentPage = 1;
        filterSubscribers();
    });
}

// ===== DATA LOADING =====
async function loadSubscribers() {
    try {
        showLoading();
        const response = await fetch(`https://data.vunhat2009.workers.dev/${tableName}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch data from ${tableName}`);
        }
        const data = await response.json();
        allSubscribers = data.map(subscriber => ({
            id: subscriber.id,
            subscribername: subscriber.subscribername,
            subscribertype: subscriber.subscribertype,
            operator: subscriber.operator,
            plan: subscriber.plan,
            status: subscriber.status
        }));
        // Sort by id
        allSubscribers.sort((a, b) => {
            try {
                const idA = a.id && a.id.startsWith('TB') ? parseInt(a.id.slice(2), 10) : -1;
                const idB = b.id && b.id.startsWith('TB') ? parseInt(b.id.slice(2), 10) : -1;
                return idA - idB;
            } catch (e) {
                console.error("Error during parsing int", e);
                return 0;
            }
        });
        filteredSubscribers = [...allSubscribers];
        displaySubscribers();
    } catch (error) {
        console.error('Error loading subscribers:', error);
        alert('Không thể tải dữ liệu thuê bao. Vui lòng thử lại sau.');
    } finally {
        hideLoading();
    }
}

// ===== DISPLAY FUNCTIONS =====
function displaySubscribers() {
    const tbody = document.getElementById('subscriberTableBody');
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredSubscribers.length);
    const displayedData = filteredSubscribers.slice(startIndex, endIndex);
    tbody.innerHTML = '';

    displayedData.forEach((subscriber, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${startIndex + index + 1}</td>
            <td>${subscriber.id}</td>
            <td>${subscriber.subscribername}</td>
            <td>${formatSubscriberType(subscriber.subscribertype)}</td>
            <td>${formatOperator(subscriber.operator)}</td>
            <td>${formatPlan(subscriber.plan)}</td>
            <td>${formatStatus(subscriber.status)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-action btn-view" onclick="viewSubscriber('${subscriber.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-action btn-edit" onclick="editSubscriber('${subscriber.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-action btn-delete" onclick="deleteSubscriber('${subscriber.id}')">
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
async function filterSubscribers() {
    try {
        showLoading();
        const filters = {
            type: document.getElementById('subscriberType').value,
            operator: document.getElementById('subscriberOperator').value,
            plan: document.getElementById('subscriberPlan').value,
            search: document.getElementById('searchInput').value.toLowerCase()
        };

        filteredSubscribers = allSubscribers.filter(subscriber => {
            let matches = true;

            if (filters.type && subscriber.subscribertype !== filters.type) matches = false;
            if (filters.operator && subscriber.operator !== filters.operator) matches = false;
            if (filters.plan && subscriber.plan !== filters.plan) matches = false;

            if (filters.search) {
                const searchMatch =
                    subscriber.id.toLowerCase().includes(filters.search) ||
                    subscriber.subscribername.toLowerCase().includes(filters.search);
                if (!searchMatch) matches = false;
            }
            return matches;
        });

        displaySubscribers();
    } catch (error) {
        console.error('Lỗi khi lọc dữ liệu thuê bao:', error);
        alert('Có lỗi xảy ra khi lọc dữ liệu thuê bao');
    } finally {
        hideLoading();
    }
}

// ===== CRUD OPERATIONS =====
function viewSubscriber(id) {
    const subscriber = allSubscribers.find(s => s.id === id);
    if (!subscriber) {
        alert('Không tìm thấy thông tin thuê bao');
        return;
    }

    const modalContent = `
        <div class="modal-header">
            <h5 class="modal-title">Chi tiết thuê bao</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
            <div class="mb-3">
                <label class="fw-bold">Số thuê bao:</label>
                <p>${subscriber.id}</p>
            </div>
            <div class="mb-3">
                <label class="fw-bold">Tên chủ thuê bao:</label>
                <p>${subscriber.subscribername}</p>
            </div>
            <div class="mb-3">
                <label class="fw-bold">Loại thuê bao:</label>
                <p>${formatSubscriberType(subscriber.subscribertype)}</p>
            </div>
            <div class="mb-3">
                <label class="fw-bold">Nhà mạng:</label>
                <p>${formatOperator(subscriber.operator)}</p>
            </div>
            <div class="mb-3">
                <label class="fw-bold">Gói cước:</label>
                <p>${formatPlan(subscriber.plan)}</p>
            </div>
            <div class="mb-3">
                <label class="fw-bold">Trạng thái:</label>
                <p>${formatStatus(subscriber.status)}</p>
            </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
        </div>
    `;

    const modalElement = document.getElementById('subscriberModal');
    modalElement.querySelector('.modal-content').innerHTML = modalContent;

    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

function addNewSubscriber() {
    const modalContent = `
        <div class="modal-header">
            <h5 class="modal-title">Thêm mới thuê bao</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
            <form id="addSubscriberForm" class="needs-validation" novalidate>
                <div class="mb-3">
                    <label class="form-label required">Số thuê bao</label>
                    <input type="text" class="form-control" name="id" value="${generateNextId()}" readonly>
                </div>
                <div class="mb-3">
                    <label class="form-label required">Tên chủ thuê bao</label>
                    <input type="text" class="form-control" name="subscribername" required>
                    <div class="invalid-feedback">Vui lòng nhập tên chủ thuê bao</div>
                </div>
                <div class="mb-3">
                    <label class="form-label required">Loại thuê bao</label>
                    <select class="form-select" name="subscribertype" required>
                        <option value="">Chọn loại thuê bao</option>
                        <option value="mobile">Di động</option>
                        <option value="fixed">Cố định</option>
                        <option value="internet">Internet</option>
                    </select>
                    <div class="invalid-feedback">Vui lòng chọn loại thuê bao</div>
                </div>
                <div class="mb-3">
                    <label class="form-label required">Nhà mạng</label>
                    <select class="form-select" name="operator" required>
                        <option value="">Chọn nhà mạng</option>
                        <option value="viettel">Viettel</option>
                        <option value="vnpt">VNPT</option>
                        <option value="mobifone">Mobifone</option>
                        <option value="fpt">FPT</option>
                    </select>
                    <div class="invalid-feedback">Vui lòng chọn nhà mạng</div>
                </div>
                <div class="mb-3">
                    <label class="form-label required">Gói cước</label>
                    <select class="form-select" name="plan" required>
                        <option value="">Chọn gói cước</option>
                        <option value="basic">Cơ bản</option>
                        <option value="standard">Tiêu chuẩn</option>
                        <option value="premium">Cao cấp</option>
                    </select>
                    <div class="invalid-feedback">Vui lòng chọn gói cước</div>
                </div>
                <div class="mb-3">
                    <label class="form-label required">Trạng thái</label>
                    <select class="form-select" name="status" required>
                        <option value="">Chọn trạng thái</option>
                        <option value="active">Hoạt động</option>
                        <option value="inactive">Không hoạt động</option>
                        <option value="pending">Đang chờ</option>
                    </select>
                    <div class="invalid-feedback">Vui lòng chọn trạng thái</div>
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
            <button type="button" class="btn btn-primary" onclick="saveNewSubscriber()">
                <i class="fas fa-save me-1"></i>Lưu
            </button>
        </div>
    `;

    const modalElement = document.getElementById('subscriberModal');
    modalElement.querySelector('.modal-content').innerHTML = modalContent;

    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

async function saveNewSubscriber() {
    try {
        const form = document.getElementById('addSubscriberForm');
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }

        showLoading();

        const formData = {
            id: form.querySelector('[name="id"]').value,
            subscribername: form.querySelector('[name="subscribername"]').value,
            subscribertype: form.querySelector('[name="subscribertype"]').value,
            operator: form.querySelector('[name="operator"]').value,
            plan: form.querySelector('[name="plan"]').value,
            status: form.querySelector('[name="status"]').value
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

        await loadSubscribers();

        const modalElement = document.getElementById('subscriberModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();

        alert('Thêm mới thuê bao thành công!');
    } catch (error) {
        console.error('Lỗi khi thêm mới thuê bao:', error);
        alert('Có lỗi xảy ra khi thêm mới thuê bao');
    } finally {
        hideLoading();
    }
}

function editSubscriber(id) {
    const subscriber = allSubscribers.find(s => s.id === id);
    if (!subscriber) {
        alert('Không tìm thấy thông tin thuê bao');
        return;
    }

    const modalContent = `
        <div class="modal-header">
            <h5 class="modal-title">Chỉnh sửa thông tin thuê bao</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
            <form id="editSubscriberForm" class="needs-validation" novalidate>
                <input type="hidden" name="id" value="${subscriber.id}">
                <div class="mb-3">
                    <label class="form-label required">Tên chủ thuê bao</label>
                    <input type="text" class="form-control" name="subscribername" value="${subscriber.subscribername}" required>
                    <div class="invalid-feedback">Vui lòng nhập tên chủ thuê bao</div>
                </div>
                <div class="mb-3">
                    <label class="form-label required">Loại thuê bao</label>
                    <select class="form-select" name="subscribertype" required>
                        <option value="mobile" ${subscriber.subscribertype === 'mobile' ? 'selected' : ''}>Di động</option>
                        <option value="fixed" ${subscriber.subscribertype === 'fixed' ? 'selected' : ''}>Cố định</option>
                        <option value="internet" ${subscriber.subscribertype === 'internet' ? 'selected' : ''}>Internet</option>
                    </select>
                    <div class="invalid-feedback">Vui lòng chọn loại thuê bao</div>
                </div>
                <div class="mb-3">
                    <label class="form-label required">Nhà mạng</label>
                    <select class="form-select" name="operator" required>
                        <option value="viettel" ${subscriber.operator === 'viettel' ? 'selected' : ''}>Viettel</option>
                        <option value="vnpt" ${subscriber.operator === 'vnpt' ? 'selected' : ''}>VNPT</option>
                        <option value="mobifone" ${subscriber.operator === 'mobifone' ? 'selected' : ''}>Mobifone</option>
                        <option value="fpt" ${subscriber.operator === 'fpt' ? 'selected' : ''}>FPT</option>
                    </select>
                    <div class="invalid-feedback">Vui lòng chọn nhà mạng</div>
                </div>
                <div class="mb-3">
                    <label class="form-label required">Gói cước</label>
                    <select class="form-select" name="plan" required>
                        <option value="basic" ${subscriber.plan === 'basic' ? 'selected' : ''}>Cơ bản</option>
                        <option value="standard" ${subscriber.plan === 'standard' ? 'selected' : ''}>Tiêu chuẩn</option>
                        <option value="premium" ${subscriber.plan === 'premium' ? 'selected' : ''}>Cao cấp</option>
                    </select>
                    <div class="invalid-feedback">Vui lòng chọn gói cước</div>
                </div>
                <div class="mb-3">
                    <label class="form-label required">Trạng thái</label>
                    <select class="form-select" name="status" required>
                        <option value="active" ${subscriber.status === 'active' ? 'selected' : ''}>Hoạt động</option>
                        <option value="inactive" ${subscriber.status === 'inactive' ? 'selected' : ''}>Không hoạt động</option>
                        <option value="pending" ${subscriber.status === 'pending' ? 'selected' : ''}>Đang chờ</option>
                    </select>
                    <div class="invalid-feedback">Vui lòng chọn trạng thái</div>
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
            <button type="button" class="btn btn-primary" onclick="saveEditedSubscriber('${subscriber.id}')">
                <i class="fas fa-save me-1"></i>Lưu thay đổi
            </button>
        </div>
    `;

    const modalElement = document.getElementById('subscriberModal');
    modalElement.querySelector('.modal-content').innerHTML = modalContent;

    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

async function saveEditedSubscriber(id) {
    try {
        const form = document.getElementById('editSubscriberForm');
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }

        showLoading();

        const formData = {
            id: id,
            subscribername: form.querySelector('[name="subscribername"]').value,
            subscribertype: form.querySelector('[name="subscribertype"]').value,
            operator: form.querySelector('[name="operator"]').value,
            plan: form.querySelector('[name="plan"]').value,
            status: form.querySelector('[name="status"]').value
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
            throw new Error('Network response was not ok');
        }

        await loadSubscribers();

        const modalElement = document.getElementById('subscriberModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();

        alert('Cập nhật thông tin thuê bao thành công!');
    } catch (error) {
        console.error('Lỗi khi cập nhật thông tin thuê bao:', error);
        alert('Có lỗi xảy ra khi cập nhật thông tin thuê bao');
    } finally {
        hideLoading();
    }
}

async function deleteSubscriber(id) {
    try {
        const subscriber = allSubscribers.find(s => s.id === id);
        if (!subscriber) {
            alert('Không tìm thấy thông tin thuê bao');
            return;
        }

        if (!confirm(`Bạn có chắc chắn muốn xóa thuê bao này?\n\n- Số thuê bao: ${subscriber.id}\n- Tên: ${subscriber.subscribername}`)) {
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

        await loadSubscribers();

        alert('Xóa thuê bao thành công!');
    } catch (error) {
        console.error('Lỗi khi xóa thuê bao:', error);
        alert('Có lỗi xảy ra khi xóa thuê bao');
    } finally {
        hideLoading();
    }
}

// ===== PAGINATION FUNCTIONS =====
function updatePagination() {
    const totalPages = Math.ceil(filteredSubscribers.length / itemsPerPage);
    const paginationElement = document.getElementById('pagination');
    const paginationInfo = document.getElementById('paginationInfo');
    if (!paginationElement) return;

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, filteredSubscribers.length);
    paginationInfo.textContent = `Hiển thị ${startItem}-${endItem} trong tổng số ${filteredSubscribers.length} thuê bao`;

    let paginationHtml = getPaginationHtml(totalPages);
    paginationElement.innerHTML = paginationHtml;
}

function getPaginationHtml(totalPages) {
    let html = `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <button class="page-link" onclick="changePage(${currentPage - 1})">
                <i class="fas fa-chevron-left"></i>
            </button>
        </li>
    `;

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

    html += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <button class="page-link" onclick="changePage(${currentPage + 1})">
                <i class="fas fa-chevron-right"></i>
            </button>
        </li>
    `;

    return html;
}

function changePage(page) {
    const totalPages = Math.ceil(filteredSubscribers.length / itemsPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        displaySubscribers();
    }
}

// ===== UTILITY FUNCTIONS =====
function formatSubscriberType(type) {
    const types = {
        mobile: 'Di động',
        fixed: 'Cố định',
        internet: 'Internet'
    };
    return types[type] || type;
}

function formatOperator(operator) {
    const operators = {
        viettel: 'Viettel',
        vnpt: 'VNPT',
        mobifone: 'Mobifone',
        fpt: 'FPT'
    };
    return operators[operator] || operator;
}

function formatPlan(plan) {
    const plans = {
        basic: 'Cơ bản',
        standard: 'Tiêu chuẩn',
        premium: 'Cao cấp'
    };
    return plans[plan] || plan;
}

function formatStatus(status) {
    const statuses = {
        active: 'Hoạt động',
        inactive: 'Không hoạt động',
        pending: 'Đang chờ'
    };
    return statuses[status] || status;
}

function generateNextId() {
    if (!allSubscribers || allSubscribers.length === 0) {
        return "TB001";
    }
    const lastId = allSubscribers[allSubscribers.length - 1].id;
    const numericPart = parseInt(lastId.slice(2), 10);
    const nextNumericPart = numericPart + 1;
    return `TB${String(nextNumericPart).padStart(3, '0')}`;
}

function showLoading() {
    document.getElementById('loading-spinner').classList.remove('d-none');
}

function hideLoading() {
    document.getElementById('loading-spinner').classList.add('d-none');
}