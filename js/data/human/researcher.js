let allResearchers = [];
let filteredResearchers = [];
const tableName = 'khcn_data_human_researcher'; // Tên bảng trong Supabase
let currentPage = 1;
const itemsPerPage = 10;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    loadResearchers();
    initializeEventListeners();
});

// ===== EVENT LISTENERS =====
function initializeEventListeners() {
    // Filter event listeners
    document.getElementById('researcherField').addEventListener('change', () => {
        currentPage = 1;
        filterResearchers();
    });
    document.getElementById('researcherLevel').addEventListener('change', () => {
        currentPage = 1;
        filterResearchers();
    });
    document.getElementById('searchInput').addEventListener('input', () => {
        currentPage = 1;
        filterResearchers();
    });
}

// ===== DATA LOADING =====
async function loadResearchers() {
   try {
        showLoading();
       const response = await fetch(`https://data.vunhat2009.workers.dev/${tableName}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch data from ${tableName}`);
        }
        allResearchers = await response.json();
        // Sắp xếp theo id
        allResearchers.sort((a, b) => {
            const idA = parseInt(a.id.slice(3), 10);
            const idB = parseInt(b.id.slice(3), 10);
            return idA - idB;
        });
        filteredResearchers = [...allResearchers]; // Initialize filtered data
        displayResearchers();
    } catch (error) {
        console.error('Error loading researchers:', error);
        alert('Không thể tải dữ liệu nghiên cứu viên. Vui lòng thử lại sau.');
    } finally {
        hideLoading();
    }
}

// ===== DISPLAY FUNCTIONS =====
function displayResearchers() {
    const tbody = document.getElementById('researcherTableBody');
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredResearchers.length);
    const displayedData = filteredResearchers.slice(startIndex, endIndex);
    tbody.innerHTML = '';

    displayedData.forEach((researcher, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${startIndex + index + 1}</td>
             <td>${researcher.name}</td>
            <td>${formatResearcherField(researcher.field)}</td>
              <td><span class="level-badge ${formatResearcherLevelClass(researcher.level)}">${formatResearcherLevel(researcher.level)}</span></td>
             <td>${researcher.workplace}</td>
            <td>
                <div class="action-buttons">
                   <button class="btn btn-action btn-view" onclick="viewResearcher('${researcher.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                   <button class="btn btn-action btn-edit" onclick="editResearcher('${researcher.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                     <button class="btn btn-action btn-delete" onclick="deleteResearcher('${researcher.id}')">
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
async function filterResearchers() {
    try {
        showLoading();
         const filters = {
            field: document.getElementById('researcherField').value,
            level: document.getElementById('researcherLevel').value,
           search: document.getElementById('searchInput').value.toLowerCase()
         };

        filteredResearchers = allResearchers.filter(researcher => {
            let matches = true;

           if (filters.field && researcher.field !== filters.field) matches = false;
            if (filters.level && researcher.level !== filters.level) matches = false;

             if (filters.search) {
                const searchMatch =
                    researcher.name.toLowerCase().includes(filters.search) ||
                      researcher.workplace.toLowerCase().includes(filters.search);
                 if (!searchMatch) matches = false;
            }
            return matches;
        });

        displayResearchers();
    } catch (error) {
        console.error('Lỗi khi lọc dữ liệu nghiên cứu viên:', error);
        alert('Có lỗi xảy ra khi lọc dữ liệu nghiên cứu viên');
    } finally {
       hideLoading();
    }
}

// ===== CRUD OPERATIONS =====
function viewResearcher(id) {
    const researcher = allResearchers.find(i => i.id === id);
      if (!researcher) {
          alert('Không tìm thấy thông tin nghiên cứu viên');
           return;
    }

    const modalContent = `
       <div class="modal-header">
            <h5 class="modal-title">Chi tiết nghiên cứu viên</h5>
           <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
       <div class="modal-body">
           <div class="row mb-3">
               <div class="col-md-6">
                   <label class="fw-bold">Mã:</label>
                    <p>${researcher.id}</p>
               </div>
                <div class="col-md-6">
                    <label class="fw-bold">Lĩnh vực:</label>
                    <p>${formatResearcherField(researcher.field)}</p>
                 </div>
            </div>
           <div class="mb-3">
               <label class="fw-bold">Họ và tên:</label>
               <p>${researcher.name}</p>
            </div>
             <div class="row mb-3">
                  <div class="col-md-6">
                        <label class="fw-bold">Trình độ:</label>
                      <p>${formatResearcherLevel(researcher.level)}</p>
                </div>
                <div class="col-md-6">
                    <label class="fw-bold">Nơi công tác:</label>
                    <p>${researcher.workplace}</p>
                </div>
            </div>
        </div>
        <div class="modal-footer">
           <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
        </div>
    `;

    const modalElement = document.getElementById('researcherModal');
    modalElement.querySelector('.modal-content').innerHTML = modalContent;

    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

async function addNewResearcher() {
     const modalContent = `
        <div class="modal-header">
             <h5 class="modal-title">Thêm mới nghiên cứu viên</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
            <form id="addResearcherForm" class="needs-validation" novalidate>
                 <div class="mb-3">
                     <label class="form-label required">Mã nghiên cứu viên</label>
                    <input type="text" class="form-control" name="id" value="${generateNextId()}" readonly>
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
                             <option value="research">Nghiên cứu</option>
                    </select>
                     <div class="invalid-feedback">Vui lòng chọn lĩnh vực</div>
                </div>
               <div class="mb-3">
                     <label class="form-label required">Trình độ</label>
                       <select class="form-select" name="level" required>
                            <option value="">Chọn trình độ</option>
                            <option value="master">Thạc sĩ</option>
                            <option value="bachelor">Cử nhân</option>
                           <option value="technician">Kỹ thuật viên</option>
                     </select>
                     <div class="invalid-feedback">Vui lòng chọn trình độ</div>
               </div>
               <div class="mb-3">
                    <label class="form-label">Nơi công tác</label>
                    <input type="text" class="form-control" name="workplace">
               </div>
            </form>
        </div>
        <div class="modal-footer">
           <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
            <button type="button" class="btn btn-primary" onclick="saveNewResearcher()">
                 <i class="fas fa-save me-1"></i>Lưu
            </button>
        </div>
    `;

    const modalElement = document.getElementById('researcherModal');
    modalElement.querySelector('.modal-content').innerHTML = modalContent;

    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

async function saveNewResearcher() {
      try {
           const form = document.getElementById('addResearcherForm');
         if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
         }
          showLoading();

        const formData = {
            id: document.querySelector('#addResearcherForm [name="id"]').value,
           name: form.querySelector('[name="name"]').value,
            field: form.querySelector('[name="field"]').value,
             level: form.querySelector('[name="level"]').value,
            workplace: form.querySelector('[name="workplace"]').value,
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
           await loadResearchers();

         const modalElement = document.getElementById('researcherModal');
         const modal = bootstrap.Modal.getInstance(modalElement);
           modal.hide();

        alert('Thêm mới nghiên cứu viên thành công!');

    } catch (error) {
        console.error('Lỗi khi thêm mới nghiên cứu viên:', error);
       alert('Có lỗi xảy ra khi thêm mới nghiên cứu viên');
    } finally {
        hideLoading();
    }
}
// Tạo ID mới
function generateNextId() {
    if (!allResearchers || allResearchers.length === 0) {
        return "NCV001";
    }
    const lastId = allResearchers[allResearchers.length - 1].id;
    const numericPart = parseInt(lastId.slice(3), 10);
    const nextNumericPart = numericPart + 1;
    return `NCV${String(nextNumericPart).padStart(3, '0')}`;
}

function editResearcher(id) {
    const researcher = allResearchers.find(i => i.id === id);
    if (!researcher) {
        alert('Không tìm thấy thông tin nghiên cứu viên');
          return;
     }

    const modalContent = `
         <div class="modal-header">
            <h5 class="modal-title">Chỉnh sửa thông tin nghiên cứu viên</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
            <form id="editResearcherForm" class="needs-validation" novalidate>
                <input type="hidden" name="id" value="${researcher.id}">
                 <div class="mb-3">
                     <label class="form-label required">Họ và tên</label>
                    <input type="text" class="form-control" name="name" value="${researcher.name}" required>
                    <div class="invalid-feedback">Vui lòng nhập họ và tên</div>
                 </div>
                 <div class="mb-3">
                      <label class="form-label required">Lĩnh vực</label>
                       <select class="form-select" name="field" required>
                         <option value="agriculture" ${researcher.field === 'agriculture' ? 'selected' : ''}>Nông nghiệp</option>
                          <option value="health" ${researcher.field === 'health' ? 'selected' : ''}>Y tế</option>
                         <option value="industry" ${researcher.field === 'industry' ? 'selected' : ''}>Công nghiệp</option>
                         <option value="construction" ${researcher.field === 'construction' ? 'selected' : ''}>Xây dựng</option>
                         <option value="it" ${researcher.field === 'it' ? 'selected' : ''}>Công nghệ thông tin</option>
                           <option value="research" ${researcher.field === 'research' ? 'selected' : ''}>Nghiên cứu</option>
                    </select>
                     <div class="invalid-feedback">Vui lòng chọn lĩnh vực</div>
                </div>
               <div class="mb-3">
                    <label class="form-label required">Trình độ</label>
                     <select class="form-select" name="level" required>
                           <option value="master" ${researcher.level === 'master' ? 'selected' : ''}>Thạc sĩ</option>
                            <option value="bachelor" ${researcher.level === 'bachelor' ? 'selected' : ''}>Cử nhân</option>
                          <option value="technician" ${researcher.level === 'technician' ? 'selected' : ''}>Kỹ thuật viên</option>
                     </select>
                     <div class="invalid-feedback">Vui lòng chọn trình độ</div>
                </div>
                <div class="mb-3">
                     <label class="form-label">Nơi công tác</label>
                    <input type="text" class="form-control" name="workplace" value="${researcher.workplace}">
                </div>
           </form>
        </div>
        <div class="modal-footer">
           <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
             <button type="button" class="btn btn-primary" onclick="saveEditedResearcher('${researcher.id}')">
                <i class="fas fa-save me-1"></i>Lưu thay đổi
            </button>
        </div>
    `;

    const modalElement = document.getElementById('researcherModal');
    modalElement.querySelector('.modal-content').innerHTML = modalContent;

    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

async function saveEditedResearcher(id) {
    try {
          const form = document.getElementById('editResearcherForm');
            if (!form.checkValidity()) {
             form.classList.add('was-validated');
                return;
          }

        showLoading();

        const formData = {
            id: id,
            name: form.querySelector('[name="name"]').value,
            field: form.querySelector('[name="field"]').value,
            level: form.querySelector('[name="level"]').value,
            workplace: form.querySelector('[name="workplace"]').value,
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
         await loadResearchers();
         // Sắp xếp lại mảng sau khi edit thành công
         allResearchers.sort((a, b) => {
             const idA = parseInt(a.id.slice(3), 10);
             const idB = parseInt(b.id.slice(3), 10);
             return idA - idB;
        });
        displayResearchers();
         const modalElement = document.getElementById('researcherModal');
         const modal = bootstrap.Modal.getInstance(modalElement);
          modal.hide();

      alert('Cập nhật thông tin nghiên cứu viên thành công!');

   } catch (error) {
        console.error('Lỗi khi cập nhật thông tin nghiên cứu viên:', error);
       alert('Có lỗi xảy ra khi cập nhật thông tin nghiên cứu viên');
   } finally {
        hideLoading();
   }
}

async function deleteResearcher(id) {
    try {
        const researcher = allResearchers.find(i => i.id === id);
         if (!researcher) {
            alert('Không tìm thấy thông tin nghiên cứu viên');
             return;
        }

      if (!confirm(`Bạn có chắc chắn muốn xóa nghiên cứu viên này?\n\n- Mã: ${researcher.id}\n- Tên nghiên cứu viên: ${researcher.name}`)) {
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
         await loadResearchers();

        alert('Xóa nghiên cứu viên thành công!');

    } catch (error) {
         console.error('Lỗi khi xóa nghiên cứu viên:', error);
       alert('Có lỗi xảy ra khi xóa nghiên cứu viên');
    } finally {
        hideLoading();
    }
}

// ===== PAGINATION FUNCTIONS =====
function updatePagination() {
    const totalPages = Math.ceil(filteredResearchers.length / itemsPerPage);
    const paginationElement = document.getElementById('pagination');
    const paginationInfo = document.getElementById('paginationInfo');

    // Cập nhật thông tin phân trang
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, filteredResearchers.length);
    paginationInfo.textContent = `Hiển thị ${startItem}-${endItem} trong tổng số ${filteredResearchers.length} nghiên cứu viên`;

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
    const totalPages = Math.ceil(filteredResearchers.length / itemsPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        displayResearchers();
    }
}

// ===== UTILITY FUNCTIONS =====
function formatResearcherField(field) {
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
function formatResearcherLevel(level) {
    const levels = {
       master: "Thạc sĩ",
        bachelor: "Cử nhân",
        technician: "Kỹ thuật viên",
        doctor: "Tiến sĩ"
    };
    return levels[level] || level;
}
function formatResearcherLevelClass(level) {
    const levels = {
        master: "level-master",
        bachelor: "level-bachelor",
        technician: "level-technician",
        doctor: "level-doctor"
   };
    return levels[level] || "";
}

function showLoading() {
    document.getElementById('loading-spinner').classList.remove('d-none');
}

function hideLoading() {
    document.getElementById('loading-spinner').classList.add('d-none');
}
