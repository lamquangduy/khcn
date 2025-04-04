let allHumans = [];
let filteredHumans = [];
const tableName = 'khcn_data_it_human';
let currentPage = 1;
const itemsPerPage = 10;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    loadHumans();
    initializeEventListeners();
});

// ===== EVENT LISTENERS =====
function initializeEventListeners() {
    // Filter event listeners
    document.getElementById('humanPosition').addEventListener('change', () => {
        currentPage = 1;
        filterHumans();
    });
    document.getElementById('humanEnterprise').addEventListener('change', () => {
         currentPage = 1;
        filterHumans();
    });
    document.getElementById('location').addEventListener('change', () => {
         currentPage = 1;
        filterHumans();
    });
    document.getElementById('searchInput').addEventListener('input', () => {
         currentPage = 1;
        filterHumans();
    });
}

// ===== DATA LOADING =====
async function loadHumans() {
    try {
         showLoading();
         const response = await fetch(`https://data.vunhat2009.workers.dev/${tableName}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch data from ${tableName}`);
        }
        const data = await response.json();
         allHumans = data.map(human => ({
             ...human,
           id: human.id,
            name: human.name,
           position: human.position,
            enterprise: human.enterprise,
            experience: human.experience,
           location: human.location,
        }))
         // Sắp xếp theo id
         allHumans.sort((a, b) => {
             try {
                const idA = a.id && a.id.startsWith('NL') ? parseInt(a.id.slice(2), 10) : -1;
                const idB = b.id && b.id.startsWith('NL') ? parseInt(b.id.slice(2), 10) : -1;
                return idA - idB;

             } catch(e) {
                console.error("Error during parsing int", e);
                return 0;
             }
        });
         filteredHumans = [...allHumans]; // Initialize filtered data
        displayHumans();
    } catch (error) {
         console.error('Error loading humans:', error);
        alert('Không thể tải dữ liệu nhân lực. Vui lòng thử lại sau.');
    } finally {
         hideLoading();
    }
}

// ===== DISPLAY FUNCTIONS =====
function displayHumans() {
    const tbody = document.getElementById('humanTableBody');
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredHumans.length);
    const displayedData = filteredHumans.slice(startIndex, endIndex);
    tbody.innerHTML = '';

    displayedData.forEach((human, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${startIndex + index + 1}</td>
            <td>${human.name}</td>
            <td>${formatHumanPosition(human.position)}</td>
            <td>${formatHumanEnterprise(human.enterprise)}</td>
            <td>${human.experience || '<span class="text-muted">Không có</span>'}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-action btn-view" onclick="viewHuman('${human.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-action btn-edit" onclick="editHuman('${human.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-action btn-delete" onclick="deleteHuman('${human.id}')">
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
async function filterHumans() {
     try {
         showLoading();
         const filters = {
            position: document.getElementById('humanPosition').value,
             enterprise: document.getElementById('humanEnterprise').value,
             location: document.getElementById('location').value,
             search: document.getElementById('searchInput').value.toLowerCase()
        };

       filteredHumans = allHumans.filter(human => {
             let matches = true;

             if (filters.position && human.position !== filters.position) matches = false;
            if (filters.enterprise && human.enterprise !== filters.enterprise) matches = false;
            if (filters.location && human.location !== filters.location) matches = false;

            if (filters.search) {
                const searchMatch =
                   human.name.toLowerCase().includes(filters.search) ||
                  formatHumanEnterprise(human.enterprise).toLowerCase().includes(filters.search);
                 if (!searchMatch) matches = false;
           }

           return matches;
        });

        displayHumans();
    } catch (error) {
        console.error('Lỗi khi lọc dữ liệu nhân lực:', error);
        alert('Có lỗi xảy ra khi lọc dữ liệu nhân lực');
    } finally {
         hideLoading();
    }
}

// ===== CRUD OPERATIONS =====
function viewHuman(id) {
    const human = allHumans.find(i => i.id === id);
    if (!human) {
        alert('Không tìm thấy thông tin nhân lực');
        return;
    }

     const modalContent = `
         <div class="modal-header">
            <h5 class="modal-title">Chi tiết nhân lực CNTT</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
         </div>
         <div class="modal-body">
             <div class="row mb-3">
                <div class="col-md-6">
                    <label class="fw-bold">Mã:</label>
                   <p>${human.id}</p>
               </div>
                <div class="col-md-6">
                    <label class="fw-bold">Vị trí:</label>
                     <p>${formatHumanPosition(human.position)}</p>
                </div>
            </div>
            <div class="mb-3">
               <label class="fw-bold">Họ và tên:</label>
                <p>${human.name}</p>
             </div>
            <div class="row mb-3">
                <div class="col-md-6">
                    <label class="fw-bold">Doanh nghiệp:</label>
                    <p>${formatHumanEnterprise(human.enterprise)}</p>
                 </div>
                 <div class="col-md-6">
                       <label class="fw-bold">Địa bàn:</label>
                      <p>${formatLocation(human.location)}</p>
                 </div>
            </div>
            <div class="mb-3">
                <label class="fw-bold">Kinh nghiệm:</label>
                <p>${human.experience || '<span class="text-muted">Không có</span>'}</p>
            </div>
       </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
        </div>
    `;

    const modalElement = document.getElementById('humanModal');
    modalElement.querySelector('.modal-content').innerHTML = modalContent;

    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

async function addNewHuman() {
    const modalContent = `
        <div class="modal-header">
            <h5 class="modal-title">Thêm mới nhân lực CNTT</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
            <form id="addHumanForm" class="needs-validation" novalidate>
                <div class="mb-3">
                   <label class="form-label required">Mã nhân lực</label>
                   <input type="text" class="form-control" name="id" value="${generateNextId()}" readonly>
                 </div>
                <div class="mb-3">
                    <label class="form-label required">Họ và tên</label>
                   <input type="text" class="form-control" name="name" required>
                   <div class="invalid-feedback">Vui lòng nhập họ và tên</div>
                </div>
               <div class="mb-3">
                     <label class="form-label required">Vị trí</label>
                    <select class="form-select" name="position" required>
                         <option value="">Chọn vị trí</option>
                          <option value="developer">Lập trình viên</option>
                        <option value="engineer">Kỹ sư IT</option>
                         <option value="tester">Kiểm thử viên</option>
                          <option value="designer">Thiết kế UI/UX</option>
                         <option value="project_manager">Quản lý dự án</option>
                    </select>
                   <div class="invalid-feedback">Vui lòng chọn vị trí</div>
                </div>
                <div class="mb-3">
                    <label class="form-label required">Doanh nghiệp</label>
                    <select class="form-select" name="enterprise" required>
                          <option value="">Chọn doanh nghiệp</option>
                          <option value="fpt_software">FPT Software</option>
                         <option value="hacom">Hà Nội Computer (Hacom)</option>
                          <option value="viettel_solutions">Viettel Solutions</option>
                           <option value="tinhvan">Tập đoàn Tinh Vân</option>
                           <option value="misa">Công ty MISA</option>
                            <option value="phongvu">Phong Vũ</option>
                   </select>
                    <div class="invalid-feedback">Vui lòng chọn doanh nghiệp</div>
                 </div>
                   <div class="mb-3">
                    <label class="form-label required">Địa bàn</label>
                    <select class="form-select" name="location" required>
                        <option value="">Chọn địa bàn</option>
                           <option value="haichau">Hải Châu</option>
                            <option value="thanhkhe">Thanh Khê</option>
                            <option value="sontra">Sơn Trà</option>
                            <option value="nguhanhson">Ngũ Hành Sơn</option>
                           <option value="lienchieu">Liên Chiểu</option>
                           <option value="camle">Cẩm Lệ</option>
                           <option value="hoavang">Hòa Vang</option>
                             <option value="hoangsa">Hoàng Sa</option>
                    </select>
                     <div class="invalid-feedback">Vui lòng chọn địa bàn</div>
                 </div>
                <div class="mb-3">
                    <label class="form-label">Kinh nghiệm</label>
                   <input type="text" class="form-control" name="experience">
                 </div>
            </form>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
            <button type="button" class="btn btn-primary" onclick="saveNewHuman()">
               <i class="fas fa-save me-1"></i>Lưu
            </button>
        </div>
    `;

    const modalElement = document.getElementById('humanModal');
    modalElement.querySelector('.modal-content').innerHTML = modalContent;

    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

async function saveNewHuman() {
    try {
        const form = document.getElementById('addHumanForm');
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }

        showLoading();

        const formData = {
            id: document.querySelector('#addHumanForm [name="id"]').value,
            name: form.querySelector('[name="name"]').value,
            position: form.querySelector('[name="position"]').value,
            enterprise: form.querySelector('[name="enterprise"]').value,
            experience: form.querySelector('[name="experience"]').value || null,
            location: form.querySelector('[name="location"]').value
        };

        const response = await fetch(`https://data.vunhat2009.workers.dev/${tableName}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
            mode: 'cors'
        });

        if (!response.ok) throw new Error('Failed to save human resource');

        await loadHumans(); // Reload from API

        const modalElement = document.getElementById('humanModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();

        alert('Thêm mới nhân lực thành công!');
    } catch (error) {
        console.error('Lỗi khi thêm mới nhân lực:', error);
        alert('Có lỗi xảy ra khi thêm mới nhân lực');
    } finally {
        hideLoading();
    }
}
// Tạo ID mới
function generateNextId() {
    if (!allHumans || allHumans.length === 0) {
        return "NL001";
    }
    const lastId = allHumans[allHumans.length - 1].id;
    const numericPart = parseInt(lastId.slice(2), 10);
    const nextNumericPart = numericPart + 1;
    return `NL${String(nextNumericPart).padStart(3, '0')}`;
}
function editHuman(id) {
    const human = allHumans.find(i => i.id === id);
    if (!human) {
        alert('Không tìm thấy thông tin nhân lực');
        return;
    }

    const modalContent = `
        <div class="modal-header">
            <h5 class="modal-title">Chỉnh sửa thông tin nhân lực CNTT</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
             <form id="editHumanForm" class="needs-validation" novalidate>
                 <input type="hidden" name="id" value="${human.id}">
                <div class="mb-3">
                    <label class="form-label required">Họ và tên</label>
                    <input type="text" class="form-control" name="name" value="${human.name}" required>
                     <div class="invalid-feedback">Vui lòng nhập họ và tên</div>
                 </div>
                 <div class="mb-3">
                     <label class="form-label required">Vị trí</label>
                     <select class="form-select" name="position" required>
                       <option value="developer" ${human.position === 'developer' ? 'selected' : ''}>Lập trình viên</option>
                        <option value="engineer" ${human.position === 'engineer' ? 'selected' : ''}>Kỹ sư IT</option>
                       <option value="tester" ${human.position === 'tester' ? 'selected' : ''}>Kiểm thử viên</option>
                        <option value="designer" ${human.position === 'designer' ? 'selected' : ''}>Thiết kế UI/UX</option>
                        <option value="project_manager" ${human.position === 'project_manager' ? 'selected' : ''}>Quản lý dự án</option>
                    </select>
                    <div class="invalid-feedback">Vui lòng chọn vị trí</div>
                 </div>
                <div class="mb-3">
                     <label class="form-label required">Doanh nghiệp</label>
                     <select class="form-select" name="enterprise" required>
                         <option value="fpt_software" ${human.enterprise === 'fpt_software' ? 'selected' : ''}>FPT Software</option>
                        <option value="hacom" ${human.enterprise === 'hacom' ? 'selected' : ''}>Hà Nội Computer (Hacom)</option>
                         <option value="viettel_solutions" ${human.enterprise === 'viettel_solutions' ? 'selected' : ''}>Viettel Solutions</option>
                         <option value="tinhvan" ${human.enterprise === 'tinhvan' ? 'selected' : ''}>Tập đoàn Tinh Vân</option>
                        <option value="misa" ${human.enterprise === 'misa' ? 'selected' : ''}>Công ty MISA</option>
                        <option value="phongvu" ${human.enterprise === 'phongvu' ? 'selected' : ''}>Phong Vũ</option>
                    </select>
                      <div class="invalid-feedback">Vui lòng chọn doanh nghiệp</div>
                </div>
                  <div class="mb-3">
                     <label class="form-label required">Địa bàn</label>
                    <select class="form-select" name="location" required>
                        <option value="haichau" ${human.location === 'haichau' ? 'selected' : ''}>Hải Châu</option>
                         <option value="thanhkhe" ${human.location === 'thanhkhe' ? 'selected' : ''}>Thanh Khê</option>
                        <option value="sontra" ${human.location === 'sontra' ? 'selected' : ''}>Sơn Trà</option>
                        <option value="nguhanhson" ${human.location === 'nguhanhson' ? 'selected' : ''}>Ngũ Hành Sơn</option>
                        <option value="lienchieu" ${human.location === 'lienchieu' ? 'selected' : ''}>Liên Chiểu</option>
                         <option value="camle" ${human.location === 'camle' ? 'selected' : ''}>Cẩm Lệ</option>
                        <option value="hoavang" ${human.location === 'hoavang' ? 'selected' : ''}>Hòa Vang</option>
                          <option value="hoangsa" ${human.location === 'hoangsa' ? 'selected' : ''}>Hoàng Sa</option>
                    </select>
                    <div class="invalid-feedback">Vui lòng chọn địa bàn</div>
                 </div>
               <div class="mb-3">
                    <label class="form-label">Kinh nghiệm</label>
                    <input type="text" class="form-control" name="experience" value="${human.experience || ''}">
               </div>
            </form>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
            <button type="button" class="btn btn-primary" onclick="saveEditedHuman('${human.id}')">
               <i class="fas fa-save me-1"></i>Lưu thay đổi
            </button>
        </div>
    `;

    const modalElement = document.getElementById('humanModal');
    modalElement.querySelector('.modal-content').innerHTML = modalContent;

   const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

async function saveEditedHuman(id) {
    try {
        const form = document.getElementById('editHumanForm');
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }

        showLoading();

        const formData = {
            id: id,
            name: form.querySelector('[name="name"]').value,
            position: form.querySelector('[name="position"]').value,
            enterprise: form.querySelector('[name="enterprise"]').value,
            experience: form.querySelector('[name="experience"]').value || null,
            location: form.querySelector('[name="location"]').value
        };

        const response = await fetch(`https://data.vunhat2009.workers.dev/${tableName}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
            mode: 'cors'
        });

        if (!response.ok) throw new Error('Failed to update human resource');

        await loadHumans(); // Reload from API

        const modalElement = document.getElementById('humanModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();

        alert('Cập nhật thông tin nhân lực thành công!');
    } catch (error) {
        console.error('Lỗi khi cập nhật thông tin nhân lực:', error);
        alert('Có lỗi xảy ra khi cập nhật thông tin nhân lực');
    } finally {
        hideLoading();
    }
}

async function deleteHuman(id) {
    try {
        const human = allHumans.find(i => i.id === id);
        if (!human) {
            alert('Không tìm thấy thông tin nhân lực');
            return;
        }

        if (!confirm(`Bạn có chắc chắn muốn xóa nhân lực này?\n\n- Mã: ${human.id}\n- Tên: ${human.name}`)) {
            return;
        }

        showLoading();

        const response = await fetch(`https://data.vunhat2009.workers.dev/${tableName}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id }),
            mode: 'cors'
        });

        if (!response.ok) throw new Error('Failed to delete human resource');

        await loadHumans(); // Reload from API

        alert('Xóa nhân lực thành công!');
    } catch (error) {
        console.error('Lỗi khi xóa nhân lực:', error);
        alert('Có lỗi xảy ra khi xóa nhân lực');
    } finally {
        hideLoading();
    }
}

// ===== PAGINATION FUNCTIONS =====
function updatePagination() {
    const totalPages = Math.ceil(filteredHumans.length / itemsPerPage);
    const paginationElement = document.getElementById('pagination');
     const paginationInfo = document.getElementById('paginationInfo');

    // Cập nhật thông tin phân trang
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, filteredHumans.length);
    paginationInfo.textContent = `Hiển thị ${startItem}-${endItem} trong tổng số ${filteredHumans.length} nhân lực`;

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
    const totalPages = Math.ceil(filteredHumans.length / itemsPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
       displayHumans();
    }
}

// ===== UTILITY FUNCTIONS =====
function formatHumanPosition(position) {
    const positions = {
        developer: 'Lập trình viên',
        engineer: 'Kỹ sư IT',
        tester: 'Kiểm thử viên',
        designer: 'Thiết kế UI/UX',
        project_manager: 'Quản lý dự án'
    };
    return positions[position] || position;
}

function formatHumanEnterprise(enterprise) {
    const enterprises = {
        fpt_software: 'FPT Software',
         hacom: 'Hà Nội Computer (Hacom)',
        viettel_solutions: 'Viettel Solutions',
        tinhvan: 'Tập đoàn Tinh Vân',
        misa: 'Công ty MISA',
        phongvu: 'Phong Vũ'
    };
    return enterprises[enterprise] || enterprise;
}
function formatLocation(location) {
    const locations = {
         haichau: 'Hải Châu',
        thanhkhe: 'Thanh Khê',
        sontra: 'Sơn Trà',
        nguhanhson: 'Ngũ Hành Sơn',
        lienchieu: 'Liên Chiểu',
        camle: 'Cẩm Lệ',
         hoavang: 'Hòa Vang',
         hoangsa: "Hoàng Sa"
    };
    return locations[location] || location;
}

function showLoading() {
    document.getElementById('loading-spinner').classList.remove('d-none');
}

function hideLoading() {
    document.getElementById('loading-spinner').classList.add('d-none');
}