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

    // --- Define custom icons ---
    const postOfficeIcon = L.divIcon({
        className: 'map-marker buucuc',
        html: '<i class="fas fa-mail-bulk"></i>',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
    });

    const servicePointIcon = L.divIcon({
        className: 'map-marker diem',
        html: '<i class="fas fa-map-marker-alt"></i>',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
    });

    const mailboxIcon = L.divIcon({
        className: 'map-marker hopthu',
        html: '<i class="fas fa-envelope-open"></i>',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
    });


    // --- Sample Postal Data with REAL-LOOKING NAMES ---
    const postalData = [
        {
            id: 1,
            name: 'Bưu cục Hải Châu Trung Tâm',
            type: 'buucuc',
            address: '155 Nguyễn Văn Linh, Hải Châu, Đà Nẵng',
            district: 'haiChau',
            coordinates: [16.0615, 108.2210],
            openingHours: '7:00 - 19:00',
            services: 'Chuyển phát nhanh, Bưu phẩm đảm bảo, Thu hộ tiền',
            status: 'active',
            manager: 'Trần Thị Thu Thảo',
            phone: '0236 3823 456',
            images: ['/assets/gis/postal/buucuc.jpg']
        },
        {
            id: 2,
            name: 'Điểm phục vụ Bưu điện Văn hóa Xã Thanh Khê Đông',
            type: 'diem',
            address: '52 Nguyễn Biểu, Thanh Khê, Đà Nẵng',
            district: 'thanhKhe',
            coordinates: [16.0698, 108.1955],
             openingHours: '7:00 - 17:00',
             services: 'Phát hành báo chí, Nhận gửi thư thường',
             status: 'active',
            staff: 'Lê Hoàng Nam',
            phone: '0236 3757 890',
            images: ['/assets/gis/postal/diemphucvu.jpg']
        },
         {
                id: 3,
                name: 'Hộp thư công cộng Đường Bạch Đằng',
                type: 'hopthu',
                address: 'Vỉa hè đường Bạch Đằng, đoạn gần cầu Rồng, Sơn Trà, Đà Nẵng',
                district: 'sonTra',
                coordinates: [16.0449, 108.2278],
                installationDate: '2023-01-20',
                collectionTimes: '08:00 và 17:00 hàng ngày',
                status: 'active',
                material: 'Hợp kim sơn tĩnh điện',
                images: ['/assets/gis/postal/hopthu.jpg']
            },
        {
            id: 4,
            name: 'Bưu cục Ngũ Hành Sơn Trung Tâm',
            type: 'buucuc',
            address: '88 Lê Văn Hưu, Ngũ Hành Sơn, Đà Nẵng',
            district: 'nguHanhSon',
            coordinates: [16.0023, 108.2475],
              openingHours: '7:00 - 19:00',
              services: 'Dịch vụ EMS, Western Union, Thanh toán hóa đơn',
              status: 'active',
              manager: 'Võ Thị Ánh Nguyệt',
              phone: '0236 3959 222',
              images: ['/assets/gis/postal/buucuc1.jpg']
        },
        {
            id: 5,
            name: 'Điểm phục vụ Bưu điện Hòa Khánh Bắc',
            type: 'diem',
            address: 'Khu dân cư Phước Lý, Hòa Khánh Bắc, Liên Chiểu, Đà Nẵng',
            district: 'lienChieu',
            coordinates: [16.0905, 108.1432],
            openingHours: '7:30 - 17:30',
            services: 'Bán tem, Nhận gửi thư thường, Phát báo',
            status: 'active',
            staff: 'Đặng Minh Tuấn',
            phone: '0236 3845 678',
            images: ['/assets/gis/postal/diemphucvu1.jpg']
        },
        {
            id: 6,
            name: 'Hộp thư công cộng Chợ Cẩm Lệ',
            type: 'hopthu',
            address: 'Trước cổng chính Chợ Cẩm Lệ, Cẩm Lệ, Đà Nẵng',
            district: 'camLe',
            coordinates: [16.0210, 108.2012],
             installationDate: '2023-03-15',
            collectionTimes: '09:00 và 16:00 hàng ngày',
            status: 'active',
            material: 'Composite',
            images: ['/assets/gis/postal/hopthu1.jpg']
        },
        {
          id: 7,
            name: 'Bưu cục Hòa Vang Trung Tâm',
            type: 'buucuc',
            address: 'Quốc lộ 1A, Thôn Phú Hòa, Hòa Vang, Đà Nẵng',
            district: 'hoavang',
            coordinates: [15.9792, 108.1015],
            openingHours: '7:00 - 18:00',
            services: 'Dịch vụ tiết kiệm bưu điện, Chuyển tiền nhanh',
            status: 'inactive',
            manager: 'Huỳnh Thị Kim Chi',
            phone: '0236 3686 111',
            images: ['/assets/gis/postal/buucuc2.jpg']
        },
        {
            id: 8,
            name: 'Điểm phục vụ Bưu điện Thạc Gián',
            type: 'diem',
            address: '108 Hoàng Hoa Thám, Thạc Gián, Thanh Khê, Đà Nẵng',
            district: 'thanhKhe',
            coordinates: [16.0652, 108.2119],
             openingHours: '8:00 - 16:30',
             services: 'Phát bưu phẩm, Bán báo, Văn phòng phẩm',
             status: 'inactive',
            staff: 'Ngô Đức Bình',
            phone: '0236 3515 222',
            images: ['/assets/gis/postal/diemphucvu2.jpg']
        },
        {
          id: 9,
           name: 'Hộp thư công cộng Công viên Biển Đông',
           type: 'hopthu',
           address: 'Khu vực Công viên Biển Đông, Võ Nguyên Giáp, Sơn Trà, Đà Nẵng',
           district: 'sontra',
           coordinates: [16.0595, 108.2405],
          installationDate: '2023-06-01',
          collectionTimes: '09:30 và 17:30 hàng ngày',
          status: 'inactive',
          material: 'Gỗ', // Example of different material
          images: ['/assets/gis/postal/hopthu2.jpg']
        },
        {
            id: 10,
            name: 'Bưu cục Sơn Trà An Hải Đông',
            type: 'buucuc',
            address: '25 Nguyễn Phan Vinh, An Hải Đông, Sơn Trà, Đà Nẵng',
            district: 'sonTra',
            coordinates: [16.0731, 108.2365],
             openingHours: '7:00 - 19:30',
            services: 'Dịch vụ Logistics, Phát hàng thu tiền hộ (COD)',
            status: 'inactive',
            manager: 'Lâm Ngọc Mai',
            phone: '0236 3929 777',
            images: ['/assets/gis/postal/buucuc3.jpg']
        },
         {
            id: 11,
            name: 'Điểm phục vụ Bưu điện Non Nước',
            type: 'diem',
             address: 'Làng đá mỹ nghệ Non Nước, Ngũ Hành Sơn, Đà Nẵng',
            district: 'nguHanhSon',
            coordinates: [15.9812, 108.2525],
            openingHours: '7:30 - 17:00',
            services: 'Nhận bưu phẩm, Bán tem lưu niệm',
            status: 'inactive',
            staff: 'Cao Văn Vũ',
            phone: '0236 3838 444',
            images: ['/assets/gis/postal/diemphucvu3.jpg']
        },
        {
            id: 12,
            name: 'Hộp thư công cộng Khu Công nghiệp Liên Chiểu',
            type: 'hopthu',
            address: 'Cổng Khu Công nghiệp Liên Chiểu, Liên Chiểu, Đà Nẵng',
            district: 'lienchieu',
            coordinates: [16.1289, 108.1210],
             installationDate: '2023-09-01',
              collectionTimes: '10:30 và 15:30 hàng ngày',
              status: 'active',
            material: 'Kim loại', // Another material example
            images: ['/assets/gis/postal/hopthu3.jpg']
        },
        {
            id: 13,
            name: 'Bưu cục Cẩm Lệ Hòa Xuân',
            type: 'buucuc',
            address: 'Khu đô thị sinh thái Hòa Xuân, Cẩm Lệ, Đà Nẵng',
            district: 'camLe',
            coordinates: [16.0188, 108.2105],
            openingHours: '8:00 - 18:30',
            services: 'Dịch vụ tài chính bưu chính, Đại lý bảo hiểm',
            status: 'inactive',
            manager: 'Đinh Thị Phương Thảo',
            phone: '0236 3797 555',
            images: ['/assets/gis/postal/buucuc4.jpg']
        },
        {
            id: 14,
            name: 'Điểm phục vụ Bưu điện Hòa Phong',
            type: 'diem',
             address: 'Chợ Túy Loan, Xã Hòa Phong, Hòa Vang, Đà Nẵng',
            district: 'hoavang',
            coordinates: [15.9582, 108.0889],
            openingHours: '7:00 - 16:00',
            services: 'Nhận phát hàng hóa nông sản',
            status: 'inactive',
            staff: 'Vương Đình Nam',
            phone: '0236 3858 666',
            images: ['/assets/gis/postal/diemphucvu4.jpg']
        },
        {
            id: 15,
            name: 'Hộp thư công cộng Trường Sa Lớn',
            type: 'hopthu',
            address: 'Trung tâm Đảo Trường Sa Lớn, huyện Trường Sa, Khánh Hòa', // Still technically Hoàng Sa District in the map
            district: 'truongsa', // Keep district as truongSa for filtering
            coordinates: [10.383333, 114.316667],
             installationDate: '2021-11-11',
            collectionTimes: '12:00 hàng ngày (trừ CN)',
            status: 'active',
            material: 'Thép không gỉ', // Another material example
            images: ['/assets/gis/postal/hopthu4.jpg']
        }
    ];

    let currentMarkers = [];

    // --- Function to filter and display markers ---
    const filterAndDisplayMarkers = () => {
        const districtFilter = document.getElementById('district').value;
        const postofficeTypeFilter = document.getElementById('postofficeType').value;
        const statusFilter = document.getElementById('status').value;
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();


        clearMarkers();

        const filters = {
            district: districtFilter,
            postofficeType: postofficeTypeFilter,
            status: statusFilter,
            searchTerm: searchTerm
        };

        filterPostalData(filters);
    };

    // --- Function to filter postal data ---
    const filterPostalData = (filters) => {
        postalData.forEach(item => {
            if (shouldShowPostal(item, filters)) {
                addMarker(item);
            }
        });
    };

    // --- Function to determine if a postal item should be shown ---
    const shouldShowPostal = (item, filters) => {
        const districtMatch = !filters.district || item.district === filters.district;
        const typeMatch = !filters.postofficeType || item.type === filters.postofficeType;
        const statusMatch = !filters.status || (filters.status === '' || item.status === filters.status); // Status filter applies only to hopthu
        const searchMatch = !filters.searchTerm ||
                            item.name.toLowerCase().includes(filters.searchTerm) ||
                            item.address.toLowerCase().includes(filters.searchTerm);

        return typeMatch && districtMatch && statusMatch && searchMatch;
    };


    // --- Function to add a marker to the map ---
    const addMarker = (item) => {
        let icon;
        let className = 'map-marker';

        if (item.type === 'buucuc') {
            icon = postOfficeIcon;
            className += ' buucuc';
            className += ` ${item.status}`;
        } else if (item.type === 'diem') {
            icon = servicePointIcon;
            className += ' diem';
            className += ` ${item.status}`;
        } else if (item.type === 'hopthu') {
            icon = mailboxIcon;
            className += ' hopthu';
            className += ` ${item.status}`;
        } else {
            return;
        }

        // if (item.status && item.type === 'hopthu') { // Only apply status style to hopthu
        //      className += ` ${item.status}`;
        // }


        const popupContent = createPopupContent(item);
        const marker = L.marker(item.coordinates, { icon:  L.divIcon({
                className: className,
                html: icon.options.html,
                iconSize: icon.options.iconSize,
                iconAnchor: icon.options.iconAnchor,
                popupAnchor: icon.options.popupAnchor
            }) });

        marker.bindPopup(popupContent, {
            maxWidth: 350,
            className: 'postal-popup'
        });

        marker.addTo(map);
        currentMarkers.push(marker);
    };

    // --- Function to create popup content ---
    const createPopupContent = (item) => {
        let content = `<div class="popup-content">`;
        content += `<div class="popup-header"><h3>${item.name}</h3></div>`;
        content += `<div class="popup-body">`;

        content += `
            <div class="popup-info-group">
                <div class="popup-info-item"><label><i class="fas fa-mail-bulk"></i> Loại hình:</label> <span>${getPostalTypeName(item.type)}</span></div>
                <div class="popup-info-item"><label><i class="fas fa-map-marker-alt"></i> Địa chỉ:</label> <span>${item.address}</span></div>`;

        if (item.type === 'buucuc') {
            content += `
                <div class="popup-info-item"><label><i class="far fa-clock"></i> Giờ mở cửa:</label> <span>${item.openingHours || 'Không rõ'}</span></div>
                <div class="popup-info-item"><label><i class="fas fa-list-alt"></i> Dịch vụ:</label> <span>${item.services || 'Không rõ'}</span></div>
                <div class="popup-info-item"><label><i class="fas fa-user"></i> Quản lý:</label> <span>${item.manager || 'Không rõ'}</span></div>
                <div class="popup-info-item"><label><i class="fas fa-phone-alt"></i> Điện thoại:</label> <span>${item.phone || 'Không có'}</span></div>
            `;
        } else if (item.type === 'diem') {
            content += `
                <div class="popup-info-item"><label><i class="far fa-clock"></i> Giờ mở cửa:</label> <span>${item.openingHours || 'Không rõ'}</span></div>
                <div class="popup-info-item"><label><i class="fas fa-list-alt"></i> Dịch vụ:</label> <span>${item.services || 'Không rõ'}</span></div>
                <div class="popup-info-item"><label><i class="fas fa-user"></i> Nhân viên:</label> <span>${item.staff || 'Không rõ'}</span></div>
                <div class="popup-info-item"><label><i class="fas fa-phone-alt"></i> Điện thoại:</label> <span>${item.phone || 'Không có'}</span></div>
           `;
        } else if (item.type === 'hopthu') {
            content += `
                <div class="popup-info-item"><label><i class="fas fa-calendar-alt"></i> Ngày lắp đặt:</label> <span>${item.installationDate || 'Không rõ'}</span></div>
                <div class="popup-info-item"><label><i class="fas fa-clock"></i> Thời gian thu gom:</label> <span>${item.collectionTimes || 'Không rõ'}</span></div>
                <div class="popup-info-item"><label><i class="fas fa-info-circle"></i> Trạng thái:</label> <span>${getPostalStatusName(item.status)}</span></div>
                <div class="popup-info-item"><label><i class="fas fa-box-open"></i> Vật liệu:</label> <span>${item.material || 'Không rõ'}</span></div>
            `;
        }
         if (item.images && item.images.length > 0) {
            content += `<div style="margin-top: 10px; text-align: center;">
                           <img src="${item.images[0]}" alt="${item.name}" style="max-width:100%; max-height: 150px;">
                        </div>`;
        }


        content += `</div></div>`;
        return content;
    };

    // --- Function to clear markers ---
    const clearMarkers = () => {
        currentMarkers.forEach(marker => map.removeLayer(marker));
        currentMarkers = [];
        if (heatmapLayer) {
            map.removeLayer(heatmapLayer);
            heatmapLayer = null;
        }
    };

    // --- Function to get postal type name ---
    const getPostalTypeName = (type) => {
        const typeNames = {
            buucuc: 'Bưu cục',
            diem: 'Điểm phục vụ',
            hopthu: 'Hộp thư công cộng'
        };
        return typeNames[type] || 'Không rõ';
    };

    // --- Function to get postal status name (for hopthu) ---
    const getPostalStatusName = (status) => {
        const statusNames = {
            active: 'Hoạt động',
            inactive: 'Không hoạt động'
        };
        return statusNames[status] || 'Không rõ';
    };

    // --- Setup layer controls ---
    const setupLayerControls = () => {
        document.querySelectorAll('input[name="mapLayer"]').forEach(radio => {
            radio.addEventListener('change', function () {
                toggleMapLayer(this.value);
            });
        });
    };

    // --- Function to toggle map layers ---
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

    // --- Function to toggle heatmap ---
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

    // --- Function to export data ---
    const exportData = () => {
        const blob = new Blob([JSON.stringify(postalData, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'postal-map-data.json';
        a.click();
        window.URL.revokeObjectURL(url);
    };


    // --- Event listeners for filter changes ---
    document.getElementById('district').addEventListener('change', filterAndDisplayMarkers);
    document.getElementById('postofficeType').addEventListener('change', filterAndDisplayMarkers);
    document.getElementById('status').addEventListener('change', filterAndDisplayMarkers);
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

    // --- Initial display ---
    filterAndDisplayMarkers();
});