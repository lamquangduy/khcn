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
    const industrialParkIcon = L.divIcon({
        className: 'map-marker industrialPark',
        html: '<i class="fas fa-industry"></i>',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
    });

    const hightechParkIcon = L.divIcon({
        className: 'map-marker hightechPark',
        html: '<i class="fas fa-rocket"></i>',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
    });

    const itParkIcon = L.divIcon({
        className: 'map-marker itPark',
        html: '<i class="fas fa-laptop-code"></i>',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
    });

    // --- Sample Zone Data ---
    const zoneData = [
        {
            id: 1,
            name: 'Khu Công Nghiệp Hòa Khánh',
            type: 'industrialPark',
            address: 'Phường Hòa Khánh Bắc, Quận Liên Chiểu, Đà Nẵng',
            district: 'lienChieu',
            coordinates: [16.08340654494022, 108.14577471090303],
            status: 'operating',
            area: '420 ha',
            investor: 'Ban Quản Lý Khu Công Nghệ Cao Đà Nẵng',
            website: 'www.danangipc.gov.vn',
            industries: 'Dệt may, Da giày, Cơ khí, Chế biến thực phẩm',
            images: ['/assets/gis/zone/hoakhanh.jpg']
        },
        {
            id: 2,
            name: 'Khu Công Nghệ Cao Đà Nẵng',
            type: 'hightechPark',
            address: 'Phường Hòa Liên, Huyện Hòa Vang, Đà Nẵng',
            district: 'hoaVang',
            coordinates: [16.07525257322133, 108.09697018655709],
            status: 'operating',
            area: '1129 ha',
            investor: 'Ban Quản Lý Khu Công Nghệ Cao Đà Nẵng',
            website: 'www.dhtp.gov.vn',
            industries: 'Công nghệ thông tin, Sinh học, Vật liệu mới, Điện tử',
            images: ['/assets/gis/zone/dhtp.jpg']
        },
         {
            id: 3,
           name: 'Khu Công Viên Phần Mềm Đà Nẵng',
            type: 'itPark',
            address: 'Phường Thuận Phước, Quận Hải Châu, Đà Nẵng',
            district: 'haiChau',
            coordinates: [16.092360949690853, 108.21843187178959],
            status: 'operating',
             area: '15.5 ha',
              investor: 'Công ty CP Phát triển Khu Công viên phần mềm Đà Nẵng',
             website: 'www.dsoft.com.vn',
            industries: 'Phần mềm, Dịch vụ công nghệ thông tin',
            images: ['/assets/gis/zone/dcvpm.jpg']
        },
         {
            id: 4,
            name: 'Khu Công Nghiệp Liên Chiểu',
            type: 'industrialPark',
            address: 'Phường Hòa Hiệp Bắc, Quận Liên Chiểu, Đà Nẵng',
             district: 'lienchieu',
             coordinates: [16.127661890296302, 108.11995595693837],
            status: 'operating',
            area: '280 ha',
            investor: 'Ban Quản Lý Các Khu Công Nghiệp Đà Nẵng',
             website: 'www.diza.gov.vn',
             industries: 'Dệt may, Cơ khí, Vật liệu xây dựng',
             images: ['/assets/gis/zone/lienchieu.jpg']
        },
         {
           id: 5,
            name: 'Khu Công Nghiệp Dịch Vụ Thủy Sản Đà Nẵng',
           type: 'industrialPark',
            address: 'Phường Hải Châu 1, Quận Hải Châu, Đà Nẵng',
            district: 'sonTra',
            coordinates: [16.07287072101062, 108.22157424952375],
             status: 'operating',
            area: '50 ha',
            investor: 'Công ty Phát Triển Hạ Tầng KCN Đà Nẵng',
            website: 'www.idcdanang.com.vn',
             industries: 'Chế biến thủy sản, Dịch vụ hậu cần',
             images: ['/assets/gis/zone/thuysan.jpg']
        },
       {
            id: 6,
            name: 'Khu Công Nghệ Cao Hòa Liên',
            type: 'hightechPark',
            address: 'Xã Hòa Liên, Huyện Hòa Vang, Đà Nẵng',
            district: 'hoaVang',
             coordinates: [16.085450939007057, 108.08739007960428],
            status: 'planning',
            area: '297 ha',
             investor: 'Ban Quản Lý Khu Công Nghệ Cao Đà Nẵng',
              website: 'www.dhtp.gov.vn',
               industries: 'Nghiên cứu và Phát triển, Sản xuất công nghệ cao',
               images: ['/assets/gis/zone/hoalien.jpg']
        },
        {
           id: 7,
           name: 'Khu Công Viên Phần Mềm Số 2',
            type: 'itPark',
           address: 'Phường Thuận Phước, Quận Hải Châu, Đà Nẵng',
             district: 'sontra',
            coordinates: [16.092196014607573, 108.21941892471767],
            status: 'planning',
             area: '21 ha',
             investor: 'Công ty CP Phát triển Khu Công viên phần mềm Đà Nẵng',
            website: 'www.dsoft.com.vn',
            industries: 'Phần mềm, Trung tâm dữ liệu',
            images: ['/assets/gis/zone/cvpm2.jpg']
         },
        {
          id: 8,
            name: 'Khu Công Nghiệp Đà Nẵng',
            type: 'industrialPark',
            address: 'Phường An Hải Bắc, Quận Sơn Trà, Đà Nẵng',
             district: 'lienchieu',
            coordinates: [16.078495977033647, 108.23836992439428],
             status: 'planning',
            area: '150 ha',
            investor: 'Ban Quản Lý Các Khu Công Nghiệp Đà Nẵng',
            website: 'www.diza.gov.vn',
            industries: 'Cơ khí, Điện tử',
            images: ['/assets/gis/zone/kcn-danang.jpg']
         },
           {
            id: 9,
            name: 'Khu Kinh tế Hoàng Sa',
            type: 'industrialPark', // Adjusted type for legend and filtering
            address: 'Đảo Hoàng Sa',
            district: 'hoangsa',
            coordinates: [16.32426039513064, 111.77290628979264],
            status: 'planning',
            area: '1000 ha',
           investor: 'UBND Thành phố Đà Nẵng',
            website: 'www.hoangsa.gov.vn', // Mock website
             industries: 'Nghiên cứu biển, Năng lượng tái tạo, Logistics', // Mock industries
             images: ['/assets/gis/zone/hoangsa.jpg'] // Mock image
         }
    ];

    let currentMarkers = [];

    // --- Function to filter and display markers ---
    const filterAndDisplayMarkers = () => {
        const zoneTypeFilter = document.getElementById('zoneType').value;
        const districtFilter = document.getElementById('district').value;
        const statusFilter = document.getElementById('status').value;
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();

        clearMarkers();

        const filters = {
            zoneType: zoneTypeFilter,
            district: districtFilter,
            status: statusFilter,
            searchTerm: searchTerm
        };

        filterZoneData(filters);
    };

    // --- Function to filter zone data ---
    const filterZoneData = (filters) => {
        zoneData.forEach(item => {
            if (shouldShowZone(item, filters)) {
                addMarker(item);
            }
        });
    };

    // --- Function to determine if a zone should be shown ---
    const shouldShowZone = (item, filters) => {
        const typeMatch = !filters.zoneType || item.type === filters.zoneType;
        const districtMatch = !filters.district || item.district === filters.district;
        const statusMatch = !filters.status || item.status === filters.status;
        const searchMatch = !filters.searchTerm ||
                            item.name.toLowerCase().includes(filters.searchTerm) ||
                            item.address.toLowerCase().includes(filters.searchTerm);

        return typeMatch && districtMatch && statusMatch && searchMatch;
    };


    // --- Function to add marker to the map ---
    const addMarker = (item) => {
        let icon;
        let className = 'map-marker';

        if (item.type === 'industrialPark') {
            icon = industrialParkIcon;
            className += ' industrialPark';
        } else if (item.type === 'hightechPark') {
            icon = hightechParkIcon;
            className += ' hightechPark';
        } else if (item.type === 'itPark') {
            icon = itParkIcon;
            className += ' itPark';
        } else {
            return;
        }
         if (item.status) {
            className += ` ${item.status}`;
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
            className: 'zone-popup'
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
                <div class="popup-info-item"><label><i class="fas fa-industry"></i> Loại hình:</label> <span>${getZoneTypeName(item.type)}</span></div>
                <div class="popup-info-item"><label><i class="fas fa-chart-line"></i> Trạng thái:</label> <span>${getZoneStatusName(item.status)}</span></div>
                <div class="popup-info-item"><label><i class="fas fa-map-marker-alt"></i> Địa chỉ:</label> <span>${item.address}</span></div>
                <div class="popup-info-item"><label><i class="fas fa-ruler-combined"></i> Diện tích:</label> <span>${item.area || 'Không rõ'}</span></div>
                <div class="popup-info-item"><label><i class="fas fa-user-tie"></i> Chủ đầu tư:</label> <span>${item.investor || 'Không rõ'}</span></div>
                <div class="popup-info-item"><label><i class="fas fa-globe"></i> Website:</label> <span><a href="${item.website}" target="_blank" rel="noopener noreferrer">${item.website || 'Không có'}</a></span></div>
                <div class="popup-info-item"><label><i class="fas fa-warehouse"></i> Ngành nghề:</label> <span>${item.industries || 'Không có thông tin'}</span></div>
            </div>`;

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

    // --- Function to get zone type name ---
    const getZoneTypeName = (type) => {
        const typeNames = {
            industrialPark: 'Khu Công nghiệp',
            hightechPark: 'Khu Công nghệ cao',
            itPark: 'Khu Công viên phần mềm'
        };
        return typeNames[type] || 'Không rõ';
    };

    // --- Function to get zone status name ---
    const getZoneStatusName = (status) => {
        const statusNames = {
            operating: 'Đang hoạt động',
            planning: 'Đang quy hoạch'
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
        const blob = new Blob([JSON.stringify(zoneData, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'zone-map-data.json';
        a.click();
        window.URL.revokeObjectURL(url);
    };


    // --- Event listeners for filter changes ---
    document.getElementById('zoneType').addEventListener('change', filterAndDisplayMarkers);
    document.getElementById('district').addEventListener('change', filterAndDisplayMarkers);
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