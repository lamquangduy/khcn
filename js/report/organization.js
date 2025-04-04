// Mock data
const reportData = {
    '2024': {
        title: 'Báo cáo số lượng tổ chức KH&CN năm 2024',
         data: [
              { row: 'Tổng số', total: 45, nhaNuoc: { trungUong: 5, diaPhuong: 20 }, ngoaiNhaNuoc: 18, coVonDauTuNuocNgoai: 2 },
             { row: 'Chia theo thẩm quyền thành lập', total: 45,  items: [
                   {row: "-  Quốc hội, Ủy ban thường vụ Quốc hội", total: 0, nhaNuoc: { trungUong: 0, diaPhuong: 0 }, ngoaiNhaNuoc: 0, coVonDauTuNuocNgoai: 0 },
                    {row: "-  Chính phủ ", total: 2, nhaNuoc: { trungUong: 2, diaPhuong: 0 }, ngoaiNhaNuoc: 0, coVonDauTuNuocNgoai: 0 },
                    {row: "-  Tòa án nhân dân tối cao", total: 0, nhaNuoc: { trungUong: 0, diaPhuong: 0 }, ngoaiNhaNuoc: 0, coVonDauTuNuocNgoai: 0 },
                    {row: "-  Viện Kiểm sát nhân dân tối cao", total: 0, nhaNuoc: { trungUong: 0, diaPhuong: 0 }, ngoaiNhaNuoc: 0, coVonDauTuNuocNgoai: 0 },
                    {row: "-  Thủ tướng Chính phủ ", total: 1, nhaNuoc: { trungUong: 1, diaPhuong: 0 }, ngoaiNhaNuoc: 0, coVonDauTuNuocNgoai: 0 },
                    {row: "-  Bộ trưởng, Thủ trưởng cơ quan ngang Bộ, cơ quan thuộc Chính phủ  ", total: 2, nhaNuoc: { trungUong: 2, diaPhuong: 0 }, ngoaiNhaNuoc: 0, coVonDauTuNuocNgoai: 0 },
                    {row: "-  Ủy ban nhân dân tỉnh, thành phố trực thuộc Trung ương  ", total: 10, nhaNuoc: { trungUong: 0, diaPhuong: 10 }, ngoaiNhaNuoc: 0, coVonDauTuNuocNgoai: 0 },
                    {row: "-  Tổ chức chính trị, tổ chức chính trị-xã hội, tổ chức xã hội, tổ chức xã hội-nghề nghiệp", total: 7, nhaNuoc: { trungUong: 0, diaPhuong: 0 }, ngoaiNhaNuoc: 7, coVonDauTuNuocNgoai: 0 },
                  { row: "-  Doanh nghiệp, tổ chức khác, cá nhân", total: 23, nhaNuoc: { trungUong: 0, diaPhuong: 0 }, ngoaiNhaNuoc: 11, coVonDauTuNuocNgoai: 12 }
                 ]
             },
            { row: 'Chia theo loại hình tổ chức', total: 45,
                items: [
                     {row: "-  Tổ chức nghiên cứu khoa học và phát triển công nghệ", total: 15, nhaNuoc: { trungUong: 3, diaPhuong: 7 }, ngoaiNhaNuoc: 5, coVonDauTuNuocNgoai: 0 },
                    {row: "-  Cơ sở giáo dục đại học, cao đẳng:", total: 12,  nhaNuoc: { trungUong: 0, diaPhuong: 5 }, ngoaiNhaNuoc: 7, coVonDauTuNuocNgoai: 0,
                           subItems: [
                             {row: "+  Trường đại học", total: 5, nhaNuoc: { trungUong: 0, diaPhuong: 2 }, ngoaiNhaNuoc: 3, coVonDauTuNuocNgoai: 0},
                               {row: "+  Học viện", total: 2, nhaNuoc: { trungUong: 0, diaPhuong: 1 }, ngoaiNhaNuoc: 1, coVonDauTuNuocNgoai: 0},
                                 {row: "+  Đại học quốc gia, đại học vùng", total: 1, nhaNuoc: { trungUong: 0, diaPhuong: 1 }, ngoaiNhaNuoc: 0, coVonDauTuNuocNgoai: 0},
                               {row: "+  Viện nghiên cứu khoa học được phép đào tạo trình độ tiến sĩ", total: 2, nhaNuoc: { trungUong: 0, diaPhuong: 1 }, ngoaiNhaNuoc: 1, coVonDauTuNuocNgoai: 0},
                               {row: "+  Trường cao đẳng", total: 2, nhaNuoc: { trungUong: 0, diaPhuong: 0 }, ngoaiNhaNuoc: 2, coVonDauTuNuocNgoai: 0}
                           ]
                     },
                   {row: "- Tổ chức dịch vụ KH&CN:", total: 18, nhaNuoc: { trungUong: 2, diaPhuong: 8 }, ngoaiNhaNuoc: 6, coVonDauTuNuocNgoai: 2,
                        subItems: [
                         { row: "+DV thông tin, thư viện", total: 3, nhaNuoc: { trungUong: 0, diaPhuong: 1 }, ngoaiNhaNuoc: 2, coVonDauTuNuocNgoai: 0 },
                          { row: "+DV bảo tàng KH&CN", total: 1, nhaNuoc: { trungUong: 0, diaPhuong: 0 }, ngoaiNhaNuoc: 1, coVonDauTuNuocNgoai: 0 },
                           { row: "+DV dịch thuật, biên tập, xuất bản KH&CN", total: 2, nhaNuoc: { trungUong: 0, diaPhuong: 1 }, ngoaiNhaNuoc: 1, coVonDauTuNuocNgoai: 0 },
                            { row: "+DV điều tra cơ bản định kỳ, thường xuyên", total: 2, nhaNuoc: { trungUong: 1, diaPhuong: 1 }, ngoaiNhaNuoc: 0, coVonDauTuNuocNgoai: 0 },
                             { row: "+DV thống kê, điều tra xã hội", total: 1, nhaNuoc: { trungUong: 0, diaPhuong: 1 }, ngoaiNhaNuoc: 0, coVonDauTuNuocNgoai: 0 },
                             { row: "+DV tiêu chuẩn, quy chuẩn kỹ thuật, đo lường, chất lượng sản phẩm, hàng hóa", total: 4, nhaNuoc: { trungUong: 0, diaPhuong: 3 }, ngoaiNhaNuoc: 1, coVonDauTuNuocNgoai: 0 },
                             { row: "+DV tư vấn về KH&CN", total: 3, nhaNuoc: { trungUong: 1, diaPhuong: 1 }, ngoaiNhaNuoc: 1, coVonDauTuNuocNgoai: 0 },
                            { row: "+DV sở hữu trí tuệ", total: 1, nhaNuoc: { trungUong: 0, diaPhuong: 0 }, ngoaiNhaNuoc: 0, coVonDauTuNuocNgoai: 1 },
                           { row: "+DV năng lượng nguyên tử, an toàn bức xạ hạt nhân", total: 0, nhaNuoc: { trungUong: 0, diaPhuong: 0 }, ngoaiNhaNuoc: 0, coVonDauTuNuocNgoai: 0 },
                            { row: "+DV chuyển giao công nghệ", total: 1, nhaNuoc: { trungUong: 0, diaPhuong: 0 }, ngoaiNhaNuoc: 0, coVonDauTuNuocNgoai: 1 },
                           { row: "+DV KH&CN khác", total: 1, nhaNuoc: { trungUong: 0, diaPhuong: 0 }, ngoaiNhaNuoc: 0, coVonDauTuNuocNgoai: 1 },
                         ]
                   }
                ]
             },
              { row: 'Lĩnh vực khoa học và công nghệ', total: 45, items: [
                { row: "-  Khoa học tự nhiên", total: 10, nhaNuoc: { trungUong: 2, diaPhuong: 3 }, ngoaiNhaNuoc: 5, coVonDauTuNuocNgoai: 0 },
                  { row: "-  Khoa học kỹ thuật và công nghệ", total: 18, nhaNuoc: { trungUong: 1, diaPhuong: 8 }, ngoaiNhaNuoc: 9, coVonDauTuNuocNgoai: 0 },
                 { row: "-  Khoa học y, dược", total: 6, nhaNuoc: { trungUong: 1, diaPhuong: 3 }, ngoaiNhaNuoc: 1, coVonDauTuNuocNgoai: 1 },
                 { row: "-  Khoa học nông nghiệp", total: 5, nhaNuoc: { trungUong: 0, diaPhuong: 3 }, ngoaiNhaNuoc: 2, coVonDauTuNuocNgoai: 0 },
                  { row: "-  Khoa học xã hội", total: 4, nhaNuoc: { trungUong: 0, diaPhuong: 3 }, ngoaiNhaNuoc: 1, coVonDauTuNuocNgoai: 0 },
                 { row: "-  Khoa học nhân văn", total: 2, nhaNuoc: { trungUong: 1, diaPhuong: 0 }, ngoaiNhaNuoc: 0, coVonDauTuNuocNgoai: 1 }
                 ]
             }
        ]
    },
      '2023': {
           title: 'Báo cáo số lượng tổ chức KH&CN năm 2023',
          data: [
            { row: 'Tổng số', total: 40, nhaNuoc: { trungUong: 4, diaPhuong: 18 }, ngoaiNhaNuoc: 16, coVonDauTuNuocNgoai: 2 },
              { row: 'Chia theo thẩm quyền thành lập', total: 40,  items: [
                     {row: "-  Quốc hội, Ủy ban thường vụ Quốc hội", total: 0, nhaNuoc: { trungUong: 0, diaPhuong: 0 }, ngoaiNhaNuoc: 0, coVonDauTuNuocNgoai: 0 },
                    {row: "-  Chính phủ ", total: 2, nhaNuoc: { trungUong: 2, diaPhuong: 0 }, ngoaiNhaNuoc: 0, coVonDauTuNuocNgoai: 0 },
                    {row: "-  Tòa án nhân dân tối cao", total: 0, nhaNuoc: { trungUong: 0, diaPhuong: 0 }, ngoaiNhaNuoc: 0, coVonDauTuNuocNgoai: 0 },
                    {row: "-  Viện Kiểm sát nhân dân tối cao", total: 0, nhaNuoc: { trungUong: 0, diaPhuong: 0 }, ngoaiNhaNuoc: 0, coVonDauTuNuocNgoai: 0 },
                    {row: "-  Thủ tướng Chính phủ ", total: 1, nhaNuoc: { trungUong: 1, diaPhuong: 0 }, ngoaiNhaNuoc: 0, coVonDauTuNuocNgoai: 0 },
                    {row: "-  Bộ trưởng, Thủ trưởng cơ quan ngang Bộ, cơ quan thuộc Chính phủ  ", total: 1, nhaNuoc: { trungUong: 1, diaPhuong: 0 }, ngoaiNhaNuoc: 0, coVonDauTuNuocNgoai: 0 },
                    {row: "-  Ủy ban nhân dân tỉnh, thành phố trực thuộc Trung ương  ", total: 10, nhaNuoc: { trungUong: 0, diaPhuong: 10 }, ngoaiNhaNuoc: 0, coVonDauTuNuocNgoai: 0 },
                    {row: "-  Tổ chức chính trị, tổ chức chính trị-xã hội, tổ chức xã hội, tổ chức xã hội-nghề nghiệp", total: 6, nhaNuoc: { trungUong: 0, diaPhuong: 0 }, ngoaiNhaNuoc: 6, coVonDauTuNuocNgoai: 0 },
                  { row: "-  Doanh nghiệp, tổ chức khác, cá nhân", total: 20, nhaNuoc: { trungUong: 0, diaPhuong: 0 }, ngoaiNhaNuoc: 10, coVonDauTuNuocNgoai: 10 }
                 ]
             },
           { row: 'Chia theo loại hình tổ chức', total: 40,
                items: [
                     {row: "-  Tổ chức nghiên cứu khoa học và phát triển công nghệ", total: 12, nhaNuoc: { trungUong: 2, diaPhuong: 6 }, ngoaiNhaNuoc: 4, coVonDauTuNuocNgoai: 0 },
                    {row: "-  Cơ sở giáo dục đại học, cao đẳng:", total: 10,  nhaNuoc: { trungUong: 0, diaPhuong: 4 }, ngoaiNhaNuoc: 6, coVonDauTuNuocNgoai: 0,
                           subItems: [
                             {row: "+  Trường đại học", total: 4, nhaNuoc: { trungUong: 0, diaPhuong: 1 }, ngoaiNhaNuoc: 3, coVonDauTuNuocNgoai: 0},
                               {row: "+  Học viện", total: 2, nhaNuoc: { trungUong: 0, diaPhuong: 1 }, ngoaiNhaNuoc: 1, coVonDauTuNuocNgoai: 0},
                                 {row: "+  Đại học quốc gia, đại học vùng", total: 1, nhaNuoc: { trungUong: 0, diaPhuong: 1 }, ngoaiNhaNuoc: 0, coVonDauTuNuocNgoai: 0},
                               {row: "+  Viện nghiên cứu khoa học được phép đào tạo trình độ tiến sĩ", total: 1, nhaNuoc: { trungUong: 0, diaPhuong: 1 }, ngoaiNhaNuoc: 0, coVonDauTuNuocNgoai: 0},
                               {row: "+  Trường cao đẳng", total: 2, nhaNuoc: { trungUong: 0, diaPhuong: 0 }, ngoaiNhaNuoc: 2, coVonDauTuNuocNgoai: 0}
                           ]
                     },
                   {row: "- Tổ chức dịch vụ KH&CN:", total: 18, nhaNuoc: { trungUong: 2, diaPhuong: 8 }, ngoaiNhaNuoc: 6, coVonDauTuNuocNgoai: 2,
                        subItems: [
                            { row: "+DV thông tin, thư viện", total: 3, nhaNuoc: { trungUong: 0, diaPhuong: 1 }, ngoaiNhaNuoc: 2, coVonDauTuNuocNgoai: 0 },
                             { row: "+DV bảo tàng KH&CN", total: 1, nhaNuoc: { trungUong: 0, diaPhuong: 0 }, ngoaiNhaNuoc: 1, coVonDauTuNuocNgoai: 0 },
                           { row: "+DV dịch thuật, biên tập, xuất bản KH&CN", total: 2, nhaNuoc: { trungUong: 0, diaPhuong: 1 }, ngoaiNhaNuoc: 1, coVonDauTuNuocNgoai: 0 },
                            { row: "+DV điều tra cơ bản định kỳ, thường xuyên", total: 2, nhaNuoc: { trungUong: 1, diaPhuong: 1 }, ngoaiNhaNuoc: 0, coVonDauTuNuocNgoai: 0 },
                             { row: "+DV thống kê, điều tra xã hội", total: 1, nhaNuoc: { trungUong: 0, diaPhuong: 1 }, ngoaiNhaNuoc: 0, coVonDauTuNuocNgoai: 0 },
                             { row: "+DV tiêu chuẩn, quy chuẩn kỹ thuật, đo lường, chất lượng sản phẩm, hàng hóa", total: 3, nhaNuoc: { trungUong: 0, diaPhuong: 3 }, ngoaiNhaNuoc: 0, coVonDauTuNuocNgoai: 0 },
                             { row: "+DV tư vấn về KH&CN", total: 2, nhaNuoc: { trungUong: 1, diaPhuong: 0 }, ngoaiNhaNuoc: 1, coVonDauTuNuocNgoai: 0 },
                            { row: "+DV sở hữu trí tuệ", total: 1, nhaNuoc: { trungUong: 0, diaPhuong: 0 }, ngoaiNhaNuoc: 0, coVonDauTuNuocNgoai: 1 },
                           { row: "+DV năng lượng nguyên tử, an toàn bức xạ hạt nhân", total: 0, nhaNuoc: { trungUong: 0, diaPhuong: 0 }, ngoaiNhaNuoc: 0, coVonDauTuNuocNgoai: 0 },
                            { row: "+DV chuyển giao công nghệ", total: 1, nhaNuoc: { trungUong: 0, diaPhuong: 0 }, ngoaiNhaNuoc: 0, coVonDauTuNuocNgoai: 1 },
                           { row: "+DV KH&CN khác", total: 1, nhaNuoc: { trungUong: 0, diaPhuong: 0 }, ngoaiNhaNuoc: 0, coVonDauTuNuocNgoai: 1 },
                         ]
                   }
                ]
             },
              { row: 'Lĩnh vực khoa học và công nghệ', total: 40, items: [
                 { row: "-  Khoa học tự nhiên", total: 8, nhaNuoc: { trungUong: 2, diaPhuong: 2 }, ngoaiNhaNuoc: 4, coVonDauTuNuocNgoai: 0 },
                { row: "-  Khoa học kỹ thuật và công nghệ", total: 16, nhaNuoc: { trungUong: 1, diaPhuong: 7 }, ngoaiNhaNuoc: 8, coVonDauTuNuocNgoai: 0 },
                { row: "-  Khoa học y, dược", total: 5, nhaNuoc: { trungUong: 1, diaPhuong: 2 }, ngoaiNhaNuoc: 1, coVonDauTuNuocNgoai: 1 },
                { row: "-  Khoa học nông nghiệp", total: 4, nhaNuoc: { trungUong: 0, diaPhuong: 2 }, ngoaiNhaNuoc: 2, coVonDauTuNuocNgoai: 0 },
                  { row: "-  Khoa học xã hội", total: 4, nhaNuoc: { trungUong: 0, diaPhuong: 3 }, ngoaiNhaNuoc: 1, coVonDauTuNuocNgoai: 0 },
                  { row: "-  Khoa học nhân văn", total: 3, nhaNuoc: { trungUong: 0, diaPhuong: 2 }, ngoaiNhaNuoc: 0, coVonDauTuNuocNgoai: 1 }
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
const renderOrganizationTable = (data) => {
    const table = document.createElement('table');
    table.classList.add('table', 'table-bordered', 'organization-table');

    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th rowspan="2" style="vertical-align: middle;">Nội dung</th>
             <th rowspan="2" style="vertical-align: middle;">Tổng số</th>
            <th colspan="2">Nhà nước</th>
            <th rowspan="2" style="vertical-align: middle;">Ngoài nhà nước</th>
             <th rowspan="2" style="vertical-align: middle;">Có vốn đầu tư nước ngoài</th>
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
               if(subItem.subItems) {
                    const subGroupRow = document.createElement('tr');
                      subGroupRow.innerHTML = `
                            <td style="padding-left: 30px;">${subItem.row}</td>
                            <td>${subItem.total}</td>
                            <td>${subItem.nhaNuoc.trungUong}</td>
                            <td>${subItem.nhaNuoc.diaPhuong}</td>
                            <td>${subItem.ngoaiNhaNuoc}</td>
                             <td>${subItem.coVonDauTuNuocNgoai}</td>
                        `;
                         tbody.appendChild(subGroupRow);
                    subItem.subItems.forEach(ssItem =>{
                         const ssGroupRow = document.createElement('tr');
                             ssGroupRow.innerHTML = `
                                  <td style="padding-left: 60px;">${ssItem.row}</td>
                                   <td>${ssItem.total}</td>
                                    <td>${ssItem.nhaNuoc.trungUong}</td>
                                   <td>${ssItem.nhaNuoc.diaPhuong}</td>
                                     <td>${ssItem.ngoaiNhaNuoc}</td>
                                   <td>${ssItem.coVonDauTuNuocNgoai}</td>
                                `;
                                  tbody.appendChild(ssGroupRow);
                    });
               }else{
                 const subGroupRow = document.createElement('tr');
                      subGroupRow.innerHTML = `
                            <td style="padding-left: 30px;">${subItem.row}</td>
                            <td>${subItem.total}</td>
                            <td>${subItem.nhaNuoc.trungUong}</td>
                            <td>${subItem.nhaNuoc.diaPhuong}</td>
                            <td>${subItem.ngoaiNhaNuoc}</td>
                            <td>${subItem.coVonDauTuNuocNgoai}</td>
                        `;
                         tbody.appendChild(subGroupRow);
               }

           });
       }else{
             const dataRow = document.createElement('tr');
            dataRow.innerHTML = `
                <td>${item.row}</td>
                <td>${item.total}</td>
                <td>${item.nhaNuoc.trungUong}</td>
                <td>${item.nhaNuoc.diaPhuong}</td>
                <td>${item.ngoaiNhaNuoc}</td>
                <td>${item.coVonDauTuNuocNgoai}</td>
            `;
             tbody.appendChild(dataRow);
       }
    });
    table.appendChild(thead);
    table.appendChild(tbody);
    return table;
};

// Main functions
const loadOrganizationReport = () => {
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
        reportSection.appendChild(renderOrganizationTable(yearData.data));
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
           const filePath = `/assets/Report 2024/01_KHCN_TC.xlsx`;
           // Create a temporary link element
           const link = document.createElement('a');
           link.href = filePath;
           link.download = 'Báo cáo số lượng tổ chức KH&CN.xlsx'; // Specify the file name for the download

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
    btnXemBaoCao.addEventListener('click', loadOrganizationReport);
});

// Export functions to global scope
window.loadOrganizationReport = loadOrganizationReport;
window.printReport = exportFunctions.print;
window.exportToPDF = exportFunctions.toPDF;
window.exportToExcel = exportFunctions.toExcel;