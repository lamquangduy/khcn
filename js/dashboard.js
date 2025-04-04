document.addEventListener('DOMContentLoaded', function () {
  // Biểu đồ cơ cấu dự án nghiên cứu
  new Chart(document.getElementById('projectChart'), {
    type: 'doughnut',
    data: {
      labels: ['Nông nghiệp', 'Y tế', 'Công nghiệp', 'Xây dựng', 'Công nghệ thông tin'],
      datasets: [
        {
          data: [35, 20, 25, 10, 10], // Đã thay đổi số liệu
          backgroundColor: ['#4CAF50', '#2196F3', '#FFC107', '#9C27B0', '#FF5722'],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
        },
      },
    },
  });
  // Biểu đồ phân bổ kinh phí KHCN
  new Chart(document.getElementById('fundingChart'), {
    type: 'bar',
    data: {
      labels: ['Nghiên cứu cơ bản', 'Nghiên cứu ứng dụng', 'Phát triển công nghệ', 'Đổi mới sáng tạo'],
      datasets: [
        {
          label: 'Kinh phí (tỷ đồng)',
          data: [60, 160, 220, 120], // Đã thay đổi số liệu
          backgroundColor: '#2196F3',
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });

  // Biểu đồ số lượng công bố khoa học
  new Chart(document.getElementById('publicationChart'), {
    type: 'line',
    data: {
      labels: ['2020', '2021', '2022', '2023', '2024'],
      datasets: [
        {
          label: 'Số lượng công bố',
          data: [180, 200, 220, 280, 350],  // Đã thay đổi số liệu
          borderColor: '#4CAF50',
          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });

  // Biểu đồ cơ cấu doanh nghiệp KHCN theo lĩnh vực
  new Chart(document.getElementById('enterpriseSectorChart'), {
    type: 'bar',
    data: {
      labels: [
        'Công nghệ sinh học',
        'Công nghệ vật liệu',
        'Công nghệ năng lượng',
        'Công nghệ tự động hóa',
        'CNTT',
      ],
      datasets: [
        {
          label: 'Số lượng doanh nghiệp',
          data: [90, 40, 30, 75, 65], // Đã thay đổi số liệu
          backgroundColor: '#2196F3',
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
  // Biểu đồ cơ cấu doanh nghiệp CNTT
  new Chart(document.getElementById('enterpriseChart'), {
    type: 'doughnut',
    data: {
      labels: ['Phần mềm', 'Nội dung số', 'Phần cứng', 'Dịch vụ CNTT', 'Kinh doanh CNTT'],
      datasets: [{
        data: [2500, 700, 200, 1500, 4000],  // Đã thay đổi số liệu
        backgroundColor: ['#4CAF50', '#2196F3', '#FFC107', '#9C27B0', '#FF5722']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });

  // Biểu đồ phân bố lao động CNTT
  new Chart(document.getElementById('laborChart'), {
    type: 'bar',
    data: {
      labels: ['Phần mềm', 'Phần cứng', 'Nội dung số', 'Dịch vụ', 'Kinh doanh'],
      datasets: [{
        label: 'Số lượng lao động',
        data: [25000, 11000, 8000, 7000, 10000],  // Đã thay đổi số liệu
        backgroundColor: '#2196F3'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

  // Biểu đồ thuê bao băng rộng
  new Chart(document.getElementById('broadbandChart'), {
    type: 'line',
    data: {
      labels: ['2021', '2022', '2023', '2024'],
      datasets: [{
        label: 'Băng rộng cố định',
        data: [300000, 330000, 370000, 400000], // Đã thay đổi số liệu
        borderColor: '#4CAF50',
        tension: 0.4
      },
      {
        label: 'Băng rộng di động',
        data: [1000000, 1050000, 1100000, 1200000],  // Đã thay đổi số liệu
        borderColor: '#2196F3',
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
  // Biểu đồ doanh thu hoạt động dịch vụ Thông tin và Truyền thông
  new Chart(document.getElementById('revenueChart'), {
    type: 'line',
    data: {
      labels: ['2021', '2022', '2023', '2024'],
      datasets: [{
        label: 'Hoạt động Thông tin và Truyền thông',
        data: [7000, 7200, 7500, 7800], // Đã thay đổi số liệu
        borderColor: '#4CAF50',
        tension: 0.4
      },
      {
        label: 'Hoạt động viễn thông',
        data: [4500, 4700, 5000, 5500], // Đã thay đổi số liệu
        borderColor: '#2196F3',
        tension: 0.4
      },
      {
        label: 'Lập trình máy tính',
        data: [1300, 1400, 1500, 1650], // Đã thay đổi số liệu
        borderColor: '#FF9800',
        tension: 0.4
      },
      {
        label: 'Dịch vụ thông tin khác',
        data: [100, 110, 120, 130], // Đã thay đổi số liệu
        borderColor: '#9C27B0',
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Đơn vị: Tỷ đồng',
          position: 'left'
        },
        legend: {
          position: 'bottom'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (value) {
              return value.toLocaleString() + ' tỷ';
            }
          }
        }
      }
    }
  });
  // Gọi hàm cập nhật dữ liệu khi trang load
  updateAlerts();
  updateKPIs();
});

// Cập nhật dữ liệu realtime (mỗi 5 phút)
setInterval(() => {
  updateAlerts();
  updateKPIs();
}, 300000);

// Object chứa vietsub các status
const statusMap = {
  urgent: "Cần xử lý",
  warning: "Đang xử lý",
  pending: "Chờ xử lý",
};
// Hàm cập nhật bảng cảnh báo
function updateAlerts() {
  // Dữ liệu cảnh báo đã gán cứng
  const alertsData = [
    {
      type: "Dự án",
      content: "Dự án 'Nghiên cứu và phát triển giống lúa mới kháng bệnh' sắp hết thời hạn nghiệm thu",
      deadline: "20/01/2025",
      status: "urgent",
    },
    {
      type: "Sở hữu trí tuệ",
      content: "Bằng sáng chế 'Quy trình sản xuất vật liệu composite mới' cần gia hạn",
      deadline: "28/01/2025",
      status: "warning",
    },
    {
      type: "Doanh nghiệp",
      content: "Doanh nghiệp 'Công ty TNHH Công nghệ Sinh học Xanh' cần đánh giá lại năng lực",
      deadline: "05/02/2025",
      status: "pending",
    },
    {
      type: "Dự án",
      content: "Dự án 'Ứng dụng AI trong quản lý giao thông đô thị' cần cập nhật tiến độ",
      deadline: "10/02/2025",
      status: "pending",
    },
    {
      type: "Wifi",
      content: "Điểm phát wifi tại TTHC cần bảo trì",
      deadline: "10/01/2025",
      status: "warning",
    },
    {
      type: "Hạ tầng",
      content: "Sự cố đường truyền khu vực Sơn Trà",
      deadline: "01/01/2025",
      status: "pending",
    },
    {
      type: "Giấy phép",
      content: "Giấy phép bưu chính của Công ty Hoàng Huy sắp hết hạn",
      deadline: "15/01/2025",
      status: "urgent",
    },
  ];
  // Lấy thẻ tbody của bảng cảnh báo
  const tableBody = document.querySelector('.alert-table tbody');
  tableBody.innerHTML = ''; // Xóa dữ liệu cũ

  // Kiểm tra nếu alertsData là một mảng và không rỗng
  if (Array.isArray(alertsData) && alertsData.length > 0) {
    // Duyệt qua từng cảnh báo
    alertsData.forEach(alert => {
      // Tạo một hàng mới trong bảng
      const row = `
         <tr>
            <td><i class="fas ${getAlertIcon(alert.type)}"></i> ${alert.type}</td>
            <td>${alert.content}</td>
            <td>${alert.deadline}</td>
              <td><span class="status ${alert.status.toLowerCase()}">${statusMap[alert.status] // Vietsub status
        }</span></td>
          </tr>
      `;
      // Thêm hàng vào bảng
      tableBody.innerHTML += row;
    });
  } else {
    // Nếu không có dữ liệu, hiển thị một thông báo
    tableBody.innerHTML = '<tr><td colspan="4">Không có cảnh báo nào.</td></tr>';
  }
}

// Hàm lấy icon dựa theo loại cảnh báo
function getAlertIcon(type) {
  switch (type) {
    case "Dự án":
      return "fas fa-exclamation-triangle";
    case "Sở hữu trí tuệ":
      return "fas fa-copyright";
    case "Doanh nghiệp":
      return "fas fa-industry";
    case "Wifi":
      return "fas fa-wifi";
    case "Hạ tầng":
      return "fas fa-broadcast-tower";
    case "Giấy phép":
      return "fas fa-mail-bulk";
    default:
      return "fas fa-exclamation-circle";
  }
}

// Hàm cập nhật các chỉ số KPI
function updateKPIs() {
  // Dữ liệu KPI đã gán cứng
  const kpiData = {
    "Tỷ lệ dự án KHCN nghiệm thu thành công": "88%",
    "Số lượng công bố KHCN/100 nhà khoa học": "23",
    "Số lượng bằng sáng chế/1000 dân": "11",
    "Tỷ lệ doanh nghiệp KHCN có hoạt động đổi mới": "78%",
    "Tỷ lệ hộ gia đình có internet": "92%",
    "Tỷ lệ thuê bao băng rộng cố định/100 dân": "35%",
    "Tỷ lệ thuê bao smartphone": "96%",
    "Tỷ lệ DN ứng dụng CNTT": "99%",
  };
  // Kiểm tra nếu kpiData là một object và có dữ liệu
  if (typeof kpiData === 'object' && kpiData !== null) {
    // Lấy các phần tử KPI trên trang
    const kpiItems = document.querySelectorAll('.kpi-item');
    // Duyệt qua từng KPI item
    kpiItems.forEach(item => {
      const kpiNameElement = item.querySelector('h4');
      const kpiValueElement = item.querySelector('.kpi-value');
      if (kpiNameElement && kpiValueElement) {
        // Lấy tên KPI
        const kpiName = kpiNameElement.textContent.trim();
        // Tìm giá trị KPI trong dữ liệu
        const kpiValue = kpiData[kpiName];
        // Cập nhật giá trị KPI (nếu tìm thấy)
        if (kpiValue !== undefined) {
          kpiValueElement.textContent = kpiValue;
        } else {
          console.warn(`Không tìm thấy giá trị KPI cho: ${kpiName}`);
        }
      }
    });
  } else {
    // Nếu dữ liệu không hợp lệ, bạn có thể chọn hiển thị thông báo hoặc ẩn các phần tử KPI
    const kpiGrid = document.querySelector('.kpi-grid');
    kpiGrid.innerHTML = '<p>Lỗi: Không thể tải dữ liệu KPI. </p>'
  }
}