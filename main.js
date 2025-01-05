const errors = {
    empty: 'Please enter a serialized matrix.',
    invalid: 'The serialization is invalid.',
    array: 'Each row must be an array.',
    rows: 'Row length must be between 1 and 1000.',
    columns: 'Column length must be between 1 and 1000.',
    consistent: 'Each row must have a consistent length.',
    type: 'Each cell must have the same type.',
};

const button = document.querySelector('button');
const select = document.querySelector('select');
const input = document.querySelector('input');
const output = document.querySelector('output');

addEventListener('load', () => input.value = localStorage.getItem('data'));
addEventListener('load', () => select.selectedIndex = localStorage.getItem('size'));
addEventListener('keydown', e => e.key === 'Enter' && button.click());
addEventListener('keydown', e => e.key === 'ArrowUp' && (select.selectedIndex = (select.selectedIndex + 5) % 6));
addEventListener('keydown', e => e.key === 'ArrowDown' && (select.selectedIndex = (select.selectedIndex + 1) % 6));
button.addEventListener('click', render);
select.addEventListener('change', () => localStorage.setItem('size', select.selectedIndex));

function render() {
    const data = input.value.trim();
    if (data.length === 0) return alert(errors.empty);

    let matrix;
    try {
        matrix = JSON.parse(data);
        if (!Array.isArray(matrix)) throw Error;
    } catch {
        return alert(errors.invalid);
    }

    for (const row of matrix) {
        if (!Array.isArray(row)) return alert(errors.array);
    }

    const m = matrix.length;
    if (m === 0 || m > 1000) return alert(errors.rows);

    const n = matrix[0].length;
    if (n === 0 || n > 1000) return alert(errors.columns);

    for (const row of matrix) {
        if (row.length !== n) return alert(errors.consistent);
    }

    const type = typeof matrix[0][0];
    for (let r = 0; r < m; r++) {
        for (let c = 0; c < n; c++) {
            if (typeof matrix[r][c] !== type) return alert(errors.type);
            if (typeof matrix[r][c] === 'boolean') matrix[r][c] = Number(matrix[r][c]);
        }
    }

    output.innerHTML = '';
    localStorage.setItem('data', data);

    const size = select.options[select.selectedIndex].innerText;
    document.documentElement.style.setProperty('--size', `${size}px`);

    for (let r = 0; r < m; r++) {
        const row = document.createElement('div');
        row.classList.add('row');
        output.append(row);

        for (let c = 0; c < n; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.innerText = matrix[r][c];
            row.append(cell);
        }
    }
}
