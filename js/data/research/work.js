let allWorks = [];
let filteredWorks = [];
const tableName = 'khcn_data_work'; // Tên bảng trong Supabase
let currentPage = 1;
const itemsPerPage = 10;


// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function () {
    loadWorks();
    initializeEventListeners();
});

// ===== EVENT LISTENERS =====
function initializeEventListeners() {
    // Filter event listeners
    document.getElementById('workField').addEventListener('change', () => {
        currentPage = 1;
        filterWorks();
    });
    document.getElementById('workType').addEventListener('change', () => {
        currentPage = 1;
        filterWorks();
    });
    document.getElementById('searchInput').addEventListener('input', () => {
        currentPage = 1;
        filterWorks();
    });
}

// ===== DATA LOADING =====
async function loadWorks() {
    try {
        showLoading();
        const response = await fetch(`https://data.vunhat2009.workers.dev/${tableName}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch data from ${tableName}`);
        }
        allWorks = await response.json();
        // Sắp xếp theo id
        allWorks.sort((a, b) => {
            const idA = parseInt(a.id.slice(2), 10);
            const idB = parseInt(b.id.slice(2), 10);
            return idA - idB;
        });
        filteredWorks = [...allWorks]; // Initialize filtered data
        displayWorks();
    } catch (error) {
        console.error('Error loading works:', error);
        alert('Không thể tải dữ liệu công trình. Vui lòng thử lại sau.');
    } finally {
        hideLoading();
    }
}

// ===== DISPLAY FUNCTIONS =====
function displayWorks() {
    const tbody = document.getElementById('workTableBody');
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredWorks.length);
    const displayedData = filteredWorks.slice(startIndex, endIndex);
    tbody.innerHTML = '';

    displayedData.forEach((work, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${startIndex + index + 1}</td>
            <td>${work.name}</td>
            <td>${formatWorkField(work.field)}</td>
            <td>${work.author}</td>
             <td><span class="work-badge ${formatWorkTypeClass(work.type)}">${formatWorkType(work.type)}</span></td>
            <td>${work.year}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-action btn-view" onclick="viewWork('${work.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-action btn-edit" onclick="editWork('${work.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-action btn-delete" onclick="deleteWork('${work.id}')">
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
async function filterWorks() {
    try {
        showLoading();
        const filters = {
            field: document.getElementById('workField').value,
            type: document.getElementById('workType').value,
            search: document.getElementById('searchInput').value.toLowerCase()
        };

        filteredWorks = allWorks.filter(work => {
            let matches = true;

            if (filters.field && work.field !== filters.field) matches = false;
            if (filters.type && work.type !== filters.type) matches = false;

            if (filters.search) {
                const searchMatch =
                    work.name.toLowerCase().includes(filters.search) ||
                    work.author.toLowerCase().includes(filters.search);
                if (!searchMatch) matches = false;
            }

            return matches;
        });

        displayWorks(filteredWorks);
    } catch (error) {
        console.error('Lỗi khi lọc dữ liệu công trình:', error);
        alert('Có lỗi xảy ra khi lọc dữ liệu công trình');
    } finally {
        hideLoading();
    }
}

// ===== CRUD OPERATIONS =====
function viewWork(id) {
    const work = allWorks.find(i => i.id === id);
    if (!work) {
        alert('Không tìm thấy thông tin công trình');
        return;
    }

    const modalContent = `
        <div class="modal-header">
            <h5 class="modal-title">Chi tiết công trình nghiên cứu</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
             <div class="row mb-3">
                 <div class="col-md-6">
                      <label class="fw-bold">Mã:</label>
                      <p>${work.id}</p>
                 </div>
                  <div class="col-md-6">
                       <label class="fw-bold">Lĩnh vực:</label>
                      <p>${formatWorkField(work.field)}</p>
                  </div>
             </div>
            <div class="mb-3">
                <label class="fw-bold">Tên công trình:</label>
                 <p>${work.name}</p>
            </div>
             <div class="row mb-3">
                  <div class="col-md-6">
                        <label class="fw-bold">Tác giả:</label>
                        <p>${work.author}</p>
                 </div>
                  <div class="col-md-6">
                      <label class="fw-bold">Loại hình:</label>
                        <p>${formatWorkType(work.type)}</p>
                  </div>
             </div>
             <div class="mb-3">
                <label class="fw-bold">Năm công bố:</label>
                 <p>${work.year}</p>
            </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
        </div>
    `;

    const modalElement = document.getElementById('workModal');
    modalElement.querySelector('.modal-content').innerHTML = modalContent;

    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

async function addNewWork() {
    const newId = generateNextId();
    const modalContent = `
        <div class="modal-header">
            <h5 class="modal-title">Thêm mới công trình nghiên cứu</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
            <form id="addWorkForm" class="needs-validation" novalidate>
                <div class="mb-3">
                    <label class="form-label required">Mã công trình</label>
                    <input type="text" class="form-control" name="id" value="${newId}" readonly>
                </div>
                 <div class="mb-3">
                      <label class="form-label required">Tên công trình</label>
                      <input type="text" class="form-control" name="name" required>
                       <div class="invalid-feedback">Vui lòng nhập tên công trình</div>
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
                       <label class="form-label required">Tác giả</label>
                       <input type="text" class="form-control" name="author" required>
                        <div class="invalid-feedback">Vui lòng nhập tác giả</div>
                  </div>
                <div class="mb-3">
                     <label class="form-label required">Loại hình</label>
                      <select class="form-select" name="type" required>
                        <option value="">Chọn loại hình</option>
                           <option value="journal">Bài báo khoa học</option>
                           <option value="book">Sách chuyên khảo</option>
                            <option value="patent">Bằng sáng chế</option>
                           <option value="solution">Giải pháp hữu ích</option>
                      </select>
                      <div class="invalid-feedback">Vui lòng chọn loại hình</div>
                  </div>
                 <div class="mb-3">
                       <label class="form-label required">Năm công bố</label>
                      <input type="number" class="form-control" name="year" required>
                      <div class="invalid-feedback">Vui lòng nhập năm công bố</div>
                 </div>
            </form>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
            <button type="button" class="btn btn-primary" onclick="saveNewWork()">
                <i class="fas fa-save me-1"></i>Lưu
            </button>
        </div>
    `;

    const modalElement = document.getElementById('workModal');
    modalElement.querySelector('.modal-content').innerHTML = modalContent;

    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

async function saveNewWork() {
    try {
        const form = document.getElementById('addWorkForm');
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }

        showLoading();

        const formData = {
            id: document.querySelector('#addWorkForm [name="id"]').value,
            name: form.querySelector('[name="name"]').value,
            field: form.querySelector('[name="field"]').value,
            author: form.querySelector('[name="author"]').value,
            type: form.querySelector('[name="type"]').value,
            year: form.querySelector('[name="year"]').value,
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
        await loadWorks();

        const modalElement = document.getElementById('workModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();
        alert('Thêm mới công trình thành công!');

    } catch (error) {
        console.error('Lỗi khi thêm mới công trình:', error);
        alert('Có lỗi xảy ra khi thêm mới công trình');
    } finally {
        hideLoading();
    }
}
// Tạo ID mới
function generateNextId() {
    if (!allWorks || allWorks.length === 0) {
        return "CT001";
    }
    const lastId = allWorks[allWorks.length - 1].id;
    const numericPart = parseInt(lastId.slice(2), 10);
    const nextNumericPart = numericPart + 1;
    return `CT${String(nextNumericPart).padStart(3, '0')}`;
}

function editWork(id) {
    const work = allWorks.find(i => i.id === id);
    if (!work) {
        alert('Không tìm thấy thông tin công trình');
        return;
    }
    const modalContent = `
         <div class="modal-header">
            <h5 class="modal-title">Chỉnh sửa thông tin công trình</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
            <form id="editWorkForm" class="needs-validation" novalidate>
                <input type="hidden" name="id" value="${work.id}">
                <div class="mb-3">
                     <label class="form-label required">Tên công trình</label>
                    <input type="text" class="form-control" name="name" value="${work.name}" required>
                     <div class="invalid-feedback">Vui lòng nhập tên công trình</div>
                </div>
                <div class="mb-3">
                   <label class="form-label required">Lĩnh vực</label>
                    <select class="form-select" name="field" required>
                        <option value="agriculture" ${work.field === 'agriculture' ? 'selected' : ''}>Nông nghiệp</option>
                        <option value="health" ${work.field === 'health' ? 'selected' : ''}>Y tế</option>
                       <option value="industry" ${work.field === 'industry' ? 'selected' : ''}>Công nghiệp</option>
                         <option value="construction" ${work.field === 'construction' ? 'selected' : ''}>Xây dựng</option>
                         <option value="it" ${work.field === 'it' ? 'selected' : ''}>Công nghệ thông tin</option>
                    </select>
                   <div class="invalid-feedback">Vui lòng chọn lĩnh vực</div>
                </div>
                <div class="mb-3">
                     <label class="form-label required">Tác giả</label>
                    <input type="text" class="form-control" name="author" value="${work.author}" required>
                    <div class="invalid-feedback">Vui lòng nhập tác giả</div>
               </div>
               <div class="mb-3">
                     <label class="form-label required">Loại hình</label>
                      <select class="form-select" name="type" required>
                           <option value="journal" ${work.type === 'journal' ? 'selected' : ''}>Bài báo khoa học</option>
                           <option value="book" ${work.type === 'book' ? 'selected' : ''}>Sách chuyên khảo</option>
                           <option value="patent" ${work.type === 'patent' ? 'selected' : ''}>Bằng sáng chế</option>
                          <option value="solution" ${work.type === 'solution' ? 'selected' : ''}>Giải pháp hữu ích</option>
                      </select>
                       <div class="invalid-feedback">Vui lòng chọn loại hình</div>
                </div>
                <div class="mb-3">
                    <label class="form-label required">Năm công bố</label>
                    <input type="number" class="form-control" name="year" value="${work.year}" required>
                   <div class="invalid-feedback">Vui lòng nhập năm công bố</div>
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
            <button type="button" class="btn btn-primary" onclick="saveEditedWork('${work.id}')">
               <i class="fas fa-save me-1"></i>Lưu thay đổi
           </button>
        </div>
    `;

    const modalElement = document.getElementById('workModal');
    modalElement.querySelector('.modal-content').innerHTML = modalContent;

    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

async function saveEditedWork(id) {
    try {
        const form = document.getElementById('editWorkForm');
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }

        showLoading();

        const formData = {
            id: id,
            name: form.querySelector('[name="name"]').value,
            field: form.querySelector('[name="field"]').value,
            author: form.querySelector('[name="author"]').value,
            type: form.querySelector('[name="type"]').value,
            year: form.querySelector('[name="year"]').value,
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
        await loadWorks();
        // Sắp xếp lại mảng sau khi edit thành công
        allWorks.sort((a, b) => {
            const idA = parseInt(a.id.slice(2), 10);
            const idB = parseInt(b.id.slice(2), 10);
            return idA - idB;
        });
        displayWorks()

        const modalElement = document.getElementById('workModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();

        alert('Cập nhật thông tin công trình thành công!');

    } catch (error) {
        console.error('Lỗi khi cập nhật thông tin công trình:', error);
        alert('Có lỗi xảy ra khi cập nhật thông tin công trình');
    } finally {
        hideLoading();
    }
}

async function deleteWork(id) {
    try {
        const work = allWorks.find(i => i.id === id);
        if (!work) {
            alert('Không tìm thấy thông tin công trình');
            return;
        }

        if (!confirm(`Bạn có chắc chắn muốn xóa công trình này?\n\n- Mã: ${work.id}\n- Tên công trình: ${work.name}`)) {
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
        await loadWorks();

        alert('Xóa công trình thành công!');

    } catch (error) {
        console.error('Lỗi khi xóa công trình:', error);
        alert('Có lỗi xảy ra khi xóa công trình');
    } finally {
        hideLoading();
    }
}
// ===== PAGINATION FUNCTIONS =====
function updatePagination() {
    const totalPages = Math.ceil(filteredWorks.length / itemsPerPage);
    const paginationElement = document.getElementById('pagination');
    const paginationInfo = document.getElementById('paginationInfo');

    // Cập nhật thông tin phân trang
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, filteredWorks.length);
    paginationInfo.textContent = `Hiển thị ${startItem}-${endItem} trong tổng số ${filteredWorks.length} công trình`;

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
    const totalPages = Math.ceil(filteredWorks.length / itemsPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        displayWorks();
    }
}


// ===== UTILITY FUNCTIONS =====
function formatWorkField(field) {
    const fields = {
        agriculture: "Nông nghiệp",
        health: "Y tế",
        industry: "Công nghiệp",
        construction: "Xây dựng",
        it: "Công nghệ thông tin"
    };
    return fields[field] || field;
}
function formatWorkType(type) {
    const types = {
        journal: "Bài báo khoa học",
        book: "Sách chuyên khảo",
        patent: "Bằng sáng chế",
        solution: "Giải pháp hữu ích"
    };
    return types[type] || type;
}
function formatWorkTypeClass(type) {
    const types = {
        journal: "work-journal",
        book: "work-book",
        patent: "work-patent",
        solution: "work-solution"
    };
    return types[type] || "";
}

function showLoading() {
    document.getElementById('loading-spinner').classList.remove('d-none');
}

function hideLoading() {
    document.getElementById('loading-spinner').classList.add('d-none');
}