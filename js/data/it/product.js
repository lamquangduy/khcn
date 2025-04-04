let allProducts = [];
let filteredProducts = [];
const tableName = 'khcn_data_it_product';
let currentPage = 1;
const itemsPerPage = 10;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    initializeEventListeners();
});

// ===== EVENT LISTENERS =====
function initializeEventListeners() {
    // Filter event listeners
    document.getElementById('productType').addEventListener('change', () => {
        currentPage = 1;
        filterProducts();
    });
    document.getElementById('productEnterprise').addEventListener('change', () => {
        currentPage = 1;
        filterProducts();
    });
     document.getElementById('location').addEventListener('change', () => {
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
         const data = await response.json();
        allProducts = data.map(product => ({
           ...product,
            id: product.id,
             name: product.name,
            type: product.type,
            enterprise: product.enterprise,
             price: product.price,
             location: product.location,
        }))
         // Sắp xếp theo id
         allProducts.sort((a, b) => {
             try {
                const idA = a.id && a.id.startsWith('SP') ? parseInt(a.id.slice(2), 10) : -1;
                const idB = b.id && b.id.startsWith('SP') ? parseInt(b.id.slice(2), 10) : -1;
                return idA - idB;

            } catch(e) {
                 console.error("Error during parsing int", e);
                return 0;
            }
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
            <td>${formatProductType(product.type)}</td>
            <td>${formatProductEnterprise(product.enterprise)}</td>
            <td>${formatCurrency(product.price)}</td>
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
            type: document.getElementById('productType').value,
             enterprise: document.getElementById('productEnterprise').value,
              location: document.getElementById('location').value,
             search: document.getElementById('searchInput').value.toLowerCase()
        };

        filteredProducts = allProducts.filter(product => {
            let matches = true;

             if (filters.type && product.type !== filters.type) matches = false;
            if (filters.enterprise && product.enterprise !== filters.enterprise) matches = false;
             if (filters.location && product.location !== filters.location) matches = false;

            if (filters.search) {
                const searchMatch =
                    product.name.toLowerCase().includes(filters.search) ||
                   formatProductEnterprise(product.enterprise).toLowerCase().includes(filters.search);
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
            <h5 class="modal-title">Chi tiết sản phẩm CNTT</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
            <div class="row mb-3">
                <div class="col-md-6">
                    <label class="fw-bold">Mã:</label>
                    <p>${product.id}</p>
                 </div>
                 <div class="col-md-6">
                      <label class="fw-bold">Loại sản phẩm:</label>
                     <p>${formatProductType(product.type)}</p>
                 </div>
            </div>
            <div class="mb-3">
                <label class="fw-bold">Tên:</label>
                <p>${product.name}</p>
            </div>
            <div class="row mb-3">
                 <div class="col-md-6">
                    <label class="fw-bold">Doanh nghiệp:</label>
                    <p>${formatProductEnterprise(product.enterprise)}</p>
                </div>
                 <div class="col-md-6">
                     <label class="fw-bold">Giá:</label>
                    <p>${formatCurrency(product.price)}</p>
                </div>
            </div>
             <div class="mb-3">
                  <label class="fw-bold">Địa bàn:</label>
                 <p>${formatLocation(product.location)}</p>
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
     const modalContent = `
        <div class="modal-header">
            <h5 class="modal-title">Thêm mới sản phẩm CNTT</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
            <form id="addProductForm" class="needs-validation" novalidate>
                <div class="mb-3">
                     <label class="form-label required">Tên</label>
                     <input type="text" class="form-control" name="name" required>
                     <div class="invalid-feedback">Vui lòng nhập tên</div>
                 </div>
                 <div class="mb-3">
                     <label class="form-label required">Loại sản phẩm</label>
                    <select class="form-select" name="type" required>
                        <option value="">Chọn loại sản phẩm</option>
                         <option value="software">Phần mềm</option>
                         <option value="hardware">Phần cứng</option>
                           <option value="solution">Giải pháp</option>
                    </select>
                     <div class="invalid-feedback">Vui lòng chọn loại sản phẩm</div>
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
                     <label class="form-label required">Giá</label>
                   <input type="number" class="form-control" name="price" required>
                    <div class="invalid-feedback">Vui lòng nhập giá</div>
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
            id: generateNextId(), // Use a proper ID generation function
            name: form.querySelector('[name="name"]').value,
            type: form.querySelector('[name="type"]').value,
            enterprise: form.querySelector('[name="enterprise"]').value,
            location: form.querySelector('[name="location"]').value,
            price: parseFloat(form.querySelector('[name="price"]').value)
        };

        const response = await fetch(`https://data.vunhat2009.workers.dev/${tableName}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
            mode: 'cors'
        });

        if (!response.ok) throw new Error('Failed to save product');

        await loadProducts(); // Reload from API

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

// Add this helper function for consistent ID generation
function generateNextId() {
    if (!allProducts || allProducts.length === 0) return "SP001";
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
                      <label class="form-label required">Tên</label>
                     <input type="text" class="form-control" name="name" value="${product.name}" required>
                    <div class="invalid-feedback">Vui lòng nhập tên</div>
                </div>
                <div class="mb-3">
                     <label class="form-label required">Loại sản phẩm</label>
                      <select class="form-select" name="type" required>
                           <option value="software" ${product.type === 'software' ? 'selected' : ''}>Phần mềm</option>
                            <option value="hardware" ${product.type === 'hardware' ? 'selected' : ''}>Phần cứng</option>
                            <option value="solution" ${product.type === 'solution' ? 'selected' : ''}>Giải pháp</option>
                     </select>
                     <div class="invalid-feedback">Vui lòng chọn loại sản phẩm</div>
                 </div>
                <div class="mb-3">
                   <label class="form-label required">Doanh nghiệp</label>
                     <select class="form-select" name="enterprise" required>
                       <option value="fpt_software" ${product.enterprise === 'fpt_software' ? 'selected' : ''}>FPT Software</option>
                       <option value="hacom" ${product.enterprise === 'hacom' ? 'selected' : ''}>Hà Nội Computer (Hacom)</option>
                        <option value="viettel_solutions" ${product.enterprise === 'viettel_solutions' ? 'selected' : ''}>Viettel Solutions</option>
                       <option value="tinhvan" ${product.enterprise === 'tinhvan' ? 'selected' : ''}>Tập đoàn Tinh Vân</option>
                        <option value="misa" ${product.enterprise === 'misa' ? 'selected' : ''}>Công ty MISA</option>
                        <option value="phongvu" ${product.enterprise === 'phongvu' ? 'selected' : ''}>Phong Vũ</option>
                    </select>
                     <div class="invalid-feedback">Vui lòng chọn doanh nghiệp</div>
               </div>
                <div class="mb-3">
                    <label class="form-label required">Giá</label>
                    <input type="number" class="form-control" name="price" value="${product.price}" required>
                     <div class="invalid-feedback">Vui lòng nhập giá</div>
                 </div>
                   <div class="mb-3">
                      <label class="form-label required">Địa bàn</label>
                     <select class="form-select" name="location" required>
                          <option value="haichau" ${product.location === 'haichau' ? 'selected' : ''}>Hải Châu</option>
                          <option value="thanhkhe" ${product.location === 'thanhkhe' ? 'selected' : ''}>Thanh Khê</option>
                         <option value="sontra" ${product.location === 'sontra' ? 'selected' : ''}>Sơn Trà</option>
                          <option value="nguhanhson" ${product.location === 'nguhanhson' ? 'selected' : ''}>Ngũ Hành Sơn</option>
                         <option value="lienchieu" ${product.location === 'lienchieu' ? 'selected' : ''}>Liên Chiểu</option>
                         <option value="camle" ${product.location === 'camle' ? 'selected' : ''}>Cẩm Lệ</option>
                        <option value="hoavang" ${product.location === 'hoavang' ? 'selected' : ''}>Hòa Vang</option>
                         <option value="hoangsa" ${product.location === 'hoangsa' ? 'selected' : ''}>Hoàng Sa</option>
                     </select>
                    <div class="invalid-feedback">Vui lòng chọn địa bàn</div>
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
            type: form.querySelector('[name="type"]').value,
            enterprise: form.querySelector('[name="enterprise"]').value,
            location: form.querySelector('[name="location"]').value,
            price: parseFloat(form.querySelector('[name="price"]').value)
        };

        const response = await fetch(`https://data.vunhat2009.workers.dev/${tableName}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
            mode: 'cors'
        });

        if (!response.ok) throw new Error('Failed to update product');

        await loadProducts(); // Reload from API

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
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id }),
            mode: 'cors'
        });

        if (!response.ok) throw new Error('Failed to delete product');

        await loadProducts(); // Reload from API

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
function formatProductType(type) {
    const types = {
       software: 'Phần mềm',
       hardware: 'Phần cứng',
        solution: 'Giải pháp'
    };
    return types[type] || type;
}

function formatProductEnterprise(enterprise) {
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

function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

function showLoading() {
    document.getElementById('loading-spinner').classList.remove('d-none');
}

function hideLoading() {
    document.getElementById('loading-spinner').classList.add('d-none');
}