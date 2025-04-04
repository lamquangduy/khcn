let allEnterprises = [];
let filteredEnterprises = [];
const tableName = 'khcn_data_enterprise_info';
let currentPage = 1;
const itemsPerPage = 10;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function () {
    loadEnterprises();
    initializeEventListeners();
});

// ===== EVENT LISTENERS =====
function initializeEventListeners() {
    document.getElementById('enterpriseField').addEventListener('change', () => { currentPage = 1; filterEnterprises(); });
    document.getElementById('enterpriseType').addEventListener('change', () => { currentPage = 1; filterEnterprises(); });
    document.getElementById('enterpriseDistrict').addEventListener('change', () => { currentPage = 1; filterEnterprises(); });
    document.getElementById('searchInput').addEventListener('input', () => { currentPage = 1; filterEnterprises(); });
}

// ===== DATA LOADING =====
async function loadEnterprises() {
    try {
        showLoading();
        const response = await fetch(`https://data.vunhat2009.workers.dev/${tableName}`);
        if (!response.ok) throw new Error(`Failed to fetch data from ${tableName}`);
        allEnterprises = await response.json();
        allEnterprises.sort((a, b) => {
            const idA = a.id && a.id.startsWith('DN') ? parseInt(a.id.slice(2), 10) : -1;
            const idB = b.id && b.id.startsWith('DN') ? parseInt(b.id.slice(2), 10) : -1;
            return idA - idB;
        });
        filteredEnterprises = [...allEnterprises];
        displayEnterprises();
    } catch (error) {
        console.error('Error loading enterprises:', error);
        alert('Không thể tải dữ liệu doanh nghiệp. Vui lòng thử lại sau.');
    } finally {
        hideLoading();
    }
}

// ===== DISPLAY FUNCTIONS =====
function displayEnterprises() {
    const tbody = document.getElementById('enterpriseTableBody');
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredEnterprises.length);
    const displayedData = filteredEnterprises.slice(startIndex, endIndex);
    tbody.innerHTML = '';

    displayedData.forEach((enterprise, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${startIndex + index + 1}</td>
            <td>${enterprise.name}</td>
            <td>${formatEnterpriseField(enterprise.field)}</td>
            <td>${enterprise.address}</td>
            <td><span class="enterprise-badge ${formatEnterpriseTypeClass(enterprise.type)}">${formatEnterpriseType(enterprise.type)}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-action btn-view" onclick="viewEnterprise('${enterprise.id}')"><i class="fas fa-eye"></i></button>
                    <button class="btn btn-action btn-map" onclick="showMap(${enterprise.latitude}, ${enterprise.longitude})"><i class="fas fa-map-marker-alt"></i></button>
                    <button class="btn btn-action btn-edit" onclick="editEnterprise('${enterprise.id}')"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-action btn-delete" onclick="deleteEnterprise('${enterprise.id}')"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
    updatePagination();
}

// ===== FILTER FUNCTIONS =====
async function filterEnterprises() {
    try {
        showLoading();
        const filters = {
            field: document.getElementById('enterpriseField').value,
            type: document.getElementById('enterpriseType').value,
            district: document.getElementById('enterpriseDistrict').value,
            search: document.getElementById('searchInput').value.toLowerCase()
        };

        filteredEnterprises = allEnterprises.filter(enterprise => {
            let matches = true;
            if (filters.field && enterprise.field !== filters.field) matches = false;
            if (filters.type && enterprise.type !== filters.type) matches = false;
            if (filters.district && enterprise.district !== filters.district) matches = false;
            if (filters.search) {
                const searchMatch =
                    enterprise.name.toLowerCase().includes(filters.search) ||
                    enterprise.address.toLowerCase().includes(filters.search);
                if (!searchMatch) matches = false;
            }
            return matches;
        });
        displayEnterprises();
    } catch (error) {
        console.error('Lỗi khi lọc dữ liệu doanh nghiệp:', error);
        alert('Có lỗi xảy ra khi lọc dữ liệu doanh nghiệp');
    } finally {
        hideLoading();
    }
}

// ===== CRUD OPERATIONS =====
function viewEnterprise(id) {
    const enterprise = allEnterprises.find(i => i.id === id);
    if (!enterprise) {
        alert('Không tìm thấy thông tin doanh nghiệp');
        return;
    }

    const modalContent = `
        <div class="modal-header">
            <h5 class="modal-title">Chi tiết doanh nghiệp KHCN</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
            <div class="row mb-3">
                <div class="col-md-6"><label class="fw-bold">Mã:</label><p>${enterprise.id}</p></div>
                <div class="col-md-6"><label class="fw-bold">Lĩnh vực:</label><p>${formatEnterpriseField(enterprise.field)}</p></div>
            </div>
            <div class="mb-3"><label class="fw-bold">Tên doanh nghiệp:</label><p>${enterprise.name}</p></div>
            <div class="row mb-3">
                <div class="col-md-6"><label class="fw-bold">Địa chỉ:</label><p>${enterprise.address}</p></div>
                <div class="col-md-6"><label class="fw-bold">Loại hình:</label><p>${formatEnterpriseType(enterprise.type)}</p></div>
            </div>
            <div class="row mb-3">
                <div class="col-md-6"><label class="fw-bold">Quận/Huyện:</label><p>${formatDistrict(enterprise.district)}</p></div>
                <div class="col-md-6"><label class="fw-bold">Tọa độ:</label><p>${enterprise.latitude}, ${enterprise.longitude}</p></div>
            </div>
            <div class="row mb-3">
                <div class="col-md-6"><label class="fw-bold">Ngày tạo:</label><p>${formatDateToDisplay(enterprise.createdat)}</p></div>
                <div class="col-md-6"><label class="fw-bold">Ngày cập nhật:</label><p>${formatDateToDisplay(enterprise.updatedat)}</p></div>
            </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
        </div>
    `;

    const modalElement = document.getElementById('enterpriseModal');
    modalElement.querySelector('.modal-content').innerHTML = modalContent;
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

function showMap(latitude, longitude) {
    const modalContent = `
        <div class="modal-header">
            <h5 class="modal-title">Bản đồ</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
            <iframe
                width="100%"
                height="400px"
                frameborder="0"
                src="https://maps.google.com/maps?q=${latitude},${longitude}&t=&z=13&ie=UTF8&iwloc=&output=embed"
            ></iframe>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
        </div>
    `;

    const modalElement = document.getElementById('enterpriseModal');
    modalElement.querySelector('.modal-content').innerHTML = modalContent;
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

async function addNewEnterprise() {
    const newId = generateNextId();
    const modalContent = `
        <div class="modal-header">
            <h5 class="modal-title">Thêm mới doanh nghiệp KHCN</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
            <form id="addEnterpriseForm" class="needs-validation" novalidate>
                <div class="mb-3">
                    <label class="form-label required">Mã doanh nghiệp</label>
                    <input type="text" class="form-control" name="id" value="${newId}" readonly>
                </div>
                <div class="mb-3">
                    <label class="form-label required">Tên doanh nghiệp</label>
                    <input type="text" class="form-control" name="name" required>
                    <div class="invalid-feedback">Vui lòng nhập tên doanh nghiệp</div>
                </div>
                <div class="mb-3">
                    <label class="form-label required">Lĩnh vực</label>
                    <select class="form-select" name="field" required>
                        <option value="">Chọn lĩnh vực</option>
                        <option value="agriculture">Nông nghiệp</option>
                        <option value="health">Y tế</option>
                        <option value="industry">Công nghiệp</option>
                        <option value="construction">Xây dựng</option>
                        <option value="it">Công nghệ thông tin</option>
                        <option value="research">Nghiên cứu</option>
                    </select>
                    <div class="invalid-feedback">Vui lòng chọn lĩnh vực</div>
                </div>
                <div class="mb-3">
                    <label class="form-label required">Địa chỉ</label>
                    <input type="text" class="form-control" name="address" required>
                    <div class="invalid-feedback">Vui lòng nhập địa chỉ</div>
                </div>
                <div class="mb-3">
                    <label class="form-label required">Loại hình</label>
                    <select class="form-select" name="type" required>
                        <option value="">Chọn loại hình</option>
                        <option value="startup">Khởi nghiệp</option>
                        <option value="small">Doanh nghiệp nhỏ</option>
                        <option value="medium">Doanh nghiệp vừa</option>
                        <option value="large">Doanh nghiệp lớn</option>
                    </select>
                    <div class="invalid-feedback">Vui lòng chọn loại hình</div>
                </div>
                <div class="mb-3">
                    <label class="form-label required">Quận/Huyện</label>
                    <select class="form-select" name="district" required>
                        <option value="">Chọn Quận/Huyện</option>
                        <option value="haichau">Hải Châu</option>
                        <option value="thanhkhe">Thanh Khê</option>
                        <option value="sontra">Sơn Trà</option>
                        <option value="nguhanhson">Ngũ Hành Sơn</option>
                        <option value="lienchieu">Liên Chiểu</option>
                        <option value="camle">Cẩm Lệ</option>
                        <option value="hoavang">Hòa Vang</option>
                        <option value="hoangsa">Hoàng Sa</option>
                    </select>
                    <div class="invalid-feedback">Vui lòng chọn Quận/Huyện</div>
                </div>
                <div class="row mb-3">
                    <div class="col-md-6">
                        <label class="form-label required">Vĩ độ</label>
                        <input type="number" step="any" class="form-control" name="latitude" required>
                        <div class="invalid-feedback">Vui lòng nhập vĩ độ</div>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label required">Kinh độ</label>
                        <input type="number" step="any" class="form-control" name="longitude" required>
                        <div class="invalid-feedback">Vui lòng nhập kinh độ</div>
                    </div>
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
            <button type="button" class="btn btn-primary" onclick="saveNewEnterprise()">
                <i class="fas fa-save me-1"></i>Lưu
            </button>
        </div>
    `;

    const modalElement = document.getElementById('enterpriseModal');
    modalElement.querySelector('.modal-content').innerHTML = modalContent;
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

async function saveNewEnterprise() {
    try {
        const form = document.getElementById('addEnterpriseForm');
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }
        showLoading();
        const formData = {
            id: form.querySelector('[name="id"]').value,
            name: form.querySelector('[name="name"]').value,
            field: form.querySelector('[name="field"]').value,
            address: form.querySelector('[name="address"]').value,
            type: form.querySelector('[name="type"]').value,
            district: form.querySelector('[name="district"]').value,
            latitude: parseFloat(form.querySelector('[name="latitude"]').value),
            longitude: parseFloat(form.querySelector('[name="longitude"]').value)
        };
        const response = await fetch(`https://data.vunhat2009.workers.dev/${tableName}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
            mode: 'cors'
        });
        if (!response.ok) throw new Error('Failed to save enterprise');
        await loadEnterprises();
        const modal = bootstrap.Modal.getInstance(document.getElementById('enterpriseModal'));
        modal.hide();
        alert('Thêm mới doanh nghiệp thành công!');
    } catch (error) {
        console.error('Lỗi khi thêm mới doanh nghiệp:', error);
        alert('Có lỗi xảy ra khi thêm mới doanh nghiệp');
    } finally {
        hideLoading();
    }
}

function editEnterprise(id) {
    const enterprise = allEnterprises.find(i => i.id === id);
    if (!enterprise) {
        alert('Không tìm thấy thông tin doanh nghiệp');
        return;
    }

    const modalContent = `
        <div class="modal-header">
            <h5 class="modal-title">Chỉnh sửa doanh nghiệp KHCN</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
            <form id="editEnterpriseForm" class="needs-validation" novalidate>
                <input type="hidden" name="id" value="${enterprise.id}">
                <div class="mb-3">
                    <label class="form-label required">Tên doanh nghiệp</label>
                    <input type="text" class="form-control" name="name" value="${enterprise.name}" required>
                    <div class="invalid-feedback">Vui lòng nhập tên doanh nghiệp</div>
                </div>
                <div class="mb-3">
                    <label class="form-label required">Lĩnh vực</label>
                    <select class="form-select" name="field" required>
                        <option value="agriculture" ${enterprise.field === 'agriculture' ? 'selected' : ''}>Nông nghiệp</option>
                        <option value="health" ${enterprise.field === 'health' ? 'selected' : ''}>Y tế</option>
                        <option value="industry" ${enterprise.field === 'industry' ? 'selected' : ''}>Công nghiệp</option>
                        <option value="construction" ${enterprise.field === 'construction' ? 'selected' : ''}>Xây dựng</option>
                        <option value="it" ${enterprise.field === 'it' ? 'selected' : ''}>Công nghệ thông tin</option>
                        <option value="research" ${enterprise.field === 'research' ? 'selected' : ''}>Nghiên cứu</option>
                    </select>
                    <div class="invalid-feedback">Vui lòng chọn lĩnh vực</div>
                </div>
                <div class="mb-3">
                    <label class="form-label required">Địa chỉ</label>
                    <input type="text" class="form-control" name="address" value="${enterprise.address}" required>
                    <div class="invalid-feedback">Vui lòng nhập địa chỉ</div>
                </div>
                <div class="mb-3">
                    <label class="form-label required">Loại hình</label>
                    <select class="form-select" name="type" required>
                        <option value="startup" ${enterprise.type === 'startup' ? 'selected' : ''}>Khởi nghiệp</option>
                        <option value="small" ${enterprise.type === 'small' ? 'selected' : ''}>Doanh nghiệp nhỏ</option>
                        <option value="medium" ${enterprise.type === 'medium' ? 'selected' : ''}>Doanh nghiệp vừa</option>
                        <option value="large" ${enterprise.type === 'large' ? 'selected' : ''}>Doanh nghiệp lớn</option>
                    </select>
                    <div class="invalid-feedback">Vui lòng chọn loại hình</div>
                </div>
                <div class="mb-3">
                    <label class="form-label required">Quận/Huyện</label>
                    <select class="form-select" name="district" required>
                        <option value="haichau" ${enterprise.district === 'haichau' ? 'selected' : ''}>Hải Châu</option>
                        <option value="thanhkhe" ${enterprise.district === 'thanhkhe' ? 'selected' : ''}>Thanh Khê</option>
                        <option value="sontra" ${enterprise.district === 'sontra' ? 'selected' : ''}>Sơn Trà</option>
                        <option value="nguhanhson" ${enterprise.district === 'nguhanhson' ? 'selected' : ''}>Ngũ Hành Sơn</option>
                        <option value="lienchieu" ${enterprise.district === 'lienchieu' ? 'selected' : ''}>Liên Chiểu</option>
                        <option value="camle" ${enterprise.district === 'camle' ? 'selected' : ''}>Cẩm Lệ</option>
                        <option value="hoavang" ${enterprise.district === 'hoavang' ? 'selected' : ''}>Hòa Vang</option>
                        <option value="hoangsa" ${enterprise.district === 'hoangsa' ? 'selected' : ''}>Hoàng Sa</option>
                    </select>
                    <div class="invalid-feedback">Vui lòng chọn Quận/Huyện</div>
                </div>
                <div class="row mb-3">
                    <div class="col-md-6">
                        <label class="form-label required">Vĩ độ</label>
                        <input type="number" step="any" class="form-control" name="latitude" value="${enterprise.latitude}" required>
                        <div class="invalid-feedback">Vui lòng nhập vĩ độ</div>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label required">Kinh độ</label>
                        <input type="number" step="any" class="form-control" name="longitude" value="${enterprise.longitude}" required>
                        <div class="invalid-feedback">Vui lòng nhập kinh độ</div>
                    </div>
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
            <button type="button" class="btn btn-primary" onclick="saveEditedEnterprise('${enterprise.id}')">
                <i class="fas fa-save me-1"></i>Lưu thay đổi
            </button>
        </div>
    `;

    const modalElement = document.getElementById('enterpriseModal');
    modalElement.querySelector('.modal-content').innerHTML = modalContent;
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

async function saveEditedEnterprise(id) {
    try {
        const form = document.getElementById('editEnterpriseForm');
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }
        showLoading();
        const formData = {
            id: id,
            name: form.querySelector('[name="name"]').value,
            field: form.querySelector('[name="field"]').value,
            address: form.querySelector('[name="address"]').value,
            type: form.querySelector('[name="type"]').value,
            district: form.querySelector('[name="district"]').value,
            latitude: parseFloat(form.querySelector('[name="latitude"]').value),
            longitude: parseFloat(form.querySelector('[name="longitude"]').value)
        };
        const response = await fetch(`https://data.vunhat2009.workers.dev/${tableName}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
            mode: 'cors'
        });
        if (!response.ok) throw new Error('Failed to update enterprise');
        await loadEnterprises();
        const modal = bootstrap.Modal.getInstance(document.getElementById('enterpriseModal'));
        modal.hide();
        alert('Cập nhật thông tin doanh nghiệp thành công!');
    } catch (error) {
        console.error('Lỗi khi cập nhật thông tin doanh nghiệp:', error);
        alert('Có lỗi xảy ra khi cập nhật thông tin doanh nghiệp');
    } finally {
        hideLoading();
    }
}

async function deleteEnterprise(id) {
    try {
        const enterprise = allEnterprises.find(i => i.id === id);
        if (!enterprise) {
            alert('Không tìm thấy thông tin doanh nghiệp');
            return;
        }
        if (!confirm(`Bạn có chắc chắn muốn xóa doanh nghiệp này?\n\n- Mã: ${enterprise.id}\n- Tên doanh nghiệp: ${enterprise.name}`)) {
            return;
        }
        showLoading();
        const response = await fetch(`https://data.vunhat2009.workers.dev/${tableName}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id }),
            mode: 'cors'
        });
        if (!response.ok) throw new Error('Failed to delete enterprise');
        await loadEnterprises();
        alert('Xóa doanh nghiệp thành công!');
    } catch (error) {
        console.error('Lỗi khi xóa doanh nghiệp:', error);
        alert('Có lỗi xảy ra khi xóa doanh nghiệp');
    } finally {
        hideLoading();
    }
}

// ===== PAGINATION FUNCTIONS =====
function updatePagination() {
    const totalPages = Math.ceil(filteredEnterprises.length / itemsPerPage);
    const paginationElement = document.getElementById('pagination');
    const paginationInfo = document.getElementById('paginationInfo');
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, filteredEnterprises.length);
    paginationInfo.textContent = `Hiển thị ${startItem}-${endItem} trong tổng số ${filteredEnterprises.length} doanh nghiệp`;
    paginationElement.innerHTML = getPaginationHtml(totalPages);
}

function getPaginationHtml(totalPages) {
    let html = `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <button class="page-link" onclick="changePage(${currentPage - 1})"><i class="fas fa-chevron-left"></i></button>
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
            html += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        }
    }
    html += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <button class="page-link" onclick="changePage(${currentPage + 1})"><i class="fas fa-chevron-right"></i></button>
        </li>
    `;
    return html;
}

function changePage(page) {
    const totalPages = Math.ceil(filteredEnterprises.length / itemsPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        displayEnterprises();
    }
}

function generateNextId() {
    if (!allEnterprises || allEnterprises.length === 0) return "DN001";
    const lastId = allEnterprises[allEnterprises.length - 1].id;
    const numericPart = parseInt(lastId.slice(2), 10);
    const nextNumericPart = numericPart + 1;
    return `DN${String(nextNumericPart).padStart(3, '0')}`;
}

// ===== UTILITY FUNCTIONS =====
function formatEnterpriseField(field) {
    const fields = {
        agriculture: "Nông nghiệp",
        health: "Y tế",
        industry: "Công nghiệp",
        construction: "Xây dựng",
        it: "Công nghệ thông tin",
        research: "Nghiên cứu"
    };
    return fields[field] || field;
}

function formatEnterpriseType(type) {
    const types = {
        startup: "Khởi nghiệp",
        small: "Doanh nghiệp nhỏ",
        medium: "Doanh nghiệp vừa",
        large: "Doanh nghiệp lớn"
    };
    return types[type] || type;
}

function formatEnterpriseTypeClass(type) {
    const types = {
        startup: "enterprise-startup",
        small: "enterprise-small",
        medium: "enterprise-medium",
        large: "enterprise-large"
    };
    return types[type] || "";
}

function formatDistrict(district) {
    const districts = {
        haichau: "Hải Châu",
        thanhkhe: "Thanh Khê",
        sontra: "Sơn Trà",
        nguhanhson: "Ngũ Hành Sơn",
        lienchieu: "Liên Chiểu",
        camle: "Cẩm Lệ",
        hoavang: "Hòa Vang",
        hoangsa: "Hoàng Sa"
    };
    return districts[district] || district;
}

function formatDateToDisplay(date) {
    if (!date) return '';
    const datePart = date.split('T')[0]; // Extract yyyy-mm-dd
    const [year, month, day] = datePart.split('-');
    return `${day}/${month}/${year}`;
}

function showLoading() {
    document.getElementById('loading-spinner').classList.remove('d-none');
}

function hideLoading() {
    document.getElementById('loading-spinner').classList.add('d-none');
}