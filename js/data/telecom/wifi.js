let allWifiPoints = [];
let filteredWifiPoints = [];
const tableName = 'khcn_data_telecom_wifi'; // Tên bảng trong Supabase
const apiBaseUrl = 'https://data.vunhat2009.workers.dev';
let currentPage = 2;
const itemsPerPage = 10;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    loadWifiPoints();
    initializeEventListeners();
});

// ===== EVENT LISTENERS =====
function initializeEventListeners() {
    // Filter event listeners
    document.getElementById('wifiLocation').addEventListener('change', () => {
        currentPage = 1;
        filterWifi();
    });
    document.getElementById('wifiProvider').addEventListener('change', () => {
        currentPage = 1;
        filterWifi();
    });
    document.getElementById('searchInput').addEventListener('input', () => {
        currentPage = 1;
        filterWifi();
    });
}

// ===== DATA LOADING =====
async function loadWifiPoints() {
    try {
        showLoading();
        const response = await fetch(`${apiBaseUrl}/${tableName}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch data from ${tableName}`);
        }
        const data = await response.json();
        
        // Map the data to ensure consistent structure
        allWifiPoints = data.map(wifi => ({
            id: wifi.id || '',
            name: wifi.name || '',
            location: wifi.location || '',
            provider: wifi.provider || '',
            ssid: wifi.ssid || '',
            password: wifi.password || null,
            address: wifi.address || '',
            latitude: wifi.latitude || null,
            longitude: wifi.longitude || null
        }));
        
        // Sắp xếp theo id
        allWifiPoints.sort((a, b) => {
            try {
                const idA = a.id && a.id.startsWith('WF') ? parseInt(a.id.slice(2), 10) : -1;
                const idB = b.id && b.id.startsWith('WF') ? parseInt(b.id.slice(2), 10) : -1;
                return idA - idB;
            } catch(e) {
                console.error("Error during parsing int", e);
                return 0;
            }
        });
        
        filteredWifiPoints = [...allWifiPoints]; // Initialize filtered data
        displayWifiPoints();
    } catch (error) {
        console.error('Error loading Wifi points:', error);
        alert('Không thể tải dữ liệu điểm phát Wifi. Vui lòng thử lại sau.');
    } finally {
        hideLoading();
    }
}

// ===== DISPLAY FUNCTIONS =====
function displayWifiPoints() {
    const tbody = document.getElementById('wifiTableBody');
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredWifiPoints.length);
    const displayedData = filteredWifiPoints.slice(startIndex, endIndex);
    tbody.innerHTML = '';

    displayedData.forEach((wifi, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${startIndex + index + 1}</td>
            <td>${wifi.name}</td>
            <td>${formatWifiLocation(wifi.location)}</td>
            <td>${formatWifiProvider(wifi.provider)}</td>
            <td>${wifi.ssid}</td>
            <td>${wifi.password || '<span class="text-muted">Không có</span>'}</td>
            <td>${wifi.latitude && wifi.longitude ? `Lat: ${wifi.latitude}, Lng: ${wifi.longitude}` : ''}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-action btn-view" onclick="viewWifi('${wifi.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-action btn-map" onclick="showMap(${wifi.latitude}, ${wifi.longitude})">
                        <i class="fas fa-map-marker-alt"></i>
                    </button>
                    <button class="btn btn-action btn-edit" onclick="editWifi('${wifi.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-action btn-delete" onclick="deleteWifi('${wifi.id}')">
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
async function filterWifi() {
    try {
        showLoading();
        const filters = {
            location: document.getElementById('wifiLocation').value,
            provider: document.getElementById('wifiProvider').value,
            search: document.getElementById('searchInput').value.toLowerCase()
        };

        filteredWifiPoints = allWifiPoints.filter(wifi => {
            let matches = true;

            if (filters.location && wifi.location !== filters.location) matches = false;
            if (filters.provider && wifi.provider !== filters.provider) matches = false;

            if (filters.search) {
                const searchMatch =
                    (wifi.name && wifi.name.toLowerCase().includes(filters.search)) ||
                    (wifi.address && wifi.address.toLowerCase().includes(filters.search)) ||
                    (wifi.ssid && wifi.ssid.toLowerCase().includes(filters.search)) ||
                    (wifi.provider && wifi.provider.toLowerCase().includes(filters.search));
                if (!searchMatch) matches = false;
            }

            return matches;
        });

        displayWifiPoints();
    } catch (error) {
        console.error('Lỗi khi lọc dữ liệu Wifi:', error);
        alert('Có lỗi xảy ra khi lọc dữ liệu Wifi');
    } finally {
        hideLoading();
    }
}

// ===== CRUD OPERATIONS =====
function viewWifi(id) {
    const wifiPoint = allWifiPoints.find(w => w.id === id);
    if (!wifiPoint) {
        alert('Không tìm thấy thông tin điểm phát Wifi');
        return;
    }

    const modalContent = `
        <div class="modal-header">
            <h5 class="modal-title">Chi tiết điểm phát Wifi công cộng</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
            <div class="row mb-3">
                <div class="col-md-6">
                    <label class="fw-bold">ID:</label>
                    <p>${wifiPoint.id}</p>
                </div>
                <div class="col-md-6">
                    <label class="fw-bold">Nhà cung cấp:</label>
                    <p>${formatWifiProvider(wifiPoint.provider)}</p>
                </div>
            </div>
            <div class="mb-3">
                <label class="fw-bold">Tên điểm phát:</label>
                <p>${wifiPoint.name}</p>
            </div>
            <div class="row mb-3">
                <div class="col-md-6">
                    <label class="fw-bold">Địa điểm:</label>
                    <p>${formatWifiLocation(wifiPoint.location)}</p>
                </div>
                <div class="col-md-6">
                    <label class="fw-bold">SSID:</label>
                    <p>${wifiPoint.ssid}</p>
                </div>
            </div>
            <div class="mb-3">
                <label class="fw-bold">Mật khẩu:</label>
                <p>${wifiPoint.password || '<span class="text-muted">Không có</span>'}</p>
            </div>
            <div class="mb-3">
                <label class="fw-bold">Địa chỉ:</label>
                <p>${wifiPoint.address}</p>
            </div>
            <div class="mb-3">
                <label class="fw-bold">Tọa độ:</label>
                <p>Vĩ độ: ${wifiPoint.latitude || 'Không có'}, Kinh độ: ${wifiPoint.longitude || 'Không có'}</p>
            </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
        </div>
    `;

    const modalElement = document.getElementById('wifiModal');
    modalElement.querySelector('.modal-content').innerHTML = modalContent;

    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

function showMap(latitude, longitude) {
    if (!latitude || !longitude) {
        alert('Không có thông tin tọa độ');
        return;
    }
    
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
                src="https://maps.google.com/maps?q=${latitude},${longitude}&t=&z=15&ie=UTF8&iwloc=&output=embed"
            ></iframe>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
        </div>
    `;

    const modalElement = document.getElementById('wifiModal');
    modalElement.querySelector('.modal-content').innerHTML = modalContent;

    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

async function addNewWifi() {
    const modalContent = `
        <div class="modal-header">
            <h5 class="modal-title">Thêm mới điểm phát Wifi công cộng</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
            <form id="addWifiForm" class="needs-validation" novalidate>
                <div class="mb-3">
                    <label class="form-label required">Tên điểm phát</label>
                    <input type="text" class="form-control" name="name" required>
                    <div class="invalid-feedback">Vui lòng nhập tên điểm phát</div>
                </div>
                <div class="mb-3">
                    <label class="form-label required">Địa điểm</label>
                    <select class="form-select" name="location" required>
                        <option value="">Chọn địa điểm</option>
                        <option value="haichau">Hải Châu</option>
                        <option value="thanhkhe">Thanh Khê</option>
                        <option value="sontra">Sơn Trà</option>
                        <option value="nguhanhson">Ngũ Hành Sơn</option>
                        <option value="lienchieu">Liên Chiểu</option>
                        <option value="camle">Cẩm Lệ</option>
                        <option value="hoavang">Hòa Vang</option>
                        <option value="hoangsa">Hoàng Sa</option>
                    </select>
                    <div class="invalid-feedback">Vui lòng chọn địa điểm</div>
                </div>
                <div class="mb-3">
                    <label class="form-label required">Nhà cung cấp</label>
                    <select class="form-select" name="provider" required>
                        <option value="">Chọn nhà cung cấp</option>
                        <option value="viettel">Viettel</option>
                        <option value="vnpt">VNPT</option>
                        <option value="mobifone">Mobifone</option>
                        <option value="fpt">FPT</option>
                    </select>
                    <div class="invalid-feedback">Vui lòng chọn nhà cung cấp</div>
                </div>
                <div class="mb-3">
                    <label class="form-label required">SSID</label>
                    <input type="text" class="form-control" name="ssid" required>
                    <div class="invalid-feedback">Vui lòng nhập SSID</div>
                </div>
                <div class="mb-3">
                    <label class="form-label">Mật khẩu</label>
                    <input type="text" class="form-control" name="password">
                </div>
                <div class="mb-3">
                    <label class="form-label required">Địa chỉ</label>
                    <input type="text" class="form-control" name="address" required>
                    <div class="invalid-feedback">Vui lòng nhập địa chỉ</div>
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
            <button type="button" class="btn btn-primary" onclick="saveNewWifi()">
                <i class="fas fa-save me-1"></i>Lưu
            </button>
        </div>
    `;

    const modalElement = document.getElementById('wifiModal');
    modalElement.querySelector('.modal-content').innerHTML = modalContent;

    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

async function saveNewWifi() {
    try {
        const form = document.getElementById('addWifiForm');
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }

        showLoading();

        // Create a new ID based on the highest existing ID
        let newId = 1;
        allWifiPoints.forEach(wifi => {
            if (wifi.id && wifi.id.startsWith('WF')) {
                const idNum = parseInt(wifi.id.slice(2), 10);
                if (!isNaN(idNum) && idNum >= newId) {
                    newId = idNum + 1;
                }
            }
        });

        const formData = {
            id: `WF${String(newId).padStart(3, '0')}`,
            name: form.querySelector('[name="name"]').value,
            location: form.querySelector('[name="location"]').value,
            provider: form.querySelector('[name="provider"]').value,
            ssid: form.querySelector('[name="ssid"]').value,
            password: form.querySelector('[name="password"]').value || null,
            address: form.querySelector('[name="address"]').value,
            latitude: parseFloat(form.querySelector('[name="latitude"]').value) || null,
            longitude: parseFloat(form.querySelector('[name="longitude"]').value) || null
        };

        // Make API call to create new WiFi point
        const response = await fetch(`${apiBaseUrl}/${tableName}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        // After successful API call, update local data
        allWifiPoints.push(formData);
        filteredWifiPoints = [...allWifiPoints];
        displayWifiPoints();

        const modalElement = document.getElementById('wifiModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();

        alert('Thêm mới điểm phát Wifi thành công!');
    } catch (error) {
        console.error('Lỗi khi thêm mới điểm phát Wifi:', error);
        alert('Có lỗi xảy ra khi thêm mới điểm phát Wifi: ' + error.message);
    } finally {
        hideLoading();
    }
}

function editWifi(id) {
    const wifiPoint = allWifiPoints.find(w => w.id === id);
    if (!wifiPoint) {
        alert('Không tìm thấy thông tin điểm phát Wifi');
        return;
    }

    const modalContent = `
        <div class="modal-header">
            <h5 class="modal-title">Chỉnh sửa thông tin điểm phát Wifi</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
            <form id="editWifiForm" class="needs-validation" novalidate>
                <input type="hidden" name="id" value="${wifiPoint.id}">
                <div class="mb-3">
                    <label class="form-label required">Tên điểm phát</label>
                    <input type="text" class="form-control" name="name" value="${wifiPoint.name}" required>
                    <div class="invalid-feedback">Vui lòng nhập tên điểm phát</div>
                </div>
                <div class="mb-3">
                    <label class="form-label required">Địa điểm</label>
                    <select class="form-select" name="location" required>
                        <option value="haichau" ${wifiPoint.location === 'haichau' ? 'selected' : ''}>Hải Châu</option>
                        <option value="thanhkhe" ${wifiPoint.location === 'thanhkhe' ? 'selected' : ''}>Thanh Khê</option>
                        <option value="sontra" ${wifiPoint.location === 'sontra' ? 'selected' : ''}>Sơn Trà</option>
                        <option value="nguhanhson" ${wifiPoint.location === 'nguhanhson' ? 'selected' : ''}>Ngũ Hành Sơn</option>
                        <option value="lienchieu" ${wifiPoint.location === 'lienchieu' ? 'selected' : ''}>Liên Chiểu</option>
                        <option value="camle" ${wifiPoint.location === 'camle' ? 'selected' : ''}>Cẩm Lệ</option>
                        <option value="hoavang" ${wifiPoint.location === 'hoavang' ? 'selected' : ''}>Hòa Vang</option>
                        <option value="hoangsa" ${wifiPoint.location === 'hoangsa' ? 'selected' : ''}>Hoàng Sa</option>
                    </select>
                    <div class="invalid-feedback">Vui lòng chọn địa điểm</div>
                </div>
                <div class="mb-3">
                    <label class="form-label required">Nhà cung cấp</label>
                    <select class="form-select" name="provider" required>
                        <option value="viettel" ${wifiPoint.provider === 'viettel' ? 'selected' : ''}>Viettel</option>
                        <option value="vnpt" ${wifiPoint.provider === 'vnpt' ? 'selected' : ''}>VNPT</option>
                        <option value="mobifone" ${wifiPoint.provider === 'mobifone' ? 'selected' : ''}>Mobifone</option>
                        <option value="fpt" ${wifiPoint.provider === 'fpt' ? 'selected' : ''}>FPT</option>
                    </select>
                    <div class="invalid-feedback">Vui lòng chọn nhà cung cấp</div>
                </div>
                <div class="mb-3">
                    <label class="form-label required">SSID</label>
                    <input type="text" class="form-control" name="ssid" value="${wifiPoint.ssid}" required>
                    <div class="invalid-feedback">Vui lòng nhập SSID</div>
                </div>
                <div class="mb-3">
                    <label class="form-label">Mật khẩu</label>
                    <input type="text" class="form-control" name="password" value="${wifiPoint.password || ''}">
                </div>
                <div class="mb-3">
                    <label class="form-label required">Địa chỉ</label>
                    <input type="text" class="form-control" name="address" value="${wifiPoint.address}" required>
                    <div class="invalid-feedback">Vui lòng nhập địa chỉ</div>
                </div>
                <div class="row mb-3">
                    <div class="col-md-6">
                        <label class="form-label">Vĩ độ</label>
                        <input type="number" class="form-control" name="latitude" value="${wifiPoint.latitude || ''}" step="any">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Kinh độ</label>
                        <input type="number" class="form-control" name="longitude" value="${wifiPoint.longitude || ''}" step="any">
                    </div>
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
            <button type="button" class="btn btn-primary" onclick="saveEditedWifi('${wifiPoint.id}')">
                <i class="fas fa-save me-1"></i>Lưu thay đổi
            </button>
        </div>
    `;

    const modalElement = document.getElementById('wifiModal');
    modalElement.querySelector('.modal-content').innerHTML = modalContent;

    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

async function saveEditedWifi(id) {
    try {
        const form = document.getElementById('editWifiForm');
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }
        
        showLoading();

        const formData = {
            id: id,
            name: form.querySelector('[name="name"]').value,
            location: form.querySelector('[name="location"]').value,
            provider: form.querySelector('[name="provider"]').value,
            ssid: form.querySelector('[name="ssid"]').value,
            password: form.querySelector('[name="password"]').value || null,
            address: form.querySelector('[name="address"]').value,
            latitude: parseFloat(form.querySelector('[name="latitude"]').value) || null,
            longitude: parseFloat(form.querySelector('[name="longitude"]').value) || null
        };

        // Use base URL and send ID in body
        const response = await fetch(`${apiBaseUrl}/${tableName}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const index = allWifiPoints.findIndex(w => w.id === id);
        if (index !== -1) {
            allWifiPoints[index] = formData;
        }
        
        filteredWifiPoints = [...allWifiPoints];
        displayWifiPoints();

        const modalElement = document.getElementById('wifiModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();

        alert('Cập nhật thông tin điểm phát Wifi thành công!');
    } catch (error) {
        console.error('Lỗi khi cập nhật thông tin điểm phát Wifi:', error);
        alert('Có lỗi xảy ra khi cập nhật thông tin điểm phát Wifi: ' + error.message);
    } finally {
        hideLoading();
    }
}

async function deleteWifi(id) {
    try {
        const wifiPoint = allWifiPoints.find(w => w.id === id);
        if (!wifiPoint) {
            alert('Không tìm thấy thông tin điểm phát Wifi');
            return;
        }

        if (!confirm(`Bạn có chắc chắn muốn xóa điểm phát Wifi này?\n\n- ID: ${wifiPoint.id}\n- Tên: ${wifiPoint.name}`)) {
            return;
        }
        
        showLoading();
        
        // Use base URL and send ID in body
        const response = await fetch(`${apiBaseUrl}/${tableName}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id })
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        allWifiPoints = allWifiPoints.filter(w => w.id !== id);
        filteredWifiPoints = [...allWifiPoints];
        displayWifiPoints();

        alert('Xóa điểm phát Wifi thành công!');
    } catch (error) {
        console.error('Lỗi khi xóa điểm phát Wifi:', error);
        alert('Có lỗi xảy ra khi xóa điểm phát Wifi: ' + error.message);
    } finally {
        hideLoading();
    }
}
// ===== PAGINATION FUNCTIONS =====
function updatePagination() {
    const totalPages = Math.ceil(filteredWifiPoints.length / itemsPerPage);
    const paginationElement = document.getElementById('pagination');
    const paginationInfo = document.getElementById('paginationInfo');

    // Cập nhật thông tin phân trang
    const startItem = filteredWifiPoints.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
    const endItem = Math.min(currentPage * itemsPerPage, filteredWifiPoints.length);
    paginationInfo.textContent = `Hiển thị ${startItem}-${endItem} trong tổng số ${filteredWifiPoints.length} điểm phát Wifi`;

    let paginationHtml = getPaginationHtml(totalPages);
    paginationElement.innerHTML = paginationHtml;
}

// Tạo HTML cho phân trang
function getPaginationHtml(totalPages) {
    if (totalPages === 0) return '';
    
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
    const totalPages = Math.ceil(filteredWifiPoints.length / itemsPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        displayWifiPoints();
    }
}

// ===== UTILITY FUNCTIONS =====
function formatWifiLocation(location) {
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

function formatWifiProvider(provider) {
    const providers = {
        viettel: 'Viettel',
        vnpt: 'VNPT',
        mobifone: 'Mobifone',
        fpt: 'FPT'
    };
    return providers[provider] || provider;
}

function showLoading() {
    document.getElementById('loading-spinner').classList.remove('d-none');
}

function hideLoading() {
    document.getElementById('loading-spinner').classList.add('d-none');
}