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
    const antennaIcon = L.divIcon({
        className: 'map-marker cot',
        html: '<i class="fas fa-broadcast-tower"></i>',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
    });

    const btsIcon = L.divIcon({
        className: 'map-marker tram',
        html: '<i class="fas fa-satellite-dish"></i>',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
    });

    const cableIcon = L.divIcon({
        className: 'map-marker cap',
        html: '<i class="fas fa-ethernet"></i>',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
    });


    // --- Sample Telecom Data ---
    const telecomData = [
        {
            id: 1,
            name: 'Cột ăng ten Viettel Hải Châu',
            type: 'cot',
            address: 'Đường 2 tháng 9, Hải Châu, Đà Nẵng',
            district: 'haiChau',
            coordinates: [16.057646, 108.221492],
            owner: 'viettel',
            height: '50m',
            status: 'Active',
            installationDate: '2022-05-15',
            material: 'Steel',
            capacity: '400MHz',
            images: ['/assets/gis/telecom/cot.jpg']
        },
        {
            id: 2,
            name: 'Trạm BTS Vinaphone Thanh Khê',
            type: 'tram',
            address: 'Đường Nguyễn Văn Linh, Thanh Khê, Đà Nẵng',
            district: 'thanhKhe',
            coordinates: [16.059488865806554, 108.20780330958475],
            provider: 'vinaphone',
             technology: '4G',
            power: '1000W',
            bandwidth: '20MHz',
            frequency: '1800MHz',
            equipmentModel: 'Ericsson RBS 6102',
            images: ['/assets/gis/telecom/tram.jpg']
        },
      {
           id: 3,
            name: 'Tuyến cáp quang FPT Sơn Trà',
            type: 'cap',
            address: 'Đường Ngô Quyền, Sơn Trà',
            district: 'sontra',
            owner: 'FPT Telecom',
            length: '20km',
             fiberType: 'Single mode',
            installationDate: '2023-01-20',
            cableType: 'Underground',
             coreCount: '12',
            coordinates: [ // Sample line data - adjust with real data
                [16.096733315692745, 108.26161756604702],
                [16.09479164327449, 108.25324529866285],
                [16.08411210565321, 108.24905916497077],
                [16.077177033570322, 108.24819306834482],
                [16.06358359057687, 108.24804871890716]
            ],
            images: ['/assets/gis/telecom/cap.jpg']
        },
        {
            id: 4,
            name: 'Cột ăng ten Mobifone Ngũ Hành Sơn',
            type: 'cot',
            address: 'Đường Lê Văn Hiến, Ngũ Hành Sơn',
          district: 'nguhanhson',
            coordinates: [16.017442052256815, 108.25388720753693],
            owner: 'mobifone',
            height: '45m',
             status: 'Active',
            installationDate: '2021-11-01',
            material: 'Concrete',
              capacity: '300MHz',
              images: ['/assets/gis/telecom/cot1.jpg']
        },
        {
            id: 5,
            name: 'Trạm BTS Viettel Liên Chiểu',
            type: 'tram',
            address: 'Đường Nguyễn Tất Thành, Liên Chiểu',
          district: 'lienchieu',
            coordinates: [16.088884614831073, 108.15514762632732],
             provider: 'viettel',
             technology: '5G',
             power: '1200W',
            bandwidth: '40MHz',
             frequency: '2600MHz',
           equipmentModel: 'Huawei RRU5302',
           images: ['/assets/gis/telecom/tram1.jpg']
        },
        {
            id: 6,
           name: 'Tuyến cáp quang VNPT Cẩm Lệ',
            type: 'cap',
            address: 'Đường Cách Mạng Tháng 8, Cẩm Lệ',
            district: 'camle',
             owner: 'VNPT',
             length: '30km',
             fiberType: 'Multi mode',
            installationDate: '2023-04-10',
             cableType: 'Aerial',
             coreCount: '24',
            coordinates: [ // Sample line data - adjust with real data
                 [16.0144376684944, 108.196064076143170],
                 [16.013943227827372, 108.1974143837788],
                 [16.016168201184623, 108.2022047608671],
                [16.017466090856338, 108.2056448303198],
                [16.019814631664786, 108.2100172550447]
            ],
            images: ['/assets/gis/telecom/cap1.jpg']
        },
        {
            id: 7,
            name: 'Cột ăng ten Gtel Hòa Vang',
            type: 'cot',
            address: 'Đường Trường Sơn, Hòa Vang',
          district: 'hoavang',
            coordinates: [16.01208537626726, 108.1670774350091],
           owner: 'Gtel',
           height: '60m',
          status: 'Inactive',
          installationDate: '2020-08-22',
          material: 'Steel',
           capacity: '350MHz',
           images: ['/assets/gis/telecom/cot2.jpg']
        },
        {
            id: 8,
            name: 'Trạm BTS Mobifone Hải Châu',
            type: 'tram',
            address: 'Đường 2 tháng 9, Hải Châu',
          district: 'haichau',
            coordinates: [16.046257414068197, 108.22173921887907],
            provider: 'mobifone',
            technology: '4G',
            power: '900W',
            bandwidth: '15MHz',
             frequency: '2100MHz',
            equipmentModel: 'Nokia Flexi BTS',
            images: ['/assets/gis/telecom/tram2.jpg']
        },
        {
            id: 9,
             name: 'Tuyến cáp quang Viettel Thanh Khê',
            type: 'cap',
            address: 'Đường Điện Biên Phủ, Thanh Khê',
            district: 'thanhkhe',
            owner: 'Viettel',
            length: '2.5km',
             fiberType: 'Single mode',
            installationDate: '2022-09-18',
           cableType: 'Underground',
           coreCount: '8',
            coordinates: [ // Sample line data - adjust with real data
                 [16.083631, 108.181009],
                 [16.084000, 108.182000],
                 [16.085000, 108.183000],
                [16.086000, 108.184000]
            ],
            images: ['/assets/gis/telecom/cap2.jpg']
        },
      {
            id: 10,
            name: 'Cột ăng ten Vinaphone Sơn Trà',
            type: 'cot',
            address: 'Đường Trần Hưng Đạo, Sơn Trà',
          district: 'sontra',
            coordinates: [16.1199630581815, 108.2693053049854],
             owner: 'vinaphone',
            height: '55m',
            status: 'Active',
          installationDate: '2021-06-30',
           material: 'Steel',
           capacity: '450MHz',
           images: ['/assets/gis/telecom/cot3.jpg']
        },
        {
            id: 11,
            name: 'Trạm BTS FPT Ngũ Hành Sơn',
            type: 'tram',
            address: 'Đường Hồ Xuân Hương, Ngũ Hành Sơn',
          district: 'nguhanhson',
            coordinates: [15.986658, 108.259180],
            provider: 'fpt',
             technology: '4G',
             power: '1100W',
            bandwidth: '25MHz',
            frequency: '1900MHz',
            equipmentModel: 'ZTE ZX8000',
            images: ['/assets/gis/telecom/tram3.jpg']
        },
        {
            id: 12,
           name: 'Tuyến cáp quang VNPT Liên Chiểu',
            type: 'cap',
            address: 'Đường Nguyễn Lương Bằng, Liên Chiểu',
            district: 'lienchieu',
             owner: 'VNPT',
             length: '1.8km',
            fiberType: 'Multi mode',
            installationDate: '2022-12-01',
             cableType: 'Underground',
           coreCount: '16',
           coordinates: [ // Sample line data - adjust with real data
                 [16.099600, 108.155210],
                 [16.100000, 108.156000],
                 [16.0119, 108.157000], // Typo here, should be 16.1019 or similar
                 [16.101500, 108.158000]
            ],
            images: ['/assets/gis/telecom/cap3.jpg']
        },
      {
          id: 13,
          name: 'Cột ăng ten Gtel Cẩm Lệ',
          type: 'cot',
          address: 'Đường Phạm Hùng, Cẩm Lệ',
          district: 'camle',
            coordinates: [16.024647, 108.197171],
          owner: 'Gtel',
          height: '48m',
          status: 'Active',
          installationDate: '2023-03-05',
          material: 'Concrete',
           capacity: '420MHz',
           images: ['/assets/gis/telecom/cot4.jpg']
      },
      {
        id: 14,
        name: 'Trạm BTS Viettel Hòa Vang',
        type: 'tram',
        address: 'Đường Tỉnh lộ 605, Hòa Vang',
        district: 'hoavang',
        coordinates: [15.941554315032135, 108.18099074934199],
        provider: 'viettel',
        technology: '5G',
        power: '1300W',
        bandwidth: '30MHz',
        frequency: '2300MHz',
        equipmentModel: 'Ericsson RBS 6601',
        images: ['/assets/gis/telecom/tram4.jpg']
      },
       {
            id: 15,
           name: 'Tuyến cáp quang FPT Trường Sa',
            type: 'cap',
            address: 'Đảo Trường Sa Lớn',
            district: 'truongsa', // You might want to handle 'truongsa' district specifically if needed
           owner: 'FPT',
           length: '0.5km',
           fiberType: 'Single mode',
            installationDate: '2023-06-15',
           cableType: 'Undersea',
           coreCount: '4',
           coordinates: [ // Sample line data - adjust with real data
                [10.386410, 114.308723],
                [10.387000, 114.309200],
                [10.387500, 114.310000]
            ],
            images: ['/assets/gis/telecom/cap4.jpg']
        }
    ];


    const filterAndDisplayMarkers = () => {
        const districtFilter = document.getElementById('district').value;
        const infrastructureTypeFilter = document.getElementById('infrastructureType').value;
        const providerFilter = document.getElementById('provider').value;
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();

        clearMarkers();

        const filters = { // Define filters object here
            district: districtFilter,
            infrastructureType: infrastructureTypeFilter,
            provider: providerFilter,
            searchTerm: searchTerm
        };

        filterTelecomData(filters); // Pass filters to filterTelecomData
    };

    const filterTelecomData = (filters) => { // Accept filters as argument
        telecomData.forEach(item => {
            if (shouldShowTelecom(item, filters)) { // Pass filters to shouldShowTelecom
                addMarker(item, filters); // Pass filters to addMarker
            }
        });
    };

    const shouldShowTelecom = (item, filters) => { // Accept filters as argument
        const districtMatch = !filters.district || item.district === filters.district;
        const infrastructureTypeMatch = !filters.infrastructureType || item.type === filters.infrastructureType;
        const providerMatch = !filters.provider || (filters.provider === '' || item.provider === filters.provider);
        const searchMatch = !filters.searchTerm ||
                            item.name.toLowerCase().includes(filters.searchTerm) ||
                            item.address.toLowerCase().includes(filters.searchTerm);

        return districtMatch && infrastructureTypeMatch && providerMatch && searchMatch;
    };


    const addMarker = (item, filters) => {
        let icon;
        let className = 'map-marker';
    
        if (item.type === 'cot') {
            icon = antennaIcon;
            className += ' cot';
            if (item.owner) {
                className += ` ${item.owner.toLowerCase()}`; 
            }
        } else if (item.type === 'tram') {
            icon = btsIcon;
            className += ' tram';
            if (item.provider) {
                className += ` ${item.provider}`;
            }
        } else if (item.type === 'cap') {
            icon = cableIcon;
            className += ' cap';
            className += ` ${item.provider}`;
        } else {
            return;
        }
    
        const popupContent = createPopupContent(item);
        let marker;
        if (item.type === 'cap') {
            marker = L.polyline(item.coordinates, { color: '#2ecc71' });
        } else {
            marker = L.marker(item.coordinates, {
                icon: L.divIcon({
                    className: className,
                    html: icon.options.html,
                    iconSize: icon.options.iconSize,
                    iconAnchor: icon.options.iconAnchor,
                    popupAnchor: icon.options.popupAnchor
                })
            });
        }
    
        marker.bindPopup(popupContent, {
            maxWidth: 350,
            className: 'telecom-popup'
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
                <div class="popup-info-item"><label><i class="fas fa-broadcast-tower"></i> Loại hình:</label> <span>${getTelecomTypeName(item.type)}</span></div>
                <div class="popup-info-item"><label><i class="fas fa-map-marker-alt"></i> Địa chỉ:</label> <span>${item.address}</span></div>`;

        if (item.type === 'cot') {
            content += `
                <div class="popup-info-item"><label><i class="fas fa-user-tie"></i> Chủ sở hữu:</label> <span>${item.owner || 'Không rõ'}</span></div>
                <div class="popup-info-item"><label><i class="fas fa-arrows-alt-v"></i> Chiều cao:</label> <span>${item.height || 'Không rõ'}</span></div>
                <div class="popup-info-item"><label><i class="fas fa-info-circle"></i> Trạng thái:</label> <span>${item.status || 'Không rõ'}</span></div>
                <div class="popup-info-item"><label><i class="fas fa-calendar-alt"></i> Ngày lắp đặt:</label> <span>${item.installationDate || 'Không rõ'}</span></div>
                 <div class="popup-info-item"><label><i class="fas fa-box-open"></i> Vật liệu:</label> <span>${item.material || 'Không rõ'}</span></div>
                <div class="popup-info-item"><label><i class="fas fa-signal"></i> Công suất:</label> <span>${item.capacity || 'Không rõ'}</span></div>
            `;
        } else if (item.type === 'tram') {
            content += `
                <div class="popup-info-item"><label><i class="fas fa-sitemap"></i> Nhà cung cấp:</label> <span>${getTelecomProviderName(item.provider)}</span></div>
                <div class="popup-info-item"><label><i class="fas fa-project-diagram"></i> Công nghệ:</label> <span>${item.technology || 'Không rõ'}</span></div>
                <div class="popup-info-item"><label><i class="fas fa-bolt"></i> Công suất:</label> <span>${item.power || 'Không rõ'}</span></div>
                <div class="popup-info-item"><label><i class="fas fa-wave-square"></i> Băng thông:</label> <span>${item.bandwidth || 'Không rõ'}</span></div>
                <div class="popup-info-item"><label><i class="fas fa-wave-square"></i> Tần số:</label> <span>${item.frequency || 'Không rõ'}</span></div>
                <div class="popup-info-item"><label><i class="fas fa-microchip"></i> Model thiết bị:</label> <span>${item.equipmentModel || 'Không rõ'}</span></div>
           `;
        } else if (item.type === 'cap') {
            content += `
                <div class="popup-info-item"><label><i class="fas fa-user-tie"></i> Chủ sở hữu:</label> <span>${item.owner || 'Không rõ'}</span></div>
                <div class="popup-info-item"><label><i class="fas fa-ruler-horizontal"></i> Chiều dài:</label> <span>${item.length || 'Không rõ'}</span></div>
                <div class="popup-info-item"><label><i class="fas fa-wifi"></i> Loại cáp:</label> <span>${item.fiberType || 'Không rõ'}</span></div>
                <div class="popup-info-item"><label><i class="fas fa-calendar-alt"></i> Ngày lắp đặt:</label> <span>${item.installationDate || 'Không rõ'}</span></div>
                <div class="popup-info-item"><label><i class="fas fa-cable-car"></i> Kiểu cáp:</label> <span>${item.cableType || 'Không rõ'}</span></div>
                <div class="popup-info-item"><label><i class="fas fa-sort-numeric-amount-up"></i> Số lõi:</label> <span>${item.coreCount || 'Không rõ'}</span></div>
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

    // --- Function to get telecom type name ---
    const getTelecomTypeName = (type) => {
        const typeNames = {
            cot: 'Cột ăng ten',
            tram: 'Trạm BTS',
            cap: 'Tuyến cáp'
        };
        return typeNames[type] || 'Không rõ';
    };

    // --- Function to get telecom provider name ---
    const getTelecomProviderName = (provider) => {
        const providerNames = {
            viettel: 'Viettel',
            vinaphone: 'Vinaphone',
            mobifone: 'Mobifone',
            fpt: 'FPT',
            khac: 'Khác'
        };
        return providerNames[provider] || 'Không rõ';
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
        const blob = new Blob([JSON.stringify(telecomData, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'telecom-map-data.json';
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const setupEventListeners = () => { // Encapsulate event listener setup
        // --- Event listeners for filter changes ---
        document.getElementById('district').addEventListener('change', filterAndDisplayMarkers);
        document.getElementById('infrastructureType').addEventListener('change', filterAndDisplayMarkers);
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