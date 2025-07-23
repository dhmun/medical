
document.addEventListener('DOMContentLoaded', function () {
    // 전역에 선언된 데이터를 가져옵니다.
    const summaryData = window.summaryMedicalData || {};
    const detailedData = window.detailedMedicalData || {};
    
    // HTML에 미리 정의된 요소들을 선택합니다.
    const svg = document.getElementById('svgMain');
    const tooltip = document.getElementById('tooltip');
    const tableTitle = document.getElementById('table-title');
    const tableBody = document.querySelector('#details-table tbody');

    // SVG 요소를 찾지 못하면 함수를 종료합니다.
    if (!svg) {
        console.error('지도 SVG를 찾을 수 없습니다.');
        return;
    }
    
    const provinces = svg.querySelectorAll('g[id]');
    let activeProvinceShape = null;

    provinces.forEach(province => {
        const provinceId = province.id;
        const shape = province.querySelector('.shape');
        
        // 해당 지역의 데이터가 있을 경우에만 이벤트를 추가합니다.
        if (shape && summaryData[provinceId]) {
            
            shape.addEventListener('mouseover', () => {
                const data = summaryData[provinceId];
                tooltip.style.opacity = 1;
                tooltip.innerHTML = `<h3 class="mouse-tooltip__title">${data.name}</h3><p>총 시설 수: ${data['총합']} 개</p>`;
            });
            
            shape.addEventListener('mousemove', e => {
                tooltip.style.left = `${e.pageX}px`;
                tooltip.style.top = `${e.pageY}px`;
            });
            
            shape.addEventListener('mouseout', () => {
                tooltip.style.opacity = 0;
            });

            shape.addEventListener('click', () => {
                if(activeProvinceShape) {
                    activeProvinceShape.classList.remove('shape--active');
                }
                shape.classList.add('shape--active');
                activeProvinceShape = shape;

                const provinceName = summaryData[provinceId].name;
                const facilities = detailedData[provinceId] || [];

                tableTitle.textContent = `${provinceName} 상세 정보 (${facilities.length}개)`;
                tableBody.innerHTML = '';

                if (facilities.length === 0) {
                    tableBody.innerHTML = '<tr><td colspan="6">해당 지역의 상세 데이터가 없습니다.</td></tr>';
                    return;
                }
                
                const rowsHtml = facilities.map(facility => `
                    <tr>
                        <td>${facility['카테고리'] || ''}</td>
                        <td>${facility['이름'] || ''}</td>
                        <td>${facility['주소'] || ''}</td>
                        <td>${facility['군'] || ''}</td>
                        <td>${facility['구'] || ''}</td>
                        <td>${facility['인근시설'] || ''}</td>
                    </tr>
                `).join('');
                tableBody.innerHTML = rowsHtml;
            });
        }
    });
});
