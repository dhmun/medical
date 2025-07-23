
document.addEventListener('DOMContentLoaded', function () {
    const summaryData = window.summaryMedicalData || {};
    const detailedData = window.detailedMedicalData || {};
    
    const mapContainer = document.querySelector('.map-container');
    const svg = document.getElementById('svgMain');
    if (!svg || !mapContainer) return;

    // 툴팁과 모달을 mapContainer 내부에 추가합니다.
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    mapContainer.appendChild(tooltip);

    const modalOverlay = document.getElementById('modal-overlay');
    const modalTitle = document.getElementById('modal-title');
    const modalCloseBtn = document.getElementById('modal-close');
    const modalTableBody = document.querySelector('#modal-table tbody');
    
    const provinces = svg.querySelectorAll('g[id]');
    let activeProvinceShape = null;

    provinces.forEach(province => {
        const provinceId = province.id;
        const shape = province.querySelector('.shape');
        
        if (shape && summaryData[provinceId]) {
            shape.addEventListener('mouseover', e => {
                const data = summaryData[provinceId];
                tooltip.style.opacity = 1;
                tooltip.innerHTML = `<h3>${data.name}</h3><p><strong>총합:</strong> ${data['총합']}</p><p>병원:${data['병원']} 약국:${data['약국']} 요양소:${data['요양소']}</p>`;
            });

            shape.addEventListener('mousemove', e => {
                // 부모 요소(mapContainer)를 기준으로 상대 좌표 계산
                const rect = mapContainer.getBoundingClientRect();
                tooltip.style.left = `${e.clientX - rect.left + 15}px`;
                tooltip.style.top = `${e.clientY - rect.top + 15}px`;
            });
            
            shape.addEventListener('mouseout', () => tooltip.style.opacity = 0);

            shape.addEventListener('click', () => {
                if (activeProvinceShape) activeProvinceShape.classList.remove('active');
                shape.classList.add('active');
                activeProvinceShape = shape;

                const provinceName = summaryData[provinceId].name;
                const facilities = detailedData[provinceId] || [];

                modalTitle.textContent = `${provinceName} 상세 정보 (${facilities.length}개)`;
                modalTableBody.innerHTML = '';
                
                if (facilities.length > 0) {
                    const rowsHtml = facilities.map(f => `
                        <tr>
                            <td>${f['카테고리'] || ''}</td><td>${f['이름'] || ''}</td><td>${f['주소'] || ''}</td>
                            <td>${f['군'] || ''}</td><td>${f['구'] || ''}</td><td>${f['인근시설'] || ''}</td>
                        </tr>`).join('');
                    modalTableBody.innerHTML = rowsHtml;
                } else {
                    modalTableBody.innerHTML = '<tr><td colspan="6">해당 지역의 상세 데이터가 없습니다.</td></tr>';
                }
                modalOverlay.classList.add('visible');
            });
        }
    });
    
    modalCloseBtn.addEventListener('click', () => modalOverlay.classList.remove('visible'));
    modalOverlay.addEventListener('click', e => {
        if (e.target === modalOverlay) modalOverlay.classList.remove('visible');
    });
});
