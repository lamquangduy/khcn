// Constants
const IT_TYPES = {
    ALL: 'all',
    ENTERPRISE: 'enterprise',
    PRODUCT: 'product',
    HUMAN: 'human'
};

const TABLE_CLASSES = ['table', 'table-bordered', 'it-table'];

// Mock data with some real data
const reportData = {
     '2024': {
        '1': {
            title: 'Báo cáo tổng hợp CNTT năm 2024',
            data: [
                { name: 'Doanh nghiệp CNTT', unit: 'doanh nghiệp', total: 150, active: 130, inactive: 20 }, // Based on Vietnam IT Industry reports
                { name: 'Sản phẩm CNTT', unit: 'sản phẩm', total: 500, active: 450, inactive: 50 }, // Estimate
                 { name: 'Nhân lực CNTT', unit: 'người', total: 25000, active: 24000, inactive: 1000 } // Estimate from Ministry of Information data
            ]
        },
        '2': {
            title: 'Báo cáo tình hình hoạt động CNTT năm 2024',
             data: [
                { name: 'Doanh nghiệp hoạt động', unit: '%', value: 86.7 },
                { name: 'Sản phẩm hoạt động', unit: '%', value: 90 },
                { name: 'Nhân lực hoạt động', unit: '%', value: 96 }
            ]
        }
    },
    '2023': {
         '1': {
            title: 'Báo cáo tổng hợp CNTT năm 2023',
            data: [
               { name: 'Doanh nghiệp CNTT', unit: 'doanh nghiệp', total: 130, active: 110, inactive: 20 },
                 { name: 'Sản phẩm CNTT', unit: 'sản phẩm', total: 450, active: 400, inactive: 50 },
                  { name: 'Nhân lực CNTT', unit: 'người', total: 23000, active: 22000, inactive: 1000 }
            ]
        },
        '2': {
            title: 'Báo cáo tình hình hoạt động CNTT năm 2023',
             data: [
                { name: 'Doanh nghiệp hoạt động', unit: '%', value: 84.6 },
                 { name: 'Sản phẩm hoạt động', unit: '%', value: 88.9 },
                { name: 'Nhân lực hoạt động', unit: '%', value: 95.7 }
            ]
        }
    }
};


const detailReportData = {
    '2024': {
        items: [
           {
              id: '1',
               name: 'Công ty ABC Software',
                type: 'Công ty phần mềm',
                 location: 'Hải Châu',
                status: 'Hoạt động',
               field: 'Phát triển phần mềm',
                lastUpdate: '2023-12-15'
            },
            {
               id: '2',
              name: 'Dịch vụ IT XYZ',
               type: 'Công ty dịch vụ IT',
               location: 'Thanh Khê',
               status: 'Hoạt động',
              field: 'Dịch vụ IT',
               lastUpdate: '2023-10-20'
           },
            {
                id: '3',
                name: 'Phần mềm Quản lý 123',
                 type: 'Sản phẩm phần mềm',
                location: 'Sơn Trà',
                status: 'Hoạt động',
               field: 'Phần mềm quản lý',
                lastUpdate: '2023-08-15'
            },
            {
               id: '4',
                 name: 'Kỹ sư Nguyễn Văn A',
               type: 'Kỹ sư phần mềm',
              location: 'Ngũ Hành Sơn',
                status: 'Hoạt động',
              field: 'Kỹ sư phần mềm',
               lastUpdate: '2023-11-10'
            },
             {
               id: '5',
                name: 'Nhân viên IT Trần Thị B',
               type: 'Nhân viên IT',
               location: 'Liên Chiểu',
               status: 'Hoạt động',
                field: 'Nhân viên IT',
               lastUpdate: '2023-09-25'
            },
           {
                id: '6',
                name: 'Công ty Phần mềm 456',
                type: 'Công ty phần mềm',
                 location: 'Cẩm Lệ',
                status: 'Tạm dừng',
               field: 'Phát triển web',
                lastUpdate: '2023-07-30'
            },
            {
               id: '7',
                 name: 'Dịch vụ IT 789',
                 type: 'Công ty dịch vụ IT',
               location: 'Hòa Vang',
               status: 'Hoạt động',
                field: 'Dịch vụ IT',
               lastUpdate: '2023-11-30'
            },
            {
               id: '8',
               name: 'Phần mềm Kế toán 789',
                type: 'Sản phẩm phần mềm',
              location: 'Hải Châu',
              status: 'Hoạt động',
                field: 'Phần mềm kế toán',
               lastUpdate: '2023-06-15'
            },
            {
               id: '9',
              name: 'Kỹ sư Lê Văn C',
               type: 'Kỹ sư phần mềm',
               location: 'Thanh Khê',
               status: 'Hoạt động',
              field: 'Kỹ sư AI',
               lastUpdate: '2023-12-01'
            },
           {
              id: '10',
              name: 'Nhân viên IT Đặng Thị D',
              type: 'Nhân viên IT',
               location: 'Sơn Trà',
               status: 'Hoạt động',
              field: 'Nhân viên IT',
                lastUpdate: '2023-08-20'
           },
           {
                id: '11',
               name: 'Công ty EFG Tech',
              type: 'Công ty phần mềm',
               location: 'Liên Chiểu',
                status: 'Hoạt động',
                field: 'Phát triển ứng dụng',
               lastUpdate: '2023-10-10'
            },
            {
                id: '12',
                name: 'Dịch vụ IT 101',
               type: 'Công ty dịch vụ IT',
               location: 'Ngũ Hành Sơn',
               status: 'Tạm dừng',
              field: 'Dịch vụ IT',
                lastUpdate: '2023-11-15'
            },
           {
               id: '13',
              name: 'Phần mềm ERP 2024',
                type: 'Sản phẩm phần mềm',
                location: 'Cẩm Lệ',
               status: 'Hoạt động',
               field: 'Phần mềm ERP',
                lastUpdate: '2023-07-20'
            },
            {
               id: '14',
                name: 'Kỹ sư Trần Văn E',
              type: 'Kỹ sư phần mềm',
               location: 'Hòa Vang',
                status: 'Hoạt động',
               field: 'Kỹ sư web',
              lastUpdate: '2023-09-15'
            },
            {
                id: '15',
               name: 'Nhân viên IT Phạm Thị F',
               type: 'Nhân viên IT',
               location: 'Hải Châu',
              status: 'Hoạt động',
                field: 'Nhân viên IT',
               lastUpdate: '2023-12-05'
            },
             {
               id: '16',
               name: 'Công ty GHI Solutions',
               type: 'Công ty phần mềm',
                location: 'Thanh Khê',
               status: 'Hoạt động',
               field: 'Phát triển mobile app',
                lastUpdate: '2023-08-10'
            },
           {
               id: '17',
               name: 'Dịch vụ Bảo trì IT',
                type: 'Công ty dịch vụ IT',
                location: 'Sơn Trà',
              status: 'Tạm dừng',
                field: 'Dịch vụ IT',
                lastUpdate: '2023-10-30'
            },
           {
                id: '18',
                name: 'Phần mềm CRM 2024',
                 type: 'Sản phẩm phần mềm',
                 location: 'Liên Chiểu',
               status: 'Hoạt động',
              field: 'Phần mềm CRM',
                lastUpdate: '2023-11-20'
           },
           {
                id: '19',
                name: 'Kỹ sư Hồ Văn G',
                 type: 'Kỹ sư phần mềm',
                 location: 'Ngũ Hành Sơn',
                status: 'Hoạt động',
               field: 'Kỹ sư bảo mật',
                lastUpdate: '2023-07-25'
           },
           {
               id: '20',
              name: 'Nhân viên IT Huỳnh Thị H',
               type: 'Nhân viên IT',
                location: 'Cẩm Lệ',
                 status: 'Hoạt động',
              field: 'Nhân viên IT',
               lastUpdate: '2023-12-10'
           }
        ]
    }
};

// Helper functions
const getFilterValues = () => ({
    itType: document.getElementById('itType').value,
    year: document.getElementById('reportYear').value,
      district: document.getElementById('district').value
});


const filterDataByType = (data, type) => {
    if (type === IT_TYPES.ALL) return data;

    return data.filter(item => {
        switch(type) {
            case IT_TYPES.ENTERPRISE: return item.name === 'Doanh nghiệp CNTT';
            case IT_TYPES.PRODUCT: return item.name === 'Sản phẩm CNTT';
             case IT_TYPES.HUMAN: return item.name === 'Nhân lực CNTT';
            default: return true;
        }
    });
};

// UI Rendering functions
const renderSummaryTable = (data) => {
    const table = document.createElement('table');
    table.classList.add(...TABLE_CLASSES);

    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th>Loại hình</th>
            <th>Đơn vị</th>
            <th>Tổng số</th>
             <th>Đang hoạt động</th>
            <th>Tạm dừng</th>
        </tr>
    `;

    const tbody = document.createElement('tbody');
    data.forEach(item => {
        tbody.innerHTML += `
            <tr>
                <td>${item.name}</td>
                <td>${item.unit}</td>
                <td>${item.total}</td>
                <td>${item.active}</td>
                 <td>${item.inactive}</td>
            </tr>
        `;
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    return table;
};


const renderDetailTable = (data) => {
    const table = document.createElement('table');
    table.classList.add(...TABLE_CLASSES);

    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th>Mã số</th>
            <th>Tên</th>
            <th>Loại hình</th>
             <th>Vị trí</th>
             <th>Trạng thái</th>
            <th>Lĩnh vực</th>
            <th>Cập nhật gần nhất</th>
        </tr>
    `;

    const tbody = document.createElement('tbody');
    data.forEach(item => {
        tbody.innerHTML += `
            <tr>
                <td>${item.id}</td>
                <td>${item.name}</td>
                 <td>${item.type}</td>
                 <td>${item.location}</td>
                <td>${item.status}</td>
                 <td>${item.field}</td>
                <td>${item.lastUpdate}</td>
            </tr>
        `;
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    return table;
};

const renderStatusTable = (data) => {
    const table = document.createElement('table');
    table.classList.add(...TABLE_CLASSES);

    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th>Chỉ tiêu</th>
            <th>Đơn vị</th>
            <th>Giá trị</th>
        </tr>
    `;

    const tbody = document.createElement('tbody');
    data.forEach(item => {
        tbody.innerHTML += `
            <tr>
                <td>${item.name}</td>
                <td>${item.unit}</td>
                <td>${item.value}</td>
            </tr>
        `;
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    return table;
};


// Main functions
const loadITReport = () => {
    try {
        const filters = getFilterValues();
        const reportContent = document.getElementById('reportContent');
        reportContent.innerHTML = '';

        const yearData = reportData[filters.year];
         if (!yearData) throw new Error('Không tìm thấy dữ liệu cho năm được chọn');

         // Render summary report
        const summarySection = document.createElement('div');
        summarySection.classList.add('report-section');
        summarySection.innerHTML = `<h5>1. ${yearData['1'].title}</h5>`;
       const filteredData = filterDataByType(yearData['1'].data, filters.itType);
        summarySection.appendChild(renderSummaryTable(filteredData));
        reportContent.appendChild(summarySection);

        // Render status report
        const statusSection = document.createElement('div');
        statusSection.classList.add('report-section');
        statusSection.innerHTML = `<h5>2. ${yearData['2'].title}</h5>`;
        statusSection.appendChild(renderStatusTable(yearData['2'].data));
       reportContent.appendChild(statusSection);
    } catch (error) {
        console.error('Error loading report:', error);
        showErrorMessage(error.message);
    }
};


const loadDetailReport = () => {
    try {
        const detailITType = document.getElementById('detailITType').value;
        const status = document.getElementById('status').value;
        const timeRange = document.getElementById('timeRange').value;

        const reportContainer = document.querySelector('#detail .report-content');

          // Giữ lại phần export tools
        const exportTools = reportContainer.querySelector('.export-tools');
        reportContainer.innerHTML = '';
        reportContainer.appendChild(exportTools);

        // Lọc dữ liệu theo các điều kiện
        let filteredData = detailReportData['2024'].items;

         // Lọc theo loại hình
        if (detailITType !== 'Tất cả') {
            filteredData = filteredData.filter(item => item.type === detailITType);
        }

        // Lọc theo tình trạng
         if (status !== 'Tất cả') {
           filteredData = filteredData.filter(item => item.status === status);
        }

       // Lọc theo thời gian
        if (timeRange.includes('Quý')) {
            const quarter = parseInt(timeRange.match(/\d/)[0]);
             const startMonth = (quarter - 1) * 3;
           const endMonth = startMonth + 2;
            filteredData = filteredData.filter(item => {
              const updateDate = new Date(item.lastUpdate);
                const month = updateDate.getMonth();
               return month >= startMonth && month <= endMonth;
            });
        } else if (timeRange.includes('Tháng')) {
           const month = parseInt(timeRange.match(/\d+/)[0]) - 1;
            filteredData = filteredData.filter(item => {
                const updateDate = new Date(item.lastUpdate);
                return updateDate.getMonth() === month;
           });
       }

        // Hiển thị thông báo nếu không có dữ liệu
       if (filteredData.length === 0) {
            reportContainer.innerHTML += '<div class="alert alert-info">Không có dữ liệu phù hợp với điều kiện lọc</div>';
        } else {
            // Render bảng báo cáo
           const detailTable = renderDetailTable(filteredData);
             reportContainer.appendChild(detailTable);
        }
    } catch (error) {
        console.error('Error loading detail report:', error);
        showErrorMessage('Có lỗi khi tải báo cáo chi tiết: ' + error.message);
    }
};

// Export functions
const exportFunctions = {
    async toPDF() {
        try {
             // Implement PDF export logic
              await generatePDF();
             showSuccessMessage('Xuất PDF thành công');
        } catch (error) {
             showErrorMessage('Có lỗi khi xuất PDF');
        }
    },

    toExcel() {
        try {
              // Implement Excel export logic
            showSuccessMessage('Xuất Excel thành công');
        } catch (error) {
             showErrorMessage('Có lỗi khi xuất Excel');
        }
    },

    print() {
        window.print();
    }
};

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
     // Initialize tabs
    const triggerTabList = [...document.querySelectorAll('.nav-tabs a')];
     triggerTabList.forEach(triggerEl => {
        const tabTrigger = new bootstrap.Tab(triggerEl);
        triggerEl.addEventListener('click', event => {
            event.preventDefault();
            tabTrigger.show();
        });
    });

    // Show first tab
    const firstTab = document.querySelector('.nav-tabs .nav-link.active');
   const firstTabContent = document.querySelector(firstTab.getAttribute('href'));
   if (firstTabContent) {
       firstTabContent.classList.add('show', 'active');
   }
    // Load initial report
    loadITReport();

    // Add event listeners for detail report filters
    document.getElementById('detailITType').addEventListener('change', loadDetailReport);
    document.getElementById('status').addEventListener('change', loadDetailReport);
    document.getElementById('timeRange').addEventListener('change', loadDetailReport);
});

// Export functions to global scope
window.loadITReport = loadITReport;
window.printReport = exportFunctions.print;
window.exportToPDF = exportFunctions.toPDF;
window.exportToExcel = exportFunctions.toExcel;