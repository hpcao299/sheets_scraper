const sheetId = '1SJVqPedd_cidgSkZfZlL-SG_5E4ZzwbCqKK6jvMJixI';
const base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?`;
const sheetName = 'PNIT Database';

const urlParams = new URLSearchParams(window.location.search);
const slug = urlParams.get('slug');

if (!slug) {
    window.location.href = `https://hpcao299.github.io/sheets_scraper/`;
}

const query = encodeURIComponent(`Select * WHERE F = "${slug}"`);
const url = `${base}&sheet=${sheetName}&tq=${query}`;
let data;

document.addEventListener('DOMContentLoaded', init);

function init() {
    const contentElement = document.querySelector('.content');

    contentElement.classList.add('loader');
    fetch(url)
        .then(res => res.text())
        .then(rep => {
            //Remove additional text and extract only JSON:
            const colz = [];
            const jsonData = JSON.parse(rep.substring(47).slice(0, -2));
            console.log(jsonData);

            jsonData.table.cols.forEach(heading => {
                if (heading.label) {
                    let column = heading.label;
                    colz.push(column);
                }
            });

            jsonData.table.rows.forEach(rowData => {
                const row = {};
                colz.forEach((ele, ind) => {
                    row[ele] = rowData.c[ind] != null ? rowData.c[ind].v : '';
                });
                data = row;
            });
        })
        .finally(() => {
            if (!data) {
                window.location.href = `https://hpcao299.github.io/sheets_scraper/`;
                return;
            }

            contentElement.classList.remove('loader');
            processData(data);
        });

    function processData(data) {
        const avatarElement = document.querySelector('.avatar');
        const nameElement = document.querySelector('.name');
        const descElement = document.querySelector('.desc');
        const birthDateElement = document.querySelector('.birth-date-text');

        avatarElement.src = data.avatar_url;
        avatarElement.alt = data.name;
        nameElement.innerText = data.name;
        descElement.innerText = data.description;
        birthDateElement.innerText = data.date_of_birth;
    }
}
