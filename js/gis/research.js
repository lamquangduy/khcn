document.addEventListener('DOMContentLoaded', () => {
  // --- Initialize Leaflet map ---
  const map = L.map('map', {
      center: [16.047534, 108.220970],
      zoom: 12,
      minZoom: 11,
      maxZoom: 18
  });
  let normalLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
  }).addTo(map);
  let satelliteLayer = null;
  let terrainLayer = null;
  let heatmapLayer = null;

  // --- Define custom icons for Research Centers and Labs (using CSS classes for styling) ---
  const centerIcon = L.divIcon({
      className: 'map-marker center',
      html: '<i class="fas fa-university"></i>',
      iconSize: [30, 30],
      iconAnchor: [15, 30],
      popupAnchor: [0, -30]
  });

  const labIcon = L.divIcon({
      className: 'map-marker lab',
      html: '<i class="fas fa-vial"></i>',
      iconSize: [30, 30],
      iconAnchor: [15, 30],
      popupAnchor: [0, -30]
  });

  // --- REAL-LOOKING Research Data (REPLACE THIS WITH YOUR VERIFIED REAL DATA) ---
  const researchData = [
      {
          id: 1,
          name: 'Trung tâm Nghiên cứu và Phát triển Công nghệ Cao Đà Nẵng',
          type: 'center',
          address: 'Đường số 8, Khu Công nghệ cao Đà Nẵng, Hòa Liên, Hòa Vang, Đà Nẵng',
          district: 'hoaVang',
          field: 'cntt',
          coordinates: [16.0158, 108.1578],
          director: 'PGS. TS. Nguyễn Hoàng Nam',
          phone: '0236 3777 888',
          email: 'info@dhtc-dn.vn',
          website: 'www.dhtc-dn.vn',
          description: 'Trung tâm trọng điểm quốc gia về nghiên cứu và ứng dụng công nghệ cao trong lĩnh vực CNTT, Điện tử, và Tự động hóa.',
          foundingYear: 2012,
          staffCount: 200,
          images: ['/assets/gis/research/dhtc-dn.jpg']
      },
      {
          id: 2,
          name: 'Phòng Thí nghiệm Trọng điểm Công nghệ Sinh học Miền Trung',
          type: 'lab',
          address: 'Khu Công nghệ Sinh học Hòa Liên, Hòa Vang, Đà Nẵng',
          district: 'hoaVang',
          field: 'sinhHoc',
          coordinates: [16.0185, 108.1620],
          manager: 'TS. Trần Thị Hương Giang',
          phone: '0236 3666 999',
          email: 'btlab.mt@vgbiotek.vn',
          equipment: 'Hệ thống giải trình tự gen thế hệ mới, Kính hiển vi confocal, Máy sắc ký lỏng khối phổ',
          description: 'Phòng thí nghiệm hàng đầu khu vực miền Trung về công nghệ sinh học, tập trung vào nghiên cứu ứng dụng trong nông nghiệp và y tế.',
          establishedYear: 2008,
          researchFocus: 'Công nghệ gen thực vật, Sinh học phân tử vi sinh vật, Nghiên cứu dược liệu',
          images: ['/assets/gis/research/btlab-mt.jpg']
      },
      {
          id: 3,
          name: 'Trung tâm Nghiên cứu và Ứng dụng Vật liệu Tiên tiến - Đại học Bách Khoa Đà Nẵng',
          type: 'center',
          address: 'Đường Nguyễn Lương Bằng, Quận Liên Chiểu, Đà Nẵng',
          district: 'lienChieu',
          field: 'vatLieu',
          coordinates: [16.0445, 108.2145],
          director: 'GS. TSKH. Nguyễn Văn Bình',
          phone: '0236 3842 333',
          email: 'amrc@dut.udn.vn',
          website: 'www.amrc-dut.vn',
          description: 'Trung tâm nghiên cứu mạnh của Đại học Bách Khoa Đà Nẵng, chuyên sâu về vật liệu tiên tiến, vật liệu nano, và ứng dụng trong nhiều lĩnh vực.',
          foundingYear: 2005,
          staffCount: 150,
          images: ['/assets/gis/research/amrc-dut.jpg']
      },
      {
          id: 4,
          name: 'Phòng Thí nghiệm Nghiên cứu Môi trường và Biến đổi Khí hậu',
          type: 'lab',
          address: 'Khoa Môi trường, Đại học Sư phạm Đà Nẵng, Đường Nguyễn Tất Thành, Quận Thanh Khê, Đà Nẵng',
          district: 'thanhKhe',
          field: 'moiTruong',
          coordinates: [16.0720, 108.1950],
          manager: 'TS. Lê Thị Thủy',
          phone: '0236 3735 444',
          email: 'envirolab.sptd@ued.udn.vn',
          equipment: 'Hệ thống quan trắc khí tượng tự động, Thiết bị phân tích chất lượng nước, Phần mềm mô hình hóa khí hậu',
          description: 'Phòng thí nghiệm phục vụ đào tạo và nghiên cứu khoa học trong lĩnh vực môi trường, biến đổi khí hậu và phát triển bền vững.',
          establishedYear: 2010,
          researchFocus: 'Quan trắc và phân tích môi trường, Đánh giá tác động biến đổi khí hậu, Giải pháp thích ứng và giảm thiểu',
          images: ['/assets/gis/research/envirolab-ued.jpg']
      },
      {
          id: 5,
          name: 'Trung tâm Nghiên cứu Y sinh và Dược học',
          type: 'center',
          address: 'Bệnh viện Đa khoa Đà Nẵng, Đường Hải Phòng, Hải Châu, Đà Nẵng',
          district: 'haiChau',
          field: 'yHoc',
          coordinates: [16.0630, 108.2240],
          director: 'GS. TS. Phạm Hùng Mạnh',
          phone: '0236 3822 555',
          email: 'research.medcenter.c@dananghospital.vn',
          website: 'www.medresearch-cdanang.vn', // Example - might not be real
          description: 'Trung tâm nghiên cứu trực thuộc Bệnh viện C Đà Nẵng, tập trung vào y học lâm sàng, dịch tễ học, và các nghiên cứu can thiệp y tế.',
          foundingYear: 2015,
          staffCount: 80,
          images: ['/assets/gis/research/medcenter-cdanang.jpg']
      },
       {
          id: 6,
          name: 'Phòng Thí nghiệm Điện tử và Viễn thông - Khoa Điện tử Viễn thông - Đại học Sư Phạm Kỹ Thuật',
          type: 'lab',
          address: '48 Cao Thắng, Quận Hải Châu, Đà Nẵng',
          district: 'haiChau',
          field: 'dienTu',
          coordinates: [16.0575, 108.2180],
          manager: 'TS. Nguyễn Văn Tèo',
          phone: '0236 3730374',
          email: 'lab.etvt.spkt@ute.udn.vn',
          equipment: 'Máy phân tích mạng, Máy hiện sóng số, Thiết bị đo kiểm tín hiệu viễn thông',
          description: 'Phòng thí nghiệm phục vụ đào tạo và nghiên cứu trong lĩnh vực điện tử, viễn thông, và các hệ thống nhúng.',
          establishedYear: 2000, // Example year before 2000
          researchFocus: 'Hệ thống thông tin vô tuyến, Xử lý tín hiệu số, IoT và Mạng cảm biến',
          images: ['/assets/gis/research/etvt-spkt.jpg']
      },
      {
          id: 7,
          name: 'Trung tâm Nghiên cứu và Phát triển Cơ khí - Trường Đại học Duy Tân',
          type: 'center',
          address: 'Khuôn viên Trường Đại học Duy Tân, Đường Nguyễn Văn Linh, Quận Thanh Khê, Đà Nẵng',
          district: 'thanhKhe',
          field: 'coKhi',
          coordinates: [16.0688, 108.2055],
          director: 'GS. TSKH. Lê Công Cơ', // Example name - might not be accurate director
          phone: '0236 3827 111',
          email: 'rdcenter.mech@dtu.edu.vn', // Example - might not be real
          website: 'www.rdcm-dtu.vn', // Example - might not be real
          description: 'Trung tâm mạnh của Đại học Duy Tân trong lĩnh vực cơ khí, tập trung vào cơ khí chế tạo, tự động hóa, và năng lượng tái tạo.',
          foundingYear: 2013,
          staffCount: 120,
          images: ['/assets/gis/research/rdcm-dtu.jpg']
      },
      {
          id: 8,
          name: 'Phòng Thí nghiệm Hóa Phân tích và Kiểm nghiệm - Sở Khoa học và Công nghệ Đà Nẵng',
          type: 'lab',
          address: '24 Trần Phú, Quận Hải Châu, Đà Nẵng',
          district: 'haiChau',
          field: 'hoaHoc',
          coordinates: [16.0740, 108.2230],
          manager: 'ThS. Nguyễn Thị Kim Liên', // Example manager name
          phone: '0236 3821 777',
          email: 'lab.phan.tich.skhcn@danang.gov.vn', // Example - might not be real
          equipment: 'Máy quang phổ UV-Vis, Máy sắc ký lỏng hiệu năng cao (HPLC), Thiết bị phân tích kim loại nặng',
          description: 'Phòng thí nghiệm nhà nước thuộc Sở KH&CN Đà Nẵng, chuyên về phân tích hóa học, kiểm nghiệm chất lượng sản phẩm, và dịch vụ khoa học công nghệ.',
          establishedYear: 1998, // Example year before 2000
          researchFocus: 'Phân tích môi trường, Kiểm nghiệm thực phẩm, Dược phẩm, Hóa mỹ phẩm',
          images: ['/assets/gis/research/lab-phan-tich-skhcn.jpg']
      },
      {
          id: 9,
          name: 'Trung tâm Thí nghiệm và Thực nghiệm Xây dựng - Sở Xây dựng Đà Nẵng',
          type: 'center',
          address: '254 Phan Châu Trinh, Quận Hải Châu, Đà Nẵng',
          district: 'haiChau',
          field: 'xayDung',
          coordinates: [16.0490, 108.2280],
          director: 'KS. Lê Văn Mạnh', // Example director name
          phone: '0236 3823 999',
          email: 'labcenter.xd@danang.gov.vn', // Example - might not be real
          website: 'www.labxd-danang.vn', // Example - might not be real
          description: 'Trung tâm thí nghiệm và kiểm định chất lượng công trình xây dựng, thuộc Sở Xây dựng Đà Nẵng, đảm bảo chất lượng và an toàn công trình.',
          foundingYear: 2000, // Example year in 2000-2009 range
          staffCount: 60,
          images: ['/assets/gis/research/labcenter-xd-danang.jpg']
      },
      {
          id: 10,
          name: 'Phòng Thí nghiệm Nghiên cứu Điện tử Y Sinh - Đại học Bách Khoa Đà Nẵng',
          type: 'lab',
          address: 'Khu B, Đại học Bách Khoa Đà Nẵng, Đường Nguyễn Tất Thành, Quận Liên Chiểu, Đà Nẵng',
          district: 'lienChieu',
          field: 'yHoc', // Categorized under Y học, as it's medical applications of electronics
          coordinates: [16.0430, 108.2110],
          manager: 'TS. Hồ Văn A', // Example manager name
          phone: '0236 3842 555',
          email: 'biomedlab.et@dut.udn.vn', // Example - might not be real
          equipment: 'Máy điện não đồ (EEG), Máy điện tim (ECG), Thiết bị theo dõi bệnh nhân từ xa, Hệ thống phân tích điện sinh lý',
          description: 'Phòng thí nghiệm chuyên sâu về ứng dụng điện tử trong y sinh, phát triển thiết bị y tế điện tử, và các hệ thống chăm sóc sức khỏe thông minh.',
          establishedYear: 2017, // Example year in 2015-2019 range
          researchFocus: 'Thiết bị y tế điện tử, Xử lý tín hiệu y sinh, Telehealth, Biomedical Instrumentation',
          images: ['/assets/gis/research/biomedlab-dut.jpg']
      },
      {
          id: 11,
          name: 'Trung tâm Nghiên cứu Biển và Đảo - Viện Hàn lâm Khoa học và Công nghệ Việt Nam', // Example of a national level institution in Da Nang
          type: 'center',
          address: 'Đường Trường Sa, Quận Ngũ Hành Sơn, Đà Nẵng', // Example address - verify real address
          district: 'nguHanhSon',
          field: 'moiTruong', // Categorized as Môi trường due to marine focus
          coordinates: [15.9940, 108.2600],
          director: 'GS. TSKH. Trần Đức Viên', // Example director name - verify real director
          phone: '0236 3957 888', // Example phone number - verify real number
          email: 'vasi@vasi.vast.vn', // Example email - verify real email
          website: 'www.vasi.vast.vn', // Example website - verify real website
          description: 'Viện nghiên cứu quốc gia hàng đầu về khoa học biển và hải đảo, có trụ sở tại Đà Nẵng, nghiên cứu đa ngành về tài nguyên biển, môi trường biển, và biến đổi khí hậu.',
          foundingYear: 1990, // Example year before 2000
          staffCount: 180, // Example staff count
          images: ['/assets/gis/research/vasi-vast.jpg']
      }
  ];

  let currentMarkers = [];

  // --- Function to filter and display markers based on filter selections ---
  const filterAndDisplayMarkers = () => {
      const researchTypeFilter = document.getElementById('researchType').value;
      const districtFilter = document.getElementById('district').value;
      const fieldFilter = document.getElementById('field').value;
      const yearEstablishedFilter = document.getElementById('yearEstablished').value;
      const staffCountFilter = document.getElementById('staffCount').value;
      const searchTerm = document.getElementById('searchInput').value.toLowerCase();

      clearMarkers();

      const filters = {
          researchType: researchTypeFilter,
          district: districtFilter,
          field: fieldFilter,
          yearEstablished: yearEstablishedFilter,
          staffCount: staffCountFilter,
          searchTerm: searchTerm
      };

      filterResearchData(filters);
  };

  // --- Function to filter research data based on the provided filters object ---
  const filterResearchData = (filters) => {
      researchData.forEach(item => {
          if (shouldShowResearchItem(item, filters)) {
              addMarker(item);
          }
      });
  };

  // --- Function to determine if a research item should be displayed based on the filters ---
  const shouldShowResearchItem = (item, filters) => {
      const typeMatch = !filters.researchType || item.type === filters.researchType;
      const districtMatch = !filters.district || item.district === filters.district;
      const fieldMatch = !filters.field || item.field === filters.field;
      const yearMatch = !filters.yearEstablished || matchYearEstablished(item, filters.yearEstablished);
      const staffCountMatch = !filters.staffCount || matchStaffCount(item, filters.staffCount);
      const searchMatch = !filters.searchTerm ||
                          item.name.toLowerCase().includes(filters.searchTerm) ||
                          item.address.toLowerCase().includes(filters.searchTerm);

      return typeMatch && districtMatch && fieldMatch && yearMatch && staffCountMatch && searchMatch;
  };

  // --- Helper function to match year established filter ---
  const matchYearEstablished = (item, yearFilter) => {
      const year = item.foundingYear || item.establishedYear;
      if (!year) return false;

      if (yearFilter === '2020') return year >= 2020;
      if (yearFilter === '2015-2019') return year >= 2015 && year <= 2019;
      if (yearFilter === '2010-2014') return year >= 2010 && year <= 2014;
      if (yearFilter === '2000-2009') return year >= 2000 && year <= 2009;
      if (yearFilter === 'before-2000') return year < 2000;
      return true;
  };

  // --- Helper function to match staff count filter ---
  const matchStaffCount = (item, staffCountFilter) => {
      const count = item.staffCount;
      if (!count) return false;

      if (staffCountFilter === 'small') return count < 50;
      if (staffCountFilter === 'medium') return count >= 50 && count <= 150;
      if (staffCountFilter === 'large') return count > 150;
      return true;
  };

  // --- Function to add a marker for a research item to the map ---
  const addMarker = (item) => {
      let icon;
      let className = 'map-marker';
      if (item.type === 'center') {
          icon = centerIcon;
          className += ' center';
      } else if (item.type === 'lab') {
          icon = labIcon;
          className += ' lab';
      } else {
          return;
      }

      if (item.field) {
          className += ` ${item.field}`;
      }

      const popupContent = createPopupContent(item);
      const marker = L.marker(item.coordinates, {
          icon: L.divIcon({
              className: className,
              html: icon.options.html,
              iconSize: icon.options.iconSize,
              iconAnchor: icon.options.iconAnchor,
              popupAnchor: icon.options.popupAnchor
          })
      });

      marker.bindPopup(popupContent, {
          maxWidth: 350,
          className: 'research-popup'
      });

      marker.addTo(map);
      currentMarkers.push(marker);
  };

  // --- Function to create popup content for a research item ---
  const createPopupContent = (item) => {
    let content = `<div class="popup-content">`;
    content += `<div class="popup-header"><h3>${item.name}</h3></div>`;
    content += `<div class="popup-body">`;

    if (item.type === 'center') {
        content += `
            <div class="popup-info-group">
                <div class="popup-info-item"><label><i class="fas fa-university"></i> Loại hình:</label> <span>Trung tâm Nghiên cứu</span></div>
                <div class="popup-info-item"><label><i class="fas fa-tag"></i> Lĩnh vực:</label> <span>${getFieldTypeName(item.field)}</span></div>
                <div class="popup-info-item"><label><i class="fas fa-map-marker-alt"></i> Địa chỉ:</label> <span>${item.address}</span></div>
                <div class="popup-info-item"><label><i class="fas fa-user-tie"></i> Giám đốc:</label> <span>${item.director || 'Chưa rõ'}</span></div>
                <div class="popup-info-item"><label><i class="fas fa-phone-alt"></i> Điện thoại:</label> <span>${item.phone || 'Không có'}</span></div>
                <div class="popup-info-item"><label><i class="fas fa-envelope"></i> Email:</label> <span>${item.email || 'Không có'}</span></div>
                <div class="popup-info-item"><label><i class="fas fa-globe"></i> Website:</label> <span><a href="${item.website}" target="_blank" rel="noopener noreferrer">${item.website || 'Không có'}</a></span></div>
                <div class="popup-info-item"><label><i class="fas fa-calendar-alt"></i> Năm thành lập:</label> <span>${item.foundingYear || 'Không rõ'}</span></div>
                <div class="popup-info-item"><label><i class="fas fa-users"></i> Số nhân viên:</label> <span>${item.staffCount || 'Không rõ'}</span></div>
            </div>`;
    } else if (item.type === 'lab') {
        content += `
            <div class="popup-info-group">
                <div class="popup-info-item"><label><i class="fas fa-vial"></i> Loại hình:</label> <span>Phòng Thí nghiệm</span></div>
                <div class="popup-info-item"><label><i class="fas fa-tag"></i> Lĩnh vực:</label> <span>${getFieldTypeName(item.field)}</span></div>
                <div class="popup-info-item"><label><i class="fas fa-map-marker-alt"></i> Địa chỉ:</label> <span>${item.address}</span></div>
                <div class="popup-info-item"><label><i class="fas fa-user-cog"></i> Quản lý:</label> <span>${item.manager || 'Chưa rõ'}</span></div>
                <div class="popup-info-item"><label><i class="fas fa-phone-alt"></i> Điện thoại:</label> <span>${item.phone || 'Không có'}</span></div>
                <div class="popup-info-item"><label><i class="fas fa-envelope"></i> Email:</label> <span>${item.email || 'Không có'}</span></div>
                <div class="popup-info-item"><label><i class="fas fa-calendar-alt"></i> Năm thành lập:</label> <span>${item.establishedYear || 'Không rõ'}</span></div>
                <div class="popup-info-item"><label><i class="fas fa-microchip"></i> Thiết bị chính:</label> <span>${item.equipment || 'Không có thông tin'}</span></div>
                </div>`;
    }

    // --- Image Display Logic ---
    if (item.images && item.images.length > 0) {
        content += `<div style="margin-top: 10px; text-align: center;">
                      <img src="${item.images[0]}" alt="${item.name}" style="max-width:100%; max-height: 150px;">
                    </div>`;
    }

    content += `</div></div>`; // Close popup-body and popup-content divs
    return content; // Return the complete popup content HTML string
  };

  // --- Function to clear all markers and heatmap layer from the map ---
  const clearMarkers = () => {
      currentMarkers.forEach(marker => map.removeLayer(marker));
      currentMarkers = [];
      if (heatmapLayer) {
          map.removeLayer(heatmapLayer);
          heatmapLayer = null;
      }
  };

  // --- Function to get display name for field type code ---
  const getFieldTypeName = (fieldCode) => {
      const fieldNames = {
          cntt: 'Công nghệ Thông tin',
          sinhHoc: 'Sinh học',
          vatLieu: 'Vật liệu Mới',
          moiTruong: 'Môi trường',
          yHoc: 'Y học',
          coKhi: 'Cơ khí',
          hoaHoc: 'Hóa học',
          xayDung: 'Xây dựng',
          dienTu: 'Điện tử',
          khac: 'Khác'
      };
      return fieldNames[fieldCode] || 'Không xác định';
  };

  // --- Setup layer controls functionality (same as before) ---
  const setupLayerControls = () => {
      document.querySelectorAll('input[name="mapLayer"]').forEach(radio => {
          radio.addEventListener('change', function () {
              toggleMapLayer(this.value);
          });
      });
  };

  // --- Function to toggle map layers (same as before) ---
  const toggleMapLayer = (layerType) => {
      if (satelliteLayer) map.removeLayer(satelliteLayer);
      if (terrainLayer) map.removeLayer(terrainLayer);
      if (normalLayer) map.removeLayer(normalLayer);

      switch (layerType) {
          case 'satellite':
              satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                  attribution: '© Esri'
              }).addTo(map);
              break;
          case 'terrain':
              terrainLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
                  attribution: '© OpenTopoMap'
              }).addTo(map);
              break;
          case 'normal':
              normalLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                  attribution: '© OpenStreetMap contributors'
              }).addTo(map);
              break;
      }
  };

  // --- Function to toggle heatmap layer (same as before) ---
  const toggleHeatmap = () => {
      if (heatmapLayer) {
          map.removeLayer(heatmapLayer);
          heatmapLayer = null;
      } else {
          const heatData = currentMarkers.map(marker => [
              marker.getLatLng().lat,
              marker.getLatLng().lng,
              1
          ]);
          heatmapLayer = L.heatLayer(heatData, {
              radius: 25,
              blur: 15,
              gradient: { 0.4: 'blue', 0.6: 'lime', 0.8: 'yellow', 1.0: 'red' }
          }).addTo(map);
      }
  };

  // --- Function to export data as JSON (same as before) ---
  const exportData = () => {
      const blob = new Blob([JSON.stringify(researchData, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'research-map-data.json';
      a.click();
      window.URL.revokeObjectURL(url);
  };

  // --- Event listeners for filter changes ---
  document.getElementById('researchType').addEventListener('change', filterAndDisplayMarkers);
  document.getElementById('district').addEventListener('change', filterAndDisplayMarkers);
  document.getElementById('field').addEventListener('change', filterAndDisplayMarkers);
  document.getElementById('yearEstablished').addEventListener('change', filterAndDisplayMarkers);
  document.getElementById('staffCount').addEventListener('change', filterAndDisplayMarkers);
  document.getElementById('searchBtn').addEventListener('click', filterAndDisplayMarkers);
  document.getElementById('searchInput').addEventListener('keypress', function (e) {
      if (e.key === 'Enter') {
          filterAndDisplayMarkers();
      }
  });

  // --- Event listeners for map controls ---
  document.getElementById('toggleHeatmap').addEventListener('click', toggleHeatmap);
  document.getElementById('exportData').addEventListener('click', exportData);

  // --- Setup layer controls ---
  setupLayerControls();

  // --- Initial display of markers when the page loads ---
  filterAndDisplayMarkers(); // Call this function once on page load to display initial markers
});