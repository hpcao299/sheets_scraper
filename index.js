const sheetId = '1SJVqPedd_cidgSkZfZlL-SG_5E4ZzwbCqKK6jvMJixI';
const base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?`;
const sheetName = 'PNIT Database';
const query = encodeURIComponent('Select *');
const url = `${base}&sheet=${sheetName}&tq=${query}`;
const data = [];

document.addEventListener('DOMContentLoaded', init);

function init() {
    const output = document.querySelector('.output');
    const databaseElement = document.getElementById('database-status');

    databaseElement.classList.add('loader');
    fetch(url)
        .then(res => res.text())
        .then(rep => {
            //Remove additional text and extract only JSON:
            const jsonData = JSON.parse(rep.substring(47).slice(0, -2));
            console.log(jsonData);
            const colz = [];
            const tr = document.createElement('tr');
            //Extract column labels
            jsonData.table.cols.forEach(heading => {
                if (heading.label) {
                    let column = heading.label;
                    colz.push(column);
                    const th = document.createElement('th');
                    th.innerText = column;
                    tr.appendChild(th);
                }
            });
            output.appendChild(tr);
            //extract row data:
            jsonData.table.rows.forEach(rowData => {
                const row = {};
                colz.forEach((ele, ind) => {
                    row[ele] = rowData.c[ind] != null ? rowData.c[ind].v : '';
                });
                data.push(row);
            });
            processRows(data);
        })
        .finally(() => {
            databaseElement.classList.remove('loader');
            processMembersList(data);
        });

    function processRows(json) {
        json.forEach(row => {
            const tr = document.createElement('tr');
            const keys = Object.keys(row);

            keys.forEach(key => {
                const td = document.createElement('td');
                td.textContent = row[key];
                tr.appendChild(td);
            });
            output.appendChild(tr);
        });
    }

    function processMembersList(data) {
        const headingElement = document.querySelector('h2');
        const listElement = document.querySelector('.member-list');
        let html = '';

        data.map(member => {
            html += `
            <a href="./member.html?slug=${member.slug}">
            <div class="member-item">
            <img
            src="${member.avatar_url}"
            alt="${member.name}"
            class="member-avatar"
            />
            <div class="member-name">${member.name}</div>
            </div>
            </a>
            `;
        });

        headingElement.innerText = 'Danh sách thành viên';
        listElement.innerHTML = html;
    }
}
