let allSolutions = [];
let filteredSolutions = [];
const tableName = 'khcn_data_ip_solution'; // Tên bảng trong Supabase
let currentPage = 1;
const itemsPerPage = 10;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    loadSolutions();
    initializeEventListeners();
});

// ===== EVENT LISTENERS =====
function initializeEventListeners() {
    // Filter event listeners
     document.getElementById('solutionField').addEventListener('change', () => {
        currentPage = 1;
        filterSolutions();
    });
     document.getElementById('solutionStatus').addEventListener('change', () => {
        currentPage = 1;
        filterSolutions();
    });
    document.getElementById('searchInput').addEventListener('input', () => {
       currentPage = 1;
        filterSolutions();
    });
}

// ===== DATA LOADING =====
async function loadSolutions() {
    try {
        showLoading();
        const response = await fetch(`https://data.vunhat2009.workers.dev/${tableName}`);
         if (!response.ok) {
            throw new Error(`Failed to fetch data from ${tableName}`);
        }
        allSolutions = await response.json();
        // Sắp xếp theo id
        allSolutions.sort((a, b) => {
            const idA = parseInt(a.id.slice(3), 10);
            const idB = parseInt(b.id.slice(3), 10);
            return idA - idB;
        });
        filteredSolutions = [...allSolutions]; // Initialize filtered data
        displaySolutions();
    } catch (error) {
        console.error('Error loading solutions:', error);
        alert('Không thể tải dữ liệu giải pháp. Vui lòng thử lại sau.');
    } finally {
       hideLoading();
    }
}

// ===== DISPLAY FUNCTIONS =====
function displaySolutions() {
     const tbody = document.getElementById('solutionTableBody');
     const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredSolutions.length);
    const displayedData = filteredSolutions.slice(startIndex, endIndex);
    tbody.innerHTML = '';

    displayedData.forEach((solution, index) => {
        const row = document.createElement('tr');
         row.innerHTML = `
             <td>${startIndex + index + 1}</td>
            <td>${solution.name}</td>
             <td>${formatSolutionField(solution.field)}</td>
            <td>${solution.owner}</td>
            <td>${solution.applicationdate}</td>
             <td><span class="status-badge ${formatSolutionStatusClass(solution.status)}">${formatSolutionStatus(solution.status)}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-action btn-view" onclick="viewSolution('${solution.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-action btn-edit" onclick="editSolution('${solution.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                     <button class="btn btn-action btn-delete" onclick="deleteSolution('${solution.id}')">
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
async function filterSolutions() {
      try {
           showLoading();
        const filters = {
            field: document.getElementById('solutionField').value,
            status: document.getElementById('solutionStatus').value,
             search: document.getElementById('searchInput').value.toLowerCase()
         };

        filteredSolutions = allSolutions.filter(solution => {
            let matches = true;

             if (filters.field && solution.field !== filters.field) matches = false;
             if (filters.status && solution.status !== filters.status) matches = false;

             if (filters.search) {
                 const searchMatch =
                    solution.name.toLowerCase().includes(filters.search) ||
                    solution.owner.toLowerCase().includes(filters.search);
                 if (!searchMatch) matches = false;
            }

             return matches;
        });

        displaySolutions();
   } catch (error) {
        console.error('Lỗi khi lọc dữ liệu giải pháp:', error);
         alert('Có lỗi xảy ra khi lọc dữ liệu giải pháp');
    } finally {
       hideLoading();
    }
}

// ===== CRUD OPERATIONS =====
function viewSolution(id) {
    const solution = allSolutions.find(i => i.id === id);
      if (!solution) {
          alert('Không tìm thấy thông tin giải pháp');
          return;
      }

    const modalContent = `
        <div class="modal-header">
             <h5 class="modal-title">Chi tiết giải pháp hữu ích</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
         </div>
         <div class="modal-body">
            <div class="row mb-3">
                 <div class="col-md-6">
                     <label class="fw-bold">Mã:</label>
                    <p>${solution.id}</p>
                 </div>
                <div class="col-md-6">
                     <label class="fw-bold">Lĩnh vực:</label>
                    <p>${formatSolutionField(solution.field)}</p>
                </div>
            </div>
            <div class="mb-3">
                <label class="fw-bold">Tên giải pháp:</label>
                <p>${solution.name}</p>
             </div>
            <div class="row mb-3">
                  <div class="col-md-6">
                       <label class="fw-bold">Chủ sở hữu:</label>
                      <p>${solution.owner}</p>
                </div>
                <div class="col-md-6">
                   <label class="fw-bold">Ngày nộp:</label>
                    <p>${solution.applicationdate}</p>
                </div>
            </div>
           <div class="mb-3">
              <label class="fw-bold">Tình trạng:</label>
              <p>${formatSolutionStatus(solution.status)}</p>
            </div>
        </div>
       <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
        </div>
    `;

    const modalElement = document.getElementById('solutionModal');
    modalElement.querySelector('.modal-content').innerHTML = modalContent;

    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

async function addNewSolution() {
    const newId = generateNextId();
     const modalContent = `
       <div class="modal-header">
            <h5 class="modal-title">Thêm mới giải pháp hữu ích</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
            <form id="addSolutionForm" class="needs-validation" novalidate>
                 <div class="mb-3">
                    <label class="form-label required">Mã giải pháp</label>
                     <input type="text" class="form-control" name="id" value="${newId}" readonly>
                 </div>
                 <div class="mb-3">
                    <label class="form-label required">Tên giải pháp</label>
                    <input type="text" class="form-control" name="name" required>
                   <div class="invalid-feedback">Vui lòng nhập tên giải pháp</div>
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
            <button type="button" class="btn btn-primary" onclick="saveNewSolution()">
                <i class="fas fa-save me-1"></i>Lưu
            </button>
         </div>
    `;

      const modalElement = document.getElementById('solutionModal');
    modalElement.querySelector('.modal-content').innerHTML = modalContent;

    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

async function saveNewSolution() {
     try {
          const form = document.getElementById('addSolutionForm');
           if (!form.checkValidity()) {
               form.classList.add('was-validated');
             return;
           }
           showLoading();

          const formData = {
            id: document.querySelector('#addSolutionForm [name="id"]').value,
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
         await loadSolutions();

        const modalElement = document.getElementById('solutionModal');
       const modal = bootstrap.Modal.getInstance(modalElement);
         modal.hide();

        alert('Thêm mới giải pháp hữu ích thành công!');

   } catch (error) {
         console.error('Lỗi khi thêm mới giải pháp:', error);
         alert('Có lỗi xảy ra khi thêm mới giải pháp');
    } finally {
       hideLoading();
    }
}
// Tạo ID mới
function generateNextId() {
    if (!allSolutions || allSolutions.length === 0) {
        return "GPH001";
    }
    const lastId = allSolutions[allSolutions.length - 1].id;
    const numericPart = parseInt(lastId.slice(3), 10);
    const nextNumericPart = numericPart + 1;
    return `GPH${String(nextNumericPart).padStart(3, '0')}`;
}

function editSolution(id) {
    const solution = allSolutions.find(i => i.id === id);
      if (!solution) {
         alert('Không tìm thấy thông tin giải pháp');
          return;
      }

    const modalContent = `
          <div class="modal-header">
              <h5 class="modal-title">Chỉnh sửa thông tin giải pháp</h5>
             <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
           <form id="editSolutionForm" class="needs-validation" novalidate>
               <input type="hidden" name="id" value="${solution.id}">
                <div class="mb-3">
                     <label class="form-label required">Tên giải pháp</label>
                     <input type="text" class="form-control" name="name" value="${solution.name}" required>
                     <div class="invalid-feedback">Vui lòng nhập tên giải pháp</div>
                </div>
                 <div class="mb-3">
                    <label class="form-label required">Lĩnh vực</label>
                     <select class="form-select" name="field" required>
                         <option value="agriculture" ${solution.field === 'agriculture' ? 'selected' : ''}>Nông nghiệp</option>
                        <option value="health" ${solution.field === 'health' ? 'selected' : ''}>Y tế</option>
                          <option value="industry" ${solution.field === 'industry' ? 'selected' : ''}>Công nghiệp</option>
                         <option value="construction" ${solution.field === 'construction' ? 'selected' : ''}>Xây dựng</option>
                        <option value="it" ${solution.field === 'it' ? 'selected' : ''}>Công nghệ thông tin</option>
                    </select>
                     <div class="invalid-feedback">Vui lòng chọn lĩnh vực</div>
               </div>
                 <div class="mb-3">
                     <label class="form-label required">Chủ sở hữu</label>
                    <input type="text" class="form-control" name="owner" value="${solution.owner}" required>
                     <div class="invalid-feedback">Vui lòng nhập chủ sở hữu</div>
                 </div>
                <div class="mb-3">
                   <label class="form-label required">Ngày nộp</label>
                     <input type="date" class="form-control" name="applicationdate" value="${solution.applicationdate}" required>
                     <div class="invalid-feedback">Vui lòng chọn ngày nộp</div>
                </div>
               <div class="mb-3">
                   <label class="form-label required">Tình trạng</label>
                   <select class="form-select" name="status" required>
                        <option value="pending" ${solution.status === 'pending' ? 'selected' : ''}>Đang chờ cấp</option>
                          <option value="granted" ${solution.status === 'granted' ? 'selected' : ''}>Đã cấp</option>
                        <option value="expired" ${solution.status === 'expired' ? 'selected' : ''}>Hết hiệu lực</option>
                    </select>
                     <div class="invalid-feedback">Vui lòng chọn tình trạng</div>
                </div>
           </form>
       </div>
        <div class="modal-footer">
           <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
           <button type="button" class="btn btn-primary" onclick="saveEditedSolution('${solution.id}')">
                <i class="fas fa-save me-1"></i>Lưu thay đổi
           </button>
       </div>
    `;

     const modalElement = document.getElementById('solutionModal');
    modalElement.querySelector('.modal-content').innerHTML = modalContent;

    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

async function saveEditedSolution(id) {
    try {
        const form = document.getElementById('editSolutionForm');
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
          await loadSolutions();
         // Sắp xếp lại mảng sau khi edit thành công
        allSolutions.sort((a, b) => {
            const idA = parseInt(a.id.slice(3), 10);
            const idB = parseInt(b.id.slice(3), 10);
            return idA - idB;
        });
        displaySolutions();
          const modalElement = document.getElementById('solutionModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
          modal.hide();

        alert('Cập nhật thông tin giải pháp thành công!');

    } catch (error) {
       console.error('Lỗi khi cập nhật thông tin giải pháp:', error);
        alert('Có lỗi xảy ra khi cập nhật thông tin giải pháp');
    } finally {
         hideLoading();
    }
}

async function deleteSolution(id) {
     try {
        const solution = allSolutions.find(i => i.id === id);
       if (!solution) {
           alert('Không tìm thấy thông tin giải pháp');
           return;
        }

       if (!confirm(`Bạn có chắc chắn muốn xóa giải pháp này?\n\n- Mã: ${solution.id}\n- Tên giải pháp: ${solution.name}`)) {
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
        await loadSolutions();

       alert('Xóa giải pháp thành công!');

    } catch (error) {
      console.error('Lỗi khi xóa giải pháp:', error);
      alert('Có lỗi xảy ra khi xóa giải pháp');
   } finally {
      hideLoading();
    }
}

// ===== PAGINATION FUNCTIONS =====
function updatePagination() {
    const totalPages = Math.ceil(filteredSolutions.length / itemsPerPage);
    const paginationElement = document.getElementById('pagination');
    const paginationInfo = document.getElementById('paginationInfo');

    // Cập nhật thông tin phân trang
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, filteredSolutions.length);
    paginationInfo.textContent = `Hiển thị ${startItem}-${endItem} trong tổng số ${filteredSolutions.length} giải pháp`;

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
    const totalPages = Math.ceil(filteredSolutions.length / itemsPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        displaySolutions();
    }
}
// ===== UTILITY FUNCTIONS =====
function formatSolutionField(field) {
    const fields = {
        agriculture: "Nông nghiệp",
       health: "Y tế",
        industry: "Công nghiệp",
        construction: "Xây dựng",
        it: "Công nghệ thông tin"
    };
    return fields[field] || field;
}
function formatSolutionStatus(status) {
     const statuses = {
       pending: "Đang chờ cấp",
        granted: "Đã cấp",
        expired: "Hết hiệu lực"
    };
    return statuses[status] || status;
}
function formatSolutionStatusClass(status) {
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