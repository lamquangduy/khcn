let allOffices = [];
let filteredOffices = [];
const tableName = 'khcn_data_postal_office'; // Tên bảng trong Supabase
let currentPage = 1;
const itemsPerPage = 10;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    loadOffices();
    initializeEventListeners();
});

// ===== EVENT LISTENERS =====
function initializeEventListeners() {
    // Filter event listeners
     document.getElementById('officeType').addEventListener('change', () => {
        currentPage = 1;
        filterOffices();
    });
    document.getElementById('district').addEventListener('change', () => {
         currentPage = 1;
        filterOffices();
    });
    document.getElementById('status').addEventListener('change', () => {
        currentPage = 1;
        filterOffices();
    });
    document.getElementById('searchInput').addEventListener('input', () => {
         currentPage = 1;
        filterOffices();
    });
}

// ===== DATA LOADING =====
async function loadOffices() {
    try {
        showLoading();
        const response = await fetch(`https://data.vunhat2009.workers.dev/${tableName}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch data from ${tableName}`);
        }
          const data = await response.json();
           // Map data to add coordinates object
        allOffices = data.map(office => ({
             ...office,
              coordinates: {
                lat: office.latitude,
                lng: office.longitude,
            }
          }));
         // Sắp xếp theo id
         allOffices.sort((a, b) => {
            const idA = parseInt(a.id.slice(2), 10);
            const idB = parseInt(b.id.slice(2), 10);
            return idA - idB;
        });
        filteredOffices = [...allOffices]; // Initialize filtered data
        displayOffices();
    } catch (error) {
        console.error('Error loading offices:', error);
        alert('Không thể tải dữ liệu bưu cục. Vui lòng thử lại sau.');
    } finally {
        hideLoading();
    }
}

// ===== DISPLAY FUNCTIONS =====
function displayOffices() {
    const tbody = document.getElementById('officesTableBody');
     const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredOffices.length);
    const displayedData = filteredOffices.slice(startIndex, endIndex);
    tbody.innerHTML = '';

    displayedData.forEach((office, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${startIndex + index + 1}</td>
            <td>${office.name}</td>
            <td>${formatOfficeType(office.type)}</td>
            <td>${office.address}</td>
            <td>${office.phone}</td>
            <td>${formatStatus(office.status)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-action btn-view" onclick="viewOffice('${office.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-action btn-map" onclick="showMap(${office.coordinates.lat},${office.coordinates.lng})">
                        <i class="fas fa-map-marker-alt"></i>
                    </button>
                    <button class="btn btn-action btn-edit" onclick="editOffice('${office.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-action btn-delete" onclick="deleteOffice('${office.id}')">
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
async function filterOffices() {
    try {
         showLoading();
        const filters = {
            type: document.getElementById('officeType').value,
            district: document.getElementById('district').value,
            status: document.getElementById('status').value,
            search: document.getElementById('searchInput').value.toLowerCase()
        };

       filteredOffices = allOffices.filter(office => {
            let matches = true;
            if (filters.type && office.type !== filters.type) matches = false;
            if (filters.status && office.status !== filters.status) matches = false;
            
             if (filters.search) {
                const searchMatch =
                    office.name.toLowerCase().includes(filters.search) ||
                     office.address.toLowerCase().includes(filters.search) ||
                    office.phone.includes(filters.search);
                 if (!searchMatch) matches = false;
            }
              if (filters.district) {
                const address = office.address.toLowerCase();
                let districtName = '';
                
                // Mapping giá trị value với tên quận/huyện
                switch(filters.district) {
                    case 'haichau':
                        districtName = 'hải châu';
                        break;
                     case 'thanhkhe':
                         districtName = 'thanh khê';
                       break;
                     case 'sontra':
                        districtName = 'sơn trà';
                        break;
                    case 'nguhanhson':
                        districtName = 'ngũ hành sơn';
                        break;
                    case 'lienchieu':
                         districtName = 'liên chiểu';
                       break;
                     case 'camle':
                         districtName = 'cẩm lệ';
                       break;
                   case 'hoavang':
                         districtName = 'hòa vang';
                        break;
                     case 'hoangsa':
                         districtName = 'hoàng sa';
                        break;
                }
                // Kiểm tra địa chỉ có chứa tên quận/huyện không
                 if (!address.includes(districtName)) {
                   matches = false;
                }
             }


            return matches;
        });

        displayOffices();
   } catch (error) {
        console.error('Lỗi khi lọc dữ liệu bưu cục:', error);
        alert('Có lỗi xảy ra khi lọc dữ liệu bưu cục');
    } finally {
        hideLoading();
    }
}

// ===== CRUD OPERATIONS =====
function viewOffice(id) {
    const office = allOffices.find(o => o.id === id);
    if (!office) {
        alert('Không tìm thấy thông tin bưu cục');
        return;
    }

    const modalContent = `
        <div class="modal-header">
            <h5 class="modal-title">Chi tiết bưu cục</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
            <div class="row mb-3">
                <div class="col-md-6">
                    <label class="fw-bold">Mã bưu cục:</label>
                    <p>${office.id}</p>
                </div>
                <div class="col-md-6">
                    <label class="fw-bold">Trạng thái:</label>
                    <p>${formatStatus(office.status)}</p>
                </div>
            </div>
            <div class="mb-3">
                <label class="fw-bold">Tên bưu cục:</label>
                <p>${office.name}</p>
            </div>
            <div class="row mb-3">
                <div class="col-md-6">
                    <label class="fw-bold">Loại hình:</label>
                    <p>${formatOfficeType(office.type)}</p>
                </div>
                 <div class="col-md-6">
                    <label class="fw-bold">Quận/Huyện:</label>
                     <p>${formatDistrict(office.district)}</p>
                </div>
            </div>
            <div class="mb-3">
                <label class="fw-bold">Địa chỉ:</label>
                <p>${office.address}</p>
            </div>
            <div class="mb-3">
                <label class="fw-bold">Điện thoại:</label>
                <p>${office.phone}</p>
            </div>
             <div class="mb-3">
                <label class="fw-bold">Tọa độ:</label>
                <p>Vĩ độ: ${office.coordinates.lat}, Kinh độ: ${office.coordinates.lng}</p>
            </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
        </div>
    `;

    const modalElement = document.getElementById('officeModal');
    modalElement.querySelector('.modal-content').innerHTML = modalContent;
    
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

function showMap(latitude, longitude) {
    const modalContent = `
        <div class="modal-header">
            <h5 class="modal-title">Bản đồ</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
            <iframe
                width="100%"
                height="400px"
                frameborder="0"
                src="https://maps.google.com/maps?q=${latitude},${longitude}&t=&z=13&ie=UTF8&iwloc=&output=embed"
            ></iframe>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
        </div>
    `;

    const modalElement = document.getElementById('officeModal');
    modalElement.querySelector('.modal-content').innerHTML = modalContent;

    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

// CREATE - Thêm mới bưu cục
async function addNewOffice() {
    const newId = generateNextId();
    const modalContent = `
        <div class="modal-header">
            <h5 class="modal-title">Thêm mới bưu cục</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
            <form id="addOfficeForm" class="needs-validation" novalidate>
                 <div class="mb-3">
                     <label class="form-label required">Mã bưu cục</label>
                     <input type="text" class="form-control" name="id" value="${newId}" readonly>
                  </div>
                <!-- Thông tin cơ bản -->
                <div class="mb-3">
                    <label class="form-label required">Tên bưu cục</label>
                    <input type="text" class="form-control" name="name" required>
                    <div class="invalid-feedback">Vui lòng nhập tên bưu cục</div>
                </div>

                <!-- Loại hình -->
                <div class="mb-3">
                    <label class="form-label required">Loại hình</label>
                    <select class="form-select" name="type" required>
                        <option value="">Chọn loại hình</option>
                        <option value="post_office">Bưu cục</option>
                        <option value="service_point">Điểm phục vụ</option>
                        <option value="agency">Đại lý</option>
                        <option value="mailbox">Thùng thư công cộng</option>
                    </select>
                    <div class="invalid-feedback">Vui lòng chọn loại hình</div>
                </div>

                <!-- Thông tin địa chỉ -->
                <div class="mb-3">
                    <label class="form-label required">Địa chỉ</label>
                    <input type="text" class="form-control" name="address" required>
                    <div class="invalid-feedback">Vui lòng nhập địa chỉ</div>
                </div>

                <!-- Quận/Huyện -->
                <div class="mb-3">
                     <label class="form-label required">Quận/Huyện</label>
                     <select class="form-select" name="district" required>
                        <option value="">Chọn quận/huyện</option>
                           <option value="haichau">Hải Châu</option>
                            <option value="thanhkhe">Thanh Khê</option>
                            <option value="sontra">Sơn Trà</option>
                            <option value="nguhanhson">Ngũ Hành Sơn</option>
                            <option value="lienchieu">Liên Chiểu</option>
                            <option value="camle">Cẩm Lệ</option>
                           <option value="hoavang">Hòa Vang</option>
                           <option value="hoangsa">Hoàng Sa</option>
                    </select>
                     <div class="invalid-feedback">Vui lòng chọn quận/huyện</div>
                 </div>

                <!-- Điện thoại -->
                <div class="mb-3">
                    <label class="form-label">Điện thoại</label>
                    <input type="text" class="form-control" name="phone">
                </div>

                <!-- Tọa độ -->
                <div class="row mb-3">
                    <div class="col-md-6">
                        <label class="form-label">Vĩ độ</label>
                        <input type="number" class="form-control" name="latitude" step="any">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Kinh độ</label>
                        <input type="number" class="form-control" name="longitude" step="any">
                    </div>
                </div>

                <!-- Trạng thái -->
                <div class="mb-3">
                    <label class="form-label required">Trạng thái</label>
                    <select class="form-select" name="status" required>
                        <option value="active">Đang hoạt động</option>
                        <option value="inactive">Tạm ngừng</option>
                       <option value="pending">Chờ xử lý</option>
                    </select>
                    <div class="invalid-feedback">Vui lòng chọn trạng thái</div>
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
            <button type="button" class="btn btn-primary" onclick="saveNewOffice()">
                 <i class="fas fa-save me-1"></i>Lưu
            </button>
        </div>
    `;

    const modalElement = document.getElementById('officeModal');
    modalElement.querySelector('.modal-content').innerHTML = modalContent;
    
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

// Hàm xử lý lưu bưu cục mới
async function saveNewOffice() {
    try {
       // Lấy form và kiểm tra validation
          const form = document.getElementById('addOfficeForm');
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
         }
         showLoading();

        // Lấy dữ liệu từ form
        const formData = {
            id: document.querySelector('#addOfficeForm [name="id"]').value,
             name: form.querySelector('[name="name"]').value,
            type: form.querySelector('[name="type"]').value,
             address: form.querySelector('[name="address"]').value,
            district: form.querySelector('[name="district"]').value,
           phone: form.querySelector('[name="phone"]').value,
            latitude: parseFloat(form.querySelector('[name="latitude"]').value) || null,
             longitude: parseFloat(form.querySelector('[name="longitude"]').value) || null,
            status: form.querySelector('[name="status"]').value
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
          await loadOffices();
         // Đóng modal
        const modalElement = document.getElementById('officeModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
         modal.hide();

        // Thông báo thành công
        alert('Thêm mới bưu cục thành công!');

    } catch (error) {
       console.error('Lỗi khi thêm mới:', error);
        alert('Có lỗi xảy ra khi thêm mới bưu cục');
    } finally {
        hideLoading();
    }
}
// Tạo ID mới
function generateNextId() {
    if (!allOffices || allOffices.length === 0) {
        return "BC001";
    }
    const lastId = allOffices[allOffices.length - 1].id;
    const numericPart = parseInt(lastId.slice(2), 10);
    const nextNumericPart = numericPart + 1;
    return `BC${String(nextNumericPart).padStart(3, '0')}`;
}

function editOffice(id) {
   const office = allOffices.find(o => o.id === id);
    if (!office) {
        alert('Không tìm thấy thông tin bưu cục');
        return;
    }

    const modalContent = `
        <div class="modal-header">
            <h5 class="modal-title">Chỉnh sửa thông tin bưu cục</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
            <form id="editOfficeForm" class="needs-validation" novalidate>
                <input type="hidden" name="id" value="${office.id}">
                
                <!-- Thông tin cơ bản -->
                <div class="mb-3">
                    <label class="form-label required">Tên bưu cục</label>
                    <input type="text" class="form-control" name="name" 
                           value="${office.name}" required>
                    <div class="invalid-feedback">Vui lòng nhập tên bưu cục</div>
                </div>

                <!-- Loại hình -->
                <div class="mb-3">
                    <label class="form-label required">Loại hình</label>
                    <select class="form-select" name="type" required>
                        <option value="post_office" ${office.type === 'post_office' ? 'selected' : ''}>Bưu cục</option>
                        <option value="service_point" ${office.type === 'service_point' ? 'selected' : ''}>Điểm phục vụ</option>
                         <option value="agency" ${office.type === 'agency' ? 'selected' : ''}>Đại lý</option>
                        <option value="mailbox" ${office.type === 'mailbox' ? 'selected' : ''}>Thùng thư công cộng</option>
                    </select>
                    <div class="invalid-feedback">Vui lòng chọn loại hình</div>
                </div>

                <!-- Thông tin địa chỉ -->
                <div class="mb-3">
                    <label class="form-label required">Địa chỉ</label>
                    <input type="text" class="form-control" name="address" 
                           value="${office.address}" required>
                    <div class="invalid-feedback">Vui lòng nhập địa chỉ</div>
                </div>
                   <!-- Quận/Huyện -->
                <div class="mb-3">
                   <label class="form-label required">Quận/Huyện</label>
                   <select class="form-select" name="district" required>
                        <option value="haichau" ${office.district === 'haichau' ? 'selected' : ''}>Hải Châu</option>
                        <option value="thanhkhe" ${office.district === 'thanhkhe' ? 'selected' : ''}>Thanh Khê</option>
                       <option value="sontra" ${office.district === 'sontra' ? 'selected' : ''}>Sơn Trà</option>
                        <option value="nguhanhson" ${office.district === 'nguhanhson' ? 'selected' : ''}>Ngũ Hành Sơn</option>
                        <option value="lienchieu" ${office.district === 'lienchieu' ? 'selected' : ''}>Liên Chiểu</option>
                        <option value="camle" ${office.district === 'camle' ? 'selected' : ''}>Cẩm Lệ</option>
                        <option value="hoavang" ${office.district === 'hoavang' ? 'selected' : ''}>Hòa Vang</option>
                         <option value="hoangsa" ${office.district === 'hoangsa' ? 'selected' : ''}>Hoàng Sa</option>
                    </select>
                     <div class="invalid-feedback">Vui lòng chọn quận/huyện</div>
                 </div>

                <!-- Điện thoại -->
                <div class="mb-3">
                    <label class="form-label">Điện thoại</label>
                    <input type="text" class="form-control" name="phone" value="${office.phone}">
                </div>
                <!-- Tọa độ -->
                 <div class="row mb-3">
                    <div class="col-md-6">
                        <label class="form-label">Vĩ độ</label>
                        <input type="number" class="form-control" name="latitude" step="any" value="${office.coordinates.lat || ''}">
                    </div>
                     <div class="col-md-6">
                        <label class="form-label">Kinh độ</label>
                        <input type="number" class="form-control" name="longitude" step="any" value="${office.coordinates.lng || ''}">
                     </div>
                 </div>

                <!-- Trạng thái -->
                <div class="mb-3">
                    <label class="form-label required">Trạng thái</label>
                    <select class="form-select" name="status" required>
                        <option value="active" ${office.status === 'active' ? 'selected' : ''}>Đang hoạt động</option>
                        <option value="inactive" ${office.status === 'inactive' ? 'selected' : ''}>Tạm ngừng</option>
                        <option value="pending" ${office.status === 'pending' ? 'selected' : ''}>Chờ xử lý</option>
                    </select>
                     <div class="invalid-feedback">Vui lòng chọn trạng thái</div>
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
            <button type="button" class="btn btn-primary" onclick="saveEditedOffice('${office.id}')">
                <i class="fas fa-save me-1"></i>Lưu thay đổi
            </button>
        </div>
    `;

    const modalElement = document.getElementById('officeModal');
    modalElement.querySelector('.modal-content').innerHTML = modalContent;
    
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

// Hàm xử lý lưu thông tin đã chỉnh sửa
async function saveEditedOffice(id) {
     try {
         // Lấy form và kiểm tra validation
        const form = document.getElementById('editOfficeForm');
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }

        showLoading();

        // Lấy dữ liệu từ form
         const formData = {
            id: id,
             name: form.querySelector('[name="name"]').value,
           type: form.querySelector('[name="type"]').value,
            address: form.querySelector('[name="address"]').value,
             district: form.querySelector('[name="district"]').value,
            phone: form.querySelector('[name="phone"]').value,
           latitude: parseFloat(form.querySelector('[name="latitude"]').value) || null,
            longitude: parseFloat(form.querySelector('[name="longitude"]').value) || null,
             status: form.querySelector('[name="status"]').value
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
          await loadOffices();

        // Đóng modal
        const modalElement = document.getElementById('officeModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
       modal.hide();
        // Thông báo thành công
        alert('Cập nhật thông tin bưu cục thành công!');

    } catch (error) {
       console.error('Lỗi khi cập nhật:', error);
        alert('Có lỗi xảy ra khi cập nhật thông tin bưu cục');
    } finally {
         hideLoading();
    }
}

// DELETE - Xóa bưu cục
async function deleteOffice(id) {
     try {
        const office = allOffices.find(o => o.id === id);
         if (!office) {
           alert('Không tìm thấy thông tin bưu cục');
           return;
        }

         if (!confirm(`Bạn có chắc chắn muốn xóa bưu cục sau?\n\n` +
            `- Mã bưu cục: ${office.id}\n` +
           `- Tên bưu cục: ${office.name}\n` +
            `- Địa chỉ: ${office.address}`)) {
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
         await loadOffices();

        // Thông báo thành công
        alert('Xóa bưu cục thành công!');

   } catch (error) {
        console.error('Lỗi khi xóa:', error);
        alert('Có lỗi xảy ra khi xóa bưu cục');
    } finally {
        hideLoading();
    }
}

// ===== PAGINATION FUNCTIONS =====
function updatePagination() {
    const totalPages = Math.ceil(filteredOffices.length / itemsPerPage);
    const paginationElement = document.getElementById('pagination');
    const paginationInfo = document.getElementById('paginationInfo');

    // Cập nhật thông tin phân trang
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, filteredOffices.length);
    paginationInfo.textContent = `Hiển thị ${startItem}-${endItem} trong tổng số ${filteredOffices.length} bưu cục`;

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
    const totalPages = Math.ceil(filteredOffices.length / itemsPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        displayOffices();
    }
}

// ===== UTILITY FUNCTIONS =====
function formatOfficeType(type) {
    const types = {
        post_office: 'Bưu cục',
        service_point: 'Điểm phục vụ',
        agency: 'Đại lý',
        mailbox: 'Thùng thư công cộng'
    };
    return types[type] || type;
}

function formatStatus(status) {
    const statusClasses = {
        active: 'status-active',
        inactive: 'status-inactive',
        pending: 'status-pending'
    };

    const statusLabels = {
        active: 'Đang hoạt động',
        inactive: 'Tạm ngừng',
         pending: 'Chờ xử lý'
    };

    return `<span class="status-badge ${statusClasses[status]}">${statusLabels[status]}</span>`;
}

function formatDistrict(district) {
    const districts = {
        haichau: 'Hải Châu',
        thanhkhe: 'Thanh Khê',
       sontra: 'Sơn Trà',
       nguhanhson: 'Ngũ Hành Sơn',
        lienchieu: 'Liên Chiểu',
        camle: 'Cẩm Lệ',
         hoavang: 'Hòa Vang',
         hoangsa: "Hoàng Sa"
    };
    return districts[district] || district;
}

function showLoading() {
    document.getElementById('loading-spinner').classList.remove('d-none');
}

function hideLoading() {
    document.getElementById('loading-spinner').classList.add('d-none');
}