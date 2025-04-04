let allEnterprises = [];
let filteredEnterprises = [];
const tableName = 'khcn_data_it_enterprise';
let currentPage = 1;
const itemsPerPage = 10;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    loadEnterprises();
    initializeEventListeners();
});

// ===== EVENT LISTENERS =====
function initializeEventListeners() {
    document.getElementById('enterpriseField').addEventListener('change', () => {
        currentPage = 1;
        filterEnterprises();
    });
    document.getElementById('location').addEventListener('change', () => {
        currentPage = 1;
        filterEnterprises();
    });
    document.getElementById('enterpriseType').addEventListener('change', () => {
        currentPage = 1;
        filterEnterprises();
    });
    document.getElementById('enterpriseScope').addEventListener('change', () => {
        currentPage = 1;
        filterEnterprises();
    });
    document.getElementById('searchInput').addEventListener('input', () => {
        currentPage = 1;
        filterEnterprises();
    });
}

// ===== DATA LOADING =====
// Update loadEnterprises to include latitude and longitude
async function loadEnterprises() {
    try {
        showLoading();
        const response = await fetch(`https://data.vunhat2009.workers.dev/${tableName}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch data from ${tableName}`);
        }
        const data = await response.json();

        allEnterprises = data.map(enterprise => ({
            id: enterprise.id,
            name: enterprise.name,
            field: enterprise.field,
            address: enterprise.address,
            location: enterprise.location,
            license_number: enterprise.license_number,
            license_issuedate: enterprise.license_issuedate,
            license_status: enterprise.license_status,
            services: enterprise.services,
            status: enterprise.status,
            type: enterprise.type,
            scope: enterprise.scope,
            latitude: enterprise.latitude,  // Added
            longitude: enterprise.longitude  // Added
        }));

        allEnterprises.sort((a, b) => {
            try {
                const idA = a.id && a.id.startsWith('IT') ? parseInt(a.id.slice(2), 10) : -1;
                const idB = b.id && b.id.startsWith('IT') ? parseInt(b.id.slice(2), 10) : -1;
                return idA - idB;
            } catch (e) {
                console.error("Error during parsing int", e);
                return 0;
            }
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
            <td>${enterprise.license_number || '<span class="text-muted">Không có</span>'}</td>
            <td>${enterprise.license_issuedate || '<span class="text-muted">Không có</span>'}</td>
            <td>${formatServices(enterprise.services)}</td>
            <td>${formatType(enterprise.type)}</td>
            <td>${formatScope(enterprise.scope)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-action btn-view" onclick="viewEnterprise('${enterprise.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-action btn-map" onclick="showMap('${enterprise.id}')">
                        <i class="fas fa-map-marker-alt"></i>
                    </button>
                    <button class="btn btn-action btn-edit" onclick="editEnterprise('${enterprise.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-action btn-delete" onclick="deleteEnterprise('${enterprise.id}')">
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
async function filterEnterprises() {
    try {
        showLoading();
        const filters = {
            field: document.getElementById('enterpriseField').value,
            location: document.getElementById('location').value,
            type: document.getElementById('enterpriseType').value,
            scope: document.getElementById('enterpriseScope').value,
            search: document.getElementById('searchInput').value.toLowerCase()
        };

        filteredEnterprises = allEnterprises.filter(enterprise => {
            let matches = true;

            if (filters.field && enterprise.field !== filters.field) matches = false;
            if (filters.location && enterprise.location !== filters.location) matches = false;
            if (filters.type && enterprise.type !== filters.type) matches = false;
            if (filters.scope && enterprise.scope !== filters.scope) matches = false;

            if (filters.search) {
                const searchMatch =
                    enterprise.name.toLowerCase().includes(filters.search) ||
                    enterprise.address.toLowerCase().includes(filters.search) ||
                    (enterprise.id && enterprise.id.toLowerCase().includes(filters.search)) ||
                    (enterprise.services && enterprise.services.toLowerCase().includes(filters.search));
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
            <h5 class="modal-title">Chi tiết doanh nghiệp CNTT</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
            <div class="row mb-3">
                <div class="col-md-6">
                    <label class="fw-bold">Mã:</label>
                    <p>${enterprise.id}</p>
                </div>
                <div class="col-md-6">
                    <label class="fw-bold">Tên:</label>
                    <p>${enterprise.name}</p>
                </div>
            </div>
            <div class="row mb-3">
                <div class="col-md-6">
                    <label class="fw-bold">Lĩnh vực:</label>
                    <p>${formatEnterpriseField(enterprise.field)}</p>
                </div>
                <div class="col-md-6">
                    <label class="fw-bold">Địa chỉ:</label>
                    <p>${enterprise.address}</p>
                </div>
            </div>
            <div class="row mb-3">
                <div class="col-md-6">
                    <label class="fw-bold">Địa bàn:</label>
                    <p>${formatLocation(enterprise.location)}</p>
                </div>
                <div class="col-md-6">
                    <label class="fw-bold">Số giấy phép:</label>
                    <p>${enterprise.license_number || '<span class="text-muted">Không có</span>'}</p>
                </div>
            </div>
            <div class="row mb-3">
                <div class="col-md-6">
                    <label class="fw-bold">Ngày cấp phép:</label>
                    <p>${enterprise.license_issuedate || '<span class="text-muted">Không có</span>'}</p>
                </div>
                <div class="col-md-6">
                    <label class="fw-bold">Trạng thái giấy phép:</label>
                    <p>${enterprise.license_status ? formatLicenseStatus(enterprise.license_status) : '<span class="text-muted">Không có</span>'}</p>
                </div>
            </div>
            <div class="row mb-3">
                <div class="col-md-6">
                    <label class="fw-bold">Dịch vụ:</label>
                    <p>${formatServices(enterprise.services)}</p>
                </div>
                <div class="col-md-6">
                    <label class="fw-bold">Trạng thái:</label>
                    <p>${formatStatus(enterprise.status)}</p>
                </div>
            </div>
            <div class="row mb-3">
                <div class="col-md-6">
                    <label class="fw-bold">Loại hình:</label>
                    <p>${formatType(enterprise.type)}</p>
                </div>
                <div class="col-md-6">
                    <label class="fw-bold">Phạm vi:</label>
                    <p>${formatScope(enterprise.scope)}</p>
                </div>
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

function showMap(id) {
    const enterprise = allEnterprises.find(i => i.id === id);
    if (!enterprise || !enterprise.latitude || !enterprise.longitude) {
        alert('Không có thông tin tọa độ cho doanh nghiệp này');
        return;
    }

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
                src="https://maps.google.com/maps?q=${enterprise.latitude},${enterprise.longitude}&t=&z=13&ie=UTF8&iwloc=&output=embed"
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
    const modalContent = `
        <div class="modal-header">
            <h5 class="modal-title">Thêm mới doanh nghiệp CNTT</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
            <form id="addEnterpriseForm" class="needs-validation" novalidate>
                <div class="mb-3">
                    <label class="form-label required">Mã doanh nghiệp</label>
                    <input type="text" class="form-control" name="id" value="${generateNextId()}" readonly>
                </div>
                <div class="mb-3">
                    <label class="form-label required">Tên</label>
                    <input type="text" class="form-control" name="name" required>
                    <div class="invalid-feedback">Vui lòng nhập tên</div>
                </div>
                <div class="mb-3">
                    <label class="form-label required">Lĩnh vực</label>
                    <select class="form-select" name="field" required>
                        <option value="">Chọn lĩnh vực</option>
                        <option value="software">Phần mềm</option>
                        <option value="hardware">Phần cứng</option>
                        <option value="game">Phát triển Game</option>
                        <option value="service">Dịch vụ IT</option>
                        <option value="education">Đào tạo IT</option>
                    </select>
                    <div class="invalid-feedback">Vui lòng chọn lĩnh vực</div>
                </div>
                <div class="mb-3">
                    <label class="form-label required">Địa chỉ</label>
                    <input type="text" class="form-control" name="address" required>
                    <div class="invalid-feedback">Vui lòng nhập địa chỉ</div>
                </div>
                <div class="mb-3">
                    <label class="form-label required">Địa bàn</label>
                    <select class="form-select" name="location" required>
                        <option value="">Chọn địa bàn</option>
                        <option value="haichau">Hải Châu</option>
                        <option value="thanhkhe">Thanh Khê</option>
                        <option value="sontra">Sơn Trà</option>
                        <option value="nguhanhson">Ngũ Hành Sơn</option>
                        <option value="lienchieu">Liên Chiểu</option>
                        <option value="camle">Cẩm Lệ</option>
                        <option value="hoavang">Hòa Vang</option>
                        <option value="hoangsa">Hoàng Sa</option>
                    </select>
                    <div class="invalid-feedback">Vui lòng chọn địa bàn</div>
                </div>
                <div class="mb-3">
                    <label class="form-label">Số giấy phép</label>
                    <input type="text" class="form-control" name="license_number">
                </div>
                <div class="mb-3">
                    <label class="form-label">Ngày cấp phép</label>
                    <input type="date" class="form-control" name="license_issuedate">
                </div>
                <div class="mb-3">
                    <label class="form-label">Trạng thái giấy phép</label>
                    <select class="form-select" name="license_status">
                        <option value="">Chọn trạng thái</option>
                        <option value="valid">Hợp lệ</option>
                        <option value="expired">Hết hạn</option>
                        <option value="pending">Đang chờ</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label">Vĩ độ (Latitude)</label>
                    <input type="number" step="any" class="form-control" name="latitude">
                </div>
                <div class="mb-3">
                    <label class="form-label">Kinh độ (Longitude)</label>
                    <input type="number" step="any" class="form-control" name="longitude">
                </div>
                <div class="mb-3">
                    <label class="form-label required">Dịch vụ</label>
                    <select class="form-select" name="services" required>
                        <option value="">Chọn dịch vụ</option>
                        <option value="software_development">Phát triển phần mềm</option>
                        <option value="outsourcing">Gia công</option>
                        <option value="consulting">Tư vấn</option>
                        <option value="solutions">Giải pháp</option>
                        <option value="hardware_manufacturing">Sản xuất phần cứng</option>
                        <option value="hardware_sales">Bán phần cứng</option>
                        <option value="game_development">Phát triển game</option>
                        <option value="game_publishing">Phát hành game</option>
                        <option value="it_consulting">Tư vấn CNTT</option>
                        <option value="network_services">Dịch vụ mạng</option>
                        <option value="mobile_app_development">Phát triển ứng dụng di động</option>
                        <option value="app_maintenance">Bảo trì ứng dụng</option>
                        <option value="network_equipment">Thiết bị mạng</option>
                        <option value="cloud_services">Dịch vụ đám mây</option>
                        <option value="computer_hardware">Phần cứng máy tính</option>
                        <option value="network_solutions">Giải pháp mạng</option>
                        <option value="online_game_services">Dịch vụ game trực tuyến</option>
                        <option value="software_consulting">Tư vấn phần mềm</option>
                        <option value="it_support">Hỗ trợ CNTT</option>
                        <option value="computer_components">Linh kiện máy tính</option>
                        <option value="VR_game_services">Dịch vụ game VR</option>
                        <option value="network_security_consulting">Tư vấn bảo mật mạng</option>
                        <option value="security_solution">Giải pháp bảo mật</option>
                        <option value="system_integration">Tích hợp hệ thống</option>
                        <option value="network_equipment_production">Sản xuất thiết bị mạng</option>
                        <option value="mobile_game_development">Phát triển game di động</option>
                        <option value="cybersecurity_services">Dịch vụ an ninh mạng</option>
                    </select>
                    <div class="invalid-feedback">Vui lòng chọn dịch vụ</div>
                </div>
                <div class="mb-3">
                    <label class="form-label required">Trạng thái</label>
                    <select class="form-select" name="status" required>
                        <option value="">Chọn trạng thái</option>
                        <option value="active">Hoạt động</option>
                        <option value="inactive">Không hoạt động</option>
                    </select>
                    <div class="invalid-feedback">Vui lòng chọn trạng thái</div>
                </div>
                <div class="mb-3">
                    <label class="form-label required">Loại hình</label>
                    <select class="form-select" name="type" required>
                        <option value="">Chọn loại hình</option>
                        <option value="private">Tư nhân</option>
                        <option value="state">Nhà nước</option>
                        <option value="foreign">Nước ngoài</option>
                    </select>
                    <div class="invalid-feedback">Vui lòng chọn loại hình</div>
                </div>
                <div class="mb-3">
                    <label class="form-label required">Phạm vi</label>
                    <select class="form-select" name="scope" required>
                        <option value="">Chọn phạm vi</option>
                        <option value="domestic">Trong nước</option>
                        <option value="international">Quốc tế</option>
                        <option value="local">Địa phương</option>
                    </select>
                    <div class="invalid-feedback">Vui lòng chọn phạm vi</div>
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
            location: form.querySelector('[name="location"]').value,
            license_number: form.querySelector('[name="license_number"]').value || null,
            license_issuedate: form.querySelector('[name="license_issuedate"]').value || null,
            license_status: form.querySelector('[name="license_status"]').value || null,
            services: form.querySelector('[name="services"]').value || null,
            status: form.querySelector('[name="status"]').value,
            type: form.querySelector('[name="type"]').value,
            scope: form.querySelector('[name="scope"]').value,
            latitude: parseFloat(form.querySelector('[name="latitude"]').value) || null,
            longitude: parseFloat(form.querySelector('[name="longitude"]').value) || null
        };

        const response = await fetch(`https://data.vunhat2009.workers.dev/${tableName}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
            mode: 'cors'
        });

        if (!response.ok) throw new Error('Failed to save enterprise');

        await loadEnterprises(); // Reload from API

        const modalElement = document.getElementById('enterpriseModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();

        alert('Thêm mới doanh nghiệp thành công!');
    } catch (error) {
        console.error('Lỗi khi thêm mới doanh nghiệp:', error);
        alert('Có lỗi xảy ra khi thêm mới doanh nghiệp');
    } finally {
        hideLoading();
    }
}

function generateNextId() {
    if (!allEnterprises || allEnterprises.length === 0) {
        return "IT001";
    }
    const lastId = allEnterprises[allEnterprises.length - 1].id;
    const numericPart = parseInt(lastId.slice(2), 10);
    const nextNumericPart = numericPart + 1;
    return `IT${String(nextNumericPart).padStart(3, '0')}`;
}

function editEnterprise(id) {
    const enterprise = allEnterprises.find(i => i.id === id);
    if (!enterprise) {
        alert('Không tìm thấy thông tin doanh nghiệp');
        return;
    }

    const modalContent = `
        <div class="modal-header">
            <h5 class="modal-title">Chỉnh sửa thông tin doanh nghiệp CNTT</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
            <form id="editEnterpriseForm" class="needs-validation" novalidate>
                <input type="hidden" name="id" value="${enterprise.id}">
                <div class="mb-3">
                    <label class="form-label required">Tên</label>
                    <input type="text" class="form-control" name="name" value="${enterprise.name}" required>
                    <div class="invalid-feedback">Vui lòng nhập tên</div>
                </div>
                <div class="mb-3">
                    <label class="form-label required">Lĩnh vực</label>
                    <select class="form-select" name="field" required>
                        <option value="software" ${enterprise.field === 'software' ? 'selected' : ''}>Phần mềm</option>
                        <option value="hardware" ${enterprise.field === 'hardware' ? 'selected' : ''}>Phần cứng</option>
                        <option value="game" ${enterprise.field === 'game' ? 'selected' : ''}>Phát triển Game</option>
                        <option value="service" ${enterprise.field === 'service' ? 'selected' : ''}>Dịch vụ IT</option>
                        <option value="education" ${enterprise.field === 'education' ? 'selected' : ''}>Đào tạo IT</option>
                    </select>
                    <div class="invalid-feedback">Vui lòng chọn lĩnh vực</div>
                </div>
                <div class="mb-3">
                    <label class="form-label required">Địa chỉ</label>
                    <input type="text" class="form-control" name="address" value="${enterprise.address}" required>
                    <div class="invalid-feedback">Vui lòng nhập địa chỉ</div>
                </div>
                <div class="mb-3">
                    <label class="form-label required">Địa bàn</label>
                    <select class="form-select" name="location" required>
                        <option value="haichau" ${enterprise.location === 'haichau' ? 'selected' : ''}>Hải Châu</option>
                        <option value="thanhkhe" ${enterprise.location === 'thanhkhe' ? 'selected' : ''}>Thanh Khê</option>
                        <option value="sontra" ${enterprise.location === 'sontra' ? 'selected' : ''}>Sơn Trà</option>
                        <option value="nguhanhson" ${enterprise.location === 'nguhanhson' ? 'selected' : ''}>Ngũ Hành Sơn</option>
                        <option value="lienchieu" ${enterprise.location === 'lienchieu' ? 'selected' : ''}>Liên Chiểu</option>
                        <option value="camle" ${enterprise.location === 'camle' ? 'selected' : ''}>Cẩm Lệ</option>
                        <option value="hoavang" ${enterprise.location === 'hoavang' ? 'selected' : ''}>Hòa Vang</option>
                        <option value="hoangsa" ${enterprise.location === 'hoangsa' ? 'selected' : ''}>Hoàng Sa</option>
                    </select>
                    <div class="invalid-feedback">Vui lòng chọn địa bàn</div>
                </div>
                <div class="mb-3">
                    <label class="form-label">Số giấy phép</label>
                    <input type="text" class="form-control" name="license_number" value="${enterprise.license_number || ''}">
                </div>
                <div class="mb-3">
                    <label class="form-label">Ngày cấp phép</label>
                    <input type="date" class="form-control" name="license_issuedate" value="${enterprise.license_issuedate || ''}">
                </div>
                <div class="mb-3">
                    <label class="form-label">Trạng thái giấy phép</label>
                    <select class="form-select" name="license_status">
                        <option value="" ${!enterprise.license_status ? 'selected' : ''}>Chọn trạng thái</option>
                        <option value="valid" ${enterprise.license_status === 'valid' ? 'selected' : ''}>Hợp lệ</option>
                        <option value="expired" ${enterprise.license_status === 'expired' ? 'selected' : ''}>Hết hạn</option>
                        <option value="pending" ${enterprise.license_status === 'pending' ? 'selected' : ''}>Đang chờ</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label">Vĩ độ (Latitude)</label>
                    <input type="number" step="any" class="form-control" name="latitude" value="${enterprise.latitude || ''}">
                </div>
                <div class="mb-3">
                    <label class="form-label">Kinh độ (Longitude)</label>
                    <input type="number" step="any" class="form-control" name="longitude" value="${enterprise.longitude || ''}">
                </div>
                <div class="mb-3">
                    <label class="form-label required">Dịch vụ</label>
                    <select class="form-select" name="services" required>
                        <option value="">Chọn dịch vụ</option>
                        <option value="software_development" ${enterprise.services === 'software_development' ? 'selected' : ''}>Phát triển phần mềm</option>
                        <option value="outsourcing" ${enterprise.services === 'outsourcing' ? 'selected' : ''}>Gia công</option>
                        <option value="consulting" ${enterprise.services === 'consulting' ? 'selected' : ''}>Tư vấn</option>
                        <option value="solutions" ${enterprise.services === 'solutions' ? 'selected' : ''}>Giải pháp</option>
                        <option value="hardware_manufacturing" ${enterprise.services === 'hardware_manufacturing' ? 'selected' : ''}>Sản xuất phần cứng</option>
                        <option value="hardware_sales" ${enterprise.services === 'hardware_sales' ? 'selected' : ''}>Bán phần cứng</option>
                        <option value="game_development" ${enterprise.services === 'game_development' ? 'selected' : ''}>Phát triển game</option>
                        <option value="game_publishing" ${enterprise.services === 'game_publishing' ? 'selected' : ''}>Phát hành game</option>
                        <option value="it_consulting" ${enterprise.services === 'it_consulting' ? 'selected' : ''}>Tư vấn CNTT</option>
                        <option value="network_services" ${enterprise.services === 'network_services' ? 'selected' : ''}>Dịch vụ mạng</option>
                        <option value="mobile_app_development" ${enterprise.services === 'mobile_app_development' ? 'selected' : ''}>Phát triển ứng dụng di động</option>
                        <option value="app_maintenance" ${enterprise.services === 'app_maintenance' ? 'selected' : ''}>Bảo trì ứng dụng</option>
                        <option value="network_equipment" ${enterprise.services === 'network_equipment' ? 'selected' : ''}>Thiết bị mạng</option>
                        <option value="cloud_services" ${enterprise.services === 'cloud_services' ? 'selected' : ''}>Dịch vụ đám mây</option>
                        <option value="computer_hardware" ${enterprise.services === 'computer_hardware' ? 'selected' : ''}>Phần cứng máy tính</option>
                        <option value="network_solutions" ${enterprise.services === 'network_solutions' ? 'selected' : ''}>Giải pháp mạng</option>
                        <option value="online_game_services" ${enterprise.services === 'online_game_services' ? 'selected' : ''}>Dịch vụ game trực tuyến</option>
                        <option value="software_consulting" ${enterprise.services === 'software_consulting' ? 'selected' : ''}>Tư vấn phần mềm</option>
                        <option value="it_support" ${enterprise.services === 'it_support' ? 'selected' : ''}>Hỗ trợ CNTT</option>
                        <option value="computer_components" ${enterprise.services === 'computer_components' ? 'selected' : ''}>Linh kiện máy tính</option>
                        <option value="VR_game_services" ${enterprise.services === 'VR_game_services' ? 'selected' : ''}>Dịch vụ game VR</option>
                        <option value="network_security_consulting" ${enterprise.services === 'network_security_consulting' ? 'selected' : ''}>Tư vấn bảo mật mạng</option>
                        <option value="security_solution" ${enterprise.services === 'security_solution' ? 'selected' : ''}>Giải pháp bảo mật</option>
                        <option value="system_integration" ${enterprise.services === 'system_integration' ? 'selected' : ''}>Tích hợp hệ thống</option>
                        <option value="network_equipment_production" ${enterprise.services === 'network_equipment_production' ? 'selected' : ''}>Sản xuất thiết bị mạng</option>
                        <option value="mobile_game_development" ${enterprise.services === 'mobile_game_development' ? 'selected' : ''}>Phát triển game di động</option>
                        <option value="cybersecurity_services" ${enterprise.services === 'cybersecurity_services' ? 'selected' : ''}>Dịch vụ an ninh mạng</option>
                    </select>
                    <div class="invalid-feedback">Vui lòng chọn dịch vụ</div>
                </div>
                <div class="mb-3">
                    <label class="form-label required">Trạng thái</label>
                    <select class="form-select" name="status" required>
                        <option value="">Chọn trạng thái</option>
                        <option value="active" ${enterprise.status === 'active' ? 'selected' : ''}>Hoạt động</option>
                        <option value="inactive" ${enterprise.status === 'inactive' ? 'selected' : ''}>Không hoạt động</option>
                    </select>
                    <div class="invalid-feedback">Vui lòng chọn trạng thái</div>
                </div>
                <div class="mb-3">
                    <label class="form-label required">Loại hình</label>
                    <select class="form-select" name="type" required>
                        <option value="">Chọn loại hình</option>
                        <option value="private" ${enterprise.type === 'private' ? 'selected' : ''}>Tư nhân</option>
                        <option value="state" ${enterprise.type === 'state' ? 'selected' : ''}>Nhà nước</option>
                        <option value="foreign" ${enterprise.type === 'foreign' ? 'selected' : ''}>Nước ngoài</option>
                    </select>
                    <div class="invalid-feedback">Vui lòng chọn loại hình</div>
                </div>
                <div class="mb-3">
                    <label class="form-label required">Phạm vi</label>
                    <select class="form-select" name="scope" required>
                        <option value="">Chọn phạm vi</option>
                        <option value="domestic" ${enterprise.scope === 'domestic' ? 'selected' : ''}>Trong nước</option>
                        <option value="international" ${enterprise.scope === 'international' ? 'selected' : ''}>Quốc tế</option>
                        <option value="local" ${enterprise.scope === 'local' ? 'selected' : ''}>Địa phương</option>
                    </select>
                    <div class="invalid-feedback">Vui lòng chọn phạm vi</div>
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
            location: form.querySelector('[name="location"]').value,
            license_number: form.querySelector('[name="license_number"]').value || null,
            license_issuedate: form.querySelector('[name="license_issuedate"]').value || null,
            license_status: form.querySelector('[name="license_status"]').value || null,
            services: form.querySelector('[name="services"]').value || null,
            status: form.querySelector('[name="status"]').value,
            type: form.querySelector('[name="type"]').value,
            scope: form.querySelector('[name="scope"]').value,
            latitude: parseFloat(form.querySelector('[name="latitude"]').value) || null,
            longitude: parseFloat(form.querySelector('[name="longitude"]').value) || null
        };

        const response = await fetch(`https://data.vunhat2009.workers.dev/${tableName}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
            mode: 'cors'
        });

        if (!response.ok) throw new Error('Failed to update enterprise');

        await loadEnterprises(); // Reload from API

        const modalElement = document.getElementById('enterpriseModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
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

        if (!confirm(`Bạn có chắc chắn muốn xóa doanh nghiệp này?\n\n- Mã: ${enterprise.id}\n- Tên: ${enterprise.name}`)) {
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

        await loadEnterprises(); // Reload from API

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

    let paginationHtml = getPaginationHtml(totalPages);
    paginationElement.innerHTML = paginationHtml;
}

function getPaginationHtml(totalPages) {
    let html = '';
    html += `
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
    const totalPages = Math.ceil(filteredEnterprises.length / itemsPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        displayEnterprises();
    }
}

// ===== UTILITY FUNCTIONS =====
function formatLicenseStatus(status) {
    const statusMap = {
        valid: 'Hợp lệ',
        expired: 'Hết hạn',
        pending: 'Đang chờ'
    };
    return statusMap[status] || status;
}

function formatStatus(status) {
    const statusMap = {
        active: 'Hoạt động',
        inactive: 'Không hoạt động'
    };
    return statusMap[status] || status;
}
function formatEnterpriseField(field) {
    const fields = {
        software: 'Phần mềm',
        hardware: 'Phần cứng',
        service: 'Dịch vụ IT',
        education: 'Đào tạo IT',
        game: 'Phát triển Game'
    };
    return fields[field] || field;
}

function formatLocation(location) {
    const locations = {
        haichau: 'Hải Châu',
        thanhkhe: 'Thanh Khê',
        sontra: 'Sơn Trà',
        nguhanhson: 'Ngũ Hành Sơn',
        lienchieu: 'Liên Chiểu',
        camle: 'Cẩm Lệ',
        hoavang: 'Hòa Vang',
        hoangsa: 'Hoàng Sa'
    };
    return locations[location] || location;
}

function formatServices(services) {
    if (!services) return '<span class="text-muted">Không có</span>';
    const serviceList = services.split(', ').map(service => {
        const serviceMap = {
            'software_development': 'Phát triển phần mềm',
            'outsourcing': 'Gia công',
            'consulting': 'Tư vấn',
            'solutions': 'Giải pháp',
            'hardware_manufacturing': 'Sản xuất phần cứng',
            'hardware_sales': 'Bán phần cứng',
            'game_development': 'Phát triển game',
            'game_publishing': 'Phát hành game',
            'it_consulting': 'Tư vấn CNTT',
            'network_services': 'Dịch vụ mạng',
            'mobile_app_development': 'Phát triển ứng dụng di động',
            'app_maintenance': 'Bảo trì ứng dụng',
            'network_equipment': 'Thiết bị mạng',
            'cloud_services': 'Dịch vụ đám mây',
            'computer_hardware': 'Phần cứng máy tính',
            'network_solutions': 'Giải pháp mạng',
            'online_game_services': 'Dịch vụ game trực tuyến',
            'software_consulting': 'Tư vấn phần mềm',
            'it_support': 'Hỗ trợ CNTT',
            'computer_components': 'Linh kiện máy tính',
            'VR_game_services': 'Dịch vụ game VR',
            'network_security_consulting': 'Tư vấn bảo mật mạng',
            'security_solution': 'Giải pháp bảo mật',
            'system_integration': 'Tích hợp hệ thống',
            'network_equipment_production': 'Sản xuất thiết bị mạng',
            'mobile_game_development': 'Phát triển game di động',
            'cybersecurity_services': 'Dịch vụ an ninh mạng'
        };
        return serviceMap[service] || service;
    });
    return serviceList.join(', ');
}

function formatType(type) {
    const typeMap = {
        private: 'Tư nhân',
        state: 'Nhà nước',
        foreign: 'Nước ngoài'
    };
    return typeMap[type] || type;
}

function formatScope(scope) {
    const scopeMap = {
        domestic: 'Trong nước',
        international: 'Quốc tế',
        local: 'Địa phương'
    };
    return scopeMap[scope] || scope;
}

function showLoading() {
    document.getElementById('loading-spinner').classList.remove('d-none');
}

function hideLoading() {
    document.getElementById('loading-spinner').classList.add('d-none');
}