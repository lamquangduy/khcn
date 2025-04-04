let allInnovations = [];
let filteredInnovations = [];
const tableName = 'khcn_data_tech_innovation'; // Tên bảng trong Supabase
let currentPage = 1;
const itemsPerPage = 10;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function () {
    loadInnovations();
    initializeEventListeners();
});

// ===== EVENT LISTENERS =====
function initializeEventListeners() {
    // Filter event listeners
    document.getElementById('innovationField').addEventListener('change', () => {
        currentPage = 1;
        filterInnovations();
    });
    document.getElementById('innovationType').addEventListener('change', () => {
        currentPage = 1;
        filterInnovations();
    });
    document.getElementById('searchInput').addEventListener('input', () => {
        currentPage = 1;
        filterInnovations();
    });
}

// ===== DATA LOADING =====
async function loadInnovations() {
    try {
        showLoading();
        const response = await fetch(`https://data.vunhat2009.workers.dev/${tableName}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch data from ${tableName}`);
        }
        allInnovations = await response.json();
        // Sắp xếp theo id
        allInnovations.sort((a, b) => {
            const idA = parseInt(a.id.slice(2), 10);
            const idB = parseInt(b.id.slice(2), 10);
            return idA - idB;
        });
        filteredInnovations = [...allInnovations]; // Initialize filtered data
        displayInnovations();
    } catch (error) {
        console.error('Error loading innovations:', error);
        alert('Không thể tải dữ liệu dự án đổi mới. Vui lòng thử lại sau.');
    } finally {
        hideLoading();
    }
}

// ===== DISPLAY FUNCTIONS =====
function displayInnovations() {
    const tbody = document.getElementById('innovationTableBody');
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredInnovations.length);
    const displayedData = filteredInnovations.slice(startIndex, endIndex);
    tbody.innerHTML = '';

    displayedData.forEach((innovation, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${startIndex + index + 1}</td>
            <td>${innovation.name}</td>
            <td>${formatInnovationField(innovation.field)}</td>
            <td>${innovation.description}</td>
              <td><span class="innovation-badge ${formatInnovationTypeClass(innovation.type)}">${formatInnovationType(innovation.type)}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-action btn-view" onclick="viewInnovation('${innovation.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-action btn-edit" onclick="editInnovation('${innovation.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-action btn-delete" onclick="deleteInnovation('${innovation.id}')">
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
async function filterInnovations() {
    try {
        showLoading();
        const filters = {
            field: document.getElementById('innovationField').value,
            type: document.getElementById('innovationType').value,
            search: document.getElementById('searchInput').value.toLowerCase()
        };

        filteredInnovations = allInnovations.filter(innovation => {
            let matches = true;

            if (filters.field && innovation.field !== filters.field) matches = false;
            if (filters.type && innovation.type !== filters.type) matches = false;

            if (filters.search) {
                const searchMatch =
                    innovation.name.toLowerCase().includes(filters.search) ||
                    innovation.description.toLowerCase().includes(filters.search);
                if (!searchMatch) matches = false;
            }

            return matches;
        });

        displayInnovations();
    } catch (error) {
        console.error('Lỗi khi lọc dữ liệu dự án đổi mới:', error);
        alert('Có lỗi xảy ra khi lọc dữ liệu dự án đổi mới');
    } finally {
        hideLoading();
    }
}

// ===== CRUD OPERATIONS =====
function viewInnovation(id) {
    const innovation = allInnovations.find(i => i.id === id);
    if (!innovation) {
        alert('Không tìm thấy thông tin dự án đổi mới');
        return;
    }

    const modalContent = `
        <div class="modal-header">
             <h5 class="modal-title">Chi tiết dự án đổi mới sáng tạo</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
         </div>
        <div class="modal-body">
             <div class="row mb-3">
                <div class="col-md-6">
                     <label class="fw-bold">Mã:</label>
                     <p>${innovation.id}</p>
                </div>
                 <div class="col-md-6">
                      <label class="fw-bold">Lĩnh vực:</label>
                     <p>${formatInnovationField(innovation.field)}</p>
                 </div>
             </div>
             <div class="mb-3">
                 <label class="fw-bold">Tên dự án:</label>
                 <p>${innovation.name}</p>
             </div>
            <div class="mb-3">
                <label class="fw-bold">Mô tả:</label>
                 <p>${innovation.description}</p>
             </div>
             <div class="mb-3">
               <label class="fw-bold">Loại hình:</label>
                 <p>${formatInnovationType(innovation.type)}</p>
             </div>
       </div>
         <div class="modal-footer">
             <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
        </div>
    `;

    const modalElement = document.getElementById('innovationModal');
    modalElement.querySelector('.modal-content').innerHTML = modalContent;

    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

async function addNewInnovation() {
    const newId = generateNextId();
    const modalContent = `
         <div class="modal-header">
            <h5 class="modal-title">Thêm mới dự án đổi mới sáng tạo</h5>
             <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
         </div>
         <div class="modal-body">
           <form id="addInnovationForm" class="needs-validation" novalidate>
                <div class="mb-3">
                     <label class="form-label required">Mã dự án</label>
                     <input type="text" class="form-control" name="id" value="${newId}" readonly>
                 </div>
                  <div class="mb-3">
                     <label class="form-label required">Tên dự án</label>
                     <input type="text" class="form-control" name="name" required>
                     <div class="invalid-feedback">Vui lòng nhập tên dự án</div>
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
                     </select>
                       <div class="invalid-feedback">Vui lòng chọn lĩnh vực</div>
                </div>
                <div class="mb-3">
                   <label class="form-label">Mô tả</label>
                     <textarea class="form-control" name="description" rows="3"></textarea>
                </div>
                 <div class="mb-3">
                      <label class="form-label required">Loại hình</label>
                      <select class="form-select" name="type" required>
                           <option value="">Chọn loại hình</option>
                           <option value="product">Sản phẩm</option>
                            <option value="process">Quy trình</option>
                             <option value="service">Dịch vụ</option>
                             <option value="solution">Giải pháp</option>
                              <option value="device">Thiết bị</option>
                      </select>
                    <div class="invalid-feedback">Vui lòng chọn loại hình</div>
                 </div>
            </form>
        </div>
       <div class="modal-footer">
           <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
           <button type="button" class="btn btn-primary" onclick="saveNewInnovation()">
              <i class="fas fa-save me-1"></i>Lưu
           </button>
       </div>
    `;

    const modalElement = document.getElementById('innovationModal');
    modalElement.querySelector('.modal-content').innerHTML = modalContent;

    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

async function saveNewInnovation() {
    try {
        const form = document.getElementById('addInnovationForm');
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }

        showLoading();

        const formData = {
            id: document.querySelector('#addInnovationForm [name="id"]').value,
            name: form.querySelector('[name="name"]').value,
            field: form.querySelector('[name="field"]').value,
            description: form.querySelector('[name="description"]').value,
            type: form.querySelector('[name="type"]').value,
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
        await loadInnovations();
        const modalElement = document.getElementById('innovationModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();

        alert('Thêm mới dự án thành công!');

    } catch (error) {
        console.error('Lỗi khi thêm mới dự án đổi mới:', error);
        alert('Có lỗi xảy ra khi thêm mới dự án đổi mới');
    } finally {
        hideLoading();
    }
}
// Tạo ID mới
function generateNextId() {
    if (!allInnovations || allInnovations.length === 0) {
        return "DM001";
    }
    const lastId = allInnovations[allInnovations.length - 1].id;
    const numericPart = parseInt(lastId.slice(2), 10);
    const nextNumericPart = numericPart + 1;
    return `DM${String(nextNumericPart).padStart(3, '0')}`;
}

function editInnovation(id) {
    const innovation = allInnovations.find(i => i.id === id);
    if (!innovation) {
        alert('Không tìm thấy thông tin dự án đổi mới');
        return;
    }

    const modalContent = `
         <div class="modal-header">
            <h5 class="modal-title">Chỉnh sửa thông tin dự án đổi mới</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
           <form id="editInnovationForm" class="needs-validation" novalidate>
               <input type="hidden" name="id" value="${innovation.id}">
                 <div class="mb-3">
                    <label class="form-label required">Tên dự án</label>
                    <input type="text" class="form-control" name="name" value="${innovation.name}" required>
                   <div class="invalid-feedback">Vui lòng nhập tên dự án</div>
                </div>
                <div class="mb-3">
                      <label class="form-label required">Lĩnh vực</label>
                       <select class="form-select" name="field" required>
                         <option value="agriculture" ${innovation.field === 'agriculture' ? 'selected' : ''}>Nông nghiệp</option>
                        <option value="health" ${innovation.field === 'health' ? 'selected' : ''}>Y tế</option>
                        <option value="industry" ${innovation.field === 'industry' ? 'selected' : ''}>Công nghiệp</option>
                        <option value="construction" ${innovation.field === 'construction' ? 'selected' : ''}>Xây dựng</option>
                       <option value="it" ${innovation.field === 'it' ? 'selected' : ''}>Công nghệ thông tin</option>
                    </select>
                    <div class="invalid-feedback">Vui lòng chọn lĩnh vực</div>
                </div>
                 <div class="mb-3">
                      <label class="form-label">Mô tả</label>
                     <textarea class="form-control" name="description" rows="3">${innovation.description}</textarea>
                 </div>
                <div class="mb-3">
                    <label class="form-label required">Loại hình</label>
                    <select class="form-select" name="type" required>
                          <option value="product" ${innovation.type === 'product' ? 'selected' : ''}>Sản phẩm</option>
                            <option value="process" ${innovation.type === 'process' ? 'selected' : ''}>Quy trình</option>
                            <option value="service" ${innovation.type === 'service' ? 'selected' : ''}>Dịch vụ</option>
                            <option value="solution" ${innovation.type === 'solution' ? 'selected' : ''}>Giải pháp</option>
                            <option value="device" ${innovation.type === 'device' ? 'selected' : ''}>Thiết bị</option>
                    </select>
                     <div class="invalid-feedback">Vui lòng chọn loại hình</div>
                </div>
            </form>
        </div>
        <div class="modal-footer">
           <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
           <button type="button" class="btn btn-primary" onclick="saveEditedInnovation('${innovation.id}')">
               <i class="fas fa-save me-1"></i>Lưu thay đổi
            </button>
       </div>
    `;

    const modalElement = document.getElementById('innovationModal');
    modalElement.querySelector('.modal-content').innerHTML = modalContent;

    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

async function saveEditedInnovation(id) {
    try {
        const form = document.getElementById('editInnovationForm');
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }

        showLoading();

        const formData = {
            id: id,
            name: form.querySelector('[name="name"]').value,
            field: form.querySelector('[name="field"]').value,
            description: form.querySelector('[name="description"]').value,
            type: form.querySelector('[name="type"]').value,
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
        await loadInnovations();
        // Sắp xếp lại mảng sau khi edit thành công
        allInnovations.sort((a, b) => {
            const idA = parseInt(a.id.slice(2), 10);
            const idB = parseInt(b.id.slice(2), 10);
            return idA - idB;
        });
        displayInnovations();

        const modalElement = document.getElementById('innovationModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();

        alert('Cập nhật thông tin dự án thành công!');
    } catch (error) {
        console.error('Lỗi khi cập nhật thông tin dự án đổi mới:', error);
        alert('Có lỗi xảy ra khi cập nhật thông tin dự án đổi mới');
    } finally {
        hideLoading();
    }
}

async function deleteInnovation(id) {
    try {
        const innovation = allInnovations.find(i => i.id === id);
        if (!innovation) {
            alert('Không tìm thấy thông tin dự án đổi mới');
            return;
        }

        if (!confirm(`Bạn có chắc chắn muốn xóa dự án này?\n\n- Mã: ${innovation.id}\n- Tên dự án: ${innovation.name}`)) {
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
        await loadInnovations();

        alert('Xóa dự án thành công!');

    } catch (error) {
        console.error('Lỗi khi xóa dự án đổi mới:', error);
        alert('Có lỗi xảy ra khi xóa dự án đổi mới');
    } finally {
        hideLoading();
    }
}
// ===== PAGINATION FUNCTIONS =====
function updatePagination() {
    const totalPages = Math.ceil(filteredInnovations.length / itemsPerPage);
    const paginationElement = document.getElementById('pagination');
    const paginationInfo = document.getElementById('paginationInfo');

    // Cập nhật thông tin phân trang
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, filteredInnovations.length);
    paginationInfo.textContent = `Hiển thị ${startItem}-${endItem} trong tổng số ${filteredInnovations.length} dự án`;

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
    const totalPages = Math.ceil(filteredInnovations.length / itemsPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        displayInnovations();
    }
}
// ===== UTILITY FUNCTIONS =====
function formatInnovationField(field) {
    const fields = {
        agriculture: "Nông nghiệp",
        health: "Y tế",
        industry: "Công nghiệp",
        construction: "Xây dựng",
        it: "Công nghệ thông tin"
    };
    return fields[field] || field;
}
function formatInnovationType(type) {
    const types = {
        product: "Sản phẩm",
        process: "Quy trình",
        service: "Dịch vụ",
        solution: "Giải pháp",
        device: "Thiết bị"
    };
    return types[type] || type;
}
function formatInnovationTypeClass(type) {
    const types = {
        product: "innovation-product",
        process: "innovation-process",
        service: "innovation-service",
        solution: "innovation-solution",
        device: "innovation-device"
    };
    return types[type] || "";
}
function showLoading() {
    document.getElementById('loading-spinner').classList.remove('d-none');
}

function hideLoading() {
    document.getElementById('loading-spinner').classList.add('d-none');
}