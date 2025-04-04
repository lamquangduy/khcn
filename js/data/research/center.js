let allCenters = [];
let filteredCenters = [];
const tableName = 'khcn_data_center'; // Tên bảng trong Supabase
let currentPage = 1;
const itemsPerPage = 10;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function () {
    loadCenters();
    initializeEventListeners();
});

// ===== EVENT LISTENERS =====
function initializeEventListeners() {
    // Filter event listeners
    document.getElementById('centerField').addEventListener('change', () => {
        currentPage = 1;
        filterCenters();
    });
    document.getElementById('centerType').addEventListener('change', () => {
        currentPage = 1;
        filterCenters();
    });
    document.getElementById('centerDistrict').addEventListener('change', () => {
        currentPage = 1;
        filterCenters();
    });
    document.getElementById('searchInput').addEventListener('input', () => {
        currentPage = 1;
        filterCenters();
    });
}

// ===== DATA LOADING =====
async function loadCenters() {
    try {
        showLoading();
        const response = await fetch(`https://data.vunhat2009.workers.dev/${tableName}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch data from ${tableName}`);
        }
        allCenters = await response.json();
        // Sắp xếp theo id
        allCenters.sort((a, b) => {
            const idA = parseInt(a.id.slice(2), 10);
            const idB = parseInt(b.id.slice(2), 10);
            return idA - idB;
        });
        filteredCenters = [...allCenters]; // Initialize filtered data
        displayCenters();
    } catch (error) {
        console.error('Error loading centers:', error);
        alert('Không thể tải dữ liệu trung tâm. Vui lòng thử lại sau.');
    } finally {
        hideLoading();
    }
}

// ===== DISPLAY FUNCTIONS =====
function displayCenters() {
    const tbody = document.getElementById('centerTableBody');
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredCenters.length);
    const displayedData = filteredCenters.slice(startIndex, endIndex);
    tbody.innerHTML = '';

    displayedData.forEach((center, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${startIndex + index + 1}</td>
            <td>${center.name}</td>
            <td>${formatCenterField(center.field)}</td>
            <td>${center.address}</td>
            <td><span class="center-badge ${formatCenterTypeClass(center.type)}">${formatCenterType(center.type)}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-action btn-view" onclick="viewCenter('${center.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                     <button class="btn btn-action btn-map" onclick="showMap(${center.latitude}, ${center.longitude})">
                        <i class="fas fa-map-marker-alt"></i>
                    </button>
                    <button class="btn btn-action btn-edit" onclick="editCenter('${center.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-action btn-delete" onclick="deleteCenter('${center.id}')">
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
async function filterCenters() {
    try {
        showLoading();
        const filters = {
            field: document.getElementById('centerField').value,
            type: document.getElementById('centerType').value,
            district: document.getElementById('centerDistrict').value,
            search: document.getElementById('searchInput').value.toLowerCase()
        };

        filteredCenters = allCenters.filter(center => {
            let matches = true;

            if (filters.field && center.field !== filters.field) matches = false;
            if (filters.type && center.type !== filters.type) matches = false;
            if (filters.district && center.district !== filters.district) matches = false;

            if (filters.search) {
                const searchMatch =
                    center.name.toLowerCase().includes(filters.search) ||
                    center.address.toLowerCase().includes(filters.search);
                if (!searchMatch) matches = false;
            }

            return matches;
        });

        displayCenters();
    } catch (error) {
        console.error('Lỗi khi lọc dữ liệu trung tâm:', error);
        alert('Có lỗi xảy ra khi lọc dữ liệu trung tâm');
    } finally {
        hideLoading();
    }
}

// ===== CRUD OPERATIONS =====
function viewCenter(id) {
    const center = allCenters.find(i => i.id === id);
    if (!center) {
        alert('Không tìm thấy thông tin trung tâm');
        return;
    }

    const modalContent = `
        <div class="modal-header">
            <h5 class="modal-title">Chi tiết trung tâm nghiên cứu</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
             <div class="row mb-3">
                <div class="col-md-6">
                    <label class="fw-bold">Mã:</label>
                    <p>${center.id}</p>
                 </div>
                  <div class="col-md-6">
                        <label class="fw-bold">Lĩnh vực:</label>
                        <p>${formatCenterField(center.field)}</p>
                 </div>
            </div>
            <div class="mb-3">
                 <label class="fw-bold">Tên trung tâm:</label>
                 <p>${center.name}</p>
            </div>
             <div class="row mb-3">
                 <div class="col-md-6">
                      <label class="fw-bold">Địa chỉ:</label>
                       <p>${center.address}</p>
                 </div>
                   <div class="col-md-6">
                       <label class="fw-bold">Loại hình:</label>
                       <p>${formatCenterType(center.type)}</p>
                   </div>
              </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
        </div>
    `;

    const modalElement = document.getElementById('centerModal');
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

    const modalElement = document.getElementById('centerModal');
    modalElement.querySelector('.modal-content').innerHTML = modalContent;

    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

async function addNewCenter() {
    const newId = generateNextId();
    const modalContent = `
         <div class="modal-header">
             <h5 class="modal-title">Thêm mới trung tâm nghiên cứu</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
            <form id="addCenterForm" class="needs-validation" novalidate>
                 <div class="mb-3">
                    <label class="form-label required">Mã trung tâm</label>
                    <input type="text" class="form-control" name="id" value="${newId}" readonly>
                </div>
                <div class="mb-3">
                    <label class="form-label required">Tên trung tâm</label>
                    <input type="text" class="form-control" name="name" required>
                    <div class="invalid-feedback">Vui lòng nhập tên trung tâm</div>
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
                        <label class="form-label required">Vĩ độ</label>
                        <input type="number" class="form-control" name="latitude" step="any" required>
                        <div class="invalid-feedback">Vui lòng nhập vĩ độ</div>
                   </div>
                    <div class="mb-3">
                        <label class="form-label required">Kinh độ</label>
                         <input type="number" class="form-control" name="longitude" step="any" required>
                         <div class="invalid-feedback">Vui lòng nhập kinh độ</div>
                    </div>
               <div class="mb-3">
                     <label class="form-label required">Loại hình</label>
                     <select class="form-select" name="type" required>
                          <option value="">Chọn loại hình</option>
                          <option value="public">Công lập</option>
                           <option value="private">Tư nhân</option>
                            <option value="joint">Liên kết</option>
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
            </form>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
            <button type="button" class="btn btn-primary" onclick="saveNewCenter()">
                 <i class="fas fa-save me-1"></i>Lưu
             </button>
        </div>
    `;

    const modalElement = document.getElementById('centerModal');
    modalElement.querySelector('.modal-content').innerHTML = modalContent;

    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

async function saveNewCenter() {
    try {
        const form = document.getElementById('addCenterForm');
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }

        showLoading();

        const formData = {
            id: document.querySelector('#addCenterForm [name="id"]').value,
            name: form.querySelector('[name="name"]').value,
            field: form.querySelector('[name="field"]').value,
            address: form.querySelector('[name="address"]').value,
            latitude: parseFloat(form.querySelector('[name="latitude"]').value),
            longitude: parseFloat(form.querySelector('[name="longitude"]').value),
            type: form.querySelector('[name="type"]').value,
            district: form.querySelector('[name="district"]').value,
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
        await loadCenters();

        const modalElement = document.getElementById('centerModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();

        alert('Thêm mới trung tâm thành công!');

    } catch (error) {
        console.error('Lỗi khi thêm mới trung tâm:', error);
        alert('Có lỗi xảy ra khi thêm mới trung tâm');
    } finally {
        hideLoading();
    }
}
// Tạo ID mới
function generateNextId() {
    if (!allCenters || allCenters.length === 0) {
        return "TT001";
    }
    const lastId = allCenters[allCenters.length - 1].id;
    const numericPart = parseInt(lastId.slice(2), 10);
    const nextNumericPart = numericPart + 1;
    return `TT${String(nextNumericPart).padStart(3, '0')}`;
}

function editCenter(id) {
    const center = allCenters.find(i => i.id === id);
    if (!center) {
        alert('Không tìm thấy thông tin trung tâm');
        return;
    }

    const modalContent = `
          <div class="modal-header">
            <h5 class="modal-title">Chỉnh sửa thông tin trung tâm</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
            <form id="editCenterForm" class="needs-validation" novalidate>
                <input type="hidden" name="id" value="${center.id}">
                <div class="mb-3">
                     <label class="form-label required">Tên trung tâm</label>
                     <input type="text" class="form-control" name="name" value="${center.name}" required>
                       <div class="invalid-feedback">Vui lòng nhập tên trung tâm</div>
                </div>
                 <div class="mb-3">
                     <label class="form-label required">Lĩnh vực</label>
                      <select class="form-select" name="field" required>
                        <option value="agriculture" ${center.field === 'agriculture' ? 'selected' : ''}>Nông nghiệp</option>
                        <option value="health" ${center.field === 'health' ? 'selected' : ''}>Y tế</option>
                         <option value="industry" ${center.field === 'industry' ? 'selected' : ''}>Công nghiệp</option>
                         <option value="construction" ${center.field === 'construction' ? 'selected' : ''}>Xây dựng</option>
                        <option value="it" ${center.field === 'it' ? 'selected' : ''}>Công nghệ thông tin</option>
                           <option value="research" ${center.field === 'research' ? 'selected' : ''}>Nghiên cứu</option>
                    </select>
                       <div class="invalid-feedback">Vui lòng chọn lĩnh vực</div>
                </div>
                 <div class="mb-3">
                    <label class="form-label required">Địa chỉ</label>
                    <input type="text" class="form-control" name="address" value="${center.address}" required>
                     <div class="invalid-feedback">Vui lòng nhập địa chỉ</div>
                </div>
                   <div class="mb-3">
                        <label class="form-label required">Vĩ độ</label>
                        <input type="number" class="form-control" name="latitude" step="any" value="${center.latitude}" required>
                        <div class="invalid-feedback">Vui lòng nhập vĩ độ</div>
                   </div>
                    <div class="mb-3">
                        <label class="form-label required">Kinh độ</label>
                         <input type="number" class="form-control" name="longitude" step="any" value="${center.longitude}" required>
                         <div class="invalid-feedback">Vui lòng nhập kinh độ</div>
                    </div>
                 <div class="mb-3">
                      <label class="form-label required">Loại hình</label>
                      <select class="form-select" name="type" required>
                         <option value="public" ${center.type === 'public' ? 'selected' : ''}>Công lập</option>
                           <option value="private" ${center.type === 'private' ? 'selected' : ''}>Tư nhân</option>
                            <option value="joint" ${center.type === 'joint' ? 'selected' : ''}>Liên kết</option>
                      </select>
                    <div class="invalid-feedback">Vui lòng chọn loại hình</div>
                 </div>
                  <div class="mb-3">
                     <label class="form-label required">Quận/Huyện</label>
                      <select class="form-select" name="district" required>
                           <option value="haichau" ${center.district === 'haichau' ? 'selected' : ''}>Hải Châu</option>
                           <option value="thanhkhe" ${center.district === 'thanhkhe' ? 'selected' : ''}>Thanh Khê</option>
                           <option value="sontra" ${center.district === 'sontra' ? 'selected' : ''}>Sơn Trà</option>
                           <option value="nguhanhson" ${center.district === 'nguhanhson' ? 'selected' : ''}>Ngũ Hành Sơn</option>
                           <option value="lienchieu" ${center.district === 'lienchieu' ? 'selected' : ''}>Liên Chiểu</option>
                            <option value="camle" ${center.district === 'camle' ? 'selected' : ''}>Cẩm Lệ</option>
                            <option value="hoavang" ${center.district === 'hoavang' ? 'selected' : ''}>Hòa Vang</option>
                             <option value="hoangsa" ${center.district === 'hoangsa' ? 'selected' : ''}>Hoàng Sa</option>
                    </select>
                     <div class="invalid-feedback">Vui lòng chọn Quận/Huyện</div>
                </div>
            </form>
        </div>
        <div class="modal-footer">
           <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
             <button type="button" class="btn btn-primary" onclick="saveEditedCenter('${center.id}')">
                <i class="fas fa-save me-1"></i>Lưu thay đổi
            </button>
        </div>
    `;

    const modalElement = document.getElementById('centerModal');
    modalElement.querySelector('.modal-content').innerHTML = modalContent;

    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

async function saveEditedCenter(id) {
    try {
        const form = document.getElementById('editCenterForm');
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
            latitude: parseFloat(form.querySelector('[name="latitude"]').value),
            longitude: parseFloat(form.querySelector('[name="longitude"]').value),
            type: form.querySelector('[name="type"]').value,
            district: form.querySelector('[name="district"]').value,
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
        await loadCenters();
        // Sắp xếp lại mảng sau khi edit thành công
        allCenters.sort((a, b) => {
            const idA = parseInt(a.id.slice(2), 10);
            const idB = parseInt(b.id.slice(2), 10);
            return idA - idB;
        });
        displayCenters();

        const modalElement = document.getElementById('centerModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();

        alert('Cập nhật thông tin trung tâm thành công!');

    } catch (error) {
        console.error('Lỗi khi cập nhật thông tin trung tâm:', error);
        alert('Có lỗi xảy ra khi cập nhật thông tin trung tâm');
    } finally {
        hideLoading();
    }
}

async function deleteCenter(id) {
    try {
        const center = allCenters.find(i => i.id === id);
        if (!center) {
            alert('Không tìm thấy thông tin trung tâm');
            return;
        }

        if (!confirm(`Bạn có chắc chắn muốn xóa trung tâm này?\n\n- Mã: ${center.id}\n- Tên trung tâm: ${center.name}`)) {
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
        await loadCenters();

        alert('Xóa trung tâm thành công!');
    } catch (error) {
        console.error('Lỗi khi xóa trung tâm:', error);
        alert('Có lỗi xảy ra khi xóa trung tâm');
    } finally {
        hideLoading();
    }
}
// ===== PAGINATION FUNCTIONS =====
function updatePagination() {
    const totalPages = Math.ceil(filteredCenters.length / itemsPerPage);
    const paginationElement = document.getElementById('pagination');
    const paginationInfo = document.getElementById('paginationInfo');

    // Cập nhật thông tin phân trang
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, filteredCenters.length);
    paginationInfo.textContent = `Hiển thị ${startItem}-${endItem} trong tổng số ${filteredCenters.length} trung tâm`;

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
    const totalPages = Math.ceil(filteredCenters.length / itemsPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        displayCenters();
    }
}
// ===== UTILITY FUNCTIONS =====
function formatCenterField(field) {
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

function formatCenterType(type) {
    const types = {
        public: "Công lập",
        private: "Tư nhân",
        joint: "Liên kết"
    };
    return types[type] || type;
}

function formatCenterTypeClass(type) {
    const types = {
        public: "center-public",
        private: "center-private",
        joint: "center-joint"
    };
    return types[type] || "";
}

function showLoading() {
    document.getElementById('loading-spinner').classList.remove('d-none');
}

function hideLoading() {
    document.getElementById('loading-spinner').classList.add('d-none');
}