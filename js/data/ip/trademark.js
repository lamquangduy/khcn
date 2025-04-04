let allTrademarks = [];
let filteredTrademarks = [];
const tableName = 'khcn_data_ip_trademark'; // Tên bảng trong Supabase
let currentPage = 1;
const itemsPerPage = 10;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    loadTrademarks();
    initializeEventListeners();
});

// ===== EVENT LISTENERS =====
function initializeEventListeners() {
    // Filter event listeners
     document.getElementById('trademarkField').addEventListener('change', () => {
        currentPage = 1;
        filterTrademarks();
    });
    document.getElementById('trademarkStatus').addEventListener('change', () => {
        currentPage = 1;
        filterTrademarks();
    });
    document.getElementById('searchInput').addEventListener('input', () => {
         currentPage = 1;
        filterTrademarks();
    });
}

// ===== DATA LOADING =====
async function loadTrademarks() {
    try {
        showLoading();
        const response = await fetch(`https://data.vunhat2009.workers.dev/${tableName}`);
         if (!response.ok) {
            throw new Error(`Failed to fetch data from ${tableName}`);
        }
        allTrademarks = await response.json();
        // Sắp xếp theo id
        allTrademarks.sort((a, b) => {
            const idA = parseInt(a.id.slice(2), 10);
            const idB = parseInt(b.id.slice(2), 10);
            return idA - idB;
        });
         filteredTrademarks = [...allTrademarks]; // Initialize filtered data
        displayTrademarks();
    } catch (error) {
        console.error('Error loading trademarks:', error);
        alert('Không thể tải dữ liệu nhãn hiệu. Vui lòng thử lại sau.');
    } finally {
       hideLoading();
    }
}

// ===== DISPLAY FUNCTIONS =====
function displayTrademarks() {
    const tbody = document.getElementById('trademarkTableBody');
     const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredTrademarks.length);
    const displayedData = filteredTrademarks.slice(startIndex, endIndex);
    tbody.innerHTML = '';

    displayedData.forEach((trademark, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${startIndex + index + 1}</td>
            <td>${trademark.name}</td>
             <td>${formatTrademarkField(trademark.field)}</td>
            <td>${trademark.owner}</td>
             <td>${trademark.applicationdate}</td>
            <td><span class="status-badge ${formatTrademarkStatusClass(trademark.status)}">${formatTrademarkStatus(trademark.status)}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-action btn-view" onclick="viewTrademark('${trademark.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-action btn-edit" onclick="editTrademark('${trademark.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-action btn-delete" onclick="deleteTrademark('${trademark.id}')">
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
async function filterTrademarks() {
    try {
        showLoading();
        const filters = {
           field: document.getElementById('trademarkField').value,
            status: document.getElementById('trademarkStatus').value,
             search: document.getElementById('searchInput').value.toLowerCase()
        };

        filteredTrademarks = allTrademarks.filter(trademark => {
            let matches = true;

             if (filters.field && trademark.field !== filters.field) matches = false;
             if (filters.status && trademark.status !== filters.status) matches = false;

            if (filters.search) {
                 const searchMatch =
                    trademark.name.toLowerCase().includes(filters.search) ||
                     trademark.owner.toLowerCase().includes(filters.search);
                 if (!searchMatch) matches = false;
            }

            return matches;
        });

         displayTrademarks(filteredTrademarks);
    } catch (error) {
        console.error('Lỗi khi lọc dữ liệu nhãn hiệu:', error);
       alert('Có lỗi xảy ra khi lọc dữ liệu nhãn hiệu');
    } finally {
        hideLoading();
    }
}

// ===== CRUD OPERATIONS =====
function viewTrademark(id) {
    const trademark = allTrademarks.find(i => i.id === id);
      if (!trademark) {
          alert('Không tìm thấy thông tin nhãn hiệu');
          return;
     }

    const modalContent = `
         <div class="modal-header">
            <h5 class="modal-title">Chi tiết nhãn hiệu</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
         </div>
        <div class="modal-body">
           <div class="row mb-3">
                <div class="col-md-6">
                     <label class="fw-bold">Mã:</label>
                    <p>${trademark.id}</p>
                 </div>
                 <div class="col-md-6">
                     <label class="fw-bold">Lĩnh vực:</label>
                     <p>${formatTrademarkField(trademark.field)}</p>
                 </div>
             </div>
              <div class="mb-3">
                <label class="fw-bold">Tên nhãn hiệu:</label>
                <p>${trademark.name}</p>
              </div>
              <div class="row mb-3">
                  <div class="col-md-6">
                        <label class="fw-bold">Chủ sở hữu:</label>
                        <p>${trademark.owner}</p>
                  </div>
                  <div class="col-md-6">
                        <label class="fw-bold">Ngày nộp:</label>
                        <p>${trademark.applicationdate}</p>
                  </div>
              </div>
            <div class="mb-3">
                 <label class="fw-bold">Tình trạng:</label>
                  <p>${formatTrademarkStatus(trademark.status)}</p>
             </div>
        </div>
        <div class="modal-footer">
             <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
        </div>
    `;

     const modalElement = document.getElementById('trademarkModal');
    modalElement.querySelector('.modal-content').innerHTML = modalContent;

    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

async function addNewTrademark() {
    const newId = generateNextId();
     const modalContent = `
         <div class="modal-header">
             <h5 class="modal-title">Thêm mới nhãn hiệu</h5>
             <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
            <form id="addTrademarkForm" class="needs-validation" novalidate>
                 <div class="mb-3">
                     <label class="form-label required">Mã nhãn hiệu</label>
                     <input type="text" class="form-control" name="id" value="${newId}" readonly>
                 </div>
                 <div class="mb-3">
                     <label class="form-label required">Tên nhãn hiệu</label>
                      <input type="text" class="form-control" name="name" required>
                     <div class="invalid-feedback">Vui lòng nhập tên nhãn hiệu</div>
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
            <button type="button" class="btn btn-primary" onclick="saveNewTrademark()">
                <i class="fas fa-save me-1"></i>Lưu
           </button>
        </div>
    `;

    const modalElement = document.getElementById('trademarkModal');
    modalElement.querySelector('.modal-content').innerHTML = modalContent;

    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

async function saveNewTrademark() {
     try {
         const form = document.getElementById('addTrademarkForm');
           if (!form.checkValidity()) {
               form.classList.add('was-validated');
                return;
           }
        showLoading();

        const formData = {
            id: document.querySelector('#addTrademarkForm [name="id"]').value,
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
       await loadTrademarks();

         const modalElement = document.getElementById('trademarkModal');
          const modal = bootstrap.Modal.getInstance(modalElement);
           modal.hide();

         alert('Thêm mới nhãn hiệu thành công!');

    } catch (error) {
        console.error('Lỗi khi thêm mới nhãn hiệu:', error);
       alert('Có lỗi xảy ra khi thêm mới nhãn hiệu');
    } finally {
        hideLoading();
    }
}
// Tạo ID mới
function generateNextId() {
     if (!allTrademarks || allTrademarks.length === 0) {
        return "NH001";
    }
    const lastId = allTrademarks[allTrademarks.length - 1].id;
    const numericPart = parseInt(lastId.slice(2), 10);
    const nextNumericPart = numericPart + 1;
    return `NH${String(nextNumericPart).padStart(3, '0')}`;
}

function editTrademark(id) {
     const trademark = allTrademarks.find(i => i.id === id);
       if (!trademark) {
          alert('Không tìm thấy thông tin nhãn hiệu');
          return;
     }

    const modalContent = `
         <div class="modal-header">
            <h5 class="modal-title">Chỉnh sửa thông tin nhãn hiệu</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
         </div>
        <div class="modal-body">
            <form id="editTrademarkForm" class="needs-validation" novalidate>
                <input type="hidden" name="id" value="${trademark.id}">
               <div class="mb-3">
                   <label class="form-label required">Tên nhãn hiệu</label>
                    <input type="text" class="form-control" name="name" value="${trademark.name}" required>
                     <div class="invalid-feedback">Vui lòng nhập tên nhãn hiệu</div>
                </div>
                 <div class="mb-3">
                     <label class="form-label required">Lĩnh vực</label>
                       <select class="form-select" name="field" required>
                          <option value="agriculture" ${trademark.field === 'agriculture' ? 'selected' : ''}>Nông nghiệp</option>
                           <option value="health" ${trademark.field === 'health' ? 'selected' : ''}>Y tế</option>
                           <option value="industry" ${trademark.field === 'industry' ? 'selected' : ''}>Công nghiệp</option>
                           <option value="construction" ${trademark.field === 'construction' ? 'selected' : ''}>Xây dựng</option>
                           <option value="it" ${trademark.field === 'it' ? 'selected' : ''}>Công nghệ thông tin</option>
                    </select>
                     <div class="invalid-feedback">Vui lòng chọn lĩnh vực</div>
               </div>
                 <div class="mb-3">
                       <label class="form-label required">Chủ sở hữu</label>
                       <input type="text" class="form-control" name="owner" value="${trademark.owner}" required>
                        <div class="invalid-feedback">Vui lòng nhập chủ sở hữu</div>
                 </div>
                <div class="mb-3">
                      <label class="form-label required">Ngày nộp</label>
                      <input type="date" class="form-control" name="applicationdate" value="${trademark.applicationdate}" required>
                      <div class="invalid-feedback">Vui lòng chọn ngày nộp</div>
                </div>
              <div class="mb-3">
                 <label class="form-label required">Tình trạng</label>
                  <select class="form-select" name="status" required>
                        <option value="pending" ${trademark.status === 'pending' ? 'selected' : ''}>Đang chờ cấp</option>
                        <option value="granted" ${trademark.status === 'granted' ? 'selected' : ''}>Đã cấp</option>
                        <option value="expired" ${trademark.status === 'expired' ? 'selected' : ''}>Hết hiệu lực</option>
                  </select>
                    <div class="invalid-feedback">Vui lòng chọn tình trạng</div>
              </div>
           </form>
       </div>
        <div class="modal-footer">
             <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
            <button type="button" class="btn btn-primary" onclick="saveEditedTrademark('${trademark.id}')">
                <i class="fas fa-save me-1"></i>Lưu thay đổi
           </button>
       </div>
    `;

     const modalElement = document.getElementById('trademarkModal');
     modalElement.querySelector('.modal-content').innerHTML = modalContent;

    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

async function saveEditedTrademark(id) {
   try {
         const form = document.getElementById('editTrademarkForm');
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
        await loadTrademarks();
         // Sắp xếp lại mảng sau khi edit thành công
         allTrademarks.sort((a, b) => {
            const idA = parseInt(a.id.slice(2), 10);
            const idB = parseInt(b.id.slice(2), 10);
            return idA - idB;
        });
        displayTrademarks();
         const modalElement = document.getElementById('trademarkModal');
          const modal = bootstrap.Modal.getInstance(modalElement);
           modal.hide();

         alert('Cập nhật thông tin nhãn hiệu thành công!');

   } catch (error) {
       console.error('Lỗi khi cập nhật thông tin nhãn hiệu:', error);
        alert('Có lỗi xảy ra khi cập nhật thông tin nhãn hiệu');
   } finally {
        hideLoading();
    }
}

async function deleteTrademark(id) {
     try {
        const trademark = allTrademarks.find(i => i.id === id);
          if (!trademark) {
              alert('Không tìm thấy thông tin nhãn hiệu');
               return;
          }

          if (!confirm(`Bạn có chắc chắn muốn xóa nhãn hiệu này?\n\n- Mã: ${trademark.id}\n- Tên nhãn hiệu: ${trademark.name}`)) {
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
          await loadTrademarks();

        alert('Xóa nhãn hiệu thành công!');

    } catch (error) {
         console.error('Lỗi khi xóa nhãn hiệu:', error);
         alert('Có lỗi xảy ra khi xóa nhãn hiệu');
    } finally {
        hideLoading();
    }
}
// ===== PAGINATION FUNCTIONS =====
function updatePagination() {
    const totalPages = Math.ceil(filteredTrademarks.length / itemsPerPage);
    const paginationElement = document.getElementById('pagination');
    const paginationInfo = document.getElementById('paginationInfo');

    // Cập nhật thông tin phân trang
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, filteredTrademarks.length);
    paginationInfo.textContent = `Hiển thị ${startItem}-${endItem} trong tổng số ${filteredTrademarks.length} nhãn hiệu`;

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
    const totalPages = Math.ceil(filteredTrademarks.length / itemsPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        displayTrademarks();
    }
}
// ===== UTILITY FUNCTIONS =====
function formatTrademarkField(field) {
    const fields = {
       agriculture: "Nông nghiệp",
        health: "Y tế",
        industry: "Công nghiệp",
        construction: "Xây dựng",
        it: "Công nghệ thông tin"
    };
    return fields[field] || field;
}

function formatTrademarkStatus(status) {
    const statuses = {
        pending: "Đang chờ cấp",
         granted: "Đã cấp",
        expired: "Hết hiệu lực"
    };
    return statuses[status] || status;
}

function formatTrademarkStatusClass(status) {
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