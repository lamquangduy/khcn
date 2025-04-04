document.addEventListener('DOMContentLoaded', () => {
    // --- Initialize Leaflet map ---
    const map = L.map('map', {
        center: [16.047534, 108.220970],
        zoom: 12,
        minZoom: 11,
        maxZoom: 18
    });
    let normalLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.jpg', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    let satelliteLayer = null;
    let terrainLayer = null;
    let heatmapLayer = null;

    // --- Define custom icons ---
    const startupIcon = L.divIcon({
        className: 'map-marker startUp',
        html: '<i class="fas fa-rocket"></i>',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
    });

    const smallIcon = L.divIcon({
        className: 'map-marker small',
        html: '<i class="fas fa-store"></i>',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
    });

    const mediumIcon = L.divIcon({
        className: 'map-marker medium',
        html: '<i class="fas fa-building"></i>',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
    });

    const largeIcon = L.divIcon({
        className: 'map-marker large',
        html: '<i class="fas fa-city"></i>',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
    });

    // --- Sample Enterprise Data ---
    const enterpriseData = [
        {
            id: 1,
            name: 'FPT Software Đà Nẵng',
            type: 'large',
            address: 'Khu Công nghiệp An Đồn, Đà Nẵng',
            district: 'sonTra',
            field: 'CNTT',
            coordinates: [16.078043495912787, 108.23276872068777],
            ceo: 'Ông Trần Đức Anh',
            phone: '0236 3779999',
            email: 'fptdn@fpt.com.vn',
            website: 'www.fpt-software.com',
            products: 'Phần mềm quản lý, Ứng dụng di động',
            foundingYear: 1999,
            staffCount: 250,
            images: ['/assets/gis/enterprise/fpt.jpg']
        },
        {
            id: 2,
            name: 'DANAPHA Pharmaceutical JSC',
            type: 'medium',
            address: '253 Dũng Sĩ Thanh Khê, Đà Nẵng',
            district: 'thanhKhe',
            field: 'sinhHoc',
            coordinates: [16.07793855004983, 108.1694444518961],
            ceo: 'Bà Nguyễn Thị Lan',
            phone: '0236 3654321',
            email: 'danapha@danapha.com',
            website: 'www.danapha.com',
            products: 'Thuốc tân dược, Thực phẩm chức năng',
            foundingYear: 1992,
            staffCount: 120,
            images: ['/assets/gis/enterprise/danapha.jpg']
        },
        {
            id: 3,
            name: 'Hoa Phat Construction Steel Da Nang',
            type: 'medium',
            address: 'Lô 1, Khu CN Hòa Khánh, Đà Nẵng',
            district: 'lienChieu',
            field: 'vatLieu',
            coordinates: [16.083365309323668, 108.14577471090303],
            ceo: 'Ông Nguyễn Văn Hùng',
            phone: '0236 3897777',
            email: 'hoaphatdn@hpg.com.vn',
            website: 'www.hoaphat.com.vn',
            products: 'Thép xây dựng, Vật liệu hoàn thiện',
            foundingYear: 2001,
            staffCount: 180,
            images: ['/assets/gis/enterprise/hoaphat.jpg']
        },
        {
            id: 4,
            name: 'Da Nang Urban Environment JSC',
            type: 'large',
            address: '308 Hoàng Diệu, Hải Châu, Đà Nẵng',
            district: 'haiChau',
            field: 'moiTruong',
            coordinates: [16.058486947805104, 108.21658456538702],
            ceo: 'Ông Lê Quang Thắng',
            phone: '0236 3942888',
            email: 'mtudn@mtudn.vn',
            website: 'www.mtudn.vn',
            products: 'Thu gom rác thải, Xử lý nước thải',
            foundingYear: 1975,
            staffCount: 500,
            images: ['/assets/gis/enterprise/mtudn.jpg']
        },
        {
            id: 5,
            name: 'Da Nang Robot Technology Company Limited',
            type: 'startUp',
            address: '420 Đường 2 tháng 9, Hải Châu, Đà Nẵng',
            district: 'haiChau',
            field: 'coKhi',
            coordinates: [16.037287065381562, 108.22364689422255],
            ceo: 'Ông Phạm Văn Tuấn',
            phone: '0236 3912345',
            email: 'robotdn@gmail.com',
            website: 'www.robotdn.vn',
            products: 'Robot công nghiệp, Robot dịch vụ',
            foundingYear: 2021,
            staffCount: 20,
            images: ['/assets/gis/enterprise/robotdn.jpg']
        },
        {
            id: 6,
            name: 'Da Nang Medical Equipment JSC',
            type: 'small',
            address: 'Lô B1, Khu CN Dịch Vụ Thủy Sản Đà Nẵng, Sơn Trà, Đà Nẵng',
            district: 'sonTra',
            field: 'yHoc',
            coordinates: [16.07274700757873, 108.22164935137698],
            ceo: 'Bà Trần Thị Mai',
            phone: '0236 3811222',
            email: 'thietbiytdn@gmail.com',
            website: 'www.thietbiytdn.com',
            products: 'Thiết bị y tế, Vật tư tiêu hao',
            foundingYear: 2010,
            staffCount: 45,
            images: ['/assets/gis/enterprise/thietbiytdn.jpg']
        },
        {
            id: 7,
            name: 'Green Power Technology JSC',
            type: 'medium',
            address: '123 Nguyễn Nhàn, Cẩm Lệ, Đà Nẵng',
            district: 'camLe',
            field: 'nangLuong', // Assuming 'Năng lượng xanh' falls under 'Khác' or needs a new field
            coordinates: [16.010354249602308, 108.19382776538559],
            ceo: 'Ông Nguyễn Đình Thắng',
            phone: '0236 3699888',
            email: 'nangluongxanhdn@gmail.com',
            website: 'www.nangluongxanhdn.com',
            products: 'Điện mặt trời, Đèn LED',
            foundingYear: 2016,
            staffCount: 90,
            images: ['/assets/gis/enterprise/nangluongxanh.jpg']
        },
        {
            id: 8,
            name: 'Smart Technology Solutions Company Limited',
            type: 'startUp',
            address: '234 Điện Biên Phủ, Thanh Khê, Đà Nẵng',
            district: 'thanhKhe',
            field: 'CNTT',
            coordinates: [16.06608485131035, 108.19646876538727],
            ceo: 'Bà Nguyễn Thị Ánh',
            phone: '0236 3478899',
            email: 'gpcnttdn@gmail.com',
            website: 'www.gpcnttdn.com',
            products: 'Phần mềm IoT, Nhà thông minh',
            foundingYear: 2022,
            staffCount: 15,
            images: ['/assets/gis/enterprise/smarttech.jpg']
        },
        {
            id: 9,
            name: 'Machine and Industrial Equipment Manufacturing JSC',
            type: 'medium',
            address: 'Khu Công nghiệp Hòa Cầm, Đà Nẵng',
            district: 'camLe',
            field: 'coKhi',
            coordinates: [16.00860547862048, 108.18554536671995],
            ceo: 'Ông Trần Quang Vinh',
            phone: '0236 3888990',
            email: 'chetaomaydn@gmail.com',
            website: 'www.chetaomaydn.com',
            products: 'Máy công nghiệp, Thiết bị chế biến',
            foundingYear: 2008,
            staffCount: 110,
            images: ['/assets/gis/enterprise/chetaomay.jpg']
        },
        {
            id: 10,
            name: 'Da Nang Seafoods JSC',
            type: 'small',
            address: '123 Trần Cao Vân, Thanh Khê, Đà Nẵng',
            district: 'thanhKhe',
            field: 'sinhHoc', // Or 'Chế biến thực phẩm' if more specific field needed
            coordinates: [16.072487736184893, 108.20864863655122],
            ceo: 'Bà Lê Thị Hằng',
            phone: '0236 3578999',
            email: 'haisandanang@gmail.com',
            website: 'www.haisandanang.com',
            products: 'Hải sản tươi sống, Chế biến hải sản',
            foundingYear: 2014,
            staffCount: 35,
            images: ['/assets/gis/enterprise/haisan.jpg']
        },
        {
            id: 11,
            name: 'Bien Dong Research Corporation', // Hoàng Sa is in Bien Dong (East Sea/South China Sea)
            type: 'medium', // Adjust type if needed
            address: 'Hoang Sa Island, Da Nang', // Symbolic address
            district: 'hoangSa',
            field: 'moiTruong', // Broadly categorized as Môi trường (Marine Research)
            coordinates: [16.32426039513064, 111.77290628979264], // Approx. Hoàng Sa coordinates
            ceo: 'Ông Nguyễn Hoàng Long', // Example CEO name
            phone: '0236 3728888', // Example phone
            email: 'ncbiendong@hoangsa.com', // Example email
            website: 'www.ncbiendong.com', // Example website
            products: 'Marine environment research, Island resources', // Example products/services
            foundingYear: 2023, // Example recent year
            staffCount: 60,     // Example staff count
            images: ['/assets/gis/enterprise/biendong.jpg'] // Example image
        }
    ];

    let currentMarkers = [];

    // --- Function to filter and display markers ---
    const filterAndDisplayMarkers = () => {
        const enterpriseTypeFilter = document.getElementById('enterpriseType').value;
        const districtFilter = document.getElementById('district').value;
        const fieldFilter = document.getElementById('field').value;
        const yearEstablishedFilter = document.getElementById('yearEstablished').value;
        const staffCountFilter = document.getElementById('staffCount').value;
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();

        clearMarkers();

        const filters = {
            enterpriseType: enterpriseTypeFilter,
            district: districtFilter,
            field: fieldFilter,
            yearEstablished: yearEstablishedFilter,
            staffCount: staffCountFilter,
            searchTerm: searchTerm
        };

        filterEnterprises(filters);
    };

    // --- Function to filter enterprises based on criteria ---
    const filterEnterprises = (filters) => {
        enterpriseData.forEach(item => {
            if (shouldShowEnterprise(item, filters)) {
                addMarker(item);
            }
        });
    };

    // --- Function to determine if an enterprise should be displayed ---
    const shouldShowEnterprise = (item, filters) => {
        const typeMatch = !filters.enterpriseType || item.type === filters.enterpriseType;
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
        const year = item.foundingYear;
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


    // --- Function to add a marker to the map ---
    const addMarker = (item) => {
        let icon;
        let className = 'map-marker';

        if (item.type === 'startUp') {
            icon = startupIcon;
            className += ' startUp';
        } else if (item.type === 'small') {
            icon = smallIcon;
            className += ' small';
        } else if (item.type === 'medium') {
            icon = mediumIcon;
            className += ' medium';
        } else if (item.type === 'large') {
            icon = largeIcon;
            className += ' large';
        } else {
            return;
        }
        if (item.field) {
            className += ` ${item.field}`;
        }


        const popupContent = createPopupContent(item);
        const marker = L.marker(item.coordinates, { icon: L.divIcon({
                className: className,
                html: icon.options.html,
                iconSize: icon.options.iconSize,
                iconAnchor: icon.options.iconAnchor,
                popupAnchor: icon.options.popupAnchor
            }) });

        marker.bindPopup(popupContent, {
            maxWidth: 350,
            className: 'enterprise-popup'
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
                <div class="popup-info-item"><label><i class="fas fa-industry"></i> Loại hình:</label> <span>${getEnterpriseTypeName(item.type)}</span></div>
                <div class="popup-info-item"><label><i class="fas fa-tag"></i> Lĩnh vực:</label> <span>${getFieldTypeName(item.field)}</span></div>
                <div class="popup-info-item"><label><i class="fas fa-map-marker-alt"></i> Địa chỉ:</label> <span>${item.address}</span></div>
                <div class="popup-info-item"><label><i class="fas fa-user-tie"></i> CEO:</label> <span>${item.ceo || 'Không rõ'}</span></div>
                <div class="popup-info-item"><label><i class="fas fa-phone-alt"></i> Điện thoại:</label> <span>${item.phone || 'Không có'}</span></div>
                <div class="popup-info-item"><label><i class="fas fa-envelope"></i> Email:</label> <span>${item.email || 'Không có'}</span></div>
                <div class="popup-info-item"><label><i class="fas fa-globe"></i> Website:</label> <span><a href="${item.website}" target="_blank" rel="noopener noreferrer">${item.website || 'Không có'}</a></span></div>
                <div class="popup-info-item"><label><i class="fas fa-calendar-alt"></i> Năm thành lập:</label> <span>${item.foundingYear || 'Không rõ'}</span></div>
                <div class="popup-info-item"><label><i class="fas fa-users"></i> Số nhân viên:</label> <span>${item.staffCount || 'Không rõ'}</span></div>
            </div>
            <div class="popup-details"><p><strong>Sản phẩm:</strong> ${item.products || 'Không có thông tin.'}</p></div>
        `;

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

    // --- Function to get enterprise type name ---
    const getEnterpriseTypeName = (type) => {
        const typeNames = {
            startUp: 'StartUp',
            small: 'Doanh nghiệp nhỏ',
            medium: 'Doanh nghiệp vừa',
            large: 'Doanh nghiệp lớn'
        };
        return typeNames[type] || 'Không rõ';
    };


    // --- Function to get field type name ---
    const getFieldTypeName = (fieldCode) => {
        const fieldNames = {
            CNTT: 'Công nghệ Thông tin',
            sinhHoc: 'Sinh học',
            vatLieu: 'Vật liệu mới',
            moiTruong: 'Môi trường',
            coKhi: 'Cơ khí',
            hoaHoc: 'Hóa học',
            xayDung: 'Xây dựng',
            dienTu: 'Điện tử',
            yHoc: 'Y học',
            khac: 'Khác'
        };
        return fieldNames[fieldCode] || 'Không xác định';
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
        const blob = new Blob([JSON.stringify(enterpriseData, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'enterprise-map-data.json';
        a.click();
        window.URL.revokeObjectURL(url);
    };


    // --- Event listeners for filter changes ---
    document.getElementById('enterpriseType').addEventListener('change', filterAndDisplayMarkers);
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

    // --- Initial display ---
    filterAndDisplayMarkers();
});