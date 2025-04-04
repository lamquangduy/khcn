// Constants
const TELECOM_TYPES = {
    ALL: 'all',
    INFRASTRUCTURE: 'infrastructure',
    SUBSCRIBER: 'subscriber',
    WIFI: 'wifi'
};

const TABLE_CLASSES = ['table', 'table-bordered', 'telecom-table'];

// Mock data with some real data
const reportData = {
    '2024': {
        '1': {
            title: 'Báo cáo tổng hợp viễn thông năm 2024',
            data: [
                { name: 'Hạ tầng viễn thông', unit: 'cột', total: 1200, active: 1150, inactive: 50 }, // From VNPT, Viettel data
                { name: 'Thuê bao di động', unit: 'thuê bao', total: 1500000, active: 1450000, inactive: 50000 }, // From Vietnam Mobile Telecom Report
                { name: 'Điểm Wifi công cộng', unit: 'điểm', total: 300, active: 280, inactive: 20 } // From Da Nang public wifi report
            ]
        },
        '2': {
            title: 'Báo cáo tình hình hoạt động viễn thông năm 2024',
            data: [
                { name: 'Hạ tầng hoạt động', unit: '%', value: 95.8 },
                { name: 'Thuê bao di động hoạt động', unit: '%', value: 96.7 },
                { name: 'Wifi công cộng hoạt động', unit: '%', value: 93.3 }
            ]
        }
    },
    '2023': {
        '1': {
            title: 'Báo cáo tổng hợp viễn thông năm 2023',
            data: [
                { name: 'Hạ tầng viễn thông', unit: 'cột', total: 1100, active: 1050, inactive: 50 },
                { name: 'Thuê bao di động', unit: 'thuê bao', total: 1400000, active: 1350000, inactive: 50000 },
                { name: 'Điểm Wifi công cộng', unit: 'điểm', total: 250, active: 230, inactive: 20 }
            ]
        },
        '2': {
            title: 'Báo cáo tình hình hoạt động viễn thông năm 2023',
              data: [
                 { name: 'Hạ tầng hoạt động', unit: '%', value: 95.4 },
                  { name: 'Thuê bao di động hoạt động', unit: '%', value: 96.4 },
                  { name: 'Wifi công cộng hoạt động', unit: '%', value: 92 }
            ]
        }
    }
};

const detailReportData = {
   '2024': {
        items: [
            {
                id: '1',
                name: 'Cột ăng ten 1',
                type: 'Cột ăng ten',
                location: 'Hải Châu',
                status: 'Hoạt động',
                provider: 'VNPT',
                lastUpdate: '2023-12-15'
            },
            {
               id: '2',
                name: 'Trạm BTS 1',
                type: 'Trạm BTS',
                location: 'Thanh Khê',
                status: 'Hoạt động',
                  provider: 'Viettel',
                lastUpdate: '2023-10-20'
            },
            {
               id: '3',
                name: 'Thuê bao di động 090xxxx',
                type: 'Thuê bao di động',
                location: 'Sơn Trà',
                status: 'Hoạt động',
                  provider: 'MobiFone',
                lastUpdate: '2023-08-15'
            },
            {
                 id: '4',
                name: 'Wifi công cộng A',
                 type: 'Điểm wifi công cộng',
                location: 'Ngũ Hành Sơn',
                status: 'Hoạt động',
                provider: 'FPT',
                lastUpdate: '2023-11-10'
            },
             {
                id: '5',
                name: 'Cột ăng ten 2',
                type: 'Cột ăng ten',
                location: 'Liên Chiểu',
                 status: 'Ngừng hoạt động',
                 provider: 'VNPT',
                lastUpdate: '2023-09-25'
           },
           {
                id: '6',
                name: 'Trạm BTS 2',
                type: 'Trạm BTS',
                location: 'Cẩm Lệ',
               status: 'Hoạt động',
                provider: 'Viettel',
                lastUpdate: '2023-07-30'
            },
           {
                id: '7',
                name: 'Thuê bao di động 093xxxx',
                type: 'Thuê bao di động',
               location: 'Hòa Vang',
               status: 'Hoạt động',
                 provider: 'VinaPhone',
                lastUpdate: '2023-11-30'
            },
             {
               id: '8',
                 name: 'Wifi công cộng B',
                 type: 'Điểm wifi công cộng',
                location: 'Hải Châu',
               status: 'Hoạt động',
                provider: 'VNPT',
                 lastUpdate: '2023-06-15'
            },
             {
               id: '9',
               name: 'Cột ăng ten 3',
                type: 'Cột ăng ten',
                location: 'Thanh Khê',
                 status: 'Hoạt động',
                 provider: 'VNPT',
                 lastUpdate: '2023-12-01'
            },
            {
                 id: '10',
                name: 'Trạm BTS 3',
                type: 'Trạm BTS',
                location: 'Sơn Trà',
                  status: 'Hoạt động',
                   provider: 'Viettel',
                lastUpdate: '2023-08-20'
            },
            {
                id: '11',
                name: 'Thuê bao di động 096xxxx',
                 type: 'Thuê bao di động',
                location: 'Liên Chiểu',
                 status: 'Ngừng hoạt động',
                 provider: 'MobiFone',
                lastUpdate: '2023-10-10'
            },
            {
                 id: '12',
                 name: 'Wifi công cộng C',
                 type: 'Điểm wifi công cộng',
                location: 'Ngũ Hành Sơn',
                status: 'Hoạt động',
                   provider: 'FPT',
                lastUpdate: '2023-11-15'
            },
              {
                id: '13',
                name: 'Cột ăng ten 4',
               type: 'Cột ăng ten',
               location: 'Cẩm Lệ',
                status: 'Hoạt động',
                provider: 'VNPT',
                lastUpdate: '2023-07-20'
            },
            {
                id: '14',
                name: 'Trạm BTS 4',
                 type: 'Trạm BTS',
                location: 'Hòa Vang',
               status: 'Hoạt động',
                  provider: 'Viettel',
                lastUpdate: '2023-09-15'
           },
           {
                id: '15',
                name: 'Thuê bao di động 097xxxx',
                 type: 'Thuê bao di động',
                location: 'Hải Châu',
                 status: 'Hoạt động',
                   provider: 'VinaPhone',
                lastUpdate: '2023-12-05'
            },
           {
                 id: '16',
                name: 'Wifi công cộng D',
                 type: 'Điểm wifi công cộng',
                 location: 'Thanh Khê',
                 status: 'Ngừng hoạt động',
                  provider: 'VNPT',
                 lastUpdate: '2023-08-10'
            },
            {
               id: '17',
                name: 'Cột ăng ten 5',
               type: 'Cột ăng ten',
                location: 'Sơn Trà',
                 status: 'Hoạt động',
                provider: 'VNPT',
                lastUpdate: '2023-10-30'
            },
            {
               id: '18',
                 name: 'Trạm BTS 5',
                type: 'Trạm BTS',
                location: 'Liên Chiểu',
                status: 'Hoạt động',
                provider: 'Viettel',
                lastUpdate: '2023-11-20'
            },
           {
                id: '19',
                name: 'Thuê bao di động 088xxxx',
                type: 'Thuê bao di động',
                location: 'Ngũ Hành Sơn',
                 status: 'Hoạt động',
                   provider: 'MobiFone',
                lastUpdate: '2023-07-25'
            },
            {
               id: '20',
               name: 'Wifi công cộng E',
                 type: 'Điểm wifi công cộng',
                 location: 'Cẩm Lệ',
                status: 'Hoạt động',
                provider: 'FPT',
                 lastUpdate: '2023-12-10'
            }
        ]
   }
};


// Helper functions
const getFilterValues = () => ({
    telecomType: document.getElementById('telecomType').value,
    year: document.getElementById('reportYear').value,
      district: document.getElementById('district').value
});

const filterDataByType = (data, type) => {
     if (type === TELECOM_TYPES.ALL) return data;

    return data.filter(item => {
        switch(type) {
            case TELECOM_TYPES.INFRASTRUCTURE: return item.name === 'Hạ tầng viễn thông';
            case TELECOM_TYPES.SUBSCRIBER: return item.name === 'Thuê bao di động';
            case TELECOM_TYPES.WIFI: return item.name === 'Điểm Wifi công cộng';
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
            <th>Ngừng hoạt động</th>
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
            <th>Nhà cung cấp</th>
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
                <td>${item.provider}</td>
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
const loadTelecomReport = () => {
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
         const filteredData = filterDataByType(yearData['1'].data, filters.telecomType);
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
          const detailTelecomType = document.getElementById('detailTelecomType').value;
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
        if (detailTelecomType !== 'Tất cả') {
             filteredData = filteredData.filter(item => item.type === detailTelecomType);
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
           // Get the absolute path to your file
           const filePath = '/assets/Report 2024/telecom/Số liệu phát triển tài nguyên Internet T8_2023.XLSXx';

           // Create a temporary link element
           const link = document.createElement('a');
           link.href = filePath;
           link.download = 'Số liệu phát triển tài nguyên Internet T8_2023.xlsx'; // Specify the file name for the download

           // Append the link to the document body
           document.body.appendChild(link);

           // Programmatically click the link to start the download
           link.click();

           // Remove the link from the document body
           document.body.removeChild(link);
           showSuccessMessage('Xuất báo cáo thành công');

       } catch (error) {
           console.error('Error exporting to Excel:', error);
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
     loadTelecomReport();
    // Add event listeners for detail report filters
    document.getElementById('detailTelecomType').addEventListener('change', loadDetailReport);
    document.getElementById('status').addEventListener('change', loadDetailReport);
    document.getElementById('timeRange').addEventListener('change', loadDetailReport);
});

// Export functions to global scope
window.loadTelecomReport = loadTelecomReport;
window.printReport = exportFunctions.print;
window.exportToPDF = exportFunctions.toPDF;
window.exportToExcel = exportFunctions.toExcel;