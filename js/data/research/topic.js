let allTopics = [];
let filteredTopics = [];
const tableName = 'khcn_data_topic'; // Tên bảng trong Supabase
let currentPage = 1;
const itemsPerPage = 10;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function () {
    loadTopics();
    initializeEventListeners();
});

// ===== EVENT LISTENERS =====
function initializeEventListeners() {
    // Filter event listeners
    document.getElementById('topicField').addEventListener('change', () => {
        currentPage = 1;
        filterTopics();
    });
    document.getElementById('topicLevel').addEventListener('change', () => {
        currentPage = 1;
        filterTopics();
    });
    document.getElementById('topicStatus').addEventListener('change', () => { // New status filter event
        currentPage = 1;
        filterTopics();
    });
    document.getElementById('searchInput').addEventListener('input', () => {
        currentPage = 1;
        filterTopics();
    });
}

// ===== DATA LOADING =====
async function loadTopics() {
    try {
        showLoading();
        const response = await fetch(`https://data.vunhat2009.workers.dev/${tableName}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch data from ${tableName}`);
        }
        const data = await response.json();
        allTopics = data.map(topic => {
            // Parse team from JSON string to array, handle potential errors
            let teamArray = [];
            if (topic.team) {
                try {
                    teamArray = JSON.parse(topic.team);
                    if (!Array.isArray(teamArray)) {
                        teamArray = []; // If parsing doesn't result in array, default to empty array
                    }
                } catch (e) {
                    console.error("Error parsing team JSON:", topic.team, e);
                    teamArray = []; // If parsing fails, default to empty array
                }
            }
            return { ...topic, team: teamArray }; // Replace string with parsed array
        });


        // Sắp xếp theo id (ví dụ: DA2024001)
        allTopics.sort((a, b) => {
            const idA = parseInt(a.id.slice(6), 10); // Lấy phần số sau DAyyyy
            const idB = parseInt(b.id.slice(6), 10);
            return idA - idB;
        });

        filteredTopics = [...allTopics]; // Initialize filtered data
        displayTopics();
    } catch (error) {
        console.error('Error loading topics:', error);
        alert('Không thể tải dữ liệu đề tài. Vui lòng thử lại sau.');
    } finally {
        hideLoading();
    }
}

// ===== DISPLAY FUNCTIONS =====
function displayTopics() {
    const tbody = document.getElementById('topicTableBody');
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredTopics.length);
    const displayedData = filteredTopics.slice(startIndex, endIndex);
    tbody.innerHTML = '';

    displayedData.forEach((topic, index) => {
        const row = document.createElement('tr');
        const level = getTopicLevelFromInstitution(topic.institution);
        const time = `${topic.startdate} - ${topic.enddate}`;
        row.innerHTML = `
            <td>${startIndex + index + 1}</td>
            <td>${topic.id}</td>
            <td>${topic.name}</td>
            <td><span class="field-badge ${formatTopicFieldClass(topic.field)}">${formatTopicField(topic.field)}</span></td>
            <td>${topic.principal}</td>
            <td>${topic.institution}</td>
            <td>${topic.startdate}</td>
            <td>${topic.enddate}</td>
            <td>${formatCurrency(topic.budget)}</td> 
            <td><span class="status-badge ${formatTopicStatusClass(topic.status)}">${topic.status}</span></td>
             <td>
                <div class="action-buttons">
                    <button class="btn btn-action btn-view" onclick="viewTopic('${topic.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-action btn-edit" onclick="editTopic('${topic.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-action btn-delete" onclick="deleteTopic('${topic.id}')">
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
async function filterTopics() {
    try {
        showLoading();
        const filters = {
            field: document.getElementById('topicField').value,
            level: document.getElementById('topicLevel').value,
            status: document.getElementById('topicStatus').value, // New status filter
            search: document.getElementById('searchInput').value.toLowerCase()
        };

        filteredTopics = allTopics.filter(topic => {
            let matches = true;
            const level = getTopicLevelFromInstitution(topic.institution);

            if (filters.field && topic.field !== filters.field) matches = false;
            if (filters.level && level !== filters.level) matches = false;
            if (filters.status && topic.status !== filters.status) matches = false; // New status filter


            if (filters.search) {
                const searchMatch =
                    topic.name.toLowerCase().includes(filters.search) ||
                    topic.principal.toLowerCase().includes(filters.search) ||
                    topic.institution.toLowerCase().includes(filters.search);
                if (!searchMatch) matches = false;
            }

            return matches;
        });

        displayTopics();
    } catch (error) {
        console.error('Lỗi khi lọc dữ liệu đề tài:', error);
        alert('Có lỗi xảy ra khi lọc dữ liệu đề tài');
    } finally {
        hideLoading();
    }
}

// ===== CRUD OPERATIONS =====
function viewTopic(id) {
    const topic = allTopics.find(i => i.id === id);
    if (!topic) {
        alert('Không tìm thấy thông tin đề tài');
        return;
    }
    const level = getTopicLevelFromInstitution(topic.institution);
    const time = `${topic.startdate} - ${topic.enddate}`;

    const modalContent = `
        <div class="modal-header">
            <h5 class="modal-title">Chi tiết đề tài nghiên cứu</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
             <div class="row mb-3">
                 <div class="col-md-6">
                      <label class="fw-bold">Mã:</label>
                      <p>${topic.id}</p>
                 </div>
                 <div class="col-md-6">
                    <label class="fw-bold">Lĩnh vực:</label>
                     <p><span class="field-badge ${formatTopicFieldClass(topic.field)}">${formatTopicField(topic.field)}</span></p>
                 </div>
             </div>
             <div class="mb-3">
                 <label class="fw-bold">Tên đề tài:</label>
                 <p>${topic.name}</p>
             </div>
            <div class="row mb-3">
                  <div class="col-md-6">
                        <label class="fw-bold">Chủ nhiệm:</label>
                       <p>${topic.principal}</p>
                  </div>
                 <div class="col-md-6">
                     <label class="fw-bold">Cấp quản lý:</label>
                       <p>${formatTopicLevel(level)}</p>
                 </div>
             </div>
             <div class="row mb-3">
                <div class="col-md-6">
                    <label class="fw-bold">Cơ quan chủ trì:</label>
                   <p>${topic.institution}</p>
               </div>
                <div class="col-md-6">
                    <label class="fw-bold">Thời gian thực hiện:</label>
                    <p>${time}</p>
                </div>
             </div>
             <div class="row mb-3">
                <div class="col-md-6">
                     <label class="fw-bold">Ngày bắt đầu:</label>
                     <p>${topic.startdate}</p>
                </div>
                 <div class="col-md-6">
                     <label class="fw-bold">Ngày kết thúc:</label>
                     <p>${topic.enddate}</p>
                 </div>
             </div>
             <div class="mb-3">
                 <label class="fw-bold">Kinh phí:</label>
                 <p>${formatCurrency(topic.budget)}</p> 
             </div>
             <div class="mb-3">
                 <label class="fw-bold">Trạng thái:</label>
                 <p><span class="status-badge ${formatTopicStatusClass(topic.status)}">${topic.status}</span></p>
             </div>
           <div class="mb-3">
               <label class="fw-bold">Mô tả:</label>
               <p>${topic.description}</p>
           </div>
           <div class="mb-3">
                <label class="fw-bold">Thành viên nhóm:</label>
                 <p>${topic.team && topic.team.length > 0 ? topic.team.join(', ') : 'Không có'}</p>
            </div>
        </div>
       <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
        </div>
    `;

    const modalElement = document.getElementById('topicModal');
    modalElement.querySelector('.modal-content').innerHTML = modalContent;

    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

async function addNewTopic() {
    const newId = generateNextId();
    const modalContent = `
        <div class="modal-header">
            <h5 class="modal-title">Thêm mới đề tài nghiên cứu</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
            <form id="addTopicForm" class="needs-validation" novalidate>
                 <div class="mb-3">
                     <label class="form-label required">Mã đề tài</label>
                     <input type="text" class="form-control" name="id" value="${newId}" readonly>
                 </div>
                <div class="mb-3">
                     <label class="form-label required">Tên đề tài</label>
                    <input type="text" class="form-control" name="name" required>
                     <div class="invalid-feedback">Vui lòng nhập tên đề tài</div>
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
                      <label class="form-label required">Chủ nhiệm</label>
                     <input type="text" class="form-control" name="principal" required>
                     <div class="invalid-feedback">Vui lòng nhập chủ nhiệm</div>
               </div>
               <div class="mb-3">
                     <label class="form-label required">Cơ quan chủ trì</label>
                     <input type="text" class="form-control" name="institution" required>
                      <div class="invalid-feedback">Vui lòng nhập cơ quan chủ trì</div>
                 </div>
                 <div class="mb-3">
                     <label class="form-label required">Ngày bắt đầu</label>
                     <input type="date" class="form-control" name="startdate" required>
                      <div class="invalid-feedback">Vui lòng nhập ngày bắt đầu</div>
                 </div>
                 <div class="mb-3">
                     <label class="form-label required">Ngày kết thúc</label>
                     <input type="date" class="form-control" name="enddate" required>
                      <div class="invalid-feedback">Vui lòng nhập ngày kết thúc</div>
                 </div>
                  <div class="mb-3">
                     <label class="form-label required">Kinh phí</label>
                     <input type="number" class="form-control" name="budget" required>
                     <div class="invalid-feedback">Vui lòng nhập kinh phí</div>
                </div>
                 <div class="mb-3">
                   <label class="form-label required">Trạng thái</label>
                     <select class="form-select" name="status" required>
                        <option value="">Chọn trạng thái</option>
                        <option value="Đang thực hiện">Đang thực hiện</option>
                        <option value="Hoàn thành">Hoàn thành</option>
                    </select>
                    <div class="invalid-feedback">Vui lòng chọn trạng thái</div>
                 </div>
                 <div class="mb-3">
                     <label class="form-label">Mô tả</label>
                     <textarea class="form-control" name="description"></textarea>
                 </div>
                 <div class="mb-3">
                     <label class="form-label">Thành viên nhóm (mỗi thành viên trên một dòng)</label>
                     <textarea class="form-control" name="team"></textarea>
                 </div>
            </form>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
            <button type="button" class="btn btn-primary" onclick="saveNewTopic()">
                <i class="fas fa-save me-1"></i>Lưu
            </button>
        </div>
    `;

    const modalElement = document.getElementById('topicModal');
    modalElement.querySelector('.modal-content').innerHTML = modalContent;

    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

async function saveNewTopic() {
    try {
        const form = document.getElementById('addTopicForm');
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }

        showLoading();

        const formData = {
            id: document.querySelector('#addTopicForm [name="id"]').value,
            name: form.querySelector('[name="name"]').value,
            field: form.querySelector('[name="field"]').value,
            principal: form.querySelector('[name="principal"]').value,
            institution: form.querySelector('[name="institution"]').value,
            startdate: form.querySelector('[name="startdate"]').value,
            enddate: form.querySelector('[name="enddate"]').value,
            budget: form.querySelector('[name="budget"]').value,
            status: form.querySelector('[name="status"]').value,
            description: form.querySelector('[name="description"]').value,
            team: form.querySelector('[name="team"]').value.split('\n').filter(member => member.trim() !== '')
        };

        // Convert team array back to JSON string for API
        formData.team = JSON.stringify(formData.team);


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
        await loadTopics();

        const modalElement = document.getElementById('topicModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();

        alert('Thêm mới đề tài thành công!');
    } catch (error) {
        console.error('Lỗi khi thêm mới đề tài:', error);
        alert('Có lỗi xảy ra khi thêm mới đề tài');
    } finally {
        hideLoading();
    }
}
// Tạo ID mới
function generateNextId() {
    if (!allTopics || allTopics.length === 0) {
        return "DT" + new Date().getFullYear() + "001"; // Start from DT2024001 as per data (adjust prefix if needed)
    }
    const lastId = allTopics[allTopics.length - 1].id;
    const numericPart = parseInt(lastId.slice(6), 10); // Extract number after DTYYYY
    const nextNumericPart = numericPart + 1;
    return `DT${new Date().getFullYear()}${String(nextNumericPart).padStart(3, '0')}`; // Dynamically get year, adjust prefix if needed
}


function editTopic(id) {
    const topic = allTopics.find(i => i.id === id);
    if (!topic) {
        alert('Không tìm thấy thông tin đề tài');
        return;
    }

    const modalContent = `
         <div class="modal-header">
             <h5 class="modal-title">Chỉnh sửa thông tin đề tài</h5>
             <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
            <form id="editTopicForm" class="needs-validation" novalidate>
                <input type="hidden" name="id" value="${topic.id}">
                 <div class="mb-3">
                      <label class="form-label required">Mã đề tài</label>
                     <input type="text" class="form-control" name="id" value="${topic.id}" readonly>
                 </div>
                 <div class="mb-3">
                      <label class="form-label required">Tên đề tài</label>
                    <input type="text" class="form-control" name="name" value="${topic.name}" required>
                    <div class="invalid-feedback">Vui lòng nhập tên đề tài</div>
                 </div>
                <div class="mb-3">
                     <label class="form-label required">Lĩnh vực</label>
                      <select class="form-select" name="field" required>
                        <option value="agriculture" ${topic.field === 'agriculture' ? 'selected' : ''}>Nông nghiệp</option>
                        <option value="health" ${topic.field === 'health' ? 'selected' : ''}>Y tế</option>
                        <option value="industry" ${topic.field === 'industry' ? 'selected' : ''}>Công nghiệp</option>
                        <option value="construction" ${topic.field === 'construction' ? 'selected' : ''}>Xây dựng</option>
                        <option value="it" ${topic.field === 'it' ? 'selected' : ''}>Công nghệ thông tin</option>
                    </select>
                     <div class="invalid-feedback">Vui lòng chọn lĩnh vực</div>
                </div>
                 <div class="mb-3">
                      <label class="form-label required">Chủ nhiệm</label>
                      <input type="text" class="form-control" name="principal" value="${topic.principal}" required>
                      <div class="invalid-feedback">Vui lòng nhập chủ nhiệm</div>
                </div>
                <div class="mb-3">
                     <label class="form-label required">Cơ quan chủ trì</label>
                     <input type="text" class="form-control" name="institution" value="${topic.institution}" required>
                      <div class="invalid-feedback">Vui lòng nhập cơ quan chủ trì</div>
                 </div>
                 <div class="mb-3">
                     <label class="form-label required">Ngày bắt đầu</label>
                     <input type="date" class="form-control" name="startdate" value="${topic.startdate}" required>
                      <div class="invalid-feedback">Vui lòng nhập ngày bắt đầu</div>
                 </div>
                 <div class="mb-3">
                     <label class="form-label required">Ngày kết thúc</label>
                     <input type="date" class="form-control" name="enddate" value="${topic.enddate}" required>
                      <div class="invalid-feedback">Vui lòng nhập ngày kết thúc</div>
                 </div>
                  <div class="mb-3">
                     <label class="form-label required">Kinh phí</label>
                    <input type="number" class="form-control" name="budget" value="${topic.budget}" required>
                     <div class="invalid-feedback">Vui lòng nhập kinh phí</div>
                </div>
                <div class="mb-3">
                   <label class="form-label required">Trạng thái</label>
                    <select class="form-select" name="status" required>
                        <option value="">Chọn trạng thái</option>
                        <option value="Đang thực hiện" ${topic.status === 'Đang thực hiện' ? 'selected' : ''}>Đang thực hiện</option> 
                        <option value="Hoàn thành" ${topic.status === 'Hoàn thành' ? 'selected' : ''}>Hoàn thành</option>
                    </select>
                     <div class="invalid-feedback">Vui lòng chọn trạng thái</div>
                 </div>
                 <div class="mb-3">
                     <label class="form-label">Mô tả</label>
                     <textarea class="form-control" name="description">${topic.description}</textarea>
                 </div>
                 <div class="mb-3">
                     <label class="form-label">Thành viên nhóm (mỗi thành viên trên một dòng)</label>
                     <textarea class="form-control" name="team">${topic.team ? topic.team.join('\n') : ''}</textarea>
                 </div>
            </form>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
            <button type="button" class="btn btn-primary" onclick="saveEditedTopic('${topic.id}')">
               <i class="fas fa-save me-1"></i>Lưu thay đổi
           </button>
        </div>
    `;

    const modalElement = document.getElementById('topicModal');
    modalElement.querySelector('.modal-content').innerHTML = modalContent;

    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

async function saveEditedTopic(id) {
    try {
        const form = document.getElementById('editTopicForm');
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }

        showLoading();

        const formData = {
            id: id,
            name: form.querySelector('[name="name"]').value,
            field: form.querySelector('[name="field"]').value,
            principal: form.querySelector('[name="principal"]').value,
            institution: form.querySelector('[name="institution"]').value,
            startdate: form.querySelector('[name="startdate"]').value,
            enddate: form.querySelector('[name="enddate"]').value,
            budget: form.querySelector('[name="budget"]').value,
            status: form.querySelector('[name="status"]').value,
            description: form.querySelector('[name="description"]').value,
            team: form.querySelector('[name="team"]').value.split('\n').filter(member => member.trim() !== '')
        };

        // Convert team array back to JSON string for API
        formData.team = JSON.stringify(formData.team);


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
        await loadTopics();
        // Sắp xếp lại mảng sau khi edit thành công
        allTopics.sort((a, b) => {
            const idA = parseInt(a.id.slice(6), 10);
            const idB = parseInt(b.id.slice(6), 10);
            return idA - idB;
        });
        displayTopics();

        const modalElement = document.getElementById('topicModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();

        alert('Cập nhật thông tin đề tài thành công!');

    } catch (error) {
        console.error('Lỗi khi cập nhật thông tin đề tài:', error);
        alert('Có lỗi xảy ra khi cập nhật thông tin đề tài');
    } finally {
        hideLoading();
    }
}

async function deleteTopic(id) {
    try {
        const topic = allTopics.find(i => i.id === id);
        if (!topic) {
            alert('Không tìm thấy thông tin đề tài');
            return;
        }

        if (!confirm(`Bạn có chắc chắn muốn xóa đề tài này?\n\n- Mã: ${topic.id}\n- Tên đề tài: ${topic.name}`)) {
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
        await loadTopics();

        alert('Xóa đề tài thành công!');

    } catch (error) {
        console.error('Lỗi khi xóa đề tài:', error);
        alert('Có lỗi xảy ra khi xóa đề tài');
    } finally {
        hideLoading();
    }
}
// ===== PAGINATION FUNCTIONS =====
function updatePagination() {
    const totalPages = Math.ceil(filteredTopics.length / itemsPerPage);
    const paginationElement = document.getElementById('pagination');
    const paginationInfo = document.getElementById('paginationInfo');

    // Cập nhật thông tin phân trang
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, filteredTopics.length);
    paginationInfo.textContent = `Hiển thị ${startItem}-${endItem} trong tổng số ${filteredTopics.length} đề tài`;

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
    const totalPages = Math.ceil(filteredTopics.length / itemsPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        displayTopics();
    }
}

// ===== UTILITY FUNCTIONS =====
function formatTopicField(field) {
    const fields = {
        agriculture: "Nông nghiệp",
        health: "Y tế",
        industry: "Công nghiệp",
        construction: "Xây dựng",
        it: "Công nghệ thông tin"
    };
    return fields[field] || field;
}

function formatTopicFieldClass(field) {
    const fieldClasses = {
        agriculture: "type-agriculture",
        health: "type-health",
        industry: "type-industry",
        construction: "type-construction",
        it: "type-it"
    };
    return fieldClasses[field] || "";
}

function formatTopicLevel(level) {
    const levels = {
        ministry: "Cấp Bộ",
        province: "Cấp Tỉnh",
        institution: "Cấp Cơ Sở"
    };
    return levels[level] || level;
}

function formatTopicLevelClass(level) {
    const levels = {
        ministry: "level-ministry",
        province: "level-province",
        institution: "level-institution"
    };
    return levels[level] || "";
}

function formatTopicStatusClass(status) {
    const statusClasses = {
        "Đang thực hiện": "status-Đang-thực-hiện",
        "Hoàn thành": "status-Hoàn-thành"
    };
    return statusClasses[status] || "";
}


function getTopicLevelFromInstitution(institution) {
    const institutionLower = institution.toLowerCase();
    if (institutionLower.includes('đại học') || institutionLower.includes('bệnh viện') || institutionLower.includes('trường')) {
        return 'institution';
    } else if (institutionLower.includes('sở') || institutionLower.includes('tỉnh') || institutionLower.includes('thành phố')) {
        return 'province';
    } else if (institutionLower.includes('bộ') || institutionLower.includes('trung ương')) {
        return 'ministry';
    }
    return 'institution'; // Default to institution if not matched
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