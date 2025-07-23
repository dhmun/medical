
document.addEventListener('DOMContentLoaded', function () {
    const summaryData = window.summaryMedicalData || {};
    const detailedData = window.detailedMedicalData || {};
    
    const svg = document.getElementById('svgMain');
    if (!svg) {
        console.error('지도 SVG를 찾을 수 없습니다.');
        return;
    }
    
    const provinces = svg.querySelectorAll('g[id]');
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    document.body.appendChild(tooltip);

    const tableTitle = document.getElementById('table-title');
    const tableBody = document.querySelector('#details-table tbody');
    
    let activeProvinceShape = null;

    provinces.forEach(province => {
        const provinceId = province.id;
        const shape = province.querySelector('.shape');
        
        if (shape && summaryData[provinceId]) {
            shape.addEventListener('mouseover', e => {
                const data = summaryData[provinceId];
                tooltip.style.opacity = 1;
                // 툴팁에 표시될 내용을 상세하게 구성
                tooltip.innerHTML = `
                    <h3>${data.name}</h3>
                    <p><strong>총 시설 수: ${data['총합']}</strong></p>
                    <p>-------------</p>
                    <p>병원: ${data['병원']}</p>
                    <p>약국: ${data['약국']}</p>
                    <p>요양소: ${data['요양소']}</p>
                    <p>의학연구소: ${data['의학연구소']}</p>
                    <p>제약공장: ${data['제약공장']}</p>
                `;
            });
            shape.addEventListener('mousemove', e => {
                tooltip.style.left = `${e.pageX + 15}px`;
                tooltip.style.top = `${e.pageY + 15}px`;
            });
            shape.addEventListener('mouseout', () => tooltip.style.opacity = 0);

            shape.addEventListener('click', () => {
                if(activeProvinceShape) {
                    activeProvinceShape.classList.remove('active');
                }
                shape.classList.add('active');
                activeProvinceShape = shape;

                const provinceName = summaryData[provinceId].name;
                const facilities = detailedData[provinceId] || [];

                tableTitle.textContent = `${provinceName} 상세 정보 (${facilities.length}개)`;
                tableBody.innerHTML = '';

                if (facilities.length === 0) {
                    tableBody.innerHTML = '<tr><td colspan="7">해당 지역의 상세 데이터가 없습니다.</td></tr>';
                    return;
                }
                
                facilities.forEach(facility => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${facility['카테고리'] || ''}</td>
                        <td>${facility['이름'] || ''}</td>
                        <td>${facility['주소'] || ''}</td>
                        <td>${facility['군'] || ''}</td>
                        <td>${facility['구'] || ''}</td>
                        <td>${facility['인근시설'] || ''}</td>
                    `;
                    tableBody.appendChild(row);
                });
            });
        }
    });
});


// script.js 파일 맨 아래에 추가

// iframe의 실제 높이를 부모 페이지(워드프레스)로 전송하는 함수
function sendIframeHeight() {
  // body 요소의 실제 높이를 계산합니다.
  const body = document.body;
  const html = document.documentElement;
  const height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);

  // 부모 페이지로 높이 정보를 메시지로 보냅니다.
  if (window.parent) {
    window.parent.postMessage({
      'iframeHeight': height,
      'iframeSrc': window.location.href
    }, '*');
  }
}

// 페이지의 모든 콘텐츠(이미지 등)가 로드된 후 높이를 전송합니다.
window.addEventListener('load', sendIframeHeight);

// 창 크기가 변경될 때도 높이를 다시 계산하여 전송합니다.
window.addEventListener('resize', sendIframeHeight);
