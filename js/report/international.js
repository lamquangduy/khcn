// Mock data
const reportData = {
    '2024': {
         title: 'Báo cáo hợp tác quốc tế về KH&CN năm 2024',
        data: [
            { row: 'Số nhiệm vụ hợp tác quốc tế về KH&CN', total: 25, kinhPhi: 150, unit: 'Nhiệm vụ',
                items: [
                    { row: '- Khoa học tự nhiên', total: 5, kinhPhi: 30, unit: 'Nhiệm vụ' },
                    { row: '- Khoa học kỹ thuật và công nghệ', total: 8, kinhPhi: 50, unit: 'Nhiệm vụ' },
                    { row: '- Khoa học y, dược', total: 6, kinhPhi: 30, unit: 'Nhiệm vụ' },
                     { row: '- Khoa học nông nghiệp', total: 3, kinhPhi: 15, unit: 'Nhiệm vụ' },
                     { row: '- Khoa học xã hội', total: 2, kinhPhi: 15, unit: 'Nhiệm vụ' },
                    { row: '- Khoa học nhân văn', total: 1, kinhPhi: 10, unit: 'Nhiệm vụ' }
                ],
              subItems: [
                  { row: 'Chia theo hình thức hợp tác', items: [
                       { row: '- Đa phương', total: 10, kinhPhi: 70, unit: 'Nhiệm vụ' },
                       { row: '- Song phương', total: 15, kinhPhi: 80, unit: 'Nhiệm vụ' }
                    ]},
                   { row: 'Chia theo đối tác quốc tế', items: [
                       { row: '- Nước/tổ chức ...', total: 12, kinhPhi: 80, unit: 'Nhiệm vụ' },
                        { row: '- Nước/tổ chức ...', total: 13, kinhPhi: 70, unit: 'Nhiệm vụ' }
                     ]},
                    { row: 'Chia theo nguồn cấp kinh phí', items: [
                       { row: '- Trong nước', kinhPhi: 100, unit: 'Triệu đồng' },
                       { row: '- Nước ngoài', kinhPhi: 50, unit: 'Triệu đồng' }
                   ]},
                  {row: 'Chia theo cấp quản lý', items:[
                        {row: '- Cấp quốc gia', total: 10, kinhPhi: 80, unit: 'Nhiệm vụ'},
                        {row: '- Cấp bộ', total: 5, kinhPhi: 30, unit: 'Nhiệm vụ'},
                        {row: '- Cấp tỉnh', total: 7, kinhPhi: 30, unit: 'Nhiệm vụ'},
                        {row: '- Cấp cơ sở', total: 3, kinhPhi: 10, unit: 'Nhiệm vụ'}
                  ]}
              ]
         },
          { row: 'Số điều ước, thỏa thuận quốc tế về KH&CN được ký kết', total: 10, unit: 'Điều ước/thỏa thuận',
               items: [
                     { row: '- Khoa học tự nhiên', total: 2, unit: 'Điều ước/thỏa thuận' },
                     { row: '- Khoa học kỹ thuật và công nghệ', total: 3, unit: 'Điều ước/thỏa thuận' },
                     { row: '- Khoa học y, dược', total: 2, unit: 'Điều ước/thỏa thuận' },
                     { row: '- Khoa học nông nghiệp', total: 1, unit: 'Điều ước/thỏa thuận' },
                    { row: '- Khoa học xã hội', total: 1, unit: 'Điều ước/thỏa thuận' },
                    { row: '- Khoa học nhân văn', total: 1, unit: 'Điều ước/thỏa thuận' }
              ],
              subItems: [
                  {row: 'Chia theo đối tác quốc tế', items: [
                      {row: '- Nước/tổ chức ...', total: 5, unit: 'Điều ước/thỏa thuận'},
                      {row: '- Nước/tổ chức ...', total: 5, unit: 'Điều ước/thỏa thuận'}
                  ]}
              ]
         },
          { row: 'Số đoàn ra về KH&CN', total: 12, unit: 'Đoàn',
               subItems: [
                     { row: 'Chia theo nước đến nghiên cứu', items: [
                            { row: '- …', total: 8, unit: 'Đoàn' },
                           { row: '- …', total: 4, unit: 'Đoàn' }
                        ]
                    },
                      { row: 'Chia theo nguồn cấp kinh phí thực hiện', items: [
                            { row: '- Trong nước', kinhPhi: 60, unit: 'Triệu đồng' },
                            { row: '- Nước ngoài', kinhPhi: 40, unit: 'Triệu đồng' }
                       ]}
                ]
         },
        { row: 'Số đoàn vào về KH&CN', total: 15, unit: 'Đoàn',
              subItems: [
                   { row: 'Chia theo nước cử đến nghiên cứu', items: [
                           { row: '- …', total: 9, unit: 'Đoàn' },
                            { row: '- …', total: 6, unit: 'Đoàn' }
                     ]
                   },
                   { row: 'Chia theo nguồn cấp kinh phí thực hiện', items: [
                         { row: '- Trong nước', kinhPhi: 50, unit: 'Triệu đồng' },
                         { row: '- Nước ngoài', kinhPhi: 70, unit: 'Triệu đồng' }
                   ]}
               ]
        }
        ]
    },
    '2023': {
        title: 'Báo cáo hợp tác quốc tế về KH&CN năm 2023',
        data: [
            { row: 'Số nhiệm vụ hợp tác quốc tế về KH&CN', total: 20, kinhPhi: 120, unit: 'Nhiệm vụ',
                items: [
                    { row: '- Khoa học tự nhiên', total: 4, kinhPhi: 25, unit: 'Nhiệm vụ' },
                    { row: '- Khoa học kỹ thuật và công nghệ', total: 7, kinhPhi: 40, unit: 'Nhiệm vụ' },
                    { row: '- Khoa học y, dược', total: 5, kinhPhi: 25, unit: 'Nhiệm vụ' },
                     { row: '- Khoa học nông nghiệp', total: 2, kinhPhi: 10, unit: 'Nhiệm vụ' },
                     { row: '- Khoa học xã hội', total: 1, kinhPhi: 10, unit: 'Nhiệm vụ' },
                    { row: '- Khoa học nhân văn', total: 1, kinhPhi: 10, unit: 'Nhiệm vụ' }
                ],
               subItems: [
                  { row: 'Chia theo hình thức hợp tác', items: [
                       { row: '- Đa phương', total: 8, kinhPhi: 60, unit: 'Nhiệm vụ' },
                       { row: '- Song phương', total: 12, kinhPhi: 60, unit: 'Nhiệm vụ' }
                   ]},
                   { row: 'Chia theo đối tác quốc tế', items: [
                       { row: '- Nước/tổ chức ...', total: 10, kinhPhi: 70, unit: 'Nhiệm vụ' },
                        { row: '- Nước/tổ chức ...', total: 10, kinhPhi: 50, unit: 'Nhiệm vụ' }
                    ]},
                   { row: 'Chia theo nguồn cấp kinh phí', items: [
                       { row: '- Trong nước', kinhPhi: 80, unit: 'Triệu đồng' },
                       { row: '- Nước ngoài', kinhPhi: 40, unit: 'Triệu đồng' }
                   ]},
                  {row: 'Chia theo cấp quản lý', items:[
                        {row: '- Cấp quốc gia', total: 8, kinhPhi: 60, unit: 'Nhiệm vụ'},
                        {row: '- Cấp bộ', total: 4, kinhPhi: 25, unit: 'Nhiệm vụ'},
                        {row: '- Cấp tỉnh', total: 6, kinhPhi: 25, unit: 'Nhiệm vụ'},
                        {row: '- Cấp cơ sở', total: 2, kinhPhi: 10, unit: 'Nhiệm vụ'}
                    ]}
               ]
         },
          { row: 'Số điều ước, thỏa thuận quốc tế về KH&CN được ký kết', total: 8, unit: 'Điều ước/thỏa thuận',
               items: [
                     { row: '- Khoa học tự nhiên', total: 1, unit: 'Điều ước/thỏa thuận' },
                     { row: '- Khoa học kỹ thuật và công nghệ', total: 2, unit: 'Điều ước/thỏa thuận' },
                     { row: '- Khoa học y, dược', total: 2, unit: 'Điều ước/thỏa thuận' },
                     { row: '- Khoa học nông nghiệp', total: 1, unit: 'Điều ước/thỏa thuận' },
                    { row: '- Khoa học xã hội', total: 1, unit: 'Điều ước/thỏa thuận' },
                    { row: '- Khoa học nhân văn', total: 1, unit: 'Điều ước/thỏa thuận' }
              ],
               subItems: [
                   {row: 'Chia theo đối tác quốc tế', items: [
                         {row: '- Nước/tổ chức ...', total: 4, unit: 'Điều ước/thỏa thuận'},
                         {row: '- Nước/tổ chức ...', total: 4, unit: 'Điều ước/thỏa thuận'}
                   ]}
               ]
        },
          { row: 'Số đoàn ra về KH&CN', total: 10, unit: 'Đoàn',
               subItems: [
                    { row: 'Chia theo nước đến nghiên cứu', items: [
                          { row: '- …', total: 6, unit: 'Đoàn' },
                         { row: '- …', total: 4, unit: 'Đoàn' }
                    ]
                  },
                   { row: 'Chia theo nguồn cấp kinh phí thực hiện', items: [
                         { row: '- Trong nước', kinhPhi: 50, unit: 'Triệu đồng' },
                         { row: '- Nước ngoài', kinhPhi: 30, unit: 'Triệu đồng' }
                    ]}
               ]
          },
         { row: 'Số đoàn vào về KH&CN', total: 12, unit: 'Đoàn',
               subItems: [
                     { row: 'Chia theo nước cử đến nghiên cứu', items: [
                            { row: '- …', total: 7, unit: 'Đoàn' },
                            { row: '- …', total: 5, unit: 'Đoàn' }
                     ]
                   },
                   { row: 'Chia theo nguồn cấp kinh phí thực hiện', items: [
                         { row: '- Trong nước', kinhPhi: 40, unit: 'Triệu đồng' },
                         { row: '- Nước ngoài', kinhPhi: 60, unit: 'Triệu đồng' }
                    ]}
               ]
         }
         ]
    }
};


// Helper functions
const getFilterValues = () => ({
    year: document.getElementById('reportYear').value,
});


// UI Rendering functions
const renderInternationalTable = (data) => {
    const table = document.createElement('table');
    table.classList.add('table', 'table-bordered', 'international-table');

    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th>Nội dung</th>
            <th>Tổng số</th>
            <th>Đơn vị</th>
             <th>Tổng kinh phí (triệu đồng)</th>
        </tr>
    `;

    const tbody = document.createElement('tbody');
    data.forEach(item => {
        if (item.items) {
             const groupRow = document.createElement('tr');
            groupRow.innerHTML = `
                <td>${item.row}</td>
                <td>${item.total}</td>
                 <td>${item.unit}</td>
                 <td>${item.kinhPhi || ''}</td>
            `;
            tbody.appendChild(groupRow);
            item.items.forEach(subItem => {
                  if(subItem.items){
                        const subGroupRow = document.createElement('tr');
                         subGroupRow.innerHTML = `
                                 <td style="padding-left: 30px;">${subItem.row}</td>
                                  <td>${subItem.total}</td>
                                   <td>${subItem.unit}</td>
                                   <td>${subItem.kinhPhi || ''}</td>
                           `;
                              tbody.appendChild(subGroupRow);
                           subItem.items.forEach(ssItem => {
                                const ssGroupRow = document.createElement('tr');
                                  ssGroupRow.innerHTML = `
                                     <td style="padding-left: 60px;">${ssItem.row}</td>
                                      <td>${ssItem.total || ''}</td>
                                      <td>${ssItem.unit}</td>
                                       <td>${ssItem.kinhPhi || ''}</td>
                                   `;
                                     tbody.appendChild(ssGroupRow);
                            });
                  } else{
                    const subGroupRow = document.createElement('tr');
                    subGroupRow.innerHTML = `
                       <td style="padding-left: 30px;">${subItem.row}</td>
                         <td>${subItem.total || ''}</td>
                          <td>${subItem.unit}</td>
                           <td>${subItem.kinhPhi || ''}</td>
                       `;
                       tbody.appendChild(subGroupRow);
                  }

            });

        } else if (item.subItems) {
             const groupRow = document.createElement('tr');
              groupRow.innerHTML = `
                 <td>${item.row}</td>
                   <td>${item.total}</td>
                    <td>${item.unit}</td>
                    <td>${item.kinhPhi || ''}</td>
              `;
             tbody.appendChild(groupRow);
            item.subItems.forEach(subItem => {
                  if(subItem.items){
                          const subGroupRow = document.createElement('tr');
                           subGroupRow.innerHTML = `
                                 <td style="padding-left: 30px;">${subItem.row}</td>
                                  <td>${subItem.total || ''}</td>
                                  <td>${subItem.unit}</td>
                                   <td>${subItem.kinhPhi || ''}</td>
                            `;
                           tbody.appendChild(subGroupRow);
                            subItem.items.forEach(ssItem => {
                                const ssGroupRow = document.createElement('tr');
                                  ssGroupRow.innerHTML = `
                                      <td style="padding-left: 60px;">${ssItem.row}</td>
                                        <td>${ssItem.total || ''}</td>
                                        <td>${ssItem.unit}</td>
                                       <td>${ssItem.kinhPhi || ''}</td>
                                 `;
                                    tbody.appendChild(ssGroupRow);
                             });
                   } else {
                       const subGroupRow = document.createElement('tr');
                        subGroupRow.innerHTML = `
                           <td style="padding-left: 30px;">${subItem.row}</td>
                             <td>${subItem.total || ''}</td>
                              <td>${subItem.unit}</td>
                               <td>${subItem.kinhPhi || ''}</td>
                           `;
                         tbody.appendChild(subGroupRow);
                   }

           });

       }else {
           const dataRow = document.createElement('tr');
           dataRow.innerHTML = `
               <td>${item.row}</td>
                <td>${item.total || ''}</td>
                 <td>${item.unit || ''}</td>
                <td>${item.kinhPhi || ''}</td>
           `;
           tbody.appendChild(dataRow);
        }
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    return table;
};


// Main functions
const loadInternationalReport = () => {
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
       reportSection.appendChild(renderInternationalTable(yearData.data));
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
            const filePath = `/assets/Report 2024/05_KHCN_HTQT.xlsx`;
           // Create a temporary link element
           const link = document.createElement('a');
           link.href = filePath;
           link.download = 'Báo cáo Hợp tác quốc tế về KHCN'; // Specify the file name for the download

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
    btnXemBaoCao.addEventListener('click', loadInternationalReport);
});


// Export functions to global scope
window.loadInternationalReport = loadInternationalReport;
window.printReport = exportFunctions.print;
window.exportToPDF = exportFunctions.toPDF;
window.exportToExcel = exportFunctions.toExcel;