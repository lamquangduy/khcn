let allLabs = [];
let filteredLabs = [];
const tableName = 'khcn_data_lab'; // Tên bảng trong Supabase
let currentPage = 1;
const itemsPerPage = 10;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function () {
    loadLabs();
    initializeEventListeners();
});

// ===== EVENT LISTENERS =====
function initializeEventListeners() {
    // Filter event listeners
    document.getElementById('labField').addEventListener('change', () => {
        currentPage = 1;
        filterLabs();
    });
    document.getElementById('labType').addEventListener('change', () => {
        currentPage = 1;
        filterLabs();
    });
    document.getElementById('labDistrict').addEventListener('change', () => {
        currentPage = 1;
        filterLabs();
    });
    document.getElementById('searchInput').addEventListener('input', () => {
        currentPage = 1;
        filterLabs();
    });
}

// ===== DATA LOADING =====
async function loadLabs() {
    try {
        showLoading();
        const response = await fetch(`https://data.vunhat2009.workers.dev/${tableName}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch data from ${tableName}`);
        }
        allLabs = await response.json();
        // Sắp xếp theo id
        allLabs.sort((a, b) => {
            const idA = parseInt(a.id.slice(3), 10);
            const idB = parseInt(b.id.slice(3), 10);
            return idA - idB;
        });
        filteredLabs = [...allLabs]; // Initialize filtered data
        displayLabs();
    } catch (error) {
        console.error('Error loading labs:', error);
        alert('Không thể tải dữ liệu phòng thí nghiệm. Vui lòng thử lại sau.');
    } finally {
        hideLoading();
    }
}

// ===== DISPLAY FUNCTIONS =====
function displayLabs() {
    const tbody = document.getElementById('labTableBody');
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredLabs.length);
    const displayedData = filteredLabs.slice(startIndex, endIndex);
    tbody.innerHTML = '';

    displayedData.forEach((lab, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${startIndex + index + 1}</td>
            <td>${lab.name}</td>
              <td>${formatLabField(lab.field)}</td>
            <td>${lab.address}</td>
            <td><span class="lab-badge ${formatLabTypeClass(lab.type)}">${formatLabType(lab.type)}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-action btn-view" onclick="viewLab('${lab.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                     <button class="btn btn-action btn-map" onclick="showMap(${lab.latitude}, ${lab.longitude})">
                        <i class="fas fa-map-marker-alt"></i>
                    </button>
                    <button class="btn btn-action btn-edit" onclick="editLab('${lab.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-action btn-delete" onclick="deleteLab('${lab.id}')">
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
async function filterLabs() {
    try {
        showLoading();
        const filters = {
            field: document.getElementById('labField').value,
            type: document.getElementById('labType').value,
            district: document.getElementById('labDistrict').value,
            search: document.getElementById('searchInput').value.toLowerCase()
        };

        filteredLabs = allLabs.filter(lab => {
            let matches = true;

            if (filters.field && lab.field !== filters.field) matches = false;
            if (filters.type && lab.type !== filters.type) matches = false;
            if (filters.district && lab.district !== filters.district) matches = false;

            if (filters.search) {
                const searchMatch =
                    lab.name.toLowerCase().includes(filters.search) ||
                    lab.address.toLowerCase().includes(filters.search);
                if (!searchMatch) matches = false;
            }

            return matches;
        });

        displayLabs();
    } catch (error) {
        console.error('Lỗi khi lọc dữ liệu phòng thí nghiệm:', error);
        alert('Có lỗi xảy ra khi lọc dữ liệu phòng thí nghiệm');
    } finally {
        hideLoading();
    }
}

// ===== CRUD OPERATIONS =====
function viewLab(id) {
    const lab = allLabs.find(i => i.id === id);
    if (!lab) {
        alert('Không tìm thấy thông tin phòng thí nghiệm');
        return;
    }

    const modalContent = `
        <div class="modal-header">
             <h5 class="modal-title">Chi tiết phòng thí nghiệm</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
         </div>
         <div class="modal-body">
             <div class="row mb-3">
                <div class="col-md-6">
                     <label class="fw-bold">Mã:</label>
                    <p>${lab.id}</p>
                 </div>
                  <div class="col-md-6">
                        <label class="fw-bold">Lĩnh vực:</label>
                       <p>${formatLabField(lab.field)}</p>
                  </div>
             </div>
             <div class="mb-3">
                <label class="fw-bold">Tên phòng thí nghiệm:</label>
                <p>${lab.name}</p>
           </div>
             <div class="row mb-3">
                <div class="col-md-6">
                     <label class="fw-bold">Địa chỉ:</label>
                     <p>${lab.address}</p>
                </div>
                 <div class="col-md-6">
                      <label class="fw-bold">Loại hình:</label>
                      <p>${formatLabType(lab.type)}</p>
                 </div>
            </div>
        </div>
         <div class="modal-footer">
           <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
         </div>
    `;

    const modalElement = document.getElementById('labModal');
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

    const modalElement = document.getElementById('labModal');
    modalElement.querySelector('.modal-content').innerHTML = modalContent;

    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

async function addNewLab() {
    const newId = generateNextId();
    const modalContent = `
        <div class="modal-header">
            <h5 class="modal-title">Thêm mới phòng thí nghiệm</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
         </div>
         <div class="modal-body">
            <form id="addLabForm" class="needs-validation" novalidate>
                  <div class="mb-3">
                     <label class="form-label required">Mã phòng thí nghiệm</label>
                     <input type="text" class="form-control" name="id" value="${newId}" readonly>
                 </div>
                  <div class="mb-3">
                     <label class="form-label required">Tên phòng thí nghiệm</label>
                    <input type="text" class="form-control" name="name" required>
                     <div class="invalid-feedback">Vui lòng nhập tên phòng thí nghiệm</div>
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
                           <option value="general">Đa năng</option>
                           <option value="specialized">Chuyên dụng</option>
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
            <button type="button" class="btn btn-primary" onclick="saveNewLab()">
               <i class="fas fa-save me-1"></i>Lưu
            </button>
        </div>
    `;

    const modalElement = document.getElementById('labModal');
    modalElement.querySelector('.modal-content').innerHTML = modalContent;

    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

async function saveNewLab() {
    try {
        const form = document.getElementById('addLabForm');
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }
        showLoading();

        const formData = {
            id: document.querySelector('#addLabForm [name="id"]').value,
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
        await loadLabs();

        const modalElement = document.getElementById('labModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();

        alert('Thêm mới phòng thí nghiệm thành công!');
    } catch (error) {
        console.error('Lỗi khi thêm mới phòng thí nghiệm:', error);
        alert('Có lỗi xảy ra khi thêm mới phòng thí nghiệm');
    } finally {
        hideLoading();
    }
}
// Tạo ID mới
function generateNextId() {
    if (!allLabs || allLabs.length === 0) {
        return "PTN001";
    }
    const lastId = allLabs[allLabs.length - 1].id;
    const numericPart = parseInt(lastId.slice(3), 10);
    const nextNumericPart = numericPart + 1;
    return `PTN${String(nextNumericPart).padStart(3, '0')}`;
}

function editLab(id) {
    const lab = allLabs.find(i => i.id === id);
    if (!lab) {
        alert('Không tìm thấy thông tin phòng thí nghiệm');
        return;
    }

    const modalContent = `
          <div class="modal-header">
               <h5 class="modal-title">Chỉnh sửa thông tin phòng thí nghiệm</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
         </div>
         <div class="modal-body">
             <form id="editLabForm" class="needs-validation" novalidate>
                 <input type="hidden" name="id" value="${lab.id}">
                <div class="mb-3">
                     <label class="form-label required">Tên phòng thí nghiệm</label>
                    <input type="text" class="form-control" name="name" value="${lab.name}" required>
                     <div class="invalid-feedback">Vui lòng nhập tên phòng thí nghiệm</div>
                 </div>
                  <div class="mb-3">
                      <label class="form-label required">Lĩnh vực</label>
                       <select class="form-select" name="field" required>
                        <option value="agriculture" ${lab.field === 'agriculture' ? 'selected' : ''}>Nông nghiệp</option>
                         <option value="health" ${lab.field === 'health' ? 'selected' : ''}>Y tế</option>
                        <option value="industry" ${lab.field === 'industry' ? 'selected' : ''}>Công nghiệp</option>
                       <option value="construction" ${lab.field === 'construction' ? 'selected' : ''}>Xây dựng</option>
                       <option value="it" ${lab.field === 'it' ? 'selected' : ''}>Công nghệ thông tin</option>
                        <option value="research" ${lab.field === 'research' ? 'selected' : ''}>Nghiên cứu</option>
                    </select>
                     <div class="invalid-feedback">Vui lòng chọn lĩnh vực</div>
                </div>
                  <div class="mb-3">
                     <label class="form-label required">Địa chỉ</label>
                      <input type="text" class="form-control" name="address" value="${lab.address}" required>
                     <div class="invalid-feedback">Vui lòng nhập địa chỉ</div>
                  </div>
                   <div class="mb-3">
                        <label class="form-label required">Vĩ độ</label>
                        <input type="number" class="form-control" name="latitude" step="any" value="${lab.latitude}" required>
                        <div class="invalid-feedback">Vui lòng nhập vĩ độ</div>
                   </div>
                    <div class="mb-3">
                        <label class="form-label required">Kinh độ</label>
                         <input type="number" class="form-control" name="longitude" step="any" value="${lab.longitude}" required>
                         <div class="invalid-feedback">Vui lòng nhập kinh độ</div>
                    </div>
                 <div class="mb-3">
                      <label class="form-label required">Loại hình</label>
                       <select class="form-select" name="type" required>
                        <option value="general" ${lab.type === 'general' ? 'selected' : ''}>Đa năng</option>
                       <option value="specialized" ${lab.type === 'specialized' ? 'selected' : ''}>Chuyên dụng</option>
                   </select>
                      <div class="invalid-feedback">Vui lòng chọn loại hình</div>
                </div>
                  <div class="mb-3">
                     <label class="form-label required">Quận/Huyện</label>
                     <select class="form-select" name="district" required>
                        <option value="haichau" ${lab.district === 'haichau' ? 'selected' : ''}>Hải Châu</option>
                           <option value="thanhkhe" ${lab.district === 'thanhkhe' ? 'selected' : ''}>Thanh Khê</option>
                           <option value="sontra" ${lab.district === 'sontra' ? 'selected' : ''}>Sơn Trà</option>
                           <option value="nguhanhson" ${lab.district === 'nguhanhson' ? 'selected' : ''}>Ngũ Hành Sơn</option>
                           <option value="lienchieu" ${lab.district === 'lienchieu' ? 'selected' : ''}>Liên Chiểu</option>
                           <option value="camle" ${lab.district === 'camle' ? 'selected' : ''}>Cẩm Lệ</option>
                            <option value="hoavang" ${lab.district === 'hoavang' ? 'selected' : ''}>Hòa Vang</option>
                            <option value="hoangsa" ${lab.district === 'hoangsa' ? 'selected' : ''}>Hoàng Sa</option>
                    </select>
                     <div class="invalid-feedback">Vui lòng chọn Quận/Huyện</div>
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
            <button type="button" class="btn btn-primary" onclick="saveEditedLab('${lab.id}')">
                <i class="fas fa-save me-1"></i>Lưu thay đổi
            </button>
        </div>
    `;

    const modalElement = document.getElementById('labModal');
    modalElement.querySelector('.modal-content').innerHTML = modalContent;

    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

async function saveEditedLab(id) {
    try {
        const form = document.getElementById('editLabForm');
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
        await loadLabs();
        // Sắp xếp lại mảng sau khi edit thành công
        allLabs.sort((a, b) => {
            const idA = parseInt(a.id.slice(3), 10);
            const idB = parseInt(b.id.slice(3), 10);
            return idA - idB;
        });
        displayLabs();

        const modalElement = document.getElementById('labModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();

        alert('Cập nhật thông tin phòng thí nghiệm thành công!');
    } catch (error) {
        console.error('Lỗi khi cập nhật thông tin phòng thí nghiệm:', error);
        alert('Có lỗi xảy ra khi cập nhật thông tin phòng thí nghiệm');
    } finally {
        hideLoading();
    }
}

async function deleteLab(id) {
    try {
        const lab = allLabs.find(i => i.id === id);
        if (!lab) {
            alert('Không tìm thấy thông tin phòng thí nghiệm');
            return;
        }

        if (!confirm(`Bạn có chắc chắn muốn xóa phòng thí nghiệm này?\n\n- Mã: ${lab.id}\n- Tên phòng thí nghiệm: ${lab.name}`)) {
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
        await loadLabs();

        alert('Xóa phòng thí nghiệm thành công!');
    } catch (error) {
        console.error('Lỗi khi xóa phòng thí nghiệm:', error);
        alert('Có lỗi xảy ra khi xóa phòng thí nghiệm');
    } finally {
        hideLoading();
    }
}
// ===== PAGINATION FUNCTIONS =====
function updatePagination() {
    const totalPages = Math.ceil(filteredLabs.length / itemsPerPage);
    const paginationElement = document.getElementById('pagination');
    const paginationInfo = document.getElementById('paginationInfo');

    // Cập nhật thông tin phân trang
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, filteredLabs.length);
    paginationInfo.textContent = `Hiển thị ${startItem}-${endItem} trong tổng số ${filteredLabs.length} phòng thí nghiệm`;

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
    const totalPages = Math.ceil(filteredLabs.length / itemsPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        displayLabs();
    }
}
// ===== UTILITY FUNCTIONS =====
function formatLabField(field) {
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
function formatLabType(type) {
    const types = {
        general: "Đa năng",
        specialized: "Chuyên dụng"
    };
    return types[type] || type;
}
function formatLabTypeClass(type) {
    const types = {
        general: "lab-general",
        specialized: "lab-specialized"
    };
    return types[type] || "";
}

function showLoading() {
    document.getElementById('loading-spinner').classList.remove('d-none');
}

function hideLoading() {
    document.getElementById('loading-spinner').classList.add('d-none');
}