let allEnterprises = [];
let filteredEnterprises = [];
const tableName = 'khcn_data_postal_enterprise'; // Tên bảng trong Supabase
let currentPage = 1;
const itemsPerPage = 10;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    loadEnterprises();
    initializeEventListeners();
});

// ===== EVENT LISTENERS =====
function initializeEventListeners() {
    document.getElementById('businessType').addEventListener('change', () => {
        currentPage = 1;
        filterEnterprises();
    });
    document.getElementById('operationScope').addEventListener('change', () => {
        currentPage = 1;
        filterEnterprises();
    });
    document.getElementById('status').addEventListener('change', () => {
        currentPage = 1;
        filterEnterprises();
    });
    document.getElementById('district').addEventListener('change', () => {
        currentPage = 1;
        filterEnterprises();
    });
    document.getElementById('service').addEventListener('change', () => {
        currentPage = 1;
        filterEnterprises();
    });
    document.getElementById('license').addEventListener('change', () => {
        currentPage = 1;
        filterEnterprises();
    });
}

// ===== DATA LOADING =====
async function loadEnterprises() {
    try {
        showLoading();
        const response = await fetch(`https://data.vunhat2009.workers.dev/${tableName}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch data from ${tableName}`);
        }
        const data = await response.json();
        // Map data to correct license
        allEnterprises = data.map(enterprise => ({
            ...enterprise,
            license: {
               number: enterprise.license_number,
               issueDate: enterprise.license_issuedate,
               status: enterprise.license_status
            }
        }));
        // Sắp xếp theo id
        allEnterprises.sort((a, b) => {
            const idA = parseInt(a.id.slice(2), 10);
            const idB = parseInt(b.id.slice(2), 10);
            return idA - idB;
        });
        filteredEnterprises = [...allEnterprises]; // Initialize filtered data
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
    const tbody = document.getElementById('enterprisesTableBody');
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredEnterprises.length);
    const displayedData = filteredEnterprises.slice(startIndex, endIndex);
    tbody.innerHTML = '';

    displayedData.forEach((enterprise, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${startIndex + index + 1}</td>
            <td>${enterprise.name}</td>
            <td>${formatBusinessType(enterprise.type)}</td>
            <td>${formatScope(enterprise.scope)}</td>
            <td>${enterprise.address}</td>
             <td>${formatLicense(enterprise.license)}</td>
            <td>${formatStatus(enterprise.status)}</td>
            <td>
                <div class="action-buttons">
                     <button class="btn btn-action btn-view" onclick="viewEnterprise('${enterprise.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-action btn-map" onclick="showMap(${enterprise.latitude}, ${enterprise.longitude})">
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
            type: document.getElementById('businessType').value,
            scope: document.getElementById('operationScope').value,
            status: document.getElementById('status').value,
            district: document.getElementById('district').value,
            service: document.getElementById('service').value,
            license: document.getElementById('license').value
        };

        filteredEnterprises = allEnterprises.filter(enterprise => {
            let matches = true;

            if (filters.type && enterprise.type !== filters.type) matches = false;
            if (filters.scope && enterprise.scope !== filters.scope) matches = false;
            if (filters.status && enterprise.status !== filters.status) matches = false;
            if (filters.service && !enterprise.services.includes(filters.service)) matches = false;

            if (filters.license) {
                switch (filters.license) {
                    case 'valid':
                        if (enterprise.license.status !== 'valid') matches = false;
                        break;
                    case 'expiring':
                        if (enterprise.license.status !== 'expiring') matches = false;
                        break;
                    case 'expired':
                        if (enterprise.license.status !== 'expired') matches = false;
                        break;
                }
            }

            if (filters.district) {
                const address = enterprise.address.toLowerCase();
                let districtName = '';

                // Mapping giá trị value với tên quận/huyện
                switch (filters.district) {
                    case 'haichau':
                        districtName = 'hải châu';
                        break;
                    case 'thanhkhe':
                        districtName = 'thanh khê';
                        break;
                    case 'sontra':
                        districtName = 'sơn trà';
                        break;
                    case 'nguhanhson':
                        districtName = 'ngũ hành sơn';
                        break;
                    case 'lienchieu':
                        districtName = 'liên chiểu';
                        break;
                    case 'camle':
                        districtName = 'cẩm lệ';
                        break;
                    case 'hoavang':
                        districtName = 'hòa vang';
                        break;
                }

                // Kiểm tra địa chỉ có chứa tên quận/huyện không
                if (!address.includes(districtName)) {
                    matches = false;
                }
            }

            return matches;
        });

        displayEnterprises();
    } catch (error) {
        console.error('Lỗi khi lọc dữ liệu:', error);
        alert('Có lỗi xảy ra khi lọc dữ liệu');
    } finally {
        hideLoading();
    }
}

// ===== CRUD OPERATIONS =====
function viewEnterprise(id) {
    const enterprise = allEnterprises.find(e => e.id === id);
    if (!enterprise) {
        alert('Không tìm thấy thông tin doanh nghiệp');
        return;
    }

    const modalContent = `
        <div class="modal-header">
            <h5 class="modal-title">Chi tiết doanh nghiệp</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
            <div class="row mb-3">
                <div class="col-md-6">
                    <label class="fw-bold">Mã số:</label>
                    <p>${enterprise.id}</p>
                </div>
                <div class="col-md-6">
                    <label class="fw-bold">Trạng thái:</label>
                    <p>${formatStatus(enterprise.status)}</p>
                </div>
            </div>
            <div class="mb-3">
                <label class="fw-bold">Tên doanh nghiệp:</label>
                <p>${enterprise.name}</p>
            </div>
            <div class="row mb-3">
                <div class="col-md-6">
                    <label class="fw-bold">Loại hình:</label>
                    <p>${formatBusinessType(enterprise.type)}</p>
                </div>
                <div class="col-md-6">
                    <label class="fw-bold">Phạm vi hoạt động:</label>
                    <p>${formatScope(enterprise.scope)}</p>
                </div>
            </div>
            <div class="mb-3">
                <label class="fw-bold">Địa chỉ:</label>
                <p>${enterprise.address}</p>
            </div>
             <div class="mb-3">
                <label class="fw-bold">Giấy phép:</label>
                <p>Số ${enterprise.license.number} - Ngày cấp: ${formatDate(enterprise.license.issueDate)}</p>
            </div>
            <div class="mb-3">
                <label class="fw-bold">Dịch vụ cung cấp:</label>
                <p>${formatServices(enterprise.services)}</p>
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

// CREATE - Thêm mới doanh nghiệp
async function addNewEnterprise() {
    const newId = generateNextId();
    const modalContent = `
        <div class="modal-header">
            <h5 class="modal-title">Thêm mới doanh nghiệp bưu chính</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
            <form id="addEnterpriseForm" class="needs-validation" novalidate>
                 <div class="mb-3">
                    <label class="form-label required">Mã doanh nghiệp</label>
                     <input type="text" class="form-control" name="id" value="${newId}" readonly>
                 </div>
                <!-- Thông tin cơ bản -->
                <div class="mb-3">
                    <label class="form-label required">Tên doanh nghiệp</label>
                    <input type="text" class="form-control" name="name" required>
                    <div class="invalid-feedback">Vui lòng nhập tên doanh nghiệp</div>
                </div>

                <!-- Thông tin phân loại -->
                <div class="row mb-3">
                    <div class="col-md-6">
                        <label class="form-label required">Loại hình doanh nghiệp</label>
                        <select class="form-select" name="type" required>
                            <option value="">Chọn loại hình</option>
                            <option value="state">Nhà nước</option>
                            <option value="private">Tư nhân</option>
                            <option value="foreign">Có vốn nước ngoài</option>
                        </select>
                        <div class="invalid-feedback">Vui lòng chọn loại hình doanh nghiệp</div>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label required">Phạm vi hoạt động</label>
                        <select class="form-select" name="scope" required>
                            <option value="">Chọn phạm vi</option>
                            <option value="international">Quốc tế</option>
                            <option value="domestic">Trong nước</option>
                            <option value="local">Nội tỉnh</option>
                        </select>
                        <div class="invalid-feedback">Vui lòng chọn phạm vi hoạt động</div>
                    </div>
                </div>

                <!-- Thông tin địa chỉ -->
                <div class="mb-3">
                    <label class="form-label required">Địa chỉ</label>
                    <input type="text" class="form-control" name="address" required>
                    <div class="invalid-feedback">Vui lòng nhập địa chỉ</div>
                </div>
                 <div class="mb-3">
                        <label class="form-label required">Vĩ độ</label>
                        <input type="number" class="form-control" name="latitude" step="any" required>
                        <div class="invalid-feedback">Vui lòng nhập vĩ độ</div>
                   </div>
                    <div class="mb-3">
                        <label class="form-label required">Kinh độ</label>
                         <input type="number" class="form-control" name="longitude" step="any" required>
                         <div class="invalid-feedback">Vui lòng nhập kinh độ</div>
                    </div>

                <!-- Thông tin giấy phép -->
                <div class="row mb-3">
                    <div class="col-md-6">
                        <label class="form-label required">Số giấy phép</label>
                        <input type="text" class="form-control" name="licenseNumber" required>
                        <div class="invalid-feedback">Vui lòng nhập số giấy phép</div>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label required">Ngày cấp</label>
                        <input type="date" class="form-control" name="issueDate" required>
                        <div class="invalid-feedback">Vui lòng chọn ngày cấp</div>
                    </div>
                </div>

                <!-- Dịch vụ cung cấp -->
                <div class="mb-3">
                    <label class="form-label">Dịch vụ cung cấp</label>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" name="services" value="letter">
                        <label class="form-check-label">Thư</label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" name="services" value="parcel">
                        <label class="form-check-label">Bưu kiện</label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" name="services" value="express">
                        <label class="form-check-label">Chuyển phát nhanh</label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" name="services" value="logistics">
                        <label class="form-check-label">Logistics</label>
                    </div>
                </div>

                <!-- Trạng thái -->
                <div class="mb-3">
                    <label class="form-label required">Trạng thái</label>
                    <select class="form-select" name="status" required>
                        <option value="active">Đang hoạt động</option>
                        <option value="suspended">Tạm ngừng</option>
                        <option value="expired">Hết hạn</option>
                    </select>
                    <div class="invalid-feedback">Vui lòng chọn trạng thái</div>
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

// Hàm xử lý lưu doanh nghiệp mới
async function saveNewEnterprise() {
    try {
        // Lấy form và kiểm tra validation
        const form = document.getElementById('addEnterpriseForm');
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }
        showLoading();
        // Lấy dữ liệu từ form
        const formData = {
            id: document.querySelector('#addEnterpriseForm [name="id"]').value,
            name: form.querySelector('[name="name"]').value,
            type: form.querySelector('[name="type"]').value,
            scope: form.querySelector('[name="scope"]').value,
            address: form.querySelector('[name="address"]').value,
            license_number: form.querySelector('[name="licenseNumber"]').value,
            license_issuedate: form.querySelector('[name="issueDate"]').value,
             latitude: parseFloat(form.querySelector('[name="latitude"]').value),
            longitude: parseFloat(form.querySelector('[name="longitude"]').value),
            services: Array.from(form.querySelectorAll('[name="services"]:checked')).map(cb => cb.value),
            status: form.querySelector('[name="status"]').value
        };

        // Kiểm tra dịch vụ
        if (formData.services.length === 0) {
            alert('Vui lòng chọn ít nhất một dịch vụ cung cấp');
            return;
        }
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
        await loadEnterprises();
        // Đóng modal
        const modalElement = document.getElementById('enterpriseModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();
        // Thông báo thành công
        alert('Thêm mới doanh nghiệp thành công!');

    } catch (error) {
        console.error('Lỗi khi thêm mới:', error);
        alert('Có lỗi xảy ra khi thêm mới doanh nghiệp');
    } finally {
        hideLoading();
    }
}
// Tạo ID mới
function generateNextId() {
    if (!allEnterprises || allEnterprises.length === 0) {
        return "BC001";
    }
    const lastId = allEnterprises[allEnterprises.length - 1].id;
    const numericPart = parseInt(lastId.slice(2), 10);
    const nextNumericPart = numericPart + 1;
    return `BC${String(nextNumericPart).padStart(3, '0')}`;
}

// UPDATE - Cập nhật thông tin doanh nghiệp
function editEnterprise(id) {
    const enterprise = allEnterprises.find(e => e.id === id);
    if (!enterprise) {
        alert('Không tìm thấy thông tin doanh nghiệp');
        return;
    }

    const modalContent = `
        <div class="modal-header">
            <h5 class="modal-title">Chỉnh sửa thông tin doanh nghiệp</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
            <form id="editEnterpriseForm" class="needs-validation" novalidate>
                <input type="hidden" name="id" value="${enterprise.id}">
                
                <!-- Thông tin cơ bản -->
                <div class="mb-3">
                    <label class="form-label required">Tên doanh nghiệp</label>
                    <input type="text" class="form-control" name="name" 
                           value="${enterprise.name}" required>
                    <div class="invalid-feedback">Vui lòng nhập tên doanh nghiệp</div>
                </div>

                <!-- Thông tin phân loại -->
                <div class="row mb-3">
                    <div class="col-md-6">
                        <label class="form-label required">Loại hình doanh nghiệp</label>
                        <select class="form-select" name="type" required>
                            <option value="state" ${enterprise.type === 'state' ? 'selected' : ''}>Nhà nước</option>
                            <option value="private" ${enterprise.type === 'private' ? 'selected' : ''}>Tư nhân</option>
                            <option value="foreign" ${enterprise.type === 'foreign' ? 'selected' : ''}>Có vốn nước ngoài</option>
                        </select>
                        <div class="invalid-feedback">Vui lòng chọn loại hình doanh nghiệp</div>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label required">Phạm vi hoạt động</label>
                        <select class="form-select" name="scope" required>
                            <option value="international" ${enterprise.scope === 'international' ? 'selected' : ''}>Quốc tế</option>
                            <option value="domestic" ${enterprise.scope === 'domestic' ? 'selected' : ''}>Trong nước</option>
                            <option value="local" ${enterprise.scope === 'local' ? 'selected' : ''}>Nội tỉnh</option>
                        </select>
                        <div class="invalid-feedback">Vui lòng chọn phạm vi hoạt động</div>
                    </div>
                </div>

                <!-- Thông tin địa chỉ -->
                <div class="mb-3">
                    <label class="form-label required">Địa chỉ</label>
                    <input type="text" class="form-control" name="address" 
                           value="${enterprise.address}" required>
                    <div class="invalid-feedback">Vui lòng nhập địa chỉ</div>
                </div>

                 <!-- Thông tin giấy phép -->
                 <div class="row mb-3">
                    <div class="col-md-6">
                        <label class="form-label required">Số giấy phép</label>
                        <input type="text" class="form-control" name="licenseNumber" 
                               value="${enterprise.license.number}" required>
                        <div class="invalid-feedback">Vui lòng nhập số giấy phép</div>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label required">Ngày cấp</label>
                        <input type="date" class="form-control" name="issueDate" 
                               value="${enterprise.license.issueDate}" required>
                        <div class="invalid-feedback">Vui lòng chọn ngày cấp</div>
                    </div>
                </div>

                 <!-- Tọa độ -->
                <div class="row mb-3">
                    <div class="col-md-6">
                        <label class="form-label required">Vĩ độ</label>
                        <input type="number" class="form-control" name="latitude" step="any" value="${enterprise.latitude}" required>
                         <div class="invalid-feedback">Vui lòng nhập vĩ độ</div>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label required">Kinh độ</label>
                        <input type="number" class="form-control" name="longitude" step="any" value="${enterprise.longitude}" required>
                          <div class="invalid-feedback">Vui lòng nhập kinh độ</div>
                    </div>
                </div>
                <!-- Dịch vụ cung cấp -->
                <div class="mb-3">
                    <label class="form-label">Dịch vụ cung cấp</label>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" name="services" value="letter"
                               ${enterprise.services.includes('letter') ? 'checked' : ''}>
                        <label class="form-check-label">Thư</label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" name="services" value="parcel"
                               ${enterprise.services.includes('parcel') ? 'checked' : ''}>
                        <label class="form-check-label">Bưu kiện</label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" name="services" value="express"
                               ${enterprise.services.includes('express') ? 'checked' : ''}>
                        <label class="form-check-label">Chuyển phát nhanh</label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" name="services" value="logistics"
                               ${enterprise.services.includes('logistics') ? 'checked' : ''}>
                        <label class="form-check-label">Logistics</label>
                    </div>
                </div>

                <!-- Trạng thái -->
                <div class="mb-3">
                    <label class="form-label required">Trạng thái</label>
                    <select class="form-select" name="status" required>
                        <option value="active" ${enterprise.status === 'active' ? 'selected' : ''}>Đang hoạt động</option>
                        <option value="suspended" ${enterprise.status === 'suspended' ? 'selected' : ''}>Tạm ngừng</option>
                        <option value="expired" ${enterprise.status === 'expired' ? 'selected' : ''}>Hết hạn</option>
                    </select>
                    <div class="invalid-feedback">Vui lòng chọn trạng thái</div>
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

// Hàm xử lý lưu thông tin đã chỉnh sửa
async function saveEditedEnterprise(id) {
    try {
        // Lấy form và kiểm tra validation
        const form = document.getElementById('editEnterpriseForm');
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }

        showLoading();

        // Lấy dữ liệu từ form
        const formData = {
            id: id,
            name: form.querySelector('[name="name"]').value,
            type: form.querySelector('[name="type"]').value,
            scope: form.querySelector('[name="scope"]').value,
            address: form.querySelector('[name="address"]').value,
            license_number: form.querySelector('[name="licenseNumber"]').value,
            license_issuedate: form.querySelector('[name="issueDate"]').value,
            latitude: parseFloat(form.querySelector('[name="latitude"]').value),
            longitude: parseFloat(form.querySelector('[name="longitude"]').value),
            services: Array.from(form.querySelectorAll('[name="services"]:checked')).map(cb => cb.value),
            status: form.querySelector('[name="status"]').value
        };
        
          // Kiểm tra dịch vụ
        if (formData.services.length === 0) {
             alert('Vui lòng chọn ít nhất một dịch vụ cung cấp');
           return;
         }

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
        await loadEnterprises();
        // Sắp xếp lại mảng sau khi edit thành công
        allEnterprises.sort((a, b) => {
            const idA = parseInt(a.id.slice(2), 10);
            const idB = parseInt(b.id.slice(2), 10);
            return idA - idB;
        });
        displayEnterprises();
        // Đóng modal
        const modalElement = document.getElementById('enterpriseModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();

        // Thông báo thành công
        alert('Cập nhật thông tin doanh nghiệp thành công!');

    } catch (error) {
        console.error('Lỗi khi cập nhật:', error);
        alert('Có lỗi xảy ra khi cập nhật thông tin doanh nghiệp');
    } finally {
        hideLoading();
    }
}

// DELETE - Xóa doanh nghiệp
async function deleteEnterprise(id) {
    try {
        const enterprise = allEnterprises.find(e => e.id === id);
        if (!enterprise) {
            alert('Không tìm thấy thông tin doanh nghiệp');
            return;
        }

        if (!confirm(`Bạn có chắc chắn muốn xóa doanh nghiệp sau?\n\n` +
            `- Mã số: ${enterprise.id}\n` +
            `- Tên doanh nghiệp: ${enterprise.name}\n` +
            `- Địa chỉ: ${enterprise.address}`)) {
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
        await loadEnterprises();
        // Xóa khỏi danh sách
        allEnterprises = allEnterprises.filter(e => e.id !== id);

        // Cập nhật giao diện
        displayEnterprises();

        // Thông báo thành công
        alert('Xóa doanh nghiệp thành công!');

    } catch (error) {
        console.error('Lỗi khi xóa:', error);
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

    // Cập nhật thông tin phân trang
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, filteredEnterprises.length);
    paginationInfo.textContent = `Hiển thị ${startItem}-${endItem} trong tổng số ${filteredEnterprises.length} doanh nghiệp`;

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
    const totalPages = Math.ceil(filteredEnterprises.length / itemsPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        displayEnterprises();
    }
}

// ===== UTILITY FUNCTIONS =====
function formatBusinessType(type) {
    const types = {
        state: 'Nhà nước',
        private: 'Tư nhân',
        foreign: 'Có vốn nước ngoài'
    };
    return `<span class="business-type type-${type}">${types[type] || type}</span>`;
}

function formatScope(scope) {
    const scopes = {
        international: 'Quốc tế',
        domestic: 'Trong nước',
        local: 'Nội tỉnh'
    };
    return scopes[scope] || scope;
}

function formatStatus(status) {
    const statusClasses = {
        active: 'status-active',
        suspended: 'status-suspended',
        expired: 'status-expired'
    };

    const statusLabels = {
        active: 'Đang hoạt động',
        suspended: 'Tạm ngừng',
        expired: 'Hết hạn'
    };

    return `<span class="status-badge ${statusClasses[status]}">${statusLabels[status]}</span>`;
}

function formatLicense(license) {
    const statusClasses = {
        valid: 'license-valid',
        expiring: 'license-expiring',
        expired: 'license-expired'
    };

    return `<span class="license-badge ${statusClasses[license.status]}">${license.number}</span>`;
}

function formatServices(services) {
    const serviceLabels = {
        letter: 'Thư',
        parcel: 'Bưu kiện',
        express: 'Chuyển phát nhanh',
        logistics: 'Logistics'
    };
    return services.map(s => serviceLabels[s] || s).join(', ');
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('vi-VN');
}
function showLoading() {
    document.getElementById('loading-spinner').classList.remove('d-none');
}

function hideLoading() {
    document.getElementById('loading-spinner').classList.add('d-none');
}