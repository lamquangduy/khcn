// Mock data
const reportData = {
    '2024': {
        title: 'Báo cáo chi cho KH&CN năm 2024',
         data: [
            { row: 'Tổng chi', total: 4500,  nganSach: { trungUong: 1200, diaPhuong: 1500 }, ngoaiNganSach: 1600, nuocNgoai: 200 },
             { row: 'Chi đầu tư phát triển KH&CN', total: 1200,  nganSach: { trungUong: 400, diaPhuong: 500 }, ngoaiNganSach: 280, nuocNgoai: 20 },
             { row: 'Chi sự nghiệp KH&CN', total: 3000, nganSach: { trungUong: 800, diaPhuong: 1000 }, ngoaiNganSach: 1100, nuocNgoai: 100,
                items:[
                     {row: 'Chi thực hiện nhiệm vụ thường xuyên theo chức năng', total: 800, nganSach: { trungUong: 200, diaPhuong: 300 }, ngoaiNganSach: 280, nuocNgoai: 20 },
                    {row: 'Chi thực hiện nhiệm vụ KH&CN ', total: 1800, nganSach: { trungUong: 500, diaPhuong: 600 }, ngoaiNganSach: 600, nuocNgoai: 100,
                        items:[
                            {row: '- Cấp quốc gia', total: 400, nganSach: { trungUong: 200, diaPhuong: 0 }, ngoaiNganSach: 150, nuocNgoai: 50 },
                           {row: '- Cấp bộ', total: 300, nganSach: { trungUong: 100, diaPhuong: 0 }, ngoaiNganSach: 150, nuocNgoai: 50 },
                            {row: '- Cấp tỉnh', total: 700, nganSach: { trungUong: 200, diaPhuong: 400 }, ngoaiNganSach: 100, nuocNgoai: 0 },
                             {row: '- Cấp cơ sở', total: 400, nganSach: { trungUong: 0, diaPhuong: 200 }, ngoaiNganSach: 200, nuocNgoai: 0 }
                        ]
                   },
                   {row: 'Chi sự nghiệp KH&CN khác', total: 400, nganSach: { trungUong: 100, diaPhuong: 100 }, ngoaiNganSach: 220, nuocNgoai: 0 }
                 ]
             },
             { row: 'Chi khác cho KH&CN', total: 300, nganSach: { trungUong: 0, diaPhuong: 0 }, ngoaiNganSach: 220, nuocNgoai: 80 }
         ]
    },
      '2023': {
           title: 'Báo cáo chi cho KH&CN năm 2023',
           data: [
               { row: 'Tổng chi', total: 4000, nganSach: { trungUong: 1000, diaPhuong: 1400 }, ngoaiNganSach: 1400, nuocNgoai: 200 },
               { row: 'Chi đầu tư phát triển KH&CN', total: 1000, nganSach: { trungUong: 300, diaPhuong: 450 }, ngoaiNganSach: 230, nuocNgoai: 20 },
               { row: 'Chi sự nghiệp KH&CN', total: 2700, nganSach: { trungUong: 700, diaPhuong: 900 }, ngoaiNganSach: 1000, nuocNgoai: 100,
                   items:[
                       {row: 'Chi thực hiện nhiệm vụ thường xuyên theo chức năng', total: 700, nganSach: { trungUong: 180, diaPhuong: 280 }, ngoaiNganSach: 220, nuocNgoai: 20 },
                       {row: 'Chi thực hiện nhiệm vụ KH&CN ', total: 1600, nganSach: { trungUong: 450, diaPhuong: 500 }, ngoaiNganSach: 600, nuocNgoai: 50,
                           items:[
                               {row: '- Cấp quốc gia', total: 350, nganSach: { trungUong: 180, diaPhuong: 0 }, ngoaiNganSach: 120, nuocNgoai: 50 },
                              {row: '- Cấp bộ', total: 280, nganSach: { trungUong: 90, diaPhuong: 0 }, ngoaiNganSach: 140, nuocNgoai: 50 },
                               {row: '- Cấp tỉnh', total: 650, nganSach: { trungUong: 180, diaPhuong: 370 }, ngoaiNganSach: 100, nuocNgoai: 0 },
                                {row: '- Cấp cơ sở', total: 320, nganSach: { trungUong: 0, diaPhuong: 130 }, ngoaiNganSach: 140, nuocNgoai: 0 }
                           ]
                      },
                      {row: 'Chi sự nghiệp KH&CN khác', total: 400, nganSach: { trungUong: 100, diaPhuong: 100 }, ngoaiNganSach: 200, nuocNgoai: 0 }
                    ]
                },
                { row: 'Chi khác cho KH&CN', total: 300, nganSach: { trungUong: 0, diaPhuong: 0 }, ngoaiNganSach: 250, nuocNgoai: 50 }
            ]
       }
};

// Helper functions
const getFilterValues = () => ({
    year: document.getElementById('reportYear').value,
});

// UI Rendering functions
const renderSpendingTable = (data) => {
    const table = document.createElement('table');
    table.classList.add('table', 'table-bordered', 'spending-table');

    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th rowspan="2" style="vertical-align: middle;">Nội dung</th>
            <th rowspan="2" style="vertical-align: middle;">Tổng chi</th>
            <th colspan="2">Ngân sách nhà nước</th>
            <th rowspan="2" style="vertical-align: middle;">Nguồn trong nước ngoài ngân sách nhà nước</th>
             <th rowspan="2" style="vertical-align: middle;">Nguồn nước ngoài</th>
        </tr>
        <tr>
             <th>Trung ương</th>
            <th>Địa phương</th>
        </tr>
    `;

    const tbody = document.createElement('tbody');
    data.forEach(item => {
         if (item.items) {
              const groupRow = document.createElement('tr');
                 groupRow.innerHTML = `
                    <td>${item.row}</td>
                    <td>${item.total}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                     <td></td>
                 `;
                 tbody.appendChild(groupRow);

             item.items.forEach(subItem => {
               if(subItem.items) {
                     const subGroupRow = document.createElement('tr');
                     subGroupRow.innerHTML = `
                        <td style="padding-left: 30px;">${subItem.row}</td>
                           <td>${subItem.total}</td>
                             <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                         `;
                           tbody.appendChild(subGroupRow);
                    subItem.items.forEach(ssItem => {
                         const ssGroupRow = document.createElement('tr');
                              ssGroupRow.innerHTML = `
                               <td style="padding-left: 60px;">${ssItem.row}</td>
                                <td>${ssItem.total}</td>
                                <td>${ssItem.nganSach.trungUong || 0}</td>
                                 <td>${ssItem.nganSach.diaPhuong || 0}</td>
                                <td>${ssItem.ngoaiNganSach || 0}</td>
                                 <td>${ssItem.nuocNgoai || 0}</td>
                           `;
                                 tbody.appendChild(ssGroupRow);
                       });
               }else{
                     const subGroupRow = document.createElement('tr');
                     subGroupRow.innerHTML = `
                        <td style="padding-left: 30px;">${subItem.row}</td>
                           <td>${subItem.total}</td>
                           <td>${subItem.nganSach.trungUong || 0}</td>
                            <td>${subItem.nganSach.diaPhuong || 0}</td>
                            <td>${subItem.ngoaiNganSach || 0}</td>
                             <td>${subItem.nuocNgoai || 0}</td>
                        `;
                           tbody.appendChild(subGroupRow);
               }

           });
       } else {
            const dataRow = document.createElement('tr');
            dataRow.innerHTML = `
                <td>${item.row}</td>
                <td>${item.total}</td>
                <td>${item.nganSach.trungUong || 0}</td>
                <td>${item.nganSach.diaPhuong || 0}</td>
                <td>${item.ngoaiNganSach || 0}</td>
                 <td>${item.nuocNgoai || 0}</td>
            `;
            tbody.appendChild(dataRow);
        }
    });


    table.appendChild(thead);
    table.appendChild(tbody);
    return table;
};


// Main functions
const loadSpendingReport = () => {
    try {
        const filters = getFilterValues();
        const reportContent = document.getElementById('reportContent');
        reportContent.innerHTML = '';

        const yearData = reportData[filters.year];
        if (!yearData) throw new Error('Không tìm thấy dữ liệu cho năm được chọn');

        // Render summary report
         const reportSection = document.createElement('div');
        reportSection.classList.add('report-section');
        reportSection.innerHTML = `<h5>${yearData.title}</h5>`;
        reportSection.appendChild(renderSpendingTable(yearData.data));
        reportContent.appendChild(reportSection);


    } catch (error) {
        console.error('Error loading report:', error);
         showErrorMessage(error.message);
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
           const filters = getFilterValues();
           // Get the absolute path to your file
            const filePath = `/assets/Report 2024/03_KHCN_CP.xlsx`;
           // Create a temporary link element
           const link = document.createElement('a');
           link.href = filePath;
           link.download = 'Báo cáo chi cho KHCN'; // Specify the file name for the download

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
   // Add event listener for button Xem báo cáo
    const btnXemBaoCao = document.querySelector('.filter-section .btn.btn-primary');
   btnXemBaoCao.addEventListener('click', loadSpendingReport);
});


// Export functions to global scope
window.loadSpendingReport = loadSpendingReport;
window.printReport = exportFunctions.print;
window.exportToPDF = exportFunctions.toPDF;
window.exportToExcel = exportFunctions.toExcel;