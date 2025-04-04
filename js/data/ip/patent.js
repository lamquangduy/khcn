let allPatents = [];
let filteredPatents = [];
const tableName = 'khcn_data_ip_patent'; // Tên bảng trong Supabase
let currentPage = 1;
const itemsPerPage = 10;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    loadPatents();
    initializeEventListeners();
});

// ===== EVENT LISTENERS =====
function initializeEventListeners() {
    // Filter event listeners
     document.getElementById('patentField').addEventListener('change', () => {
        currentPage = 1;
        filterPatents();
    });
    document.getElementById('patentStatus').addEventListener('change', () => {
         currentPage = 1;
        filterPatents();
    });
    document.getElementById('searchInput').addEventListener('input', () => {
         currentPage = 1;
        filterPatents();
    });
}

// ===== DATA LOADING =====
async function loadPatents() {
    try {
        showLoading();
        const response = await fetch(`https://data.vunhat2009.workers.dev/${tableName}`);
         if (!response.ok) {
            throw new Error(`Failed to fetch data from ${tableName}`);
        }
        allPatents = await response.json();
        // Sắp xếp theo id
         allPatents.sort((a, b) => {
            const idA = parseInt(a.id.slice(3), 10);
            const idB = parseInt(b.id.slice(3), 10);
            return idA - idB;
        });
        filteredPatents = [...allPatents]; // Initialize filtered data
        displayPatents();
    } catch (error) {
        console.error('Error loading patents:', error);
        alert('Không thể tải dữ liệu bằng sáng chế. Vui lòng thử lại sau.');
    } finally {
        hideLoading();
    }
}

// ===== DISPLAY FUNCTIONS =====
function displayPatents() {
    const tbody = document.getElementById('patentTableBody');
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredPatents.length);
    const displayedData = filteredPatents.slice(startIndex, endIndex);
    tbody.innerHTML = '';

    displayedData.forEach((patent, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${startIndex + index + 1}</td>
            <td>${patent.name}</td>
             <td>${formatPatentField(patent.field)}</td>
            <td>${patent.owner}</td>
            <td>${patent.applicationdate}</td>
           <td><span class="status-badge ${formatPatentStatusClass(patent.status)}">${formatPatentStatus(patent.status)}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-action btn-view" onclick="viewPatent('${patent.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-action btn-edit" onclick="editPatent('${patent.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                     <button class="btn btn-action btn-delete" onclick="deletePatent('${patent.id}')">
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
async function filterPatents() {
     try {
        showLoading();
        const filters = {
            field: document.getElementById('patentField').value,
            status: document.getElementById('patentStatus').value,
             search: document.getElementById('searchInput').value.toLowerCase()
         };

         filteredPatents = allPatents.filter(patent => {
            let matches = true;

             if (filters.field && patent.field !== filters.field) matches = false;
            if (filters.status && patent.status !== filters.status) matches = false;

            if (filters.search) {
                const searchMatch =
                    patent.name.toLowerCase().includes(filters.search) ||
                    patent.owner.toLowerCase().includes(filters.search);
                if (!searchMatch) matches = false;
            }

            return matches;
        });

        displayPatents();
    } catch (error) {
       console.error('Lỗi khi lọc dữ liệu bằng sáng chế:', error);
        alert('Có lỗi xảy ra khi lọc dữ liệu bằng sáng chế');
    } finally {
        hideLoading();
    }
}


// ===== CRUD OPERATIONS =====
function viewPatent(id) {
     const patent = allPatents.find(i => i.id === id);
    if (!patent) {
         alert('Không tìm thấy thông tin bằng sáng chế');
         return;
    }

    const modalContent = `
        <div class="modal-header">
            <h5 class="modal-title">Chi tiết bằng sáng chế</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
       </div>
       <div class="modal-body">
           <div class="row mb-3">
                 <div class="col-md-6">
                      <label class="fw-bold">Mã:</label>
                    <p>${patent.id}</p>
                </div>
                <div class="col-md-6">
                    <label class="fw-bold">Lĩnh vực:</label>
                    <p>${formatPatentField(patent.field)}</p>
                </div>
            </div>
             <div class="mb-3">
                <label class="fw-bold">Tên bằng sáng chế:</label>
                <p>${patent.name}</p>
            </div>
             <div class="row mb-3">
                <div class="col-md-6">
                   <label class="fw-bold">Chủ sở hữu:</label>
                    <p>${patent.owner}</p>
                </div>
                <div class="col-md-6">
                    <label class="fw-bold">Ngày nộp:</label>
                   <p>${patent.applicationdate}</p>
               </div>
           </div>
            <div class="mb-3">
                 <label class="fw-bold">Tình trạng:</label>
                 <p>${formatPatentStatus(patent.status)}</p>
            </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
        </div>
    `;

     const modalElement = document.getElementById('patentModal');
    modalElement.querySelector('.modal-content').innerHTML = modalContent;

    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

async function addNewPatent() {
    const newId = generateNextId();
     const modalContent = `
        <div class="modal-header">
            <h5 class="modal-title">Thêm mới bằng sáng chế</h5>
             <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
             <form id="addPatentForm" class="needs-validation" novalidate>
                 <div class="mb-3">
                    <label class="form-label required">Mã bằng sáng chế</label>
                     <input type="text" class="form-control" name="id" value="${newId}" readonly>
                 </div>
                 <div class="mb-3">
                     <label class="form-label required">Tên bằng sáng chế</label>
                      <input type="text" class="form-control" name="name" required>
                     <div class="invalid-feedback">Vui lòng nhập tên bằng sáng chế</div>
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
                     <label class="form-label required">Chủ sở hữu</label>
                     <input type="text" class="form-control" name="owner" required>
                    <div class="invalid-feedback">Vui lòng nhập chủ sở hữu</div>
                 </div>
                 <div class="mb-3">
                     <label class="form-label required">Ngày nộp</label>
                   <input type="date" class="form-control" name="applicationdate" required>
                    <div class="invalid-feedback">Vui lòng chọn ngày nộp</div>
                </div>
                 <div class="mb-3">
                     <label class="form-label required">Tình trạng</label>
                    <select class="form-select" name="status" required>
                        <option value="">Chọn tình trạng</option>
                          <option value="pending">Đang chờ cấp</option>
                           <option value="granted">Đã cấp</option>
                            <option value="expired">Hết hiệu lực</option>
                   </select>
                     <div class="invalid-feedback">Vui lòng chọn tình trạng</div>
                 </div>
            </form>
         </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
            <button type="button" class="btn btn-primary" onclick="saveNewPatent()">
                <i class="fas fa-save me-1"></i>Lưu
            </button>
        </div>
    `;
     const modalElement = document.getElementById('patentModal');
    modalElement.querySelector('.modal-content').innerHTML = modalContent;

    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

async function saveNewPatent() {
      try {
         const form = document.getElementById('addPatentForm');
           if (!form.checkValidity()) {
               form.classList.add('was-validated');
              return;
            }

           showLoading();

        const formData = {
            id: document.querySelector('#addPatentForm [name="id"]').value,
            name: form.querySelector('[name="name"]').value,
            field: form.querySelector('[name="field"]').value,
            owner: form.querySelector('[name="owner"]').value,
            applicationdate: form.querySelector('[name="applicationdate"]').value,
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
        await loadPatents();

         const modalElement = document.getElementById('patentModal');
         const modal = bootstrap.Modal.getInstance(modalElement);
          modal.hide();

       alert('Thêm mới bằng sáng chế thành công!');

   } catch (error) {
        console.error('Lỗi khi thêm mới bằng sáng chế:', error);
        alert('Có lỗi xảy ra khi thêm mới bằng sáng chế');
    } finally {
       hideLoading();
    }
}
// Tạo ID mới
function generateNextId() {
      if (!allPatents || allPatents.length === 0) {
        return "BSP001";
    }
    const lastId = allPatents[allPatents.length - 1].id;
    const numericPart = parseInt(lastId.slice(3), 10);
    const nextNumericPart = numericPart + 1;
    return `BSP${String(nextNumericPart).padStart(3, '0')}`;
}

function editPatent(id) {
     const patent = allPatents.find(i => i.id === id);
       if (!patent) {
          alert('Không tìm thấy thông tin bằng sáng chế');
          return;
        }

    const modalContent = `
         <div class="modal-header">
             <h5 class="modal-title">Chỉnh sửa thông tin bằng sáng chế</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
         </div>
        <div class="modal-body">
            <form id="editPatentForm" class="needs-validation" novalidate>
                <input type="hidden" name="id" value="${patent.id}">
               <div class="mb-3">
                     <label class="form-label required">Tên bằng sáng chế</label>
                      <input type="text" class="form-control" name="name" value="${patent.name}" required>
                    <div class="invalid-feedback">Vui lòng nhập tên bằng sáng chế</div>
                </div>
                <div class="mb-3">
                     <label class="form-label required">Lĩnh vực</label>
                       <select class="form-select" name="field" required>
                          <option value="agriculture" ${patent.field === 'agriculture' ? 'selected' : ''}>Nông nghiệp</option>
                           <option value="health" ${patent.field === 'health' ? 'selected' : ''}>Y tế</option>
                           <option value="industry" ${patent.field === 'industry' ? 'selected' : ''}>Công nghiệp</option>
                           <option value="construction" ${patent.field === 'construction' ? 'selected' : ''}>Xây dựng</option>
                           <option value="it" ${patent.field === 'it' ? 'selected' : ''}>Công nghệ thông tin</option>
                     </select>
                     <div class="invalid-feedback">Vui lòng chọn lĩnh vực</div>
                </div>
                <div class="mb-3">
                   <label class="form-label required">Chủ sở hữu</label>
                    <input type="text" class="form-control" name="owner" value="${patent.owner}" required>
                    <div class="invalid-feedback">Vui lòng nhập chủ sở hữu</div>
                </div>
                 <div class="mb-3">
                      <label class="form-label required">Ngày nộp</label>
                      <input type="date" class="form-control" name="applicationdate" value="${patent.applicationdate}" required>
                     <div class="invalid-feedback">Vui lòng chọn ngày nộp</div>
                </div>
               <div class="mb-3">
                    <label class="form-label required">Tình trạng</label>
                     <select class="form-select" name="status" required>
                        <option value="pending" ${patent.status === 'pending' ? 'selected' : ''}>Đang chờ cấp</option>
                        <option value="granted" ${patent.status === 'granted' ? 'selected' : ''}>Đã cấp</option>
                        <option value="expired" ${patent.status === 'expired' ? 'selected' : ''}>Hết hiệu lực</option>
                     </select>
                     <div class="invalid-feedback">Vui lòng chọn tình trạng</div>
                </div>
            </form>
        </div>
        <div class="modal-footer">
             <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
           <button type="button" class="btn btn-primary" onclick="saveEditedPatent('${patent.id}')">
               <i class="fas fa-save me-1"></i>Lưu thay đổi
            </button>
        </div>
     `;

     const modalElement = document.getElementById('patentModal');
    modalElement.querySelector('.modal-content').innerHTML = modalContent;

    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

async function saveEditedPatent(id) {
    try {
         const form = document.getElementById('editPatentForm');
          if (!form.checkValidity()) {
            form.classList.add('was-validated');
              return;
          }

         showLoading();

         const formData = {
            id: id,
             name: form.querySelector('[name="name"]').value,
             field: form.querySelector('[name="field"]').value,
            owner: form.querySelector('[name="owner"]').value,
             applicationdate: form.querySelector('[name="applicationdate"]').value,
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
          await loadPatents();
         // Sắp xếp lại mảng sau khi edit thành công
         allPatents.sort((a, b) => {
            const idA = parseInt(a.id.slice(3), 10);
            const idB = parseInt(b.id.slice(3), 10);
            return idA - idB;
        });
          displayPatents();

         const modalElement = document.getElementById('patentModal');
           const modal = bootstrap.Modal.getInstance(modalElement);
         modal.hide();

        alert('Cập nhật thông tin bằng sáng chế thành công!');

     } catch (error) {
         console.error('Lỗi khi cập nhật thông tin bằng sáng chế:', error);
        alert('Có lỗi xảy ra khi cập nhật thông tin bằng sáng chế');
    } finally {
        hideLoading();
   }
}

async function deletePatent(id) {
    try {
        const patent = allPatents.find(i => i.id === id);
       if (!patent) {
            alert('Không tìm thấy thông tin bằng sáng chế');
             return;
       }

        if (!confirm(`Bạn có chắc chắn muốn xóa bằng sáng chế này?\n\n- Mã: ${patent.id}\n- Tên bằng sáng chế: ${patent.name}`)) {
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
        await loadPatents();

        alert('Xóa bằng sáng chế thành công!');

    } catch (error) {
       console.error('Lỗi khi xóa bằng sáng chế:', error);
        alert('Có lỗi xảy ra khi xóa bằng sáng chế');
    } finally {
        hideLoading();
    }
}

// ===== PAGINATION FUNCTIONS =====
function updatePagination() {
    const totalPages = Math.ceil(filteredPatents.length / itemsPerPage);
    const paginationElement = document.getElementById('pagination');
    const paginationInfo = document.getElementById('paginationInfo');

    // Cập nhật thông tin phân trang
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, filteredPatents.length);
    paginationInfo.textContent = `Hiển thị ${startItem}-${endItem} trong tổng số ${filteredPatents.length} bằng sáng chế`;

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
    const totalPages = Math.ceil(filteredPatents.length / itemsPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        displayPatents();
    }
}
// ===== UTILITY FUNCTIONS =====
function formatPatentField(field) {
    const fields = {
        agriculture: "Nông nghiệp",
        health: "Y tế",
        industry: "Công nghiệp",
        construction: "Xây dựng",
        it: "Công nghệ thông tin"
    };
    return fields[field] || field;
}

function formatPatentStatus(status) {
    const statuses = {
        pending: "Đang chờ cấp",
        granted: "Đã cấp",
        expired: "Hết hiệu lực"
    };
    return statuses[status] || status;
}

function formatPatentStatusClass(status) {
      const statuses = {
        pending: "status-pending",
        granted: "status-granted",
        expired: "status-expired"
    };
    return statuses[status] || "";
}


function showLoading() {
    document.getElementById('loading-spinner').classList.remove('d-none');
}

function hideLoading() {
    document.getElementById('loading-spinner').classList.add('d-none');
}