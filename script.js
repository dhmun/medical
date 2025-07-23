
document.addEventListener('DOMContentLoaded', function () {
    const summaryData = window.summaryMedicalData || {};
    const detailedData = window.detailedMedicalData || {};
    
    const svg = document.getElementById('svgMain');
    if (!svg) return;
    
    const provinces = svg.querySelectorAll('g[id]');
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    document.body.appendChild(tooltip);

    // Modal DOM 요소
    const modalOverlay = document.getElementById('modal-overlay');
    const modalTitle = document.getElementById('modal-title');
    const modalCloseBtn = document.getElementById('modal-close');
    const modalTableBody = document.querySelector('#modal-table tbody');
    
    let activeProvinceShape = null;

    provinces.forEach(province => {
        const provinceId = province.id;
        const shape = province.querySelector('.shape');
        
        if (shape && summaryData[provinceId]) {
            shape.addEventListener('mouseover', e => {
                const data = summaryData[provinceId];
                tooltip.style.opacity = 1;
                tooltip.innerHTML = `
                    <h3>${data.name}</h3>
                    <p><strong>총 시설 수: ${data['총합']}</strong></p>
                    <p style="border-top: 1px solid #777; margin-top: 5px; padding-top: 5px;">
                        병원: ${data['병원']} | 약국: ${data['약국']} | 요양소: ${data['요양소']}<br>
                        연구소: ${data['의학연구소']} | 제약공장: ${data['제약공장']}
                    </p>
                `;
            });
            shape.addEventListener('mousemove', e => {
                tooltip.style.left = `${e.pageX + 15}px`;
                tooltip.style.top = `${e.pageY + 15}px`;
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
                            <td>${f['카테고리'] || ''}</td>
                            <td>${f['이름'] || ''}</td>
                            <td>${f['주소'] || ''}</td>
                            <td>${f['군'] || ''}</td>
                            <td>${f['구'] || ''}</td>
                            <td>${f['인근시설'] || ''}</td>
                        </tr>
                    `).join('');
                    modalTableBody.innerHTML = rowsHtml;
                } else {
                    modalTableBody.innerHTML = '<tr><td colspan="6">해당 지역의 상세 데이터가 없습니다.</td></tr>';
                }
                
                modalOverlay.classList.add('visible');
            });
        }
    });
    
    // Modal 닫기 이벤트
    modalCloseBtn.addEventListener('click', () => modalOverlay.classList.remove('visible'));
    modalOverlay.addEventListener('click', e => {
        if (e.target === modalOverlay) {
            modalOverlay.classList.remove('visible');
        }
    });
});
