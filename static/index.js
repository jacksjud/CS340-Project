// Group: 95
// Team Members:
// Gabriele Falchini
// Judah Jackson

document.addEventListener('DOMContentLoaded', function() {
    console.log("== DOM Content Loaded ==")
    dynamicDropdown();
    
});

// // Add event listener to export button
// document.getElementById('exportButton').addEventListener('click', async () => {
//     // Import the exportTables object from server.js
//     const selectedTable = document.querySelector('h1').textContent;
//     await exportCSV(selectedTable);
//     console.log("== Exporting CSV of "+selectedTable+" ==")
// });

function formatTableName(name){
    console.log(`== ${arguments.callee.name} called == `);
    let newName = name.charAt(0).toLowerCase()
    return newName + name.slice(1);
}

function getTableData(){
    console.log(`== ${arguments.callee.name} called == `);

    // Gets all input elements
    const inputs = document.querySelectorAll('.form-input');
    // Initializes an object to hold table data
    const data = {}
    // Add the table name
    data['tableName'] = document.querySelector('h1').textContent
    // Goes through each input and uses its id to get the input name
    inputs.forEach(input => {
        let inputName = formatTableName(input.id);
        let val = input.value;
         // Determine the value based on the element type
         if (input.tagName.toLowerCase() === 'select') {
            val = input.options[input.selectedIndex].textContent;
        } else {
            val = input.value;
        }
        // Data is added
        data[inputName] = val;
    })
    return data;
}

function clearInputs(){
    const inputs = document.querySelectorAll('.form-input');
    inputs.forEach(input => {
        if (input.tagName.toLowerCase() === 'select') {
            // Set the select to the NULL option
            const nullOption = Array.from(input.options).find(option => option.value === '');
            if (nullOption) {
                input.value = '';
            }
        } else {
            // Clear the input value
            input.value = '';
        }
    });
}

function dynamicDropdown(){
    const tableRows = document.querySelectorAll('table tbody tr:not(:first-child)'); // Skip header row
    const investorIDSet = new Set();

    tableRows.forEach(row => {
        const investorID = row.children[1].textContent.trim();
        investorIDSet.add(investorID);
    });

    const investorIDFilter = document.getElementById('investorIDFilter');

    investorIDSet.forEach(investorID => {
        const option = document.createElement('option');
        option.value = investorID;
        option.textContent = investorID;
        investorIDFilter.appendChild(option);
    });
}

/* ====================================================================================
FOCUS:

deleteButtons -
==================================================================================== */ 
const deleteButtons = document.querySelectorAll(".delete-button");

deleteButtons.forEach(button => {
    button.addEventListener('click', deleteRow);
    console.log("event listener added")
});

function deleteRow(event){
    console.log(`== ${arguments.callee.name} called == `);

    const button = event.target
    const idElement = button.closest('tr').querySelector('td:first-child');
    const id = idElement.textContent;
    const table = document.querySelector('h1').textContent;

    fetch(`/delete/row?table=${table}&row=${id}`)
       .then(response => response.json())
       .then(data => {
        const response = data["status"];
        if(response){
            console.log("== Row Deleted")
            location.reload();
        } else {
            console.error("Failed to delete row");
            alert("Unable to delete entry!")
        }
        })
        .catch(error => {
            alert("Unable to delete entry!")
            console.error("ERROR: " , error)
        });
}

/* ====================================================================================
FOCUS:

updateButton -
==================================================================================== */ 
const updateButton = document.getElementById("update-row-button");
updateButton.addEventListener("click", updateRow)

function updateRow(event){
    /* */
    console.log(`== ${arguments.callee.name} called == `);
    event.preventDefault();

    // Get table data
    const tableData = getTableData();
    console.log("tableData from updateRow: ", tableData)

    fetch(`/update-row`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(tableData)
        })
        .then(response => response.json())
        .then( data => {
            if (data.status) {
                console.log("== Successfully Updated Row ==")
                clearInputs();
                location.reload();
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => {
            console.error("Update row failed: ", error);
        });
}


/* ====================================================================================
FOCUS:

createButton -
==================================================================================== */ 
const createButton = document.getElementById("create-row-button");
createButton.addEventListener("click", createRow)

function createRow(event){
    console.log(`== ${arguments.callee.name} called == `);
    
    const table = document.querySelector('h1').textContent;
    event.preventDefault();

    // Get table data
    const tableData = getTableData();

    // probably need to add some type of verification as to what the inputs are

    fetch(`/create-table`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(tableData)
        })
        .then(response => response.json())
        .then( data => {
            if(data["status"]){
                console.log("== Successfully Created Row ==")
                clearInputs();
                location.reload();
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => {
            console.error("Create row failed: ", error);
        });
}

/* ====================================================================================
FOCUS:

replaceButton -
==================================================================================== */ 
const replaceButton = document.querySelectorAll("#replace-table-button");
replaceButton.forEach(button => {
    button.addEventListener('click', replaceTables);
    console.log("event listener added")
});

function replaceTables(event){
    console.log(`== ${arguments.callee.name} called == `);
    const table = document.querySelector('h1').textContent;
    event.preventDefault()
    fetch(`/replace-table/table?table=${table}`)
        .then(response => response.json())
        .then( data => {
            var status = data["status"];
            if(status)
                location.reload();
            else
                console.log(data.error)
        })
        .catch(error => {
            console.error("Replace Tables Failed: ", error)
        })
}

/* ====================================================================================
FOCUS:

replaceAll -
==================================================================================== */ 
function replaceAll(){
    console.log(`== ${arguments.callee.name} called == `);
    fetch("/replace-table/all")
        .then(response => response.json())
        .then(data => {
            const status = data["status"]
            if(status){
                console.log("== All Tables Replenished ==")
            } else{
                console.log("Error: ", data.error);
            }
        })
        .catch(error => {
            console.error("ERROR: ", error)
        })
}

// /* ====================================================================================
// FOCUS:

// exportCSV -
// ==================================================================================== */ 
// // Function to handle CSV export
// async function exportCSV(selectedTable) {
//     try {
//         // Check if a table is selected
//         if (!selectedTable) {
//             throw new Error('No table selected');
//         }
//         // Construct columns string for the selected table
//         const columns = Object.keys(window.exportTables[selectedTable]).join(', ');

//         // Make a request to the server to export the CSV file for the selected table
//         const response = await fetch(`/api/export?table=${selectedTable}&columns=${columns}`);

//         // Check if the response is successful
//         if (!response.ok) {
//             throw new Error('Export failed');
//         }

//         // Extract filename from content-disposition header
//         const disposition = response.headers.get('content-disposition');
//         const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
//         const matches = filenameRegex.exec(disposition);
//         const filename = matches != null && matches[1] ? matches[1].replace(/['"]/g, '') : 'export.csv';

//         // Convert the response to a blob
//         const blob = await response.blob();

//         // Create a temporary link element to trigger the download
//         const link = document.createElement('a');
//         link.href = window.URL.createObjectURL(blob);
//         link.download = filename;
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//     } catch (error) {
//         console.error('Export failed:', error);
//         // Handle error
//     }
// }