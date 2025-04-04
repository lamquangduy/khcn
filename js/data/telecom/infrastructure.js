let allInfrastructures = [];
let filteredInfrastructures = [];
const tableName = 'khcn_data_telecom_infrastructure';
let currentPage = 1;
const itemsPerPage = 10;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    loadInfrastructures();
    initializeEventListeners();
});

// ===== EVENT LISTENERS =====
function initializeEventListeners() {
    // Filter event listeners
      document.getElementById('infrastructureType').addEventListener('change', () => {
        currentPage = 1;
        filterInfrastructures();
    });
    document.getElementById('networkOperator').addEventListener('change', () => {
        currentPage = 1;
        filterInfrastructures();
    });
     document.getElementById('location').addEventListener('change', () => {
        currentPage = 1;
        filterInfrastructures();
    });
    document.getElementById('searchInput').addEventListener('input', () => {
         currentPage = 1;
        filterInfrastructures();
    });
}

// ===== DATA LOADING =====
async function loadInfrastructures() {
    try {
        showLoading();
        const response = await fetch(`https://data.vunhat2009.workers.dev/${tableName}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch data from ${tableName}`);
        }
       const data = await response.json();
        allInfrastructures = data.map(infrastructure => ({
              ...infrastructure,
            id: infrastructure.id,
            name: infrastructure.name,
            type: infrastructure.type,
            operator: infrastructure.operator,
             address: infrastructure.address,
           coordinates: {
                lat: infrastructure.latitude || null,
                lng: infrastructure.longitude || null
            },
             location: infrastructure.location,
       }))
           // Sắp xếp theo id
        allInfrastructures.sort((a, b) => {
            try {
                const idA = a.id && a.id.startsWith('HT') ? parseInt(a.id.slice(2), 10) : -1;
                 const idB = b.id && b.id.startsWith('HT') ? parseInt(b.id.slice(2), 10) : -1;
                return idA - idB;

            } catch(e) {
                console.error("Error during parsing int", e);
                return 0;
            }
        });
        filteredInfrastructures = [...allInfrastructures]; // Initialize filtered data
        displayInfrastructures();
    } catch (error) {
        console.error('Error loading infrastructures:', error);
        alert('Không thể tải dữ liệu hạ tầng. Vui lòng thử lại sau.');
    } finally {
       hideLoading();
    }
}

// ===== DISPLAY FUNCTIONS =====
function displayInfrastructures() {
    const tbody = document.getElementById('infrastructureTableBody');
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredInfrastructures.length);
    const displayedData = filteredInfrastructures.slice(startIndex, endIndex);
    tbody.innerHTML = '';

    displayedData.forEach((infrastructure, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${startIndex + index + 1}</td>
            <td>${infrastructure.name}</td>
            <td>${formatInfrastructureType(infrastructure.type)}</td>
            <td>${formatNetworkOperator(infrastructure.operator)}</td>
            <td>${infrastructure.address}</td>
            <td>${infrastructure.coordinates ? `Lat: ${infrastructure.coordinates.lat}, Lng: ${infrastructure.coordinates.lng}` : ''}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-action btn-view" onclick="viewInfrastructure('${infrastructure.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                     <button class="btn btn-action btn-map" onclick="showMap(${infrastructure.coordinates?.lat},${infrastructure.coordinates?.lng})">
                         <i class="fas fa-map-marker-alt"></i>
                    </button>
                    <button class="btn btn-action btn-edit" onclick="editInfrastructure('${infrastructure.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-action btn-delete" onclick="deleteInfrastructure('${infrastructure.id}')">
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
async function filterInfrastructures() {
    try {
        showLoading();
         const filters = {
            type: document.getElementById('infrastructureType').value,
            operator: document.getElementById('networkOperator').value,
            location: document.getElementById('location').value,
            search: document.getElementById('searchInput').value.toLowerCase()
        };

       filteredInfrastructures = allInfrastructures.filter(infrastructure => {
           let matches = true;

             if (filters.type && infrastructure.type !== filters.type) matches = false;
            if (filters.operator && infrastructure.operator !== filters.operator) matches = false;
            if (filters.location && infrastructure.location !== filters.location) matches = false;

            if (filters.search) {
                const searchMatch =
                    infrastructure.name.toLowerCase().includes(filters.search) ||
                     infrastructure.address.toLowerCase().includes(filters.search);
                if (!searchMatch) matches = false;
            }
            return matches;
        });

        displayInfrastructures();
    } catch (error) {
        console.error('Lỗi khi lọc dữ liệu hạ tầng:', error);
        alert('Có lỗi xảy ra khi lọc dữ liệu hạ tầng');
    } finally {
       hideLoading();
    }
}

// ===== CRUD OPERATIONS =====
function viewInfrastructure(id) {
    const infrastructure = allInfrastructures.find(i => i.id === id);
      if (!infrastructure) {
        alert('Không tìm thấy thông tin hạ tầng');
        return;
    }

    const modalContent = `
        <div class="modal-header">
            <h5 class="modal-title">Chi tiết hạ tầng viễn thông</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
            <div class="row mb-3">
                <div class="col-md-6">
                    <label class="fw-bold">Mã:</label>
                    <p>${infrastructure.id}</p>
                </div>
                <div class="col-md-6">
                     <label class="fw-bold">Loại hình:</label>
                    <p>${formatInfrastructureType(infrastructure.type)}</p>
               </div>
           </div>
            <div class="mb-3">
                <label class="fw-bold">Tên:</label>
                <p>${infrastructure.name}</p>
            </div>
              <div class="row mb-3">
                  <div class="col-md-6">
                        <label class="fw-bold">Nhà mạng:</label>
                        <p>${formatNetworkOperator(infrastructure.operator)}</p>
                    </div>
                   <div class="col-md-6">
                       <label class="fw-bold">Địa bàn:</label>
                        <p>${formatLocation(infrastructure.location)}</p>
                   </div>
               </div>
            <div class="mb-3">
                <label class="fw-bold">Địa chỉ:</label>
                <p>${infrastructure.address}</p>
           </div>
            <div class="mb-3">
                <label class="fw-bold">Tọa độ:</label>
                <p>Vĩ độ: ${infrastructure.coordinates?.lat}, Kinh độ: ${infrastructure.coordinates?.lng}</p>
            </div>
       </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
        </div>
    `;

     const modalElement = document.getElementById('infrastructureModal');
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

     const modalElement = document.getElementById('infrastructureModal');
     modalElement.querySelector('.modal-content').innerHTML = modalContent;

    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

async function addNewInfrastructure() {
    const modalContent = `
         <div class="modal-header">
             <h5 class="modal-title">Thêm mới hạ tầng viễn thông</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
            <form id="addInfrastructureForm" class="needs-validation" novalidate>
                 <div class="mb-3">
                    <label class="form-label required">Mã hạ tầng</label>
                     <input type="text" class="form-control" name="id" value="${generateNextId()}" readonly>
                </div>
                <div class="mb-3">
                    <label class="form-label required">Tên</label>
                     <input type="text" class="form-control" name="name" required>
                      <div class="invalid-feedback">Vui lòng nhập tên</div>
                 </div>
                 <div class="mb-3">
                     <label class="form-label required">Loại hình</label>
                      <select class="form-select" name="type" required>
                           <option value="">Chọn loại hình</option>
                           <option value="bts">Trạm BTS</option>
                            <option value="fiber_optic">Cáp quang</option>
                            <option value="antenna_pole">Cột ăng ten</option>
                            <option value="transmission_line">Tuyến truyền dẫn</option>
                     </select>
                     <div class="invalid-feedback">Vui lòng chọn loại hình</div>
               </div>
               <div class="mb-3">
                      <label class="form-label required">Nhà mạng</label>
                     <select class="form-select" name="operator" required>
                        <option value="">Chọn nhà mạng</option>
                           <option value="viettel">Viettel</option>
                           <option value="vnpt">VNPT</option>
                            <option value="mobifone">Mobifone</option>
                            <option value="fpt">FPT</option>
                    </select>
                    <div class="invalid-feedback">Vui lòng chọn nhà mạng</div>
                </div>
                <div class="mb-3">
                    <label class="form-label required">Địa chỉ</label>
                     <input type="text" class="form-control" name="address" required>
                      <div class="invalid-feedback">Vui lòng nhập địa chỉ</div>
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
            </form>
       </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
            <button type="button" class="btn btn-primary" onclick="saveNewInfrastructure()">
               <i class="fas fa-save me-1"></i>Lưu
            </button>
        </div>
    `;

    const modalElement = document.getElementById('infrastructureModal');
    modalElement.querySelector('.modal-content').innerHTML = modalContent;

    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

async function saveNewInfrastructure() {
    try {
        const form = document.getElementById('addInfrastructureForm');
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }

        showLoading();

        const formData = {
            id: document.querySelector('#addInfrastructureForm [name="id"]').value,
            name: form.querySelector('[name="name"]').value,
            type: form.querySelector('[name="type"]').value,
            operator: form.querySelector('[name="operator"]').value,
            address: form.querySelector('[name="address"]').value,
            location: form.querySelector('[name="location"]').value,
            latitude: parseFloat(form.querySelector('[name="latitude"]').value) || null,
            longitude: parseFloat(form.querySelector('[name="longitude"]').value) || null
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
        await loadInfrastructures();

        const modalElement = document.getElementById('infrastructureModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();

        alert('Thêm mới hạ tầng thành công!');

    } catch (error) {
        console.error('Lỗi khi thêm mới hạ tầng:', error);
        alert('Có lỗi xảy ra khi thêm mới hạ tầng');
    } finally {
        hideLoading();
    }
}

// Tạo ID mới
function generateNextId() {
      if (!allInfrastructures || allInfrastructures.length === 0) {
        return "HT001";
    }
    const lastId = allInfrastructures[allInfrastructures.length - 1].id;
    const numericPart = parseInt(lastId.slice(2), 10);
    const nextNumericPart = numericPart + 1;
    return `HT${String(nextNumericPart).padStart(3, '0')}`;
}

function editInfrastructure(id) {
    const infrastructure = allInfrastructures.find(i => i.id === id);
    if (!infrastructure) {
         alert('Không tìm thấy thông tin hạ tầng');
        return;
    }

    const modalContent = `
         <div class="modal-header">
            <h5 class="modal-title">Chỉnh sửa thông tin hạ tầng</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
         </div>
        <div class="modal-body">
            <form id="editInfrastructureForm" class="needs-validation" novalidate>
                 <input type="hidden" name="id" value="${infrastructure.id}">
                <div class="mb-3">
                    <label class="form-label required">Tên</label>
                     <input type="text" class="form-control" name="name" value="${infrastructure.name}" required>
                    <div class="invalid-feedback">Vui lòng nhập tên</div>
                </div>
                <div class="mb-3">
                    <label class="form-label required">Loại hình</label>
                     <select class="form-select" name="type" required>
                        <option value="bts" ${infrastructure.type === 'bts' ? 'selected' : ''}>Trạm BTS</option>
                        <option value="fiber_optic" ${infrastructure.type === 'fiber_optic' ? 'selected' : ''}>Cáp quang</option>
                        <option value="antenna_pole" ${infrastructure.type === 'antenna_pole' ? 'selected' : ''}>Cột ăng ten</option>
                        <option value="transmission_line" ${infrastructure.type === 'transmission_line' ? 'selected' : ''}>Tuyến truyền dẫn</option>
                    </select>
                    <div class="invalid-feedback">Vui lòng chọn loại hình</div>
                </div>
               <div class="mb-3">
                   <label class="form-label required">Nhà mạng</label>
                   <select class="form-select" name="operator" required>
                         <option value="viettel" ${infrastructure.operator === 'viettel' ? 'selected' : ''}>Viettel</option>
                         <option value="vnpt" ${infrastructure.operator === 'vnpt' ? 'selected' : ''}>VNPT</option>
                         <option value="mobifone" ${infrastructure.operator === 'mobifone' ? 'selected' : ''}>Mobifone</option>
                        <option value="fpt" ${infrastructure.operator === 'fpt' ? 'selected' : ''}>FPT</option>
                   </select>
                    <div class="invalid-feedback">Vui lòng chọn nhà mạng</div>
                </div>
                 <div class="mb-3">
                    <label class="form-label required">Địa chỉ</label>
                    <input type="text" class="form-control" name="address" value="${infrastructure.address}" required>
                   <div class="invalid-feedback">Vui lòng nhập địa chỉ</div>
                 </div>
                 <div class="mb-3">
                    <label class="form-label required">Địa bàn</label>
                     <select class="form-select" name="location" required>
                           <option value="haichau" ${infrastructure.location === 'haichau' ? 'selected' : ''}>Hải Châu</option>
                            <option value="thanhkhe" ${infrastructure.location === 'thanhkhe' ? 'selected' : ''}>Thanh Khê</option>
                           <option value="sontra" ${infrastructure.location === 'sontra' ? 'selected' : ''}>Sơn Trà</option>
                             <option value="nguhanhson" ${infrastructure.location === 'nguhanhson' ? 'selected' : ''}>Ngũ Hành Sơn</option>
                            <option value="lienchieu" ${infrastructure.location === 'lienchieu' ? 'selected' : ''}>Liên Chiểu</option>
                            <option value="camle" ${infrastructure.location === 'camle' ? 'selected' : ''}>Cẩm Lệ</option>
                           <option value="hoavang" ${infrastructure.location === 'hoavang' ? 'selected' : ''}>Hòa Vang</option>
                            <option value="hoangsa" ${infrastructure.location === 'hoangsa' ? 'selected' : ''}>Hoàng Sa</option>
                    </select>
                    <div class="invalid-feedback">Vui lòng chọn địa bàn</div>
                 </div>
                <div class="row mb-3">
                    <div class="col-md-6">
                        <label class="form-label">Vĩ độ</label>
                         <input type="text" class="form-control" name="latitude" value="${infrastructure.coordinates?.lat || ''}">
                    </div>
                     <div class="col-md-6">
                        <label class="form-label">Kinh độ</label>
                         <input type="text" class="form-control" name="longitude" value="${infrastructure.coordinates?.lng || ''}">
                    </div>
                </div>
            </form>
       </div>
       <div class="modal-footer">
           <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
            <button type="button" class="btn btn-primary" onclick="saveEditedInfrastructure('${infrastructure.id}')">
               <i class="fas fa-save me-1"></i>Lưu thay đổi
           </button>
        </div>
    `;

    const modalElement = document.getElementById('infrastructureModal');
    modalElement.querySelector('.modal-content').innerHTML = modalContent;

    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

async function saveEditedInfrastructure(id) {
    try {
        const form = document.getElementById('editInfrastructureForm');
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }

        showLoading();

        const formData = {
            id: id,
            name: form.querySelector('[name="name"]').value,
            type: form.querySelector('[name="type"]').value,
            operator: form.querySelector('[name="operator"]').value,
            address: form.querySelector('[name="address"]').value,
            location: form.querySelector('[name="location"]').value,
            latitude: parseFloat(form.querySelector('[name="latitude"]').value) || null,
            longitude: parseFloat(form.querySelector('[name="longitude"]').value) || null
        };

        //Log element trước khi lấy value
        console.log("Dữ liệu gửi đi:", formData);

        const response = await fetch(`https://data.vunhat2009.workers.dev/${tableName}`, {
            method: 'PUT', // Hoặc PATCH nếu API của bạn yêu cầu
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData),
              mode: 'cors'
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        await loadInfrastructures();

        const modalElement = document.getElementById('infrastructureModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();

        alert('Cập nhật thông tin hạ tầng thành công!');

    } catch (error) {
        console.error('Lỗi khi cập nhật thông tin hạ tầng:', error);
        alert('Có lỗi xảy ra khi cập nhật thông tin hạ tầng');
    } finally {
        hideLoading();
    }
}

async function deleteInfrastructure(id) {
    try {
        const infrastructure = allInfrastructures.find(i => i.id === id);
        if (!infrastructure) {
            alert('Không tìm thấy thông tin hạ tầng');
            return;
        }

        if (!confirm(`Bạn có chắc chắn muốn xóa hạ tầng này?\n\n- Mã: ${infrastructure.id}\n- Tên: ${infrastructure.name}`)) {
            return;
        }

        showLoading();

        //Log ID trước khi gửi
        console.log("Xóa hạ tầng có ID:", id);

         const response = await fetch(`https://data.vunhat2009.workers.dev/${tableName}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id }),
            mode: 'cors'
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        await loadInfrastructures(); // Tải lại dữ liệu

        alert('Xóa hạ tầng thành công!');
   } catch (error) {
        console.error('Lỗi khi xóa hạ tầng:', error);
        alert('Có lỗi xảy ra khi xóa hạ tầng');
    } finally {
        hideLoading();
    }
}

// ===== PAGINATION FUNCTIONS =====
function updatePagination() {
    const totalPages = Math.ceil(filteredInfrastructures.length / itemsPerPage);
    const paginationElement = document.getElementById('pagination');
     const paginationInfo = document.getElementById('paginationInfo');
    if(!paginationElement) return;

    // Cập nhật thông tin phân trang
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, filteredInfrastructures.length);
     paginationInfo.textContent = `Hiển thị ${startItem}-${endItem} trong tổng số ${filteredInfrastructures.length} hạ tầng`;

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
    const totalPages = Math.ceil(filteredInfrastructures.length / itemsPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        displayInfrastructures();
    }
}

// ===== UTILITY FUNCTIONS =====
function formatInfrastructureType(type) {
    const types = {
        bts: 'Trạm BTS',
        fiber_optic: 'Cáp quang',
       antenna_pole: 'Cột ăng ten',
        transmission_line: 'Tuyến truyền dẫn'
    };
    return types[type] || type;
}

function formatNetworkOperator(operator) {
    const operators = {
        viettel: 'Viettel',
        vnpt: 'VNPT',
        mobifone: 'Mobifone',
         fpt: 'FPT'
    };
    return operators[operator] || operator;
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