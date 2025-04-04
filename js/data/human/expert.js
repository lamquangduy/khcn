let allExperts = [];
let filteredExperts = [];
const tableName = 'khcn_data_human_expert'; // Tên bảng trong Supabase
let currentPage = 1;
const itemsPerPage = 10;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    loadExperts();
    initializeEventListeners();
});

// ===== EVENT LISTENERS =====
function initializeEventListeners() {
    // Filter event listeners
     document.getElementById('expertField').addEventListener('change', () => {
        currentPage = 1;
        filterExperts();
    });
    document.getElementById('expertDegree').addEventListener('change', () => {
        currentPage = 1;
        filterExperts();
    });
    document.getElementById('searchInput').addEventListener('input', () => {
       currentPage = 1;
        filterExperts();
    });
}

// ===== DATA LOADING =====
async function loadExperts() {
    try {
        showLoading();
        const response = await fetch(`https://data.vunhat2009.workers.dev/${tableName}`);
         if (!response.ok) {
            throw new Error(`Failed to fetch data from ${tableName}`);
        }
        allExperts = await response.json();
         // Sắp xếp theo id
         allExperts.sort((a, b) => {
            const idA = parseInt(a.id.slice(2), 10);
            const idB = parseInt(b.id.slice(2), 10);
            return idA - idB;
        });
        filteredExperts = [...allExperts]; // Initialize filtered data
        displayExperts();
    } catch (error) {
        console.error('Error loading experts:', error);
        alert('Không thể tải dữ liệu chuyên gia. Vui lòng thử lại sau.');
    } finally {
        hideLoading();
    }
}

// ===== DISPLAY FUNCTIONS =====
function displayExperts() {
    const tbody = document.getElementById('expertTableBody');
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredExperts.length);
    const displayedData = filteredExperts.slice(startIndex, endIndex);
    tbody.innerHTML = '';

    displayedData.forEach((expert, index) => {
        const row = document.createElement('tr');
         row.innerHTML = `
            <td>${startIndex + index + 1}</td>
            <td>${expert.name}</td>
            <td>${formatExpertField(expert.field)}</td>
             <td><span class="degree-badge ${formatExpertDegreeClass(expert.degree)}">${formatExpertDegree(expert.degree)}</span></td>
            <td>${expert.workplace}</td>
           <td>
                <div class="action-buttons">
                     <button class="btn btn-action btn-view" onclick="viewExpert('${expert.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-action btn-edit" onclick="editExpert('${expert.id}')">
                       <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-action btn-delete" onclick="deleteExpert('${expert.id}')">
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
async function filterExperts() {
    try {
        showLoading();
        const filters = {
            field: document.getElementById('expertField').value,
            degree: document.getElementById('expertDegree').value,
           search: document.getElementById('searchInput').value.toLowerCase()
        };

        filteredExperts = allExperts.filter(expert => {
            let matches = true;

           if (filters.field && expert.field !== filters.field) matches = false;
             if (filters.degree && expert.degree !== filters.degree) matches = false;
            if (filters.search) {
                const searchMatch =
                    expert.name.toLowerCase().includes(filters.search) ||
                     expert.workplace.toLowerCase().includes(filters.search);
                if (!searchMatch) matches = false;
            }

            return matches;
        });

        displayExperts();
    } catch (error) {
         console.error('Lỗi khi lọc dữ liệu chuyên gia:', error);
        alert('Có lỗi xảy ra khi lọc dữ liệu chuyên gia');
    } finally {
        hideLoading();
    }
}

// ===== CRUD OPERATIONS =====
function viewExpert(id) {
     const expert = allExperts.find(i => i.id === id);
      if (!expert) {
        alert('Không tìm thấy thông tin chuyên gia');
        return;
     }

    const modalContent = `
         <div class="modal-header">
            <h5 class="modal-title">Chi tiết chuyên gia, nhà khoa học</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
         </div>
         <div class="modal-body">
             <div class="row mb-3">
                <div class="col-md-6">
                     <label class="fw-bold">Mã:</label>
                    <p>${expert.id}</p>
               </div>
               <div class="col-md-6">
                    <label class="fw-bold">Lĩnh vực:</label>
                     <p>${formatExpertField(expert.field)}</p>
                </div>
            </div>
            <div class="mb-3">
               <label class="fw-bold">Họ và tên:</label>
                <p>${expert.name}</p>
             </div>
            <div class="row mb-3">
                <div class="col-md-6">
                      <label class="fw-bold">Học vị:</label>
                     <p>${formatExpertDegree(expert.degree)}</p>
                </div>
                <div class="col-md-6">
                    <label class="fw-bold">Nơi công tác:</label>
                    <p>${expert.workplace}</p>
                </div>
            </div>
       </div>
       <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
       </div>
    `;

    const modalElement = document.getElementById('expertModal');
    modalElement.querySelector('.modal-content').innerHTML = modalContent;

    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

async function addNewExpert() {
    const modalContent = `
       <div class="modal-header">
             <h5 class="modal-title">Thêm mới chuyên gia, nhà khoa học</h5>
             <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
            <form id="addExpertForm" class="needs-validation" novalidate>
                 <div class="mb-3">
                    <label class="form-label required">Mã chuyên gia</label>
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
                     <label class="form-label required">Học vị</label>
                       <select class="form-select" name="degree" required>
                            <option value="">Chọn học vị</option>
                           <option value="professor">Giáo sư</option>
                           <option value="associate_professor">Phó giáo sư</option>
                             <option value="doctor">Tiến sĩ</option>
                            <option value="master">Thạc sĩ</option>
                             <option value="bachelor">Cử nhân</option>
                       </select>
                     <div class="invalid-feedback">Vui lòng chọn học vị</div>
                 </div>
                <div class="mb-3">
                     <label class="form-label">Nơi công tác</label>
                     <input type="text" class="form-control" name="workplace">
                 </div>
            </form>
        </div>
        <div class="modal-footer">
           <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
            <button type="button" class="btn btn-primary" onclick="saveNewExpert()">
                 <i class="fas fa-save me-1"></i>Lưu
           </button>
        </div>
    `;

    const modalElement = document.getElementById('expertModal');
    modalElement.querySelector('.modal-content').innerHTML = modalContent;

    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

async function saveNewExpert() {
      try {
          const form = document.getElementById('addExpertForm');
           if (!form.checkValidity()) {
              form.classList.add('was-validated');
               return;
          }

         showLoading();

       const formData = {
             id: document.querySelector('#addExpertForm [name="id"]').value,
            name: form.querySelector('[name="name"]').value,
            field: form.querySelector('[name="field"]').value,
            degree: form.querySelector('[name="degree"]').value,
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
        await loadExperts();

          const modalElement = document.getElementById('expertModal');
         const modal = bootstrap.Modal.getInstance(modalElement);
          modal.hide();

       alert('Thêm mới chuyên gia thành công!');

   } catch (error) {
         console.error('Lỗi khi thêm mới chuyên gia:', error);
       alert('Có lỗi xảy ra khi thêm mới chuyên gia');
    } finally {
        hideLoading();
    }
}

// Tạo ID mới
function generateNextId() {
    if (!allExperts || allExperts.length === 0) {
        return "CG001";
    }
    const lastId = allExperts[allExperts.length - 1].id;
    const numericPart = parseInt(lastId.slice(2), 10);
    const nextNumericPart = numericPart + 1;
    return `CG${String(nextNumericPart).padStart(3, '0')}`;
}

function editExpert(id) {
     const expert = allExperts.find(i => i.id === id);
      if (!expert) {
        alert('Không tìm thấy thông tin chuyên gia');
        return;
     }

    const modalContent = `
         <div class="modal-header">
            <h5 class="modal-title">Chỉnh sửa thông tin chuyên gia</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
         </div>
         <div class="modal-body">
            <form id="editExpertForm" class="needs-validation" novalidate>
                <input type="hidden" name="id" value="${expert.id}">
                 <div class="mb-3">
                     <label class="form-label required">Họ và tên</label>
                    <input type="text" class="form-control" name="name" value="${expert.name}" required>
                    <div class="invalid-feedback">Vui lòng nhập họ và tên</div>
                 </div>
                 <div class="mb-3">
                    <label class="form-label required">Lĩnh vực</label>
                     <select class="form-select" name="field" required>
                         <option value="agriculture" ${expert.field === 'agriculture' ? 'selected' : ''}>Nông nghiệp</option>
                          <option value="health" ${expert.field === 'health' ? 'selected' : ''}>Y tế</option>
                         <option value="industry" ${expert.field === 'industry' ? 'selected' : ''}>Công nghiệp</option>
                        <option value="construction" ${expert.field === 'construction' ? 'selected' : ''}>Xây dựng</option>
                        <option value="it" ${expert.field === 'it' ? 'selected' : ''}>Công nghệ thông tin</option>
                         <option value="research" ${expert.field === 'research' ? 'selected' : ''}>Nghiên cứu</option>
                    </select>
                     <div class="invalid-feedback">Vui lòng chọn lĩnh vực</div>
                </div>
               <div class="mb-3">
                     <label class="form-label required">Học vị</label>
                      <select class="form-select" name="degree" required>
                           <option value="professor" ${expert.degree === 'professor' ? 'selected' : ''}>Giáo sư</option>
                           <option value="associate_professor" ${expert.degree === 'associate_professor' ? 'selected' : ''}>Phó giáo sư</option>
                            <option value="doctor" ${expert.degree === 'doctor' ? 'selected' : ''}>Tiến sĩ</option>
                          <option value="master" ${expert.degree === 'master' ? 'selected' : ''}>Thạc sĩ</option>
                            <option value="bachelor" ${expert.degree === 'bachelor' ? 'selected' : ''}>Cử nhân</option>
                     </select>
                    <div class="invalid-feedback">Vui lòng chọn học vị</div>
                </div>
              <div class="mb-3">
                   <label class="form-label">Nơi công tác</label>
                   <input type="text" class="form-control" name="workplace" value="${expert.workplace}">
               </div>
            </form>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
            <button type="button" class="btn btn-primary" onclick="saveEditedExpert('${expert.id}')">
                 <i class="fas fa-save me-1"></i>Lưu thay đổi
           </button>
        </div>
    `;

    const modalElement = document.getElementById('expertModal');
    modalElement.querySelector('.modal-content').innerHTML = modalContent;

   const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

async function saveEditedExpert(id) {
    try {
          const form = document.getElementById('editExpertForm');
            if (!form.checkValidity()) {
             form.classList.add('was-validated');
                return;
          }

        showLoading();

        const formData = {
            id: id,
            name: form.querySelector('[name="name"]').value,
            field: form.querySelector('[name="field"]').value,
            degree: form.querySelector('[name="degree"]').value,
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
         await loadExperts();
         // Sắp xếp lại mảng sau khi edit thành công
         allExperts.sort((a, b) => {
            const idA = parseInt(a.id.slice(2), 10);
            const idB = parseInt(b.id.slice(2), 10);
            return idA - idB;
        });
        displayExperts();
         const modalElement = document.getElementById('expertModal');
         const modal = bootstrap.Modal.getInstance(modalElement);
          modal.hide();

      alert('Cập nhật thông tin chuyên gia thành công!');

   } catch (error) {
        console.error('Lỗi khi cập nhật thông tin chuyên gia:', error);
       alert('Có lỗi xảy ra khi cập nhật thông tin chuyên gia');
   } finally {
        hideLoading();
   }
}

async function deleteExpert(id) {
     try {
          const expert = allExperts.find(i => i.id === id);
         if (!expert) {
            alert('Không tìm thấy thông tin chuyên gia');
             return;
         }

       if (!confirm(`Bạn có chắc chắn muốn xóa chuyên gia này?\n\n- Mã: ${expert.id}\n- Tên chuyên gia: ${expert.name}`)) {
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
         await loadExperts();

        alert('Xóa chuyên gia thành công!');

   } catch (error) {
        console.error('Lỗi khi xóa chuyên gia:', error);
      alert('Có lỗi xảy ra khi xóa chuyên gia');
   } finally {
        hideLoading();
   }
}

// ===== PAGINATION FUNCTIONS =====
function updatePagination() {
    const totalPages = Math.ceil(filteredExperts.length / itemsPerPage);
    const paginationElement = document.getElementById('pagination');
    const paginationInfo = document.getElementById('paginationInfo');

    // Cập nhật thông tin phân trang
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, filteredExperts.length);
    paginationInfo.textContent = `Hiển thị ${startItem}-${endItem} trong tổng số ${filteredExperts.length} chuyên gia`;

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
    const totalPages = Math.ceil(filteredExperts.length / itemsPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        displayExperts();
    }
}
// ===== UTILITY FUNCTIONS =====
function formatExpertField(field) {
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

function formatExpertDegree(degree) {
    const degrees = {
        professor: "Giáo sư",
        associate_professor: "Phó giáo sư",
        doctor: "Tiến sĩ",
        master: "Thạc sĩ",
         bachelor: "Cử nhân"
    };
    return degrees[degree] || degree;
}
function formatExpertDegreeClass(degree) {
   const degrees = {
       professor: "degree-professor",
       associate_professor: "degree-associate_professor",
       doctor: "degree-doctor",
       master: "degree-master",
       bachelor: "degree-bachelor"
   };
  return degrees[degree] || "";
}
function showLoading() {
    document.getElementById('loading-spinner').classList.remove('d-none');
}

function hideLoading() {
    document.getElementById('loading-spinner').classList.add('d-none');
}
