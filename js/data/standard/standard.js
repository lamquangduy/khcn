let allStandards = [];
let filteredStandards = [];
const tableName = 'khcn_data_standard_standard'; // Tên bảng trong Supabase
let currentPage = 1;
const itemsPerPage = 10;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    loadStandards();
    initializeEventListeners();
});

// ===== EVENT LISTENERS =====
function initializeEventListeners() {
    // Filter event listeners
     document.getElementById('standardField').addEventListener('change', () => {
        currentPage = 1;
        filterStandards();
    });
    document.getElementById('standardStatus').addEventListener('change', () => {
       currentPage = 1;
        filterStandards();
    });
    document.getElementById('searchInput').addEventListener('input', () => {
         currentPage = 1;
        filterStandards();
    });
}

// ===== DATA LOADING =====
async function loadStandards() {
    try {
        showLoading();
         const response = await fetch(`https://data.vunhat2009.workers.dev/${tableName}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch data from ${tableName}`);
        }
        allStandards = await response.json();
        // Sắp xếp theo id
        allStandards.sort((a, b) => {
            const idA = parseInt(a.id.slice(2), 10);
            const idB = parseInt(b.id.slice(2), 10);
            return idA - idB;
        });
        filteredStandards = [...allStandards]; // Initialize filtered data
        displayStandards();
    } catch (error) {
        console.error('Error loading standards:', error);
        alert('Không thể tải dữ liệu tiêu chuẩn. Vui lòng thử lại sau.');
    } finally {
         hideLoading();
    }
}

// ===== DISPLAY FUNCTIONS =====
function displayStandards() {
    const tbody = document.getElementById('standardTableBody');
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredStandards.length);
    const displayedData = filteredStandards.slice(startIndex, endIndex);
    tbody.innerHTML = '';

    displayedData.forEach((standard, index) => {
        const row = document.createElement('tr');
         row.innerHTML = `
            <td>${startIndex + index + 1}</td>
            <td>${standard.name}</td>
             <td>${formatStandardField(standard.field)}</td>
            <td>${standard.description}</td>
            <td>${standard.publishdate}</td>
           <td><span class="status-badge ${formatStandardStatusClass(standard.status)}">${formatStandardStatus(standard.status)}</span></td>
           <td>
                <div class="action-buttons">
                    <button class="btn btn-action btn-view" onclick="viewStandard('${standard.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-action btn-edit" onclick="editStandard('${standard.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                     <button class="btn btn-action btn-delete" onclick="deleteStandard('${standard.id}')">
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
async function filterStandards() {
    try {
        showLoading();
        const filters = {
            field: document.getElementById('standardField').value,
            status: document.getElementById('standardStatus').value,
            search: document.getElementById('searchInput').value.toLowerCase()
       };

       filteredStandards = allStandards.filter(standard => {
           let matches = true;

          if (filters.field && standard.field !== filters.field) matches = false;
          if (filters.status && standard.status !== filters.status) matches = false;

           if (filters.search) {
                const searchMatch =
                   standard.name.toLowerCase().includes(filters.search) ||
                   standard.description.toLowerCase().includes(filters.search);
               if (!searchMatch) matches = false;
           }

            return matches;
       });

        displayStandards();
    } catch (error) {
       console.error('Lỗi khi lọc dữ liệu tiêu chuẩn:', error);
        alert('Có lỗi xảy ra khi lọc dữ liệu tiêu chuẩn');
    } finally {
        hideLoading();
    }
}

// ===== CRUD OPERATIONS =====
function viewStandard(id) {
     const standard = allStandards.find(i => i.id === id);
      if (!standard) {
         alert('Không tìm thấy thông tin tiêu chuẩn');
           return;
      }

    const modalContent = `
       <div class="modal-header">
            <h5 class="modal-title">Chi tiết tiêu chuẩn</h5>
           <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
         <div class="modal-body">
             <div class="row mb-3">
                 <div class="col-md-6">
                      <label class="fw-bold">Mã:</label>
                      <p>${standard.id}</p>
                 </div>
                  <div class="col-md-6">
                       <label class="fw-bold">Lĩnh vực:</label>
                       <p>${formatStandardField(standard.field)}</p>
                  </div>
             </div>
             <div class="mb-3">
                 <label class="fw-bold">Tên tiêu chuẩn:</label>
                 <p>${standard.name}</p>
            </div>
             <div class="row mb-3">
                <div class="col-md-6">
                     <label class="fw-bold">Mô tả:</label>
                    <p>${standard.description}</p>
                </div>
                 <div class="col-md-6">
                    <label class="fw-bold">Ngày ban hành:</label>
                   <p>${standard.publishdate}</p>
                </div>
             </div>
             <div class="mb-3">
                 <label class="fw-bold">Tình trạng:</label>
                 <p>${formatStandardStatus(standard.status)}</p>
            </div>
        </div>
         <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
        </div>
    `;

     const modalElement = document.getElementById('standardModal');
    modalElement.querySelector('.modal-content').innerHTML = modalContent;

    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

async function addNewStandard() {
     const newId = generateNextId();
    const modalContent = `
        <div class="modal-header">
           <h5 class="modal-title">Thêm mới tiêu chuẩn</h5>
           <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
            <form id="addStandardForm" class="needs-validation" novalidate>
                  <div class="mb-3">
                     <label class="form-label required">Mã tiêu chuẩn</label>
                     <input type="text" class="form-control" name="id" value="${newId}" readonly>
                 </div>
                <div class="mb-3">
                     <label class="form-label required">Tên tiêu chuẩn</label>
                     <input type="text" class="form-control" name="name" required>
                     <div class="invalid-feedback">Vui lòng nhập tên tiêu chuẩn</div>
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
                     <label class="form-label required">Ngày ban hành</label>
                     <input type="date" class="form-control" name="publishdate" required>
                      <div class="invalid-feedback">Vui lòng chọn ngày ban hành</div>
                </div>
                <div class="mb-3">
                     <label class="form-label required">Tình trạng</label>
                     <select class="form-select" name="status" required>
                         <option value="">Chọn tình trạng</option>
                         <option value="active">Có hiệu lực</option>
                          <option value="inactive">Hết hiệu lực</option>
                     </select>
                     <div class="invalid-feedback">Vui lòng chọn tình trạng</div>
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
             <button type="button" class="btn btn-primary" onclick="saveNewStandard()">
                 <i class="fas fa-save me-1"></i>Lưu
            </button>
        </div>
    `;

    const modalElement = document.getElementById('standardModal');
    modalElement.querySelector('.modal-content').innerHTML = modalContent;

    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

async function saveNewStandard() {
     try {
          const form = document.getElementById('addStandardForm');
           if (!form.checkValidity()) {
              form.classList.add('was-validated');
               return;
            }
           showLoading();
          const formData = {
            id:  document.querySelector('#addStandardForm [name="id"]').value,
             name: form.querySelector('[name="name"]').value,
            field: form.querySelector('[name="field"]').value,
             description: form.querySelector('[name="description"]').value,
            publishdate: form.querySelector('[name="publishdate"]').value,
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
        await loadStandards();
        const modalElement = document.getElementById('standardModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
         modal.hide();

       alert('Thêm mới tiêu chuẩn thành công!');

    } catch (error) {
         console.error('Lỗi khi thêm mới tiêu chuẩn:', error);
         alert('Có lỗi xảy ra khi thêm mới tiêu chuẩn');
    } finally {
        hideLoading();
    }
}
// Tạo ID mới
function generateNextId() {
    if (!allStandards || allStandards.length === 0) {
        return "TC001";
    }
    const lastId = allStandards[allStandards.length - 1].id;
    const numericPart = parseInt(lastId.slice(2), 10);
    const nextNumericPart = numericPart + 1;
    return `TC${String(nextNumericPart).padStart(3, '0')}`;
}

function editStandard(id) {
     const standard = allStandards.find(i => i.id === id);
      if (!standard) {
          alert('Không tìm thấy thông tin tiêu chuẩn');
           return;
      }

    const modalContent = `
          <div class="modal-header">
              <h5 class="modal-title">Chỉnh sửa thông tin tiêu chuẩn</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
              <form id="editStandardForm" class="needs-validation" novalidate>
                   <input type="hidden" name="id" value="${standard.id}">
                    <div class="mb-3">
                         <label class="form-label required">Tên tiêu chuẩn</label>
                       <input type="text" class="form-control" name="name" value="${standard.name}" required>
                         <div class="invalid-feedback">Vui lòng nhập tên tiêu chuẩn</div>
                   </div>
                  <div class="mb-3">
                      <label class="form-label required">Lĩnh vực</label>
                       <select class="form-select" name="field" required>
                           <option value="agriculture" ${standard.field === 'agriculture' ? 'selected' : ''}>Nông nghiệp</option>
                         <option value="health" ${standard.field === 'health' ? 'selected' : ''}>Y tế</option>
                         <option value="industry" ${standard.field === 'industry' ? 'selected' : ''}>Công nghiệp</option>
                         <option value="construction" ${standard.field === 'construction' ? 'selected' : ''}>Xây dựng</option>
                         <option value="it" ${standard.field === 'it' ? 'selected' : ''}>Công nghệ thông tin</option>
                       </select>
                      <div class="invalid-feedback">Vui lòng chọn lĩnh vực</div>
                 </div>
                <div class="mb-3">
                      <label class="form-label">Mô tả</label>
                     <textarea class="form-control" name="description" rows="3">${standard.description}</textarea>
                </div>
                <div class="mb-3">
                    <label class="form-label required">Ngày ban hành</label>
                   <input type="date" class="form-control" name="publishdate" value="${standard.publishdate}" required>
                     <div class="invalid-feedback">Vui lòng chọn ngày ban hành</div>
               </div>
                 <div class="mb-3">
                      <label class="form-label required">Tình trạng</label>
                      <select class="form-select" name="status" required>
                           <option value="active" ${standard.status === 'active' ? 'selected' : ''}>Có hiệu lực</option>
                            <option value="inactive" ${standard.status === 'inactive' ? 'selected' : ''}>Hết hiệu lực</option>
                    </select>
                    <div class="invalid-feedback">Vui lòng chọn tình trạng</div>
                 </div>
             </form>
         </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
             <button type="button" class="btn btn-primary" onclick="saveEditedStandard('${standard.id}')">
                <i class="fas fa-save me-1"></i>Lưu thay đổi
            </button>
        </div>
    `;

     const modalElement = document.getElementById('standardModal');
    modalElement.querySelector('.modal-content').innerHTML = modalContent;

    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

async function saveEditedStandard(id) {
    try {
          const form = document.getElementById('editStandardForm');
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
           publishdate: form.querySelector('[name="publishdate"]').value,
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

         await loadStandards();
         // Sắp xếp lại mảng sau khi edit thành công
         allStandards.sort((a, b) => {
             const idA = parseInt(a.id.slice(2), 10);
             const idB = parseInt(b.id.slice(2), 10);
             return idA - idB;
         });
        displayStandards();

        const modalElement = document.getElementById('standardModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();

        alert('Cập nhật thông tin tiêu chuẩn thành công!');
    } catch (error) {
         console.error('Lỗi khi cập nhật thông tin tiêu chuẩn:', error);
        alert('Có lỗi xảy ra khi cập nhật thông tin tiêu chuẩn');
   } finally {
        hideLoading();
   }
}

async function deleteStandard(id) {
    try {
         const standard = allStandards.find(i => i.id === id);
        if (!standard) {
           alert('Không tìm thấy thông tin tiêu chuẩn');
            return;
       }

        if (!confirm(`Bạn có chắc chắn muốn xóa tiêu chuẩn này?\n\n- Mã: ${standard.id}\n- Tên tiêu chuẩn: ${standard.name}`)) {
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
        await loadStandards();

       alert('Xóa tiêu chuẩn thành công!');

    } catch (error) {
       console.error('Lỗi khi xóa tiêu chuẩn:', error);
        alert('Có lỗi xảy ra khi xóa tiêu chuẩn');
    } finally {
       hideLoading();
    }
}
// ===== PAGINATION FUNCTIONS =====
function updatePagination() {
    const totalPages = Math.ceil(filteredStandards.length / itemsPerPage);
    const paginationElement = document.getElementById('pagination');
    const paginationInfo = document.getElementById('paginationInfo');

    // Cập nhật thông tin phân trang
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, filteredStandards.length);
    paginationInfo.textContent = `Hiển thị ${startItem}-${endItem} trong tổng số ${filteredStandards.length} tiêu chuẩn`;

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
    const totalPages = Math.ceil(filteredStandards.length / itemsPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        displayStandards();
    }
}
// ===== UTILITY FUNCTIONS =====
function formatStandardField(field) {
    const fields = {
         agriculture: "Nông nghiệp",
        health: "Y tế",
       industry: "Công nghiệp",
        construction: "Xây dựng",
       it: "Công nghệ thông tin"
    };
    return fields[field] || field;
}

function formatStandardStatus(status) {
    const statuses = {
         active: "Có hiệu lực",
        inactive: "Hết hiệu lực"
    };
    return statuses[status] || status;
}
function formatStandardStatusClass(status) {
    const statuses = {
        active: "status-active",
       inactive: "status-inactive"
    };
    return statuses[status] || "";
}

function showLoading() {
    document.getElementById('loading-spinner').classList.remove('d-none');
}

function hideLoading() {
    document.getElementById('loading-spinner').classList.add('d-none');
}