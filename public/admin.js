const table = document.getElementById('dataTable');

const updateName = document.getElementById('updateName');
const updateScore = document.getElementById('updateScore');
const updateResult = document.getElementById('updateResult');
const updateId = document.getElementById('updateid');

table.addEventListener('click', function (event) {
    if (event.target.tagName === 'TD') {
        const row = event.target.parentElement;

        updateId.value = row.cells[0].textContent;
        updateName.value = row.cells[1].textContent; 
        updateScore.value = row.cells[2].textContent; 
        updateResult.value = row.cells[3].textContent; 
    }
});

document.getElementById('showalldataButton').addEventListener('click', function () {
    fetch('/get-all-data')
        .then((response) => response.json())
        .then((data) => {
            const tableBody = document.querySelector('#dataTable tbody');
            tableBody.innerHTML = '';

            data.forEach((row) => {
                const newRow = tableBody.insertRow();
                newRow.insertCell(0).textContent = row.id;
                newRow.insertCell(1).textContent = row.name;
                newRow.insertCell(2).textContent = row.score;
                newRow.insertCell(3).textContent = row.result;
            });
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
        });
});

document.getElementById('updateButton').addEventListener('click', function () {
    const idToUpdate = document.getElementById('updateid').value;
    const nameToUpdate = document.getElementById('updateName').value;
    const scoreToUpdate = document.getElementById('updateScore').value;
    const resultToUpdate = document.getElementById('updateResult').value;

    // Send a POST request to update the row in the quiz_result table
    fetch('/update-data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: idToUpdate,
            name: nameToUpdate,
            score: scoreToUpdate,
            result: resultToUpdate,
        }),
    })
    .then((response) => response.json())
    .then((data) => {
        console.log(data.message);
        document.getElementById('updateid').value = '';
        document.getElementById('updateName').value = '';
        document.getElementById('updateScore').value = '';
        document.getElementById('updateResult').value = '';
    })
    .catch((error) => {
        console.error('Error updating data:', error);
    });
});

document.getElementById('deleteButton').addEventListener('click', function () {
    const idToDelete = document.getElementById('updateid').value;

    fetch('/delete-data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: idToDelete,
        }),
    })
    .then((response) => response.json())
    .then((data) => {
        console.log(data.message);
        document.getElementById('updateid').value = '';
        document.getElementById('updateName').value = '';
        document.getElementById('updateScore').value = '';
        document.getElementById('updateResult').value = '';
    })
    .catch((error) => {
        console.error('Error deleting data:', error);
    });
});


