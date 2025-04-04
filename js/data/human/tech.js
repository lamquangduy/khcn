let allTechs = [];
let filteredTechs = [];
const tableName = 'khcn_data_human_tech'; // Tên bảng trong Supabase
let currentPage = 1;
const itemsPerPage = 10;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    loadTechs();
    initializeEventListeners();
});

// ===== EVENT LISTENERS =====
function initializeEventListeners() {
    // Filter event listeners
    document.getElementById('techField').addEventListener('change', () => {
        currentPage = 1;
        filterTechs();
    });
    document.getElementById('techExperience').addEventListener('change', () => {
        currentPage = 1;
        filterTechs();
    });
    document.getElementById('searchInput').addEventListener('input', () => {
        currentPage = 1;
        filterTechs();
    });
}

// ===== DATA LOADING =====
async function loadTechs() {
    try {
        showLoading();
        const response = await fetch(`https://data.vunhat2009.workers.dev/${tableName}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch data from ${tableName}`);
        }
        allTechs = await response.json();
        // Sắp xếp theo id
        allTechs.sort((a, b) => {
            const idA = parseInt(a.id.slice(3), 10);
            const idB = parseInt(b.id.slice(3), 10);
            return idA - idB;
        });
        filteredTechs = [...allTechs]; // Initialize filtered data
        displayTechs();
    } catch (error) {
        console.error('Error loading techs:', error);
        alert('Không thể tải dữ liệu kỹ thuật viên. Vui lòng thử lại sau.');
    } finally {
        hideLoading();
    }
}

// ===== DISPLAY FUNCTIONS =====
function displayTechs() {
    const tbody = document.getElementById('techTableBody');
    if (!tbody) {
        console.error("Không tìm thấy phần tử tbody có id 'techTableBody'");
        return;
    }
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredTechs.length);
    const displayedData = filteredTechs.slice(startIndex, endIndex);
    tbody.innerHTML = '';

    displayedData.forEach((tech, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
             <td>${startIndex + index + 1}</td>
             <td>${tech.name}</td>
            <td>${formatTechField(tech.field)}</td>
            <td>${tech.workplace}</td>
             <td><span class="experience-badge ${formatTechExperienceClass(tech.experience)}">${formatTechExperience(tech.experience)}</span></td>
             <td>
                <div class="action-buttons">
                    <button class="btn btn-action btn-view" onclick="viewTech('${tech.id}')">
                         <i class="fas fa-eye"></i>
                    </button>
                     <button class="btn btn-action btn-edit" onclick="editTech('${tech.id}')">
                        <i class="fas fa-edit"></i>
                   </button>
                    <button class="btn btn-action btn-delete" onclick="deleteTech('${tech.id}')">
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
async function filterTechs() {
    try {
        showLoading();
        const filters = {
            field: document.getElementById('techField').value,
            experience: document.getElementById('techExperience').value,
            search: document.getElementById('searchInput').value.toLowerCase()
        };

        filteredTechs = allTechs.filter(tech => {
            let matches = true;
            if (filters.field && tech.field !== filters.field) matches = false;
            if (filters.experience && tech.experience !== filters.experience) matches = false;

            if (filters.search) {
                const searchMatch =
                    tech.name.toLowerCase().includes(filters.search) ||
                    tech.workplace.toLowerCase().includes(filters.search);
                if (!searchMatch) matches = false;
            }
            return matches;
        });

        displayTechs(); // Truyền filteredTechs vào hàm displayTechs
    } catch (error) {
        console.error('Lỗi khi lọc dữ liệu kỹ thuật viên:', error);
        alert('Có lỗi xảy ra khi lọc dữ liệu kỹ thuật viên');
    } finally {
        hideLoading();
    }
}

// ===== CRUD OPERATIONS =====
function viewTech(id) {
    const tech = allTechs.find(i => i.id === id);
    if (!tech) {
        alert('Không tìm thấy thông tin kỹ thuật viên');
        return;
    }

    const modalContent = `
        <div class="modal-header">
            <h5 class="modal-title">Chi tiết kỹ thuật viên</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
            <div class="row mb-3">
                <div class="col-md-6">
                    <label class="fw-bold">Mã:</label>
                    <p>${tech.id}</p>
                </div>
                <div class="col-md-6">
                    <label class="fw-bold">Lĩnh vực:</label>
                    <p>${formatTechField(tech.field)}</p>
                </div>
            </div>
            <div class="mb-3">
                <label class="fw-bold">Họ và tên:</label>
                <p>${tech.name}</p>
            </div>
            <div class="row mb-3">
                <div class="col-md-6">
                    <label class="fw-bold">Nơi công tác:</label>
                    <p>${tech.workplace}</p>
                </div>
                <div class="col-md-6">
                    <label class="fw-bold">Kinh nghiệm:</label>
                    <p>${formatTechExperience(tech.experience)}</p>
                </div>
            </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
        </div>
    `;

    const modalElement = document.getElementById('techModal');
    modalElement.querySelector('.modal-content').innerHTML = modalContent;

    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

async function addNewTech() {
    const newId = generateNextId();
    const modalContent = `
        <div class="modal-header">
            <h5 class="modal-title">Thêm mới kỹ thuật viên</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
            <form id="addTechForm" class="needs-validation" novalidate>
                <div class="mb-3">
                    <label class="form-label required">Mã kỹ thuật viên</label>
                    <input type="text" class="form-control" name="id" value="${newId}" readonly>
                </div>
                <div class="mb-3">
                    <label class="form-label required">Họ và tên</label>
                    <input type="text" class="form-control" name="name" required>
                    <div class="invalid-feedback">Vui lòng nhập họ và tên</div>
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
                    <label class="form-label">Nơi công tác</label>
                    <input type="text" class="form-control" name="workplace">
                </div>
                <div class="mb-3">
                    <label class="form-label required">Kinh nghiệm</label>
                    <select class="form-select" name="experience" required>
                        <option value="">Chọn kinh nghiệm</option>
                        <option value="1-3">1-3 năm</option>
                        <option value="3-5">3-5 năm</option>
                        <option value="5+">Trên 5 năm</option>
                    </select>
                    <div class="invalid-feedback">Vui lòng chọn kinh nghiệm</div>
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
            <button type="button" class="btn btn-primary" onclick="saveNewTech()">
                <i class="fas fa-save me-1"></i>Lưu
            </button>
        </div>
    `;

    const modalElement = document.getElementById('techModal');
    modalElement.querySelector('.modal-content').innerHTML = modalContent;

    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

async function saveNewTech() {
    try {
        const form = document.getElementById('addTechForm');
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }
        showLoading();

        const formData = {
            id: document.querySelector('#addTechForm [name="id"]').value,
            name: form.querySelector('[name="name"]').value,
            field: form.querySelector('[name="field"]').value,
            workplace: form.querySelector('[name="workplace"]').value,
            experience: form.querySelector('[name="experience"]').value,
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
        await loadTechs();

        const modalElement = document.getElementById('techModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();

        alert('Thêm mới kỹ thuật viên thành công!');

    } catch (error) {
        console.error('Lỗi khi thêm mới kỹ thuật viên:', error);
        alert('Có lỗi xảy ra khi thêm mới kỹ thuật viên');
    } finally {
        hideLoading();
    }
}
// Tạo ID mới
function generateNextId() {
    if (!allTechs || allTechs.length === 0) {
        return "KTV001";
    }
    const lastId = allTechs[allTechs.length - 1].id;
    const numericPart = parseInt(lastId.slice(3), 10);
    const nextNumericPart = numericPart + 1;
    return `KTV${String(nextNumericPart).padStart(3, '0')}`;
}


function editTech(id) {
    const tech = allTechs.find(i => i.id === id);
    if (!tech) {
        alert('Không tìm thấy thông tin kỹ thuật viên');
        return;
    }

    const modalContent = `
        <div class="modal-header">
            <h5 class="modal-title">Chỉnh sửa thông tin kỹ thuật viên</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
            <form id="editTechForm" class="needs-validation" novalidate>
                <input type="hidden" name="id" value="${tech.id}">
                <div class="mb-3">
                    <label class="form-label required">Họ và tên</label>
                    <input type="text" class="form-control" name="name" value="${tech.name}" required>
                    <div class="invalid-feedback">Vui lòng nhập họ và tên</div>
                </div>
                <div class="mb-3">
                    <label class="form-label required">Lĩnh vực</label>
                    <select class="form-select" name="field" required>
                        <option value="agriculture" ${tech.field === 'agriculture' ? 'selected' : ''}>Nông nghiệp</option>
                        <option value="health" ${tech.field === 'health' ? 'selected' : ''}>Y tế</option>
                        <option value="industry" ${tech.field === 'industry' ? 'selected' : ''}>Công nghiệp</option>
                        <option value="construction" ${tech.field === 'construction' ? 'selected' : ''}>Xây dựng</option>
                        <option value="it" ${tech.field === 'it' ? 'selected' : ''}>Công nghệ thông tin</option>
                    </select>
                    <div class="invalid-feedback">Vui lòng chọn lĩnh vực</div>
                </div>
                <div class="mb-3">
                    <label class="form-label">Nơi công tác</label>
                    <input type="text" class="form-control" name="workplace" value="${tech.workplace}">
                </div>
                <div class="mb-3">
                    <label class="form-label required">Kinh nghiệm</label>
                    <select class="form-select" name="experience" required>
                        <option value="1-3" ${tech.experience === '1-3' ? 'selected' : ''}>1-3 năm</option>
                        <option value="3-5" ${tech.experience === '3-5' ? 'selected' : ''}>3-5 năm</option>
                        <option value="5+" ${tech.experience === '5+' ? 'selected' : ''}>Trên 5 năm</option>
                    </select>
                    <div class="invalid-feedback">Vui lòng chọn kinh nghiệm</div>
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
            <button type="button" class="btn btn-primary" onclick="saveEditedTech('${tech.id}')">
                <i class="fas fa-save me-1"></i>Lưu thay đổi
            </button>
        </div>
    `;

    const modalElement = document.getElementById('techModal');
    modalElement.querySelector('.modal-content').innerHTML = modalContent;

    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

async function saveEditedTech(id) {
    try {
        const form = document.getElementById('editTechForm');
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }
        showLoading();

        const formData = {
            id: id,
            name: form.querySelector('[name="name"]').value,
            field: form.querySelector('[name="field"]').value,
            workplace: form.querySelector('[name="workplace"]').value,
            experience: form.querySelector('[name="experience"]').value,
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
        await loadTechs();
        // Sắp xếp lại mảng sau khi edit thành công
        allTechs.sort((a, b) => {
            const idA = parseInt(a.id.slice(3), 10);
            const idB = parseInt(b.id.slice(3), 10);
            return idA - idB;
        });
        displayTechs();

        const modalElement = document.getElementById('techModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();

        alert('Cập nhật thông tin kỹ thuật viên thành công!');

    } catch (error) {
        console.error('Lỗi khi cập nhật thông tin kỹ thuật viên:', error);
        alert('Có lỗi xảy ra khi cập nhật thông tin kỹ thuật viên');
    } finally {
        hideLoading();
    }
}

async function deleteTech(id) {
    try {
        const tech = allTechs.find(i => i.id === id);
        if (!tech) {
            alert('Không tìm thấy thông tin kỹ thuật viên');
            return;
        }

        if (!confirm(`Bạn có chắc chắn muốn xóa kỹ thuật viên này?\n\n- Mã: ${tech.id}\n- Tên kỹ thuật viên: ${tech.name}`)) {
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
        await loadTechs();

        alert('Xóa kỹ thuật viên thành công!');

    } catch (error) {
        console.error('Lỗi khi xóa kỹ thuật viên:', error);
        alert('Có lỗi xảy ra khi xóa kỹ thuật viên');
    } finally {
        hideLoading();
    }
}

// ===== UTILITY FUNCTIONS =====
function formatTechField(field) {
    const fields = {
        agriculture: "Nông nghiệp",
        health: "Y tế",
        industry: "Công nghiệp",
        construction: "Xây dựng",
        it: "Công nghệ thông tin"
    };
    return fields[field] || field;
}

function formatTechExperience(experience) {
    const experiences = {
        "1-3": "1-3 năm",
        "3-5": "3-5 năm",
        "5+": "Trên 5 năm"
    };
    return experiences[experience] || experience;
}
function formatTechExperienceClass(experience) {
    const experiences = {
        "1-3": "experience-1-3",
        "3-5": "experience-3-5",
        "5+": "experience-5"
    };
    return experiences[experience] || "";
}

function showLoading() {
    document.getElementById('loading-spinner').classList.remove('d-none');
}

function hideLoading() {
    document.getElementById('loading-spinner').classList.add('d-none');
}

// ===== PAGINATION FUNCTIONS =====
function updatePagination() {
    const totalPages = Math.ceil(filteredTechs.length / itemsPerPage);
    const paginationElement = document.getElementById('pagination');
    const paginationInfo = document.getElementById('paginationInfo');

    // Cập nhật thông tin phân trang
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, filteredTechs.length);
    paginationInfo.textContent = `Hiển thị ${startItem}-${endItem} trong tổng số ${filteredTechs.length} kỹ thuật viên`;

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
    const totalPages = Math.ceil(filteredTechs.length / itemsPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        displayTechs();
    }
}