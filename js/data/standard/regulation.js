let allRegulations = [];
let filteredRegulations = [];
const tableName = 'khcn_data_standard_regulation'; // Tên bảng trong Supabase
let currentPage = 1;
const itemsPerPage = 10;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    loadRegulations();
    initializeEventListeners();
});

// ===== EVENT LISTENERS =====
function initializeEventListeners() {
    // Filter event listeners
     document.getElementById('regulationField').addEventListener('change', () => {
        currentPage = 1;
        filterRegulations();
    });
     document.getElementById('regulationStatus').addEventListener('change', () => {
       currentPage = 1;
        filterRegulations();
    });
    document.getElementById('searchInput').addEventListener('input', () => {
         currentPage = 1;
       filterRegulations();
    });
}

// ===== DATA LOADING =====
async function loadRegulations() {
    try {
        showLoading();
         const response = await fetch(`https://data.vunhat2009.workers.dev/${tableName}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch data from ${tableName}`);
        }
        allRegulations = await response.json();
         // Sắp xếp theo id
        allRegulations.sort((a, b) => {
            const idA = parseInt(a.id.slice(2), 10);
            const idB = parseInt(b.id.slice(2), 10);
            return idA - idB;
        });
        filteredRegulations = [...allRegulations]; // Initialize filtered data
        displayRegulations();
    } catch (error) {
        console.error('Error loading regulations:', error);
        alert('Không thể tải dữ liệu quy chuẩn. Vui lòng thử lại sau.');
    } finally {
         hideLoading();
    }
}

// ===== DISPLAY FUNCTIONS =====
function displayRegulations() {
    const tbody = document.getElementById('regulationTableBody');
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredRegulations.length);
    const displayedData = filteredRegulations.slice(startIndex, endIndex);
    tbody.innerHTML = '';

    displayedData.forEach((regulation, index) => {
        const row = document.createElement('tr');
          row.innerHTML = `
             <td>${startIndex + index + 1}</td>
            <td>${regulation.name}</td>
             <td>${formatRegulationField(regulation.field)}</td>
            <td>${regulation.description}</td>
            <td>${regulation.publishdate}</td>
            <td><span class="status-badge ${formatRegulationStatusClass(regulation.status)}">${formatRegulationStatus(regulation.status)}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-action btn-view" onclick="viewRegulation('${regulation.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-action btn-edit" onclick="editRegulation('${regulation.id}')">
                       <i class="fas fa-edit"></i>
                   </button>
                     <button class="btn btn-action btn-delete" onclick="deleteRegulation('${regulation.id}')">
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
async function filterRegulations() {
      try {
        showLoading();
        const filters = {
            field: document.getElementById('regulationField').value,
            status: document.getElementById('regulationStatus').value,
             search: document.getElementById('searchInput').value.toLowerCase()
         };

        filteredRegulations = allRegulations.filter(regulation => {
             let matches = true;

            if (filters.field && regulation.field !== filters.field) matches = false;
            if (filters.status && regulation.status !== filters.status) matches = false;

             if (filters.search) {
                 const searchMatch =
                     regulation.name.toLowerCase().includes(filters.search) ||
                     regulation.description.toLowerCase().includes(filters.search);
                if (!searchMatch) matches = false;
             }

            return matches;
       });

        displayRegulations();
   } catch (error) {
        console.error('Lỗi khi lọc dữ liệu quy chuẩn:', error);
        alert('Có lỗi xảy ra khi lọc dữ liệu quy chuẩn');
    } finally {
       hideLoading();
    }
}

// ===== CRUD OPERATIONS =====
function viewRegulation(id) {
    const regulation = allRegulations.find(i => i.id === id);
     if (!regulation) {
       alert('Không tìm thấy thông tin quy chuẩn');
        return;
    }

    const modalContent = `
        <div class="modal-header">
           <h5 class="modal-title">Chi tiết quy chuẩn kỹ thuật</h5>
             <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
            <div class="row mb-3">
                 <div class="col-md-6">
                      <label class="fw-bold">Mã:</label>
                      <p>${regulation.id}</p>
                  </div>
                 <div class="col-md-6">
                     <label class="fw-bold">Lĩnh vực:</label>
                    <p>${formatRegulationField(regulation.field)}</p>
                </div>
            </div>
             <div class="mb-3">
                 <label class="fw-bold">Tên quy chuẩn:</label>
                <p>${regulation.name}</p>
            </div>
            <div class="row mb-3">
               <div class="col-md-6">
                  <label class="fw-bold">Mô tả:</label>
                 <p>${regulation.description}</p>
                </div>
                 <div class="col-md-6">
                     <label class="fw-bold">Ngày ban hành:</label>
                    <p>${regulation.publishdate}</p>
                 </div>
           </div>
           <div class="mb-3">
                 <label class="fw-bold">Tình trạng:</label>
                 <p>${formatRegulationStatus(regulation.status)}</p>
           </div>
        </div>
        <div class="modal-footer">
           <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
        </div>
    `;

    const modalElement = document.getElementById('regulationModal');
    modalElement.querySelector('.modal-content').innerHTML = modalContent;

    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

async function addNewRegulation() {
    const newId = generateNextId();
     const modalContent = `
         <div class="modal-header">
            <h5 class="modal-title">Thêm mới quy chuẩn kỹ thuật</h5>
           <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
         </div>
         <div class="modal-body">
            <form id="addRegulationForm" class="needs-validation" novalidate>
                  <div class="mb-3">
                      <label class="form-label required">Mã quy chuẩn</label>
                     <input type="text" class="form-control" name="id" value="${newId}" readonly>
                   </div>
                <div class="mb-3">
                     <label class="form-label required">Tên quy chuẩn</label>
                    <input type="text" class="form-control" name="name" required>
                    <div class="invalid-feedback">Vui lòng nhập tên quy chuẩn</div>
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
             <button type="button" class="btn btn-primary" onclick="saveNewRegulation()">
                <i class="fas fa-save me-1"></i>Lưu
             </button>
         </div>
     `;

    const modalElement = document.getElementById('regulationModal');
    modalElement.querySelector('.modal-content').innerHTML = modalContent;

    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

async function saveNewRegulation() {
    try {
        const form = document.getElementById('addRegulationForm');
          if (!form.checkValidity()) {
            form.classList.add('was-validated');
              return;
          }
         showLoading();
         const formData = {
             id: document.querySelector('#addRegulationForm [name="id"]').value,
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

       await loadRegulations();

         const modalElement = document.getElementById('regulationModal');
         const modal = bootstrap.Modal.getInstance(modalElement);
          modal.hide();

      alert('Thêm mới quy chuẩn thành công!');

   } catch (error) {
         console.error('Lỗi khi thêm mới quy chuẩn:', error);
        alert('Có lỗi xảy ra khi thêm mới quy chuẩn');
    } finally {
      hideLoading();
   }
}
// Tạo ID mới
function generateNextId() {
    if (!allRegulations || allRegulations.length === 0) {
        return "QC001";
    }
    const lastId = allRegulations[allRegulations.length - 1].id;
    const numericPart = parseInt(lastId.slice(2), 10);
    const nextNumericPart = numericPart + 1;
    return `QC${String(nextNumericPart).padStart(3, '0')}`;
}

function editRegulation(id) {
    const regulation = allRegulations.find(i => i.id === id);
    if (!regulation) {
        alert('Không tìm thấy thông tin quy chuẩn');
        return;
    }

    // Định dạng ngày tháng nếu cần
    let publishDateValue = regulation.publishdate;
    if (publishDateValue) {
        // Kiểm tra xem nó đã ở đúng định dạng chưa, nếu không thì định dạng
        if (!/^\d{4}-\d{2}-\d{2}$/.test(publishDateValue)) { // đơn giản regex kiểm tra yyyy-MM-dd
            const date = new Date(regulation.publishdate);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            publishDateValue = `${year}-${month}-${day}`;
        }
    } else {
        publishDateValue = ''; // Hoặc một giá trị mặc định, ví dụ: ngày hôm nay
    }


    const modalContent = `
        <div class="modal-header">
            <h5 class="modal-title">Chỉnh sửa thông tin quy chuẩn</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
            <form id="editRegulationForm" class="needs-validation" novalidate>
                <input type="hidden" name="id" value="${regulation.id}">
                <div class="mb-3">
                    <label class="form-label required">Tên quy chuẩn</label>
                    <input type="text" class="form-control" name="name" value="${regulation.name}" required>
                    <div class="invalid-feedback">Vui lòng nhập tên quy chuẩn</div>
                </div>
                <div class="mb-3">
                    <label class="form-label required">Lĩnh vực</label>
                    <select class="form-select" name="field" required>
                        <option value="agriculture" ${regulation.field === 'agriculture' ? 'selected' : ''}>Nông nghiệp</option>
                        <option value="health" ${regulation.field === 'health' ? 'selected' : ''}>Y tế</option>
                        <option value="industry" ${regulation.field === 'industry' ? 'selected' : ''}>Công nghiệp</option>
                        <option value="construction" ${regulation.field === 'construction' ? 'selected' : ''}>Xây dựng</option>
                        <option value="it" ${regulation.field === 'it' ? 'selected' : ''}>Công nghệ thông tin</option>
                    </select>
                    <div class="invalid-feedback">Vui lòng chọn lĩnh vực</div>
                </div>
                <div class="mb-3">
                    <label class="form-label">Mô tả</label>
                    <textarea class="form-control" name="description" rows="3">${regulation.description}</textarea>
                </div>
                <div class="mb-3">
                    <label class="form-label required">Ngày ban hành</label>
                    <input type="date" class="form-control" name="publishdate" value="${publishDateValue}" required>
                    <div class="invalid-feedback">Vui lòng chọn ngày ban hành</div>
                </div>
                <div class="mb-3">
                    <label class="form-label required">Tình trạng</label>
                    <select class="form-select" name="status" required>
                        <option value="active" ${regulation.status === 'active' ? 'selected' : ''}>Có hiệu lực</option>
                        <option value="inactive" ${regulation.status === 'inactive' ? 'selected' : ''}>Hết hiệu lực</option>
                    </select>
                    <div class="invalid-feedback">Vui lòng chọn tình trạng</div>
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
            <button type="button" class="btn btn-primary" onclick="saveEditedRegulation('${regulation.id}')">
                <i class="fas fa-save me-1"></i>Lưu thay đổi
            </button>
        </div>
    `;

    const modalElement = document.getElementById('regulationModal');
    modalElement.querySelector('.modal-content').innerHTML = modalContent;

    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

async function saveEditedRegulation(id) {
    try {
        const form = document.getElementById('editRegulationForm');
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }

        showLoading();

        //Log element trước khi lấy value
        console.log(document.querySelector('[name="publishdate"]'));

        const formData = {
            id: id,
            name: form.querySelector('[name="name"]').value,
            field: form.querySelector('[name="field"]').value,
            description: form.querySelector('[name="description"]').value,
            publishdate: form.querySelector('[name="publishdate"]').value, // Đảm bảo selector đúng
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
        await loadRegulations();
        // Sắp xếp lại mảng sau khi edit thành công
        allRegulations.sort((a, b) => {
            const idA = parseInt(a.id.slice(2), 10);
            const idB = parseInt(b.id.slice(2), 10);
            return idA - idB;
        });
        displayRegulations();

        const modalElement = document.getElementById('regulationModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();

        alert('Cập nhật thông tin quy chuẩn thành công!');

    } catch (error) {
        console.error('Lỗi khi cập nhật thông tin quy chuẩn:', error);
        alert('Có lỗi xảy ra khi cập nhật thông tin quy chuẩn');
    } finally {
        hideLoading();
    }
}

async function deleteRegulation(id) {
     try {
          const regulation = allRegulations.find(i => i.id === id);
         if (!regulation) {
              alert('Không tìm thấy thông tin quy chuẩn');
               return;
          }

          if (!confirm(`Bạn có chắc chắn muốn xóa quy chuẩn này?\n\n- Mã: ${regulation.id}\n- Tên quy chuẩn: ${regulation.name}`)) {
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
        await loadRegulations();

        alert('Xóa quy chuẩn thành công!');
     } catch (error) {
          console.error('Lỗi khi xóa quy chuẩn:', error);
         alert('Có lỗi xảy ra khi xóa quy chuẩn');
     } finally {
        hideLoading();
    }
}
// ===== UTILITY FUNCTIONS =====
function formatRegulationField(field) {
    const fields = {
        agriculture: "Nông nghiệp",
        health: "Y tế",
        industry: "Công nghiệp",
        construction: "Xây dựng",
         it: "Công nghệ thông tin"
    };
    return fields[field] || field;
}
function formatRegulationStatus(status) {
    const statuses = {
        active: "Có hiệu lực",
        inactive: "Hết hiệu lực",
         expired: "Đã hết hạn",
        pending: "Đang chờ"
    };
    return statuses[status] || status;
}

function formatRegulationStatusClass(status) {
    const statuses = {
        active: "status-active",
        inactive: "status-inactive",
        expired: "status-expired",
        pending: "status-pending"
    };
    return statuses[status] || "";
}

function showLoading() {
    document.getElementById('loading-spinner').classList.remove('d-none');
}

function hideLoading() {
    document.getElementById('loading-spinner').classList.add('d-none');
}
// ===== PAGINATION FUNCTIONS =====
function updatePagination() {
    const totalPages = Math.ceil(filteredRegulations.length / itemsPerPage);
    const paginationElement = document.getElementById('pagination');
    const paginationInfo = document.getElementById('paginationInfo');

    // Cập nhật thông tin phân trang
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, filteredRegulations.length);
    paginationInfo.textContent = `Hiển thị ${startItem}-${endItem} trong tổng số ${filteredRegulations.length} quy chuẩn`;

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
    const totalPages = Math.ceil(filteredRegulations.length / itemsPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        displayRegulations();
    }
}