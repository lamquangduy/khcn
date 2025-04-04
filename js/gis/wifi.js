let currentMarkers = []; // Declare currentMarkers in global scope

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
    const wifiIcon = L.divIcon({
        className: 'map-marker wifi-default',
        html: '<i class="fas fa-wifi"></i>',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
    });

    const wifiIconViettel = L.divIcon({
        className: 'map-marker viettel',
        html: '<i class="fas fa-wifi"></i>',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
    });

    const wifiIconVNPT = L.divIcon({
        className: 'map-marker vnpt',
        html: '<i class="fas fa-wifi"></i>',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
    });

    const wifiIconFPT = L.divIcon({
        className: 'map-marker fpt',
        html: '<i class="fas fa-wifi"></i>',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
    });

    const wifiIconMobifone = L.divIcon({
        className: 'map-marker mobifone',
        html: '<i class="fas fa-wifi"></i>',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
    });


    // --- Sample Wifi Data ---
    const wifiData = [
        {
            id: 1,
            name: 'Wifi công cộng Viettel Công viên Biển Đông',
            provider: 'viettel',
            address: 'Công viên Biển Đông, Sơn Trà',
            district: 'sonTra',
            coordinates: [16.070533785709625, 108.24667364344519],
            ssid: 'Viettel_Free_Wifi',
            bandwidth: '100Mbps',
            accessType: 'Open',
            devices: '50',
            coverage: '30m',
            images: ['/assets/gis/wifi/wifi-viettel.jpg'] // Thêm ảnh vào đây
        },
        {
            id: 2,
            name: 'Wifi công cộng VNPT Sân bay Đà Nẵng',
            provider: 'vnpt',
            address: 'Sân bay Quốc tế Đà Nẵng, Hải Châu',
            district: 'haiChau',
            coordinates: [16.050818, 108.219034],
            ssid: 'VNPT_Airport_Free',
            bandwidth: '150Mbps',
            accessType: 'Portal',
            devices: '100',
            coverage: '50m',
            images: ['/assets/gis/wifi/wifi-vnpt.jpg'] // Thêm ảnh vào đây
        },
        {
            id: 3,
            name: 'Wifi công cộng FPT Cầu Rồng',
            provider: 'fpt',
            address: 'Cầu Rồng, Hải Châu',
            district: 'haiChau',
            coordinates: [16.062187, 108.226477],
            ssid: 'FPT_CauRong_Wifi',
            bandwidth: '80Mbps',
            accessType: 'Open',
            devices: '40',
            coverage: '25m',
            images: ['/assets/gis/wifi/wifi-fpt.jpg'] // Thêm ảnh vào đây
        },
        {
            id: 4,
            name: 'Wifi công cộng Mobifone Bãi biển Mỹ Khê',
            provider: 'mobifone',
            address: 'Bãi biển Mỹ Khê, Sơn Trà',
            district: 'sonTra',
            coordinates: [16.04864843575869, 108.25308953321941],
            ssid: 'Mobifone_MyKhe_Free',
            bandwidth: '120Mbps',
            accessType: 'Portal',
            devices: '80',
            coverage: '40m',
            images: ['/assets/gis/wifi/wifi-mobifone.jpg'] // Thêm ảnh vào đây
        },
        {
            id: 5,
            name: 'Wifi công cộng Viettel Chợ Hàn',
            provider: 'viettel',
            address: 'Chợ Hàn, Hải Châu',
            district: 'haiChau',
            coordinates: [16.070800, 108.224071],
            ssid: 'Viettel_ChoHan_Free',
            bandwidth: '90Mbps',
            accessType: 'Open',
            devices: '60',
            coverage: '35m',
            images: ['/assets/gis/wifi/wifi-viettel1.jpg'] // Thêm ảnh vào đây
        },
        {
            id: 6,
            name: 'Wifi công cộng VNPT Vincom',
            provider: 'vnpt',
            address: 'Vincom Plaza, Ngũ Hành Sơn',
            district: 'nguHanhSon',
            coordinates: [16.012082, 108.257362],
            ssid: 'VNPT_Vincom_Free',
            bandwidth: '130Mbps',
            accessType: 'Portal',
            devices: '120',
            coverage: '60m',
            images: ['/assets/gis/wifi/wifi-vnpt1.jpg'] // Thêm ảnh vào đây
        },
        {
            id: 7,
            name: 'Wifi công cộng FPT Ga Đà Nẵng',
            provider: 'fpt',
            address: 'Ga Đà Nẵng, Thanh Khê',
            district: 'thanhKhe',
            coordinates: [16.069920, 108.193902],
            ssid: 'FPT_GaDaNang_Wifi',
            bandwidth: '70Mbps',
            accessType: 'Open',
            devices: '35',
            coverage: '20m',
            images: ['/assets/gis/wifi/wifi-fpt1.jpg'] // Thêm ảnh vào đây
        },
        {
            id: 8,
            name: 'Wifi công cộng Mobifone Khu công nghiệp Hòa Khánh',
            provider: 'mobifone',
            address: 'Khu công nghiệp Hòa Khánh, Liên Chiểu',
            district: 'lienChieu',
            coordinates: [16.08343747164703, 108.14565669370509],
            ssid: 'Mobifone_KCN_Free',
            bandwidth: '110Mbps',
            accessType: 'Portal',
            devices: '90',
            coverage: '45m',
            images: ['/assets/gis/wifi/wifi-mobifone1.jpg'] // Thêm ảnh vào đây
        },
        {
            id: 9,
            name: 'Wifi công cộng Viettel Công viên 29/3',
            provider: 'viettel',
            address: 'Công viên 29/3, Thanh Khê',
            district: 'thanhKhe',
            coordinates: [16.068775, 108.193808],
            ssid: 'Viettel_29_3_Free',
            bandwidth: '100Mbps',
            accessType: 'Open',
            devices: '70',
            coverage: '35m',
            images: ['/assets/gis/wifi/wifi-viettel2.jpg'] // Thêm ảnh vào đây
        },
        {
            id: 10,
            name: 'Wifi công cộng VNPT Bệnh viện Đà Nẵng',
            provider: 'vnpt',
            address: 'Bệnh viện Đà Nẵng, Hải Châu',
            district: 'haiChau',
            coordinates: [16.070681, 108.218523],
            ssid: 'VNPT_Hospital_Free',
            bandwidth: '140Mbps',
            accessType: 'Portal',
            devices: '110',
            coverage: '55m',
            images: ['/assets/gis/wifi/wifi-vnpt2.jpg'] // Thêm ảnh vào đây
        },
        {
            id: 11,
            name: 'Wifi công cộng FPT Bảo tàng Đà Nẵng',
            provider: 'fpt',
            address: 'Bảo tàng Đà Nẵng, Hải Châu',
            district: 'haiChau',
            coordinates: [16.070527, 108.221422],
            ssid: 'FPT_Museum_Wifi',
            bandwidth: '75Mbps',
            accessType: 'Open',
            devices: '30',
            coverage: '20m',
            images: ['/assets/gis/wifi/wifi-fpt2.jpg'] // Thêm ảnh vào đây
        },
        {
            id: 12,
            name: 'Wifi công cộng Mobifone Cầu Thuận Phước',
            provider: 'mobifone',
            address: 'Cầu Thuận Phước, Hải Châu',
            district: 'haiChau',
            coordinates: [16.082123, 108.231290],
            ssid: 'Mobifone_CauThuanPhuoc_Free',
            bandwidth: '120Mbps',
            accessType: 'Portal',
            devices: '85',
            coverage: '40m',
            images: ['/assets/gis/wifi/wifi-mobifone2.jpg'] // Thêm ảnh vào đây
        },
        {
            id: 13,
            name: 'Wifi công cộng Viettel  Trung tâm Hành chính',
            provider: 'viettel',
            address: 'Trung tâm hành chính, Hải Châu',
            district: 'haiChau',
            coordinates: [16.064080, 108.223679],
            ssid: 'Viettel_Admin_Free',
            bandwidth: '95Mbps',
            accessType: 'Open',
            devices: '65',
            coverage: '30m',
            images: ['/assets/gis/wifi/wifi-viettel3.jpg'] // Thêm ảnh vào đây
        },
        {
            id: 14,
            name: 'Wifi công cộng VNPT Bến xe trung tâm',
            provider: 'vnpt',
            address: 'Bến xe trung tâm, Cẩm Lệ',
            district: 'camLe',
            coordinates: [16.031425, 108.187308],
            ssid: 'VNPT_BusStation_Free',
            bandwidth: '135Mbps',
            accessType: 'Portal',
            devices: '105',
            coverage: '55m',
            images: ['/assets/gis/wifi/wifi-vnpt3.jpg'] // Thêm ảnh vào đây
        },
        {
            id: 15,
            name: 'Wifi công cộng FPT Khu du lịch Bà Nà',
            provider: 'fpt',
            address: 'Khu du lịch Bà Nà, Hòa Vang',
            district: 'hoaVang',
            coordinates: [16.038262, 107.981733],
            ssid: 'FPT_BaNa_Wifi',
            bandwidth: '60Mbps',
            accessType: 'Open',
            devices: '25',
            coverage: '15m',
            images: ['/assets/gis/wifi/wifi-fpt3.jpg'] // Thêm ảnh vào đây
        },
        {
            id: 16,
            name: 'Wifi công cộng Mobifone Đảo Trường Sa Lớn',
            provider: 'mobifone',
            address: 'Đảo Trường Sa Lớn',
            district: 'truongSa',
            coordinates: [10.382248, 114.316953],
            ssid: 'Mobifone_TruongSa_Free',
            bandwidth: '100Mbps',
            accessType: 'Portal',
            devices: '75',
            coverage: '35m',
            images: ['/assets/gis/wifi/wifi-mobifone3.jpg'] // Thêm ảnh vào đây
        }
    ];


    const filterAndDisplayMarkers = () => {
        const districtFilter = document.getElementById('district').value;
        const providerFilter = document.getElementById('provider').value;
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();

        clearMarkers();

        const filters = {
            district: districtFilter,
            provider: providerFilter,
            searchTerm: searchTerm
        };

        filterWifiData(filters);
    };

    const filterWifiData = (filters) => {
        wifiData.forEach(item => {
            if (shouldShowWifi(item, filters)) {
                addMarker(item, filters);
            }
        });
    };

    const shouldShowWifi = (item, filters) => {
        const districtMatch = !filters.district || item.district === filters.district;
        const providerMatch = !filters.provider || item.provider === filters.provider;
        const searchMatch = !filters.searchTerm ||
                            item.name.toLowerCase().includes(filters.searchTerm) ||
                            item.address.toLowerCase().includes(filters.searchTerm);

        return districtMatch && providerMatch && searchMatch;
    };


    const addMarker = (item, filters) => {
        let icon;
        let className = 'map-marker';
        if (item.provider === 'viettel') {
            icon = wifiIconViettel;
            className += ' viettel';
        } else if (item.provider === 'vnpt') {
            icon = wifiIconVNPT;
            className += ' vnpt';
        } else if (item.provider === 'fpt') {
            icon = wifiIconFPT;
            className += ' fpt';
        } else if (item.provider === 'mobifone') {
            icon = wifiIconMobifone;
            className += ' mobifone';
        }
         else {
            icon = wifiIcon;
            className += ' wifi-default';
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
            className: 'wifi-popup'
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
                <div class="popup-info-item"><label><i class="fas fa-wifi"></i> Nhà cung cấp:</label> <span>${getWifiProviderName(item.provider)}</span></div>
                <div class="popup-info-item"><label><i class="fas fa-map-marker-alt"></i> Địa chỉ:</label> <span>${item.address}</span></div>
                <div class="popup-info-item"><label><i class="fas fa-wifi"></i> SSID:</label> <span>${item.ssid || 'Không rõ'}</span></div>
                <div class="popup-info-item"><label><i class="fas fa-signal"></i> Băng thông:</label> <span>${item.bandwidth || 'Không rõ'}</span></div>
                <div class="popup-info-item"><label><i class="fas fa-lock-open"></i> Loại truy cập:</label> <span>${item.accessType || 'Không rõ'}</span></div>
                <div class="popup-info-item"><label><i class="fas fa-link"></i> Số thiết bị kết nối:</label> <span>${item.devices || 'Không rõ'}</span></div>
                <div class="popup-info-item"><label><i class="fas fa-ruler"></i> Phạm vi phủ sóng:</label> <span>${item.coverage || 'Không rõ'}</span></div>
            </div>
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


    // --- Function to get wifi provider name ---
    const getWifiProviderName = (provider) => {
        const providerNames = {
            viettel: 'Viettel',
            vnpt: 'VNPT',
            fpt: 'FPT',
            mobifone: 'Mobifone'
        };
        return providerNames[provider] || 'Khác';
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
        const blob = new Blob([JSON.stringify(wifiData, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'wifi-map-data.json';
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const setupEventListeners = () => { // Encapsulate event listener setup
        // --- Event listeners for filter changes ---
        document.getElementById('district').addEventListener('change', filterAndDisplayMarkers);
        document.getElementById('provider').addEventListener('change', filterAndDisplayMarkers);
        document.getElementById('searchBtn').addEventListener('click', filterAndDisplayMarkers);
        document.getElementById('searchInput').addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                filterAndDisplayMarkers();
            }
        });

        // --- Event listeners for map controls ---
        document.getElementById('toggleHeatmap').addEventListener('click', toggleHeatmap);
        document.getElementById('exportData').addEventListener('click', exportData);
    };


    setupEventListeners(); // Call event listener setup
    setupLayerControls();

    // --- Initial display ---
    filterAndDisplayMarkers();
});