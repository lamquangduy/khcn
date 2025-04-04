// Constants
const POSTAL_TYPES = {
    ALL: 'all',
    ENTERPRISE: 'enterprise',
    OFFICE: 'office',
    SERVICE: 'service'
};

const TABLE_CLASSES = ['table', 'table-bordered', 'postal-table'];

// Mock data (Có thể tách thành file riêng data/mock-data.js)
const reportData = {
     '2024': {
        '1': {
            title: 'Báo cáo tổng hợp bưu chính năm 2024',
            data: [
                { name: 'Doanh nghiệp bưu chính', unit: 'doanh nghiệp', total: 20, active: 18, inactive: 2 },
                { name: 'Bưu cục, điểm phục vụ', unit: 'điểm', total: 150, active: 140, inactive: 10 },
                { name: 'Dịch vụ bưu chính', unit: 'dịch vụ', total: 100, active: 95, inactive: 5 }
            ]
        },
        '2': {
            title: 'Báo cáo tình hình hoạt động bưu chính năm 2024',
             data: [
                { name: 'Doanh nghiệp hoạt động', unit: '%', value: 90 },
                { name: 'Doanh nghiệp tạm dừng', unit: '%', value: 10 },
            ]
        }
    },
    '2023': {
        '1': {
            title: 'Báo cáo tổng hợp bưu chính năm 2023',
            data: [
                { name: 'Doanh nghiệp bưu chính', unit: 'doanh nghiệp', total: 18, active: 16, inactive: 2 },
                { name: 'Bưu cục, điểm phục vụ', unit: 'điểm', total: 140, active: 130, inactive: 10 },
                { name: 'Dịch vụ bưu chính', unit: 'dịch vụ', total: 90, active: 85, inactive: 5 }
            ]
        },
        '2': {
             title: 'Báo cáo tình hình hoạt động bưu chính năm 2023',
             data: [
                { name: 'Doanh nghiệp hoạt động', unit: '%', value: 88 },
                { name: 'Doanh nghiệp tạm dừng', unit: '%', value: 12 },
            ]
        }
    }
};

const detailReportData = {
  '2024': {
        items: [
          {
            id: '1',
            name: 'Bưu cục Hòa Cường',
            type: 'Bưu cục',
            location: 'Hải Châu',
            status: 'Hoạt động',
            service: 'Chuyển phát nhanh, bưu phẩm',
             lastUpdate: '2023-12-15',
            notes: 'Hoạt động tốt'
          },
          {
             id: '2',
            name: 'Doanh nghiệp ABC',
            type: 'Doanh nghiệp',
            location: 'Thanh Khê',
            status: 'Hoạt động',
            service: 'Chuyển phát nhanh',
            lastUpdate: '2023-10-20',
            notes: 'Đang mở rộng mạng lưới'
          },
            {
                id: '3',
                name: 'Dịch vụ vận chuyển 123',
                type: 'Dịch vụ',
                location: 'Sơn Trà',
                status: 'Tạm dừng',
                service: 'Vận chuyển hàng hóa',
                lastUpdate: '2023-08-15',
                 notes: 'Tạm dừng do dịch bệnh'
            },
           {
             id: '4',
            name: 'Bưu cục An Hải Bắc',
            type: 'Bưu cục',
             location: 'Sơn Trà',
             status: 'Hoạt động',
            service: 'Phát hàng, thu hộ',
             lastUpdate: '2023-11-10',
            notes: 'Hoạt động bình thường'
           },
            {
                id: '5',
                name: 'Doanh nghiệp XYZ',
                type: 'Doanh nghiệp',
                location: 'Ngũ Hành Sơn',
                status: 'Hoạt động',
               service: 'Chuyển phát nhanh quốc tế',
               lastUpdate: '2023-09-25',
                notes: 'Hoạt động tốt'
            },
            {
               id: '6',
               name: 'Dịch vụ bưu chính 456',
               type: 'Dịch vụ',
               location: 'Liên Chiểu',
               status: 'Hoạt động',
               service: 'Bưu kiện, bưu phẩm',
                lastUpdate: '2023-07-30',
                notes: 'Mặt hàng đa dạng'
           },
           {
             id: '7',
             name: 'Bưu cục Cẩm Lệ',
              type: 'Bưu cục',
              location: 'Cẩm Lệ',
             status: 'Tạm dừng',
              service: 'Chuyển phát tiết kiệm',
             lastUpdate: '2023-11-30',
                notes: 'Tạm dừng sửa chữa'
           },
            {
                id: '8',
               name: 'Doanh nghiệp Viettel Post',
               type: 'Doanh nghiệp',
              location: 'Hòa Vang',
              status: 'Hoạt động',
               service: 'Giao hàng thương mại điện tử',
                lastUpdate: '2023-06-15',
               notes: 'Đang mở rộng chi nhánh'
            },
           {
                id: '9',
                name: 'Bưu cục Thanh Khê',
                type: 'Bưu cục',
               location: 'Thanh Khê',
              status: 'Hoạt động',
              service: 'Chuyển phát trong nước',
              lastUpdate: '2023-12-01',
               notes: 'Hoạt động tốt'
            },
            {
              id: '10',
             name: 'Dịch vụ 789',
             type: 'Dịch vụ',
              location: 'Hải Châu',
             status: 'Hoạt động',
             service: 'Bưu chính liên tỉnh',
               lastUpdate: '2023-08-20',
                notes: 'Cần nâng cấp hệ thống'
            },
           {
               id: '11',
               name: 'Bưu cục Hải Châu',
                type: 'Bưu cục',
                location: 'Hải Châu',
                status: 'Hoạt động',
              service: 'Chuyển tiền, chuyển phát',
                lastUpdate: '2023-10-10',
               notes: 'Hoạt động bình thường'
            },
            {
                id: '12',
                name: 'Doanh nghiệp GHTK',
                type: 'Doanh nghiệp',
                location: 'Liên Chiểu',
               status: 'Hoạt động',
              service: 'Giao hàng thương mại điện tử',
              lastUpdate: '2023-11-15',
                notes: 'Hoạt động tốt'
            },
           {
                id: '13',
                name: 'Dịch vụ EMS',
                type: 'Dịch vụ',
                location: 'Cẩm Lệ',
                status: 'Tạm dừng',
                service: 'Chuyển phát nhanh quốc tế',
                lastUpdate: '2023-07-20',
                notes: 'Tạm dừng điều chỉnh dịch vụ'
           },
            {
               id: '14',
                name: 'Bưu cục Liên Chiểu',
               type: 'Bưu cục',
                location: 'Liên Chiểu',
                status: 'Hoạt động',
               service: 'Chuyển phát, bưu phẩm',
              lastUpdate: '2023-09-15',
               notes: 'Đang nâng cấp cơ sở hạ tầng'
           },
           {
              id: '15',
             name: 'Doanh nghiệp Best Inc',
                type: 'Doanh nghiệp',
                location: 'Sơn Trà',
               status: 'Hoạt động',
              service: 'Vận chuyển hàng hóa',
              lastUpdate: '2023-12-05',
               notes: 'Hoạt động tốt'
           },
            {
               id: '16',
                name: 'Dịch vụ GHN',
               type: 'Dịch vụ',
                location: 'Hòa Vang',
               status: 'Hoạt động',
               service: 'Giao hàng nhanh',
               lastUpdate: '2023-08-10',
                notes: 'Cần cải thiện dịch vụ'
           },
           {
               id: '17',
               name: 'Bưu cục Ngũ Hành Sơn',
                type: 'Bưu cục',
               location: 'Ngũ Hành Sơn',
              status: 'Hoạt động',
                service: 'Chuyển phát nhanh, thu hộ',
                lastUpdate: '2023-10-30',
                notes: 'Hoạt động bình thường'
            },
            {
              id: '18',
             name: 'Doanh nghiệp J&T',
              type: 'Doanh nghiệp',
             location: 'Thanh Khê',
               status: 'Hoạt động',
              service: 'Giao hàng thương mại điện tử',
              lastUpdate: '2023-11-20',
                notes: 'Hoạt động tốt'
            },
            {
              id: '19',
                name: 'Dịch vụ Kerry Express',
                type: 'Dịch vụ',
              location: 'Hải Châu',
                status: 'Tạm dừng',
                service: 'Chuyển phát nhanh quốc tế',
                lastUpdate: '2023-07-25',
                notes: 'Tạm dừng do vấn đề pháp lý'
           },
           {
              id: '20',
             name: 'Bưu cục Hòa Vang',
             type: 'Bưu cục',
               location: 'Hòa Vang',
               status: 'Hoạt động',
                service: 'Phát hàng, chuyển phát',
              lastUpdate: '2023-12-10',
               notes: 'Hoạt động bình thường'
           }
        ]
    }
};


// Helper functions
const getFilterValues = () => ({
    postalType: document.getElementById('postalType').value,
    year: document.getElementById('reportYear').value,
    district: document.getElementById('district').value
});

const filterDataByType = (data, type) => {
     if (type === POSTAL_TYPES.ALL) return data;

    return data.filter(item => {
        switch(type) {
            case POSTAL_TYPES.ENTERPRISE: return item.name === 'Doanh nghiệp bưu chính';
            case POSTAL_TYPES.OFFICE: return item.name === 'Bưu cục, điểm phục vụ';
            case POSTAL_TYPES.SERVICE: return item.name === 'Dịch vụ bưu chính';
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
            <th>Dịch vụ</th>
            <th>Cập nhật gần nhất</th>
            <th>Ghi chú</th>
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
                <td>${item.service}</td>
                <td>${item.lastUpdate}</td>
                <td>${item.notes}</td>
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
const loadPostalReport = () => {
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
        const filteredData = filterDataByType(yearData['1'].data, filters.postalType);
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
        const detailPostalType = document.getElementById('detailPostalType').value;
        const timeRange = document.getElementById('timeRange').value;

        const reportContainer = document.querySelector('#detail .report-content');

        // Giữ lại phần export tools
        const exportTools = reportContainer.querySelector('.export-tools');
        reportContainer.innerHTML = '';
        reportContainer.appendChild(exportTools);

        // Lọc dữ liệu theo các điều kiện
        let filteredData = detailReportData['2024'].items;
         // Lọc theo loại báo cáo
        if (detailPostalType === 'cap-giay-phep') {
            // Logic for "Tình hình cấp phép"
               filteredData = filteredData.filter(item => item.type === 'Doanh nghiệp' || item.type === 'Bưu cục');
        } else if (detailPostalType === 'ds-da-cap-phep') {
            // Logic for "Danh sách đã cấp phép"
                filteredData = filteredData.filter(item => item.status === 'Hoạt động');
        } else if (detailPostalType === 'ds-tra-giay-phep') {
           // Logic for "Danh sách trả giấy phép"
             filteredData = filteredData.filter(item => item.status === 'Tạm dừng');
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
           const filePath = '/assets/Report 2024/postal/postal_report_1.xlsx';

           // Create a temporary link element
           const link = document.createElement('a');
           link.href = filePath;
           link.download = 'postal_report_1.xlsx'; // Specify the file name for the download

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

// Helper functions for showing messages
const showSuccessMessage = (message) => {
    alert(message);
};

const showErrorMessage = (message) => {
    alert(message);
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
    loadPostalReport();
    // Add event listeners for detail report filters
     document.getElementById('detailPostalType').addEventListener('change', loadDetailReport);
    document.getElementById('timeRange').addEventListener('change', loadDetailReport);
});

// Export functions to global scope
window.loadPostalReport = loadPostalReport;
window.printReport = exportFunctions.print;
window.exportToPDF = exportFunctions.toPDF;
window.exportToExcel = exportFunctions.toExcel;