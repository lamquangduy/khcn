let allProjects = [];
let filteredProjects = [];
const tableName = 'khcn_data_project'; // Tên bảng trong Supabase
let currentPage = 1;
const itemsPerPage = 10;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function () {
    loadProjects();
    initializeEventListeners();
});

// ===== EVENT LISTENERS =====
function initializeEventListeners() {
    // Filter event listeners
    document.getElementById('projectField').addEventListener('change', () => {
        currentPage = 1;
        filterProjects();
    });
    document.getElementById('projectStatus').addEventListener('change', () => {
        currentPage = 1;
        filterProjects();
    });
    document.getElementById('searchInput').addEventListener('input', () => {
        currentPage = 1;
        filterProjects();
    });
}

// ===== DATA LOADING =====
async function loadProjects() {
    try {
        showLoading();
        const response = await fetch(`https://data.vunhat2009.workers.dev/${tableName}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch data from ${tableName}`);
        }
        allProjects = await response.json();
        // Sắp xếp theo id
        allProjects.sort((a, b) => {
            const idA = parseInt(a.id.slice(2), 10);
            const idB = parseInt(b.id.slice(2), 10);
            return idA - idB;
        });
        filteredProjects = [...allProjects]; // Initialize filtered data
        displayProjects();
    } catch (error) {
        console.error('Error loading projects:', error);
        alert('Không thể tải dữ liệu dự án. Vui lòng thử lại sau.');
    } finally {
        hideLoading();
    }
}

// ===== DISPLAY FUNCTIONS =====
function displayProjects() {
    const tbody = document.getElementById('projectTableBody');
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredProjects.length);
    const displayedData = filteredProjects.slice(startIndex, endIndex);
    tbody.innerHTML = '';

    displayedData.forEach((project, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
           <td>${startIndex + index + 1}</td>
            <td>${project.name}</td>
             <td>${formatProjectField(project.field)}</td>
            <td>${project.principal}</td>
            <td>${formatCurrency(project.budget)}</td>
            <td><span class="status-badge ${formatProjectStatusClass(project.status)}">${formatProjectStatus(project.status)}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-action btn-view" onclick="viewProject('${project.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-action btn-edit" onclick="editProject('${project.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-action btn-delete" onclick="deleteProject('${project.id}')">
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
async function filterProjects() {
    try {
        showLoading();
        const filters = {
            field: document.getElementById('projectField').value,
            status: document.getElementById('projectStatus').value,
            search: document.getElementById('searchInput').value.toLowerCase()
        };

        filteredProjects = allProjects.filter(project => {
            let matches = true;

            if (filters.field && project.field !== filters.field) matches = false;
            if (filters.status && project.status !== filters.status) matches = false;


            if (filters.search) {
                const searchMatch =
                    project.name.toLowerCase().includes(filters.search) ||
                    project.principal.toLowerCase().includes(filters.search);
                if (!searchMatch) matches = false;
            }
            return matches;
        });

        displayProjects();
    } catch (error) {
        console.error('Lỗi khi lọc dữ liệu dự án:', error);
        alert('Có lỗi xảy ra khi lọc dữ liệu dự án');
    } finally {
        hideLoading();
    }
}

// ===== CRUD OPERATIONS =====
function viewProject(id) {
    const project = allProjects.find(i => i.id === id);
    if (!project) {
        alert('Không tìm thấy thông tin dự án');
        return;
    }

    const modalContent = `
        <div class="modal-header">
            <h5 class="modal-title">Chi tiết dự án nghiên cứu</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
             <div class="row mb-3">
                <div class="col-md-6">
                    <label class="fw-bold">Mã:</label>
                    <p>${project.id}</p>
                </div>
                 <div class="col-md-6">
                    <label class="fw-bold">Lĩnh vực:</label>
                    <p>${formatProjectField(project.field)}</p>
                </div>
             </div>
            <div class="mb-3">
                <label class="fw-bold">Tên dự án:</label>
                <p>${project.name}</p>
            </div>
             <div class="row mb-3">
                <div class="col-md-6">
                    <label class="fw-bold">Chủ nhiệm:</label>
                   <p>${project.principal}</p>
               </div>
               <div class="col-md-6">
                    <label class="fw-bold">Kinh phí:</label>
                    <p>${formatCurrency(project.budget)}</p>
                </div>
            </div>
             <div class="mb-3">
                <label class="fw-bold">Trạng thái:</label>
                 <p>${formatProjectStatus(project.status)}</p>
            </div>
        </div>
         <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
        </div>
    `;

    const modalElement = document.getElementById('projectModal');
    modalElement.querySelector('.modal-content').innerHTML = modalContent;

    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

async function addNewProject() {
    const newId = generateNextId();
    const modalContent = `
        <div class="modal-header">
            <h5 class="modal-title">Thêm mới dự án nghiên cứu</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
            <form id="addProjectForm" class="needs-validation" novalidate>
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
                     <label class="form-label required">Chủ nhiệm</label>
                     <input type="text" class="form-control" name="principal" required>
                      <div class="invalid-feedback">Vui lòng nhập chủ nhiệm</div>
                 </div>
                 <div class="mb-3">
                     <label class="form-label required">Kinh phí</label>
                     <input type="number" class="form-control" name="budget" required>
                     <div class="invalid-feedback">Vui lòng nhập kinh phí</div>
                </div>
                <div class="mb-3">
                   <label class="form-label required">Trạng thái</label>
                     <select class="form-select" name="status" required>
                        <option value="">Chọn trạng thái</option>
                        <option value="pending">Đang thực hiện</option>
                         <option value="completed">Đã hoàn thành</option>
                          <option value="cancelled">Đã hủy</option>
                    </select>
                    <div class="invalid-feedback">Vui lòng chọn trạng thái</div>
                 </div>
            </form>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
             <button type="button" class="btn btn-primary" onclick="saveNewProject()">
                <i class="fas fa-save me-1"></i>Lưu
            </button>
        </div>
    `;

    const modalElement = document.getElementById('projectModal');
    modalElement.querySelector('.modal-content').innerHTML = modalContent;

    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

async function saveNewProject() {
    try {
        const form = document.getElementById('addProjectForm');
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }

        showLoading();

        const formData = {
            id: document.querySelector('#addProjectForm [name="id"]').value,
            name: form.querySelector('[name="name"]').value,
            field: form.querySelector('[name="field"]').value,
            principal: form.querySelector('[name="principal"]').value,
            budget: form.querySelector('[name="budget"]').value,
            status: form.querySelector('[name="status"]').value,
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
        await loadProjects();
        const modalElement = document.getElementById('projectModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();

        alert('Thêm mới dự án thành công!');

    } catch (error) {
        console.error('Lỗi khi thêm mới dự án:', error);
        alert('Có lỗi xảy ra khi thêm mới dự án');
    } finally {
        hideLoading();
    }
}
// Tạo ID mới
function generateNextId() {
    if (!allProjects || allProjects.length === 0) {
        return "DA001";
    }
    const lastId = allProjects[allProjects.length - 1].id;
    const numericPart = parseInt(lastId.slice(2), 10);
    const nextNumericPart = numericPart + 1;
    return `DA${String(nextNumericPart).padStart(3, '0')}`;
}

function editProject(id) {
    const project = allProjects.find(i => i.id === id);
    if (!project) {
        alert('Không tìm thấy thông tin dự án');
        return;
    }

    const modalContent = `
        <div class="modal-header">
            <h5 class="modal-title">Chỉnh sửa thông tin dự án</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
         <div class="modal-body">
            <form id="editProjectForm" class="needs-validation" novalidate>
                <input type="hidden" name="id" value="${project.id}">
                <div class="mb-3">
                    <label class="form-label required">Tên dự án</label>
                    <input type="text" class="form-control" name="name" value="${project.name}" required>
                    <div class="invalid-feedback">Vui lòng nhập tên dự án</div>
                </div>
               <div class="mb-3">
                    <label class="form-label required">Lĩnh vực</label>
                   <select class="form-select" name="field" required>
                        <option value="agriculture" ${project.field === 'agriculture' ? 'selected' : ''}>Nông nghiệp</option>
                        <option value="health" ${project.field === 'health' ? 'selected' : ''}>Y tế</option>
                         <option value="industry" ${project.field === 'industry' ? 'selected' : ''}>Công nghiệp</option>
                         <option value="construction" ${project.field === 'construction' ? 'selected' : ''}>Xây dựng</option>
                        <option value="it" ${project.field === 'it' ? 'selected' : ''}>Công nghệ thông tin</option>
                    </select>
                     <div class="invalid-feedback">Vui lòng chọn lĩnh vực</div>
                </div>
                 <div class="mb-3">
                     <label class="form-label required">Chủ nhiệm</label>
                    <input type="text" class="form-control" name="principal" value="${project.principal}" required>
                     <div class="invalid-feedback">Vui lòng nhập chủ nhiệm</div>
                </div>
                 <div class="mb-3">
                     <label class="form-label required">Kinh phí</label>
                    <input type="number" class="form-control" name="budget" value="${project.budget}" required>
                   <div class="invalid-feedback">Vui lòng nhập kinh phí</div>
                </div>
                <div class="mb-3">
                   <label class="form-label required">Trạng thái</label>
                    <select class="form-select" name="status" required>
                         <option value="pending" ${project.status === 'pending' ? 'selected' : ''}>Đang thực hiện</option>
                         <option value="completed" ${project.status === 'completed' ? 'selected' : ''}>Đã hoàn thành</option>
                        <option value="cancelled" ${project.status === 'cancelled' ? 'selected' : ''}>Đã hủy</option>
                    </select>
                     <div class="invalid-feedback">Vui lòng chọn trạng thái</div>
                 </div>
            </form>
        </div>
       <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
             <button type="button" class="btn btn-primary" onclick="saveEditedProject('${project.id}')">
                <i class="fas fa-save me-1"></i>Lưu thay đổi
            </button>
        </div>
    `;

    const modalElement = document.getElementById('projectModal');
    modalElement.querySelector('.modal-content').innerHTML = modalContent;

    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}


async function saveEditedProject(id) {
    try {
        const form = document.getElementById('editProjectForm');
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }

        showLoading();

        const formData = {
            id: id,
            name: form.querySelector('[name="name"]').value,
            field: form.querySelector('[name="field"]').value,
            principal: form.querySelector('[name="principal"]').value,
            budget: form.querySelector('[name="budget"]').value,
            status: form.querySelector('[name="status"]').value,
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
        await loadProjects();
        // Sắp xếp lại mảng sau khi edit thành công
        allProjects.sort((a, b) => {
            const idA = parseInt(a.id.slice(2), 10);
            const idB = parseInt(b.id.slice(2), 10);
            return idA - idB;
        });
        displayProjects()
        const modalElement = document.getElementById('projectModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();

        alert('Cập nhật thông tin dự án thành công!');

    } catch (error) {
        console.error('Lỗi khi cập nhật thông tin dự án:', error);
        alert('Có lỗi xảy ra khi cập nhật thông tin dự án');
    } finally {
        hideLoading();
    }
}


async function deleteProject(id) {
    try {
        const project = allProjects.find(i => i.id === id);
        if (!project) {
            alert('Không tìm thấy thông tin dự án');
            return;
        }

        if (!confirm(`Bạn có chắc chắn muốn xóa dự án này?\n\n- Mã: ${project.id}\n- Tên dự án: ${project.name}`)) {
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
        await loadProjects();

        alert('Xóa dự án thành công!');

    } catch (error) {
        console.error('Lỗi khi xóa dự án:', error);
        alert('Có lỗi xảy ra khi xóa dự án');
    } finally {
        hideLoading();
    }
}
// ===== PAGINATION FUNCTIONS =====
function updatePagination() {
    const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
    const paginationElement = document.getElementById('pagination');
    const paginationInfo = document.getElementById('paginationInfo');

    // Cập nhật thông tin phân trang
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, filteredProjects.length);
    paginationInfo.textContent = `Hiển thị ${startItem}-${endItem} trong tổng số ${filteredProjects.length} dự án`;

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
    const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        displayProjects();
    }
}

// ===== UTILITY FUNCTIONS =====
function formatProjectField(field) {
    const fields = {
        agriculture: "Nông nghiệp",
        health: "Y tế",
        industry: "Công nghiệp",
        construction: "Xây dựng",
        it: "Công nghệ thông tin"
    };
    return fields[field] || field;
}
function formatProjectStatus(status) {
    const statuses = {
        pending: "Đang thực hiện",
        completed: "Đã hoàn thành",
        cancelled: "Đã hủy"
    };
    return statuses[status] || status;
}

function formatProjectStatusClass(status) {
    const statuses = {
        pending: "status-pending",
        completed: "status-completed",
        cancelled: "status-cancelled"
    };
    return statuses[status] || "";
}


function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}


function showLoading() {
    document.getElementById('loading-spinner').classList.remove('d-none');
}

function hideLoading() {
    document.getElementById('loading-spinner').classList.add('d-none');
}