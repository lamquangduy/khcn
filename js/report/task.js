// Mock data
const reportData = {
    '2024': {
        title: 'Báo cáo nhiệm vụ KH&CN năm 2024',
         data: [
              { row: 'Tổng số nhiệm vụ KH&CN', total: 180, nu: 60, dangThucHien: { moi: 80, chuyenTiep: 40 }, daNghiemThu: 50, daUngDung: 30,
                items: [
                    { row: '- Số đề tài/đề án KH&CN', total: 120, nu: 40, dangThucHien: { moi: 60, chuyenTiep: 30 }, daNghiemThu: 30, daUngDung: 20 },
                    { row: '- Số dự án KH&CN', total: 60, nu: 20, dangThucHien: { moi: 20, chuyenTiep: 10 }, daNghiemThu: 20, daUngDung: 10 },
                 ]
             },
               {row: 'Chia theo cấp quản lý', total: 180,  items: [
                     { row: '- Cấp quốc gia', total: 30, nu: 10, dangThucHien: { moi: 10, chuyenTiep: 5 }, daNghiemThu: 10, daUngDung: 5 },
                      { row: '- Cấp bộ', total: 20, nu: 5, dangThucHien: { moi: 10, chuyenTiep: 0 }, daNghiemThu: 5, daUngDung: 5 },
                      { row: '- Cấp tỉnh', total: 80, nu: 30, dangThucHien: { moi: 40, chuyenTiep: 20 }, daNghiemThu: 20, daUngDung: 10 },
                      { row: '- Cấp cơ sở', total: 50, nu: 15, dangThucHien: { moi: 20, chuyenTiep: 15 }, daNghiemThu: 15, daUngDung: 10 },
                   ]
             },
             { row: 'Chia theo lĩnh vực nghiên cứu', total: 180, items: [
                  { row: '- Khoa học tự nhiên', total: 30, nu: 10, dangThucHien: { moi: 15, chuyenTiep: 5 }, daNghiemThu: 10, daUngDung: 5 },
                   { row: '- Khoa học kỹ thuật và công nghệ', total: 60, nu: 20, dangThucHien: { moi: 30, chuyenTiep: 10 }, daNghiemThu: 20, daUngDung: 10 },
                   { row: '- Khoa học y, dược', total: 40, nu: 15, dangThucHien: { moi: 20, chuyenTiep: 10 }, daNghiemThu: 10, daUngDung: 10 },
                   { row: '- Khoa học nông nghiệp', total: 20, nu: 5, dangThucHien: { moi: 10, chuyenTiep: 5 }, daNghiemThu: 5, daUngDung: 5 },
                  { row: '- Khoa học xã hội', total: 20, nu: 5, dangThucHien: { moi: 5, chuyenTiep: 5 }, daNghiemThu: 5, daUngDung: 0 },
                   { row: '- Khoa học nhân văn', total: 10, nu: 5, dangThucHien: { moi: 0, chuyenTiep: 5 }, daNghiemThu: 0, daUngDung: 0 }
             ]
           },
          { row: 'Chia theo mục tiêu kinh tế-xã hội', total: 180, items: [
                  { row: '- Thăm dò, nghiên cứu và khai thác trái đất, khí quyển', total: 10, nu: 2, dangThucHien: { moi: 5, chuyenTiep: 0 }, daNghiemThu: 5, daUngDung: 0 },
                  { row: '- Phát triển cơ sở hạ tầng và quy hoạch sử dụng đất', total: 20, nu: 5, dangThucHien: { moi: 10, chuyenTiep: 5 }, daNghiemThu: 5, daUngDung: 5 },
                   { row: '- Phát triển sản xuất và công nghệ nông nghiệp', total: 25, nu: 10, dangThucHien: { moi: 10, chuyenTiep: 5 }, daNghiemThu: 10, daUngDung: 5 },
                    { row: '- Phát triển sản xuất và công nghệ công nghiệp', total: 35, nu: 10, dangThucHien: { moi: 15, chuyenTiep: 10 }, daNghiemThu: 10, daUngDung: 5 },
                   { row: '- Phát triển, phân phối và sử dụng hợp lý năng lượng', total: 20, nu: 5, dangThucHien: { moi: 5, chuyenTiep: 5 }, daNghiemThu: 5, daUngDung: 5 },
                    { row: '- Phát triển y tế và bảo vệ sức khoẻ con người', total: 20, nu: 10, dangThucHien: { moi: 10, chuyenTiep: 0 }, daNghiemThu: 5, daUngDung: 5 },
                   { row: '- Phát triển giáo dục và đào tạo', total: 10, nu: 3, dangThucHien: { moi: 5, chuyenTiep: 0 }, daNghiemThu: 5, daUngDung: 0 },
                   { row: '- Phát triển và bảo vệ môi trường', total: 10, nu: 2, dangThucHien: { moi: 5, chuyenTiep: 5 }, daNghiemThu: 0, daUngDung: 0 },
                    { row: '- Phát triển xã hội và dịch vụ', total: 15, nu: 3, dangThucHien: { moi: 5, chuyenTiep: 5 }, daNghiemThu: 5, daUngDung: 0 },
                    { row: '- Thăm dò, nghiên cứu và khai thác vũ trụ', total: 0, dangThucHien: { moi: 0, chuyenTiep: 0 }, daNghiemThu: 0, daUngDung: 0 },
                    { row: '- Nghiên cứu do các trường đại học cấp kinh phí', total: 5, dangThucHien: { moi: 0, chuyenTiep: 5 }, daNghiemThu: 0, daUngDung: 0 },
                     { row: '- Nghiên cứu không định hướng ứng dụng', total: 0, dangThucHien: { moi: 0, chuyenTiep: 0 }, daNghiemThu: 0, daUngDung: 0 },
                     { row: '- Nghiên cứu dân sự khác', total: 10, dangThucHien: { moi: 5, chuyenTiep: 0 }, daNghiemThu: 5, daUngDung: 0 },
                      { row: '- Bảo đảm an ninh, quốc phòng', total: 0, dangThucHien: { moi: 0, chuyenTiep: 0 }, daNghiemThu: 0, daUngDung: 0 }
               ]
          }
       ]
    },
    '2023': {
          title: 'Báo cáo nhiệm vụ KH&CN năm 2023',
          data: [
                { row: 'Tổng số nhiệm vụ KH&CN', total: 160, nu: 50, dangThucHien: { moi: 70, chuyenTiep: 30 }, daNghiemThu: 40, daUngDung: 20,
                   items: [
                       { row: '- Số đề tài/đề án KH&CN', total: 100, nu: 30, dangThucHien: { moi: 50, chuyenTiep: 20 }, daNghiemThu: 25, daUngDung: 10 },
                       { row: '- Số dự án KH&CN', total: 60, nu: 20, dangThucHien: { moi: 20, chuyenTiep: 10 }, daNghiemThu: 15, daUngDung: 10 },
                    ]
              },
                {row: 'Chia theo cấp quản lý', total: 160,  items: [
                      { row: '- Cấp quốc gia', total: 20, nu: 8, dangThucHien: { moi: 8, chuyenTiep: 2 }, daNghiemThu: 5, daUngDung: 5 },
                       { row: '- Cấp bộ', total: 15, nu: 4, dangThucHien: { moi: 7, chuyenTiep: 0 }, daNghiemThu: 3, daUngDung: 5 },
                       { row: '- Cấp tỉnh', total: 70, nu: 25, dangThucHien: { moi: 30, chuyenTiep: 15 }, daNghiemThu: 15, daUngDung: 10 },
                       { row: '- Cấp cơ sở', total: 55, nu: 13, dangThucHien: { moi: 25, chuyenTiep: 13 }, daNghiemThu: 17, daUngDung: 0 },
                    ]
              },
              { row: 'Chia theo lĩnh vực nghiên cứu', total: 160, items: [
                   { row: '- Khoa học tự nhiên', total: 30, nu: 10, dangThucHien: { moi: 12, chuyenTiep: 3 }, daNghiemThu: 8, daUngDung: 7 },
                    { row: '- Khoa học kỹ thuật và công nghệ', total: 50, nu: 15, dangThucHien: { moi: 20, chuyenTiep: 10 }, daNghiemThu: 15, daUngDung: 5 },
                    { row: '- Khoa học y, dược', total: 30, nu: 10, dangThucHien: { moi: 15, chuyenTiep: 5 }, daNghiemThu: 8, daUngDung: 2 },
                     { row: '- Khoa học nông nghiệp', total: 20, nu: 7, dangThucHien: { moi: 10, chuyenTiep: 3 }, daNghiemThu: 5, daUngDung: 5 },
                   { row: '- Khoa học xã hội', total: 15, nu: 3, dangThucHien: { moi: 8, chuyenTiep: 2 }, daNghiemThu: 2, daUngDung: 3 },
                    { row: '- Khoa học nhân văn', total: 15, nu: 5, dangThucHien: { moi: 5, chuyenTiep: 5 }, daNghiemThu: 2, daUngDung: 3 }
              ]
            },
           { row: 'Chia theo mục tiêu kinh tế-xã hội', total: 150, items: [
                   { row: '- Thăm dò, nghiên cứu và khai thác trái đất, khí quyển', total: 5, nu: 1, dangThucHien: { moi: 1, chuyenTiep: 2 }, daNghiemThu: 2, daUngDung: 0 },
                   { row: '- Phát triển cơ sở hạ tầng và quy hoạch sử dụng đất', total: 15, nu: 3, dangThucHien: { moi: 5, chuyenTiep: 5 }, daNghiemThu: 3, daUngDung: 2 },
                    { row: '- Phát triển sản xuất và công nghệ nông nghiệp', total: 20, nu: 7, dangThucHien: { moi: 10, chuyenTiep: 3 }, daNghiemThu: 8, daUngDung: 2 },
                    { row: '- Phát triển sản xuất và công nghệ công nghiệp', total: 30, nu: 8, dangThucHien: { moi: 12, chuyenTiep: 5 }, daNghiemThu: 10, daUngDung: 5 },
                   { row: '- Phát triển, phân phối và sử dụng hợp lý năng lượng', total: 15, nu: 3, dangThucHien: { moi: 5, chuyenTiep: 5 }, daNghiemThu: 4, daUngDung: 1 },
                   { row: '- Phát triển y tế và bảo vệ sức khoẻ con người', total: 20, nu: 7, dangThucHien: { moi: 8, chuyenTiep: 4 }, daNghiemThu: 5, daUngDung: 3 },
                    { row: '- Phát triển giáo dục và đào tạo', total: 5, nu: 1, dangThucHien: { moi: 2, chuyenTiep: 1 }, daNghiemThu: 2, daUngDung: 0 },
                    { row: '- Phát triển và bảo vệ môi trường', total: 10, nu: 3, dangThucHien: { moi: 5, chuyenTiep: 2 }, daNghiemThu: 3, daUngDung: 0 },
                     { row: '- Phát triển xã hội và dịch vụ', total: 15, nu: 4, dangThucHien: { moi: 6, chuyenTiep: 2 }, daNghiemThu: 4, daUngDung: 3 },
                     { row: '- Thăm dò, nghiên cứu và khai thác vũ trụ', total: 0, nu: 0, dangThucHien: { moi: 0, chuyenTiep: 0 }, daNghiemThu: 0, daUngDung: 0 },
                      { row: '- Nghiên cứu do các trường đại học cấp kinh phí', total: 5, nu: 0, dangThucHien: { moi: 0, chuyenTiep: 5 }, daNghiemThu: 0, daUngDung: 0 },
                       { row: '- Nghiên cứu không định hướng ứng dụng', total: 0, nu: 0, dangThucHien: { moi: 0, chuyenTiep: 0 }, daNghiemThu: 0, daUngDung: 0 },
                       { row: '- Nghiên cứu dân sự khác', total: 10, nu: 0, dangThucHien: { moi: 3, chuyenTiep: 2 }, daNghiemThu: 3, daUngDung: 2 },
                       { row: '- Bảo đảm an ninh, quốc phòng', total: 0, nu: 0, dangThucHien: { moi: 0, chuyenTiep: 0 }, daNghiemThu: 0, daUngDung: 0 }
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
const renderTaskTable = (data) => {
    const table = document.createElement('table');
    table.classList.add('table', 'table-bordered', 'task-table');

    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th rowspan="2" style="vertical-align: middle;">Nội dung</th>
            <th rowspan="2" style="vertical-align: middle;">Tổng số</th>
             <th rowspan="2" style="vertical-align: middle;">Số nhiệm vụ KH&CN chủ nhiệm là nữ</th>
            <th colspan="2">Tình trạng tiến hành</th>
             <th rowspan="2" style="vertical-align: middle;">Số được nghiệm thu</th>
              <th rowspan="2" style="vertical-align: middle;">Số đã đưa vào ứng dụng</th>
        </tr>
        <tr>
             <th>Số phê duyệt mới trong năm</th>
            <th>Số chuyển tiếp từ năm trước</th>
        </tr>
    `;

    const tbody = document.createElement('tbody');
    data.forEach(item => {
       if (item.items) {
            const groupRow = document.createElement('tr');
            groupRow.innerHTML = `
               <td>${item.row}</td>
                <td>${item.total}</td>
                 <td>${item.nu || ''}</td>
                <td></td>
                 <td></td>
                  <td></td>
                   <td></td>
            `;
            tbody.appendChild(groupRow);

            item.items.forEach(subItem => {
                 const subGroupRow = document.createElement('tr');
                     subGroupRow.innerHTML = `
                        <td style="padding-left: 30px;">${subItem.row}</td>
                           <td>${subItem.total}</td>
                            <td>${subItem.nu || ''}</td>
                           <td>${subItem.dangThucHien.moi || 0}</td>
                           <td>${subItem.dangThucHien.chuyenTiep || 0}</td>
                             <td>${subItem.daNghiemThu || 0}</td>
                            <td>${subItem.daUngDung || 0}</td>
                        `;
                      tbody.appendChild(subGroupRow);
            });
        } else {
            const dataRow = document.createElement('tr');
            dataRow.innerHTML = `
               <td>${item.row}</td>
                <td>${item.total}</td>
                 <td>${item.nu || ''}</td>
                <td>${item.dangThucHien.moi || 0}</td>
                <td>${item.dangThucHien.chuyenTiep || 0}</td>
                <td>${item.daNghiemThu || 0}</td>
                 <td>${item.daUngDung || 0}</td>
            `;
            tbody.appendChild(dataRow);
       }
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    return table;
};

// Main functions
const loadTaskReport = () => {
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
        reportSection.appendChild(renderTaskTable(yearData.data));
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
           const filePath = `/assets/Report 2024/04_KHCN_NV.xlsx`;
           // Create a temporary link element
           const link = document.createElement('a');
           link.href = filePath;
           link.download = 'Báo cáo nhiệm vụ KHCN'; // Specify the file name for the download

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
   btnXemBaoCao.addEventListener('click', loadTaskReport);
});


// Export functions to global scope
window.loadTaskReport = loadTaskReport;
window.printReport = exportFunctions.print;
window.exportToPDF = exportFunctions.toPDF;
window.exportToExcel = exportFunctions.toExcel;