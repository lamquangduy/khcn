let allProducts = [];
let filteredProducts = [];
const tableName = 'khcn_data_tech_product'; // Tên bảng trong Supabase
let currentPage = 1;
const itemsPerPage = 10;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function () {
    loadProducts();
    initializeEventListeners();
});

// ===== EVENT LISTENERS =====
function initializeEventListeners() {
    // Filter event listeners
    document.getElementById('productField').addEventListener('change', () => {
        currentPage = 1;
        filterProducts();
    });
    document.getElementById('productType').addEventListener('change', () => {
        currentPage = 1;
        filterProducts();
    });
    document.getElementById('searchInput').addEventListener('input', () => {
        currentPage = 1;
        filterProducts();
    });
}

// ===== DATA LOADING =====
async function loadProducts() {
    try {
        showLoading();
        const response = await fetch(`https://data.vunhat2009.workers.dev/${tableName}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch data from ${tableName}`);
        }
        allProducts = await response.json();
        // Sắp xếp theo id
        allProducts.sort((a, b) => {
            const idA = parseInt(a.id.slice(2), 10);
            const idB = parseInt(b.id.slice(2), 10);
            return idA - idB;
        });
        filteredProducts = [...allProducts]; // Initialize filtered data
        displayProducts();
    } catch (error) {
        console.error('Error loading products:', error);
        alert('Không thể tải dữ liệu sản phẩm. Vui lòng thử lại sau.');
    } finally {
        hideLoading();
    }
}

// ===== DISPLAY FUNCTIONS =====
function displayProducts() {
    const tbody = document.getElementById('productTableBody');
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredProducts.length);
    const displayedData = filteredProducts.slice(startIndex, endIndex);
    tbody.innerHTML = '';

    displayedData.forEach((product, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${startIndex + index + 1}</td>
            <td>${product.name}</td>
            <td>${formatProductField(product.field)}</td>
             <td>${product.description}</td>
            <td><span class="product-badge ${formatProductTypeClass(product.type)}">${formatProductType(product.type)}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-action btn-view" onclick="viewProduct('${product.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                     <button class="btn btn-action btn-edit" onclick="editProduct('${product.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-action btn-delete" onclick="deleteProduct('${product.id}')">
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
async function filterProducts() {
    try {
        showLoading();
        const filters = {
            field: document.getElementById('productField').value,
            type: document.getElementById('productType').value,
            search: document.getElementById('searchInput').value.toLowerCase()
        };

        filteredProducts = allProducts.filter(product => {
            let matches = true;

            if (filters.field && product.field !== filters.field) matches = false;
            if (filters.type && product.type !== filters.type) matches = false;

            if (filters.search) {
                const searchMatch =
                    product.name.toLowerCase().includes(filters.search) ||
                    product.description.toLowerCase().includes(filters.search);
                if (!searchMatch) matches = false;
            }

            return matches;
        });

        displayProducts();
    } catch (error) {
        console.error('Lỗi khi lọc dữ liệu sản phẩm:', error);
        alert('Có lỗi xảy ra khi lọc dữ liệu sản phẩm');
    } finally {
        hideLoading();
    }
}


// ===== CRUD OPERATIONS =====
function viewProduct(id) {
    const product = allProducts.find(i => i.id === id);
    if (!product) {
        alert('Không tìm thấy thông tin sản phẩm');
        return;
    }

    const modalContent = `
        <div class="modal-header">
            <h5 class="modal-title">Chi tiết sản phẩm công nghệ</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
         </div>
         <div class="modal-body">
              <div class="row mb-3">
                  <div class="col-md-6">
                      <label class="fw-bold">Mã:</label>
                      <p>${product.id}</p>
                  </div>
                   <div class="col-md-6">
                       <label class="fw-bold">Lĩnh vực:</label>
                       <p>${formatProductField(product.field)}</p>
                  </div>
             </div>
             <div class="mb-3">
                 <label class="fw-bold">Tên sản phẩm:</label>
                 <p>${product.name}</p>
            </div>
            <div class="mb-3">
               <label class="fw-bold">Mô tả:</label>
               <p>${product.description}</p>
           </div>
           <div class="mb-3">
              <label class="fw-bold">Loại hình:</label>
                <p>${formatProductType(product.type)}</p>
            </div>
         </div>
         <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
         </div>
    `;

    const modalElement = document.getElementById('productModal');
    modalElement.querySelector('.modal-content').innerHTML = modalContent;

    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

async function addNewProduct() {
    const newId = generateNextId();
    const modalContent = `
         <div class="modal-header">
             <h5 class="modal-title">Thêm mới sản phẩm công nghệ</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
            <form id="addProductForm" class="needs-validation" novalidate>
                 <div class="mb-3">
                     <label class="form-label required">Mã sản phẩm</label>
                     <input type="text" class="form-control" name="id" value="${newId}" readonly>
                 </div>
                  <div class="mb-3">
                      <label class="form-label required">Tên sản phẩm</label>
                      <input type="text" class="form-control" name="name" required>
                       <div class="invalid-feedback">Vui lòng nhập tên sản phẩm</div>
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
                      <label class="form-label required">Loại hình</label>
                       <select class="form-select" name="type" required>
                            <option value="">Chọn loại hình</option>
                           <option value="hardware">Phần cứng</option>
                            <option value="software">Phần mềm</option>
                           <option value="solution">Giải pháp</option>
                             <option value="device">Thiết bị</option>
                     </select>
                       <div class="invalid-feedback">Vui lòng chọn loại hình</div>
                 </div>
            </form>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
            <button type="button" class="btn btn-primary" onclick="saveNewProduct()">
              <i class="fas fa-save me-1"></i>Lưu
           </button>
        </div>
    `;
    const modalElement = document.getElementById('productModal');
    modalElement.querySelector('.modal-content').innerHTML = modalContent;

    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

async function saveNewProduct() {
    try {
        const form = document.getElementById('addProductForm');
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }
        showLoading();
        const formData = {
            id: document.querySelector('#addProductForm [name="id"]').value,
            name: form.querySelector('[name="name"]').value,
            field: form.querySelector('[name="field"]').value,
            description: form.querySelector('[name="description"]').value,
            type: form.querySelector('[name="type"]').value,
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
        await loadProducts();

        const modalElement = document.getElementById('productModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();

        alert('Thêm mới sản phẩm thành công!');

    } catch (error) {
        console.error('Lỗi khi thêm mới sản phẩm:', error);
        alert('Có lỗi xảy ra khi thêm mới sản phẩm');
    } finally {
        hideLoading();
    }
}
// Tạo ID mới
function generateNextId() {
    if (!allProducts || allProducts.length === 0) {
        return "SP001";
    }
    const lastId = allProducts[allProducts.length - 1].id;
    const numericPart = parseInt(lastId.slice(2), 10);
    const nextNumericPart = numericPart + 1;
    return `SP${String(nextNumericPart).padStart(3, '0')}`;
}

function editProduct(id) {
    const product = allProducts.find(i => i.id === id);
    if (!product) {
        alert('Không tìm thấy thông tin sản phẩm');
        return;
    }

    const modalContent = `
         <div class="modal-header">
            <h5 class="modal-title">Chỉnh sửa thông tin sản phẩm</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
         </div>
         <div class="modal-body">
           <form id="editProductForm" class="needs-validation" novalidate>
                <input type="hidden" name="id" value="${product.id}">
                 <div class="mb-3">
                    <label class="form-label required">Tên sản phẩm</label>
                    <input type="text" class="form-control" name="name" value="${product.name}" required>
                    <div class="invalid-feedback">Vui lòng nhập tên sản phẩm</div>
                </div>
                <div class="mb-3">
                    <label class="form-label required">Lĩnh vực</label>
                      <select class="form-select" name="field" required>
                          <option value="agriculture" ${product.field === 'agriculture' ? 'selected' : ''}>Nông nghiệp</option>
                        <option value="health" ${product.field === 'health' ? 'selected' : ''}>Y tế</option>
                         <option value="industry" ${product.field === 'industry' ? 'selected' : ''}>Công nghiệp</option>
                         <option value="construction" ${product.field === 'construction' ? 'selected' : ''}>Xây dựng</option>
                        <option value="it" ${product.field === 'it' ? 'selected' : ''}>Công nghệ thông tin</option>
                    </select>
                     <div class="invalid-feedback">Vui lòng chọn lĩnh vực</div>
                 </div>
                <div class="mb-3">
                    <label class="form-label">Mô tả</label>
                   <textarea class="form-control" name="description" rows="3">${product.description}</textarea>
                 </div>
                 <div class="mb-3">
                     <label class="form-label required">Loại hình</label>
                    <select class="form-select" name="type" required>
                           <option value="hardware" ${product.type === 'hardware' ? 'selected' : ''}>Phần cứng</option>
                            <option value="software" ${product.type === 'software' ? 'selected' : ''}>Phần mềm</option>
                            <option value="solution" ${product.type === 'solution' ? 'selected' : ''}>Giải pháp</option>
                           <option value="device" ${product.type === 'device' ? 'selected' : ''}>Thiết bị</option>
                     </select>
                     <div class="invalid-feedback">Vui lòng chọn loại hình</div>
                 </div>
            </form>
        </div>
         <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
             <button type="button" class="btn btn-primary" onclick="saveEditedProduct('${product.id}')">
                 <i class="fas fa-save me-1"></i>Lưu thay đổi
             </button>
         </div>
    `;

    const modalElement = document.getElementById('productModal');
    modalElement.querySelector('.modal-content').innerHTML = modalContent;

    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

async function saveEditedProduct(id) {
    try {
        const form = document.getElementById('editProductForm');
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }
        showLoading();

        const formData = {
            id: id,
            name: form.querySelector('[name="name"]').value,
            field: form.querySelector('[name="field"]').value,
            description: form.querySelector('[name="description"]').value,
            type: form.querySelector('[name="type"]').value,
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

        await loadProducts();
        // Sắp xếp lại mảng sau khi edit thành công
        allProducts.sort((a, b) => {
            const idA = parseInt(a.id.slice(2), 10);
            const idB = parseInt(b.id.slice(2), 10);
            return idA - idB;
        });
        displayProducts();

        const modalElement = document.getElementById('productModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();

        alert('Cập nhật thông tin sản phẩm thành công!');

    } catch (error) {
        console.error('Lỗi khi cập nhật thông tin sản phẩm:', error);
        alert('Có lỗi xảy ra khi cập nhật thông tin sản phẩm');
    } finally {
        hideLoading();
    }
}

async function deleteProduct(id) {
    try {
        const product = allProducts.find(i => i.id === id);
        if (!product) {
            alert('Không tìm thấy thông tin sản phẩm');
            return;
        }

        if (!confirm(`Bạn có chắc chắn muốn xóa sản phẩm này?\n\n- Mã: ${product.id}\n- Tên sản phẩm: ${product.name}`)) {
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
        await loadProducts();

        alert('Xóa sản phẩm thành công!');

    } catch (error) {
        console.error('Lỗi khi xóa sản phẩm:', error);
        alert('Có lỗi xảy ra khi xóa sản phẩm');
    } finally {
        hideLoading();
    }
}
// ===== PAGINATION FUNCTIONS =====
function updatePagination() {
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const paginationElement = document.getElementById('pagination');
    const paginationInfo = document.getElementById('paginationInfo');

    // Cập nhật thông tin phân trang
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, filteredProducts.length);
    paginationInfo.textContent = `Hiển thị ${startItem}-${endItem} trong tổng số ${filteredProducts.length} sản phẩm`;

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
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        displayProducts();
    }
}

// ===== UTILITY FUNCTIONS =====
function formatProductField(field) {
    const fields = {
        agriculture: "Nông nghiệp",
        health: "Y tế",
        industry: "Công nghiệp",
        construction: "Xây dựng",
        it: "Công nghệ thông tin"
    };
    return fields[field] || field;
}
function formatProductType(type) {
    const types = {
        hardware: "Phần cứng",
        software: "Phần mềm",
        solution: "Giải pháp",
        device: "Thiết bị"
    };
    return types[type] || type;
}
function formatProductTypeClass(type) {
    const types = {
        hardware: "product-hardware",
        software: "product-software",
        solution: "product-solution",
        device: "product-device"
    };
    return types[type] || "";
}
function showLoading() {
    document.getElementById('loading-spinner').classList.remove('d-none');
}

function hideLoading() {
    document.getElementById('loading-spinner').classList.add('d-none');
}