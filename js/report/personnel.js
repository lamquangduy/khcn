// Mock data
const reportData = {
    '2024': {
       title: 'Báo cáo số người trong các tổ chức KH&CN năm 2024',
       data: [
           { row: 'Tổng số', total: 750,  trinhDo: { tienSi: 55, thacSi: 150, daiHoc: 400, caoDang: 100, khac: 45 }, chucDanh: { giaoSu: 10, phoGiaoSu: 30 } },
            { row: 'Chia theo loại hình tổ chức', total: 750, items: [
                   { row: '- Tổ chức nghiên cứu khoa học và phát triển công nghệ', total: 280, trinhDo: { tienSi: 30, thacSi: 60, daiHoc: 150, caoDang: 20, khac: 20 }, chucDanh: { giaoSu: 5, phoGiaoSu: 15 } },
                   { row: '- Cơ sở giáo dục đại học, cao đẳng', total: 320, trinhDo: { tienSi: 20, thacSi: 70, daiHoc: 180, caoDang: 30, khac: 20 }, chucDanh: { giaoSu: 5, phoGiaoSu: 12 } },
                   { row: '- Tổ chức dịch vụ KH&CN', total: 150,  trinhDo: { tienSi: 5, thacSi: 20, daiHoc: 70, caoDang: 50, khac: 5 }, chucDanh: { giaoSu: 0, phoGiaoSu: 3 } }
             ]
            },
             {row: 'Chia theo quốc tịch', total: 750, items: [
                 { row: '- Người Việt Nam', total: 740,  items:[
                     {row: '+ Dân tộc Kinh', total: 700, trinhDo: { tienSi: 50, thacSi: 140, daiHoc: 380, caoDang: 90, khac: 40 }, chucDanh: { giaoSu: 10, phoGiaoSu: 30 }},
                     {row: '+ Dân tộc thiểu số', total: 40, trinhDo: { tienSi: 4, thacSi: 8, daiHoc: 15, caoDang: 8, khac: 5 }, chucDanh: { giaoSu: 0, phoGiaoSu: 0 }}
                 ]},
                  { row: '- Người nước ngoài', total: 10, trinhDo: { tienSi: 1, thacSi: 2, daiHoc: 5, caoDang: 2, khac: 0 }, chucDanh: { giaoSu: 0, phoGiaoSu: 0 } },
                 ]
            },
            { row: 'Chia theo lĩnh vực đào tạo', total: 750, items: [
                  { row: '- Khoa học tự nhiên', total: 180, trinhDo: { tienSi: 15, thacSi: 30, daiHoc: 100, caoDang: 20, khac: 15 }, chucDanh: { giaoSu: 2, phoGiaoSu: 6 } },
                   { row: '- Khoa học kỹ thuật và công nghệ', total: 250, trinhDo: { tienSi: 20, thacSi: 50, daiHoc: 130, caoDang: 30, khac: 20 }, chucDanh: { giaoSu: 4, phoGiaoSu: 10 } },
                   { row: '- Khoa học y, dược', total: 100, trinhDo: { tienSi: 10, thacSi: 25, daiHoc: 50, caoDang: 10, khac: 5 }, chucDanh: { giaoSu: 2, phoGiaoSu: 4 } },
                   { row: '- Khoa học nông nghiệp', total: 80, trinhDo: { tienSi: 5, thacSi: 15, daiHoc: 40, caoDang: 15, khac: 5 }, chucDanh: { giaoSu: 1, phoGiaoSu: 3 } },
                 { row: '- Khoa học xã hội', total: 90, trinhDo: { tienSi: 3, thacSi: 15, daiHoc: 50, caoDang: 15, khac: 7 }, chucDanh: { giaoSu: 1, phoGiaoSu: 4 } },
                  { row: '- Khoa học nhân văn', total: 30, trinhDo: { tienSi: 1, thacSi: 5, daiHoc: 15, caoDang: 5, khac: 4 }, chucDanh: { giaoSu: 0, phoGiaoSu: 1 } },
                   { row: '- Khác', total: 20, trinhDo: { tienSi: 1, thacSi: 10, daiHoc: 15, caoDang: 5, khac: 0 }, chucDanh: { giaoSu: 0, phoGiaoSu: 2 } }
            ]
          },
          { row: 'Chia theo độ tuổi', total: 750, items: [
               { row: '- Đến 35 tuổi', total: 300, trinhDo: { tienSi: 10, thacSi: 70, daiHoc: 180, caoDang: 30, khac: 10 }, chucDanh: { giaoSu: 0, phoGiaoSu: 0 } },
               { row: '- Từ 36-55 tuổi', total: 350, trinhDo: { tienSi: 30, thacSi: 70, daiHoc: 180, caoDang: 40, khac: 30 }, chucDanh: { giaoSu: 5, phoGiaoSu: 15 } },
               { row: '- Từ 56-60 tuổi', total: 60, trinhDo: { tienSi: 10, thacSi: 10, daiHoc: 30, caoDang: 10, khac: 0 }, chucDanh: { giaoSu: 3, phoGiaoSu: 10 } },
                 { row: '- Từ 61-65 tuổi', total: 30, trinhDo: { tienSi: 5, thacSi: 0, daiHoc: 10, caoDang: 10, khac: 5 }, chucDanh: { giaoSu: 2, phoGiaoSu: 5 } },
                   { row: '- Trên 65 tuổi', total: 10, trinhDo: { tienSi: 0, thacSi: 0, daiHoc: 0, caoDang: 10, khac: 0 }, chucDanh: { giaoSu: 0, phoGiaoSu: 0 } }
             ]
          }
       ]
   },
    '2023': {
          title: 'Báo cáo số người trong các tổ chức KH&CN năm 2023',
           data: [
            { row: 'Tổng số', total: 700,  trinhDo: { tienSi: 50, thacSi: 140, daiHoc: 380, caoDang: 90, khac: 40 }, chucDanh: { giaoSu: 8, phoGiaoSu: 25 } },
            { row: 'Chia theo loại hình tổ chức', total: 700, items: [
                   { row: '- Tổ chức nghiên cứu khoa học và phát triển công nghệ', total: 250, trinhDo: { tienSi: 25, thacSi: 50, daiHoc: 140, caoDang: 15, khac: 20 }, chucDanh: { giaoSu: 4, phoGiaoSu: 12 } },
                   { row: '- Cơ sở giáo dục đại học, cao đẳng', total: 300,  trinhDo: { tienSi: 18, thacSi: 60, daiHoc: 170, caoDang: 25, khac: 17 }, chucDanh: { giaoSu: 4, phoGiaoSu: 10 } },
                   { row: '- Tổ chức dịch vụ KH&CN', total: 150,  trinhDo: { tienSi: 7, thacSi: 30, daiHoc: 70, caoDang: 40, khac: 3 }, chucDanh: { giaoSu: 0, phoGiaoSu: 3 } }
             ]
            },
             {row: 'Chia theo quốc tịch', total: 700, items: [
                 { row: '- Người Việt Nam', total: 690,  items:[
                     {row: '+ Dân tộc Kinh', total: 650, trinhDo: { tienSi: 45, thacSi: 130, daiHoc: 370, caoDang: 85, khac: 35 }, chucDanh: { giaoSu: 8, phoGiaoSu: 25 }},
                     {row: '+ Dân tộc thiểu số', total: 40, trinhDo: { tienSi: 5, thacSi: 10, daiHoc: 10, caoDang: 5, khac: 5 }, chucDanh: { giaoSu: 0, phoGiaoSu: 0 }}
                 ]},
                  { row: '- Người nước ngoài', total: 10, trinhDo: { tienSi: 0, thacSi: 0, daiHoc: 10, caoDang: 0, khac: 0 }, chucDanh: { giaoSu: 0, phoGiaoSu: 0 } },
                 ]
            },
            { row: 'Chia theo lĩnh vực đào tạo', total: 700, items: [
                  { row: '- Khoa học tự nhiên', total: 160, trinhDo: { tienSi: 12, thacSi: 25, daiHoc: 90, caoDang: 20, khac: 13 }, chucDanh: { giaoSu: 2, phoGiaoSu: 5 } },
                   { row: '- Khoa học kỹ thuật và công nghệ', total: 230, trinhDo: { tienSi: 18, thacSi: 45, daiHoc: 120, caoDang: 25, khac: 15 }, chucDanh: { giaoSu: 3, phoGiaoSu: 8 } },
                   { row: '- Khoa học y, dược', total: 90, trinhDo: { tienSi: 8, thacSi: 20, daiHoc: 40, caoDang: 15, khac: 7 }, chucDanh: { giaoSu: 1, phoGiaoSu: 4 } },
                   { row: '- Khoa học nông nghiệp', total: 70, trinhDo: { tienSi: 4, thacSi: 12, daiHoc: 35, caoDang: 10, khac: 9 }, chucDanh: { giaoSu: 1, phoGiaoSu: 3 } },
                 { row: '- Khoa học xã hội', total: 80, trinhDo: { tienSi: 2, thacSi: 10, daiHoc: 45, caoDang: 15, khac: 8 }, chucDanh: { giaoSu: 0, phoGiaoSu: 3 } },
                  { row: '- Khoa học nhân văn', total: 30, trinhDo: { tienSi: 1, thacSi: 5, daiHoc: 15, caoDang: 5, khac: 4 }, chucDanh: { giaoSu: 0, phoGiaoSu: 1 } },
                   { row: '- Khác', total: 40, trinhDo: { tienSi: 0, thacSi: 10, daiHoc: 10, caoDang: 5, khac: 15 }, chucDanh: { giaoSu: 0, phoGiaoSu: 1 } }
            ]
          },
           { row: 'Chia theo độ tuổi', total: 700, items: [
                { row: '- Đến 35 tuổi', total: 280, trinhDo: { tienSi: 8, thacSi: 60, daiHoc: 160, caoDang: 32, khac: 20 }, chucDanh: { giaoSu: 0, phoGiaoSu: 0 } },
               { row: '- Từ 36-55 tuổi', total: 320, trinhDo: { tienSi: 25, thacSi: 65, daiHoc: 170, caoDang: 35, khac: 25 }, chucDanh: { giaoSu: 3, phoGiaoSu: 12 } },
               { row: '- Từ 56-60 tuổi', total: 50, trinhDo: { tienSi: 8, thacSi: 8, daiHoc: 25, caoDang: 8, khac: 1 }, chucDanh: { giaoSu: 3, phoGiaoSu: 9 } },
                 { row: '- Từ 61-65 tuổi', total: 40, trinhDo: { tienSi: 5, thacSi: 7, daiHoc: 15, caoDang: 8, khac: 5 }, chucDanh: { giaoSu: 2, phoGiaoSu: 4 } },
                   { row: '- Trên 65 tuổi', total: 10, trinhDo: { tienSi: 0, thacSi: 0, daiHoc: 0, caoDang: 7, khac: 3 }, chucDanh: { giaoSu: 0, phoGiaoSu: 0 } }
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
const renderPersonnelTable = (data) => {
   const table = document.createElement('table');
   table.classList.add('table', 'table-bordered', 'personnel-table');

   const thead = document.createElement('thead');
   thead.innerHTML = `
       <tr>
           <th rowspan="2" style="vertical-align: middle;">Nội dung</th>
           <th rowspan="2" style="vertical-align: middle;">Tổng số</th>
           <th colspan="5">Trình độ chuyên môn</th>
            <th colspan="2">Chức danh</th>
       </tr>
       <tr>
           <th>Tiến sĩ</th>
           <th>Thạc sĩ</th>
           <th>Đại học</th>
           <th>Cao đẳng</th>
            <th>Khác</th>
            <th>Giáo sư</th>
             <th>Phó giáo sư</th>
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
                  <td></td>
                    <td></td>
                      <td></td>
           `;
           tbody.appendChild(groupRow);

           item.items.forEach(subItem => {
                if(subItem.items){
                     const subGroupRow = document.createElement('tr');
                     subGroupRow.innerHTML = `
                        <td style="padding-left: 30px;">${subItem.row}</td>
                          <td>${subItem.total}</td>
                         <td></td>
                         <td></td>
                          <td></td>
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
                               <td>${ssItem.trinhDo.tienSi || 0}</td>
                               <td>${ssItem.trinhDo.thacSi || 0}</td>
                               <td>${ssItem.trinhDo.daiHoc || 0}</td>
                               <td>${ssItem.trinhDo.caoDang || 0}</td>
                               <td>${ssItem.trinhDo.khac || 0}</td>
                                <td>${ssItem.chucDanh.giaoSu || 0}</td>
                                <td>${ssItem.chucDanh.phoGiaoSu || 0}</td>
                           `;
                                 tbody.appendChild(ssGroupRow);

                      });
                }else{
                    const subGroupRow = document.createElement('tr');
                    subGroupRow.innerHTML = `
                       <td style="padding-left: 30px;">${subItem.row}</td>
                          <td>${subItem.total}</td>
                          <td>${subItem.trinhDo.tienSi || 0}</td>
                           <td>${subItem.trinhDo.thacSi || 0}</td>
                           <td>${subItem.trinhDo.daiHoc || 0}</td>
                           <td>${subItem.trinhDo.caoDang || 0}</td>
                            <td>${subItem.trinhDo.khac || 0}</td>
                             <td>${subItem.chucDanh.giaoSu || 0}</td>
                            <td>${subItem.chucDanh.phoGiaoSu || 0}</td>
                      `;
                      tbody.appendChild(subGroupRow);
                }

           });
       } else {
           const dataRow = document.createElement('tr');
           dataRow.innerHTML = `
               <td>${item.row}</td>
               <td>${item.total}</td>
               <td>${item.trinhDo.tienSi || 0}</td>
               <td>${item.trinhDo.thacSi || 0}</td>
               <td>${item.trinhDo.daiHoc || 0}</td>
               <td>${item.trinhDo.caoDang || 0}</td>
                <td>${item.trinhDo.khac || 0}</td>
               <td>${item.chucDanh.giaoSu || 0}</td>
                <td>${item.chucDanh.phoGiaoSu || 0}</td>
           `;
           tbody.appendChild(dataRow);
       }
   });


   table.appendChild(thead);
   table.appendChild(tbody);
   return table;
};


// Main functions
const loadPersonnelReport = () => {
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
      reportSection.appendChild(renderPersonnelTable(yearData.data));
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
          const filePath = `/assets/Report 2024/02_KHCN_NL.xlsx`;
          // Create a temporary link element
          const link = document.createElement('a');
          link.href = filePath;
          link.download = 'Báo cáo số người trong tổ chức KH&CN.xlsx'; // Specify the file name for the download

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
   btnXemBaoCao.addEventListener('click', loadPersonnelReport);
});


// Export functions to global scope
window.loadPersonnelReport = loadPersonnelReport;
window.printReport = exportFunctions.print;
window.exportToPDF = exportFunctions.toPDF;
window.exportToExcel = exportFunctions.toExcel;