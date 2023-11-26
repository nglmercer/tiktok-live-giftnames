// Get the calendar element
var calendar = document.getElementById('calendar');
// JavaScript
document.addEventListener('DOMContentLoaded', (event) => {
    // Load previous values
    const savedValues = JSON.parse(localStorage.getItem('calendarValues')) || {};
    const savedRows = parseInt(localStorage.getItem('calendarRows')) || 0;
    const savedTimes = JSON.parse(localStorage.getItem('calendarTimes')) || {};
    let savedVotes = JSON.parse(localStorage.getItem('calendarVotes')) || {};
    const lastVoteDate = new Date(localStorage.getItem('lastVoteDate'));

    // Check if a week has passed since the last vote
    if (lastVoteDate && new Date() - lastVoteDate >= 7 * 24 * 60 * 60 * 1000) {
        // If a week has passed, reset the vote counter
        savedVotes = {};
        localStorage.setItem('calendarVotes', JSON.stringify(savedVotes));
    }

    const addRow = (rowIndex) => {
        const row = document.createElement('tr');
        const timeCell = document.createElement('td');
        const timeInput = document.createElement('input');
        timeInput.type = 'time';
        timeInput.value = savedTimes[rowIndex] || '';
        timeInput.addEventListener('change', (event) => {
            savedTimes[rowIndex] = event.target.value;
            localStorage.setItem('calendarTimes', JSON.stringify(savedTimes));
        });
        timeCell.appendChild(timeInput);
        row.appendChild(timeCell);
        for (let i = 0; i < 7; i++) {
            const cell = document.createElement('td');
            const input = document.createElement('input');
            input.type = 'text';
            input.value = savedValues[`${rowIndex}-${i}`] || '';
            input.addEventListener('change', (event) => {
                savedValues[`${rowIndex}-${i}`] = event.target.value;
                localStorage.setItem('calendarValues', JSON.stringify(savedValues));
            });
            cell.appendChild(input);
            const voteCounter = document.createElement('div');
            voteCounter.textContent = savedVotes[`${rowIndex}-${i}`] || 0;
            cell.appendChild(voteCounter);
            cell.addEventListener('click', (event) => {
                const voteKey = `${rowIndex}-${i}`;
                savedVotes[voteKey] = (savedVotes[voteKey] || 0) + 1;
                localStorage.setItem('calendarVotes', JSON.stringify(savedVotes));
                localStorage.setItem('lastVoteDate', new Date().toISOString());
                voteCounter.textContent = savedVotes[voteKey];
            });
            row.appendChild(cell);
        }
        document.getElementById('calendar-body').appendChild(row);
    };

    for (let i = 0; i < savedRows; i++) {
        addRow(i);
    }

    document.querySelector('.add-time-slot').addEventListener('click', () => {
        const rows = document.getElementById('calendar-body').getElementsByTagName('tr').length;
        if (rows >= 12) {
            alert('No puedes añadir más de 12 filas');
            return;
        }
        addRow(rows);
        localStorage.setItem('calendarRows', rows + 1);
    });
});