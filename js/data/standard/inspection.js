let allInspections = [];
let filteredInspections = [];
const tableName = 'khcn_data_standard_inspection'; // Tên bảng trong Supabase
let currentPage = 1;
const itemsPerPage = 10;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    loadInspections();
    initializeEventListeners();
});

// ===== EVENT LISTENERS =====
function initializeEventListeners() {
    // Filter event listeners
     document.getElementById('inspectionField').addEventListener('change', () => {
        currentPage = 1;
        filterInspections();
    });
    document.getElementById('inspectionResult').addEventListener('change', () => {
        currentPage = 1;
        filterInspections();
    });
     document.getElementById('searchInput').addEventListener('input', () => {
        currentPage = 1;
        filterInspections();
    });
}

// ===== DATA LOADING =====
async function loadInspections() {
    try {
        showLoading();
        const response = await fetch(`https://data.vunhat2009.workers.dev/${tableName}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch data from ${tableName}`);
        }
        allInspections = await response.json();
          // Sắp xếp theo id
        allInspections.sort((a, b) => {
            const idA = parseInt(a.id.slice(2), 10);
            const idB = parseInt(b.id.slice(2), 10);
            return idA - idB;
        });
        filteredInspections = [...allInspections]; // Initialize filtered data
        displayInspections();
    } catch (error) {
        console.error('Error loading inspections:', error);
        alert('Không thể tải dữ liệu kiểm định. Vui lòng thử lại sau.');
    } finally {
        hideLoading();
    }
}


// ===== DISPLAY FUNCTIONS =====
function displayInspections() {
     const tbody = document.getElementById('inspectionTableBody');
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredInspections.length);
    const displayedData = filteredInspections.slice(startIndex, endIndex);
    tbody.innerHTML = '';

    displayedData.forEach((inspection, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
           <td>${startIndex + index + 1}</td>
           <td>${inspection.name}</td>
            <td>${formatInspectionField(inspection.field)}</td>
           <td>${inspection.unit}</td>
           <td>${inspection.inspectiondate}</td>
           <td><span class="result-badge ${formatInspectionResultClass(inspection.result)}">${formatInspectionResult(inspection.result)}</span></td>
            <td>
                <div class="action-buttons">
                     <button class="btn btn-action btn-view" onclick="viewInspection('${inspection.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-action btn-edit" onclick="editInspection('${inspection.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-action btn-delete" onclick="deleteInspection('${inspection.id}')">
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
async function filterInspections() {
    try {
        showLoading();
         const filters = {
            field: document.getElementById('inspectionField').value,
              result: document.getElementById('inspectionResult').value,
              search: document.getElementById('searchInput').value.toLowerCase()
         };

         filteredInspections = allInspections.filter(inspection => {
             let matches = true;

            if (filters.field && inspection.field !== filters.field) matches = false;
            if (filters.result && inspection.result !== filters.result) matches = false;

             if (filters.search) {
               const searchMatch =
                   inspection.name.toLowerCase().includes(filters.search) ||
                   inspection.unit.toLowerCase().includes(filters.search);
               if (!searchMatch) matches = false;
             }

            return matches;
        });

        displayInspections();
    } catch (error) {
        console.error('Lỗi khi lọc dữ liệu kiểm định:', error);
       alert('Có lỗi xảy ra khi lọc dữ liệu kiểm định');
   } finally {
        hideLoading();
    }
}

// ===== CRUD OPERATIONS =====
function viewInspection(id) {
    const inspection = allInspections.find(i => i.id === id);
    if (!inspection) {
        alert('Không tìm thấy thông tin kiểm định');
          return;
    }

   const modalContent = `
        <div class="modal-header">
             <h5 class="modal-title">Chi tiết kiểm định chất lượng</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
         </div>
        <div class="modal-body">
           <div class="row mb-3">
                <div class="col-md-6">
                     <label class="fw-bold">Mã:</label>
                     <p>${inspection.id}</p>
                </div>
                 <div class="col-md-6">
                      <label class="fw-bold">Lĩnh vực:</label>
                    <p>${formatInspectionField(inspection.field)}</p>
                 </div>
            </div>
            <div class="mb-3">
                <label class="fw-bold">Tên kiểm định:</label>
                <p>${inspection.name}</p>
            </div>
            <div class="row mb-3">
               <div class="col-md-6">
                    <label class="fw-bold">Đơn vị kiểm định:</label>
                   <p>${inspection.unit}</p>
               </div>
                <div class="col-md-6">
                   <label class="fw-bold">Ngày thực hiện:</label>
                   <p>${inspection.inspectiondate}</p>
                </div>
            </div>
            <div class="mb-3">
                 <label class="fw-bold">Kết quả:</label>
                <p>${formatInspectionResult(inspection.result)}</p>
            </div>
       </div>
      <div class="modal-footer">
           <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
       </div>
    `;

    const modalElement = document.getElementById('inspectionModal');
    modalElement.querySelector('.modal-content').innerHTML = modalContent;

    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

async function addNewInspection() {
     const newId = generateNextId();
     const modalContent = `
        <div class="modal-header">
            <h5 class="modal-title">Thêm mới kiểm định chất lượng</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
         </div>
        <div class="modal-body">
            <form id="addInspectionForm" class="needs-validation" novalidate>
                 <div class="mb-3">
                     <label class="form-label required">Mã kiểm định</label>
                     <input type="text" class="form-control" name="id" value="${newId}" readonly>
                 </div>
                <div class="mb-3">
                     <label class="form-label required">Tên kiểm định</label>
                    <input type="text" class="form-control" name="name" required>
                   <div class="invalid-feedback">Vui lòng nhập tên kiểm định</div>
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
                    <label class="form-label required">Đơn vị kiểm định</label>
                    <input type="text" class="form-control" name="unit" required>
                    <div class="invalid-feedback">Vui lòng nhập đơn vị kiểm định</div>
                </div>
                 <div class="mb-3">
                    <label class="form-label required">Ngày thực hiện</label>
                     <input type="date" class="form-control" name="inspectiondate" required>
                     <div class="invalid-feedback">Vui lòng chọn ngày thực hiện</div>
                </div>
               <div class="mb-3">
                    <label class="form-label required">Kết quả</label>
                     <select class="form-select" name="result" required>
                       <option value="">Chọn kết quả</option>
                           <option value="pass">Đạt yêu cầu</option>
                            <option value="fail">Không đạt yêu cầu</option>
                            <option value="pending">Chưa có kết quả</option>
                    </select>
                    <div class="invalid-feedback">Vui lòng chọn kết quả</div>
               </div>
            </form>
         </div>
         <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
             <button type="button" class="btn btn-primary" onclick="saveNewInspection()">
                 <i class="fas fa-save me-1"></i>Lưu
            </button>
        </div>
    `;

     const modalElement = document.getElementById('inspectionModal');
    modalElement.querySelector('.modal-content').innerHTML = modalContent;

    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

async function saveNewInspection() {
     try {
        const form = document.getElementById('addInspectionForm');
          if (!form.checkValidity()) {
              form.classList.add('was-validated');
               return;
         }

        showLoading();

        const formData = {
            id: document.querySelector('#addInspectionForm [name="id"]').value,
             name: form.querySelector('[name="name"]').value,
            field: form.querySelector('[name="field"]').value,
            unit: form.querySelector('[name="unit"]').value,
             inspectiondate: form.querySelector('[name="inspectiondate"]').value,
            result: form.querySelector('[name="result"]').value,
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
          await loadInspections();

        const modalElement = document.getElementById('inspectionModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
         modal.hide();

        alert('Thêm mới kiểm định thành công!');

   } catch (error) {
         console.error('Lỗi khi thêm mới kiểm định:', error);
        alert('Có lỗi xảy ra khi thêm mới kiểm định');
   } finally {
        hideLoading();
    }
}

// Tạo ID mới
function generateNextId() {
    if (!allInspections || allInspections.length === 0) {
        return "KD001";
    }
    const lastId = allInspections[allInspections.length - 1].id;
    const numericPart = parseInt(lastId.slice(2), 10);
    const nextNumericPart = numericPart + 1;
    return `KD${String(nextNumericPart).padStart(3, '0')}`;
}

function editInspection(id) {
    const inspection = allInspections.find(i => i.id === id);
       if (!inspection) {
         alert('Không tìm thấy thông tin kiểm định');
         return;
     }

    const modalContent = `
          <div class="modal-header">
              <h5 class="modal-title">Chỉnh sửa thông tin kiểm định</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
         </div>
        <div class="modal-body">
             <form id="editInspectionForm" class="needs-validation" novalidate>
                <input type="hidden" name="id" value="${inspection.id}">
                 <div class="mb-3">
                      <label class="form-label required">Tên kiểm định</label>
                     <input type="text" class="form-control" name="name" value="${inspection.name}" required>
                     <div class="invalid-feedback">Vui lòng nhập tên kiểm định</div>
                 </div>
                <div class="mb-3">
                    <label class="form-label required">Lĩnh vực</label>
                     <select class="form-select" name="field" required>
                         <option value="agriculture" ${inspection.field === 'agriculture' ? 'selected' : ''}>Nông nghiệp</option>
                         <option value="health" ${inspection.field === 'health' ? 'selected' : ''}>Y tế</option>
                         <option value="industry" ${inspection.field === 'industry' ? 'selected' : ''}>Công nghiệp</option>
                         <option value="construction" ${inspection.field === 'construction' ? 'selected' : ''}>Xây dựng</option>
                         <option value="it" ${inspection.field === 'it' ? 'selected' : ''}>Công nghệ thông tin</option>
                    </select>
                     <div class="invalid-feedback">Vui lòng chọn lĩnh vực</div>
                </div>
               <div class="mb-3">
                    <label class="form-label required">Đơn vị kiểm định</label>
                    <input type="text" class="form-control" name="unit" value="${inspection.unit}" required>
                   <div class="invalid-feedback">Vui lòng nhập đơn vị kiểm định</div>
                </div>
                 <div class="mb-3">
                      <label class="form-label required">Ngày thực hiện</label>
                     <input type="date" class="form-control" name="inspectiondate" value="${inspection.inspectiondate}" required>
                     <div class="invalid-feedback">Vui lòng chọn ngày thực hiện</div>
                </div>
                <div class="mb-3">
                   <label class="form-label required">Kết quả</label>
                     <select class="form-select" name="result" required>
                          <option value="pass" ${inspection.result === 'pass' ? 'selected' : ''}>Đạt yêu cầu</option>
                           <option value="fail" ${inspection.result === 'fail' ? 'selected' : ''}>Không đạt yêu cầu</option>
                         <option value="pending" ${inspection.result === 'pending' ? 'selected' : ''}>Chưa có kết quả</option>
                     </select>
                     <div class="invalid-feedback">Vui lòng chọn kết quả</div>
                 </div>
            </form>
         </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
             <button type="button" class="btn btn-primary" onclick="saveEditedInspection('${inspection.id}')">
               <i class="fas fa-save me-1"></i>Lưu thay đổi
            </button>
         </div>
    `;

     const modalElement = document.getElementById('inspectionModal');
    modalElement.querySelector('.modal-content').innerHTML = modalContent;

     const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

async function saveEditedInspection(id) {
   try {
          const form = document.getElementById('editInspectionForm');
            if (!form.checkValidity()) {
             form.classList.add('was-validated');
                return;
            }

       showLoading();

         const formData = {
            id: id,
            name: form.querySelector('[name="name"]').value,
             field: form.querySelector('[name="field"]').value,
           unit: form.querySelector('[name="unit"]').value,
            inspectiondate: form.querySelector('[name="inspectiondate"]').value,
            result: form.querySelector('[name="result"]').value,
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
         await loadInspections();
         // Sắp xếp lại mảng sau khi edit thành công
        allInspections.sort((a, b) => {
            const idA = parseInt(a.id.slice(2), 10);
            const idB = parseInt(b.id.slice(2), 10);
            return idA - idB;
        });
         displayInspections();

        const modalElement = document.getElementById('inspectionModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
         modal.hide();

       alert('Cập nhật thông tin kiểm định thành công!');

   } catch (error) {
         console.error('Lỗi khi cập nhật thông tin kiểm định:', error);
        alert('Có lỗi xảy ra khi cập nhật thông tin kiểm định');
    } finally {
        hideLoading();
    }
}

async function deleteInspection(id) {
      try {
          const inspection = allInspections.find(i => i.id === id);
        if (!inspection) {
             alert('Không tìm thấy thông tin kiểm định');
           return;
        }

       if (!confirm(`Bạn có chắc chắn muốn xóa kiểm định này?\n\n- Mã: ${inspection.id}\n- Tên kiểm định: ${inspection.name}`)) {
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
         await loadInspections();

       alert('Xóa kiểm định thành công!');

   } catch (error) {
      console.error('Lỗi khi xóa kiểm định:', error);
     alert('Có lỗi xảy ra khi xóa kiểm định');
    } finally {
        hideLoading();
    }
}

// ===== PAGINATION FUNCTIONS =====
function updatePagination() {
    const totalPages = Math.ceil(filteredInspections.length / itemsPerPage);
    const paginationElement = document.getElementById('pagination');
    const paginationInfo = document.getElementById('paginationInfo');

    // Cập nhật thông tin phân trang
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, filteredInspections.length);
    paginationInfo.textContent = `Hiển thị ${startItem}-${endItem} trong tổng số ${filteredInspections.length} kiểm định`;

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
    const totalPages = Math.ceil(filteredInspections.length / itemsPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        displayInspections();
    }
}

// ===== UTILITY FUNCTIONS =====
function formatInspectionField(field) {
    const fields = {
       agriculture: "Nông nghiệp",
       health: "Y tế",
        industry: "Công nghiệp",
       construction: "Xây dựng",
        it: "Công nghệ thông tin"
    };
    return fields[field] || field;
}

function formatInspectionResult(result) {
    const results = {
        pass: "Đạt yêu cầu",
       fail: "Không đạt yêu cầu",
         pending: "Chưa có kết quả"
    };
    return results[result] || result;
}

function formatInspectionResultClass(result) {
     const results = {
         pass: "result-pass",
        fail: "result-fail",
        pending: "result-pending"
    };
   return results[result] || "";
}

function showLoading() {
    document.getElementById('loading-spinner').classList.remove('d-none');
}

function hideLoading() {
    document.getElementById('loading-spinner').classList.add('d-none');
}
