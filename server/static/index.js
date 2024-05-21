document.addEventListener('DOMContentLoaded', function() {
    console.log("== DOM Content Loaded ==")
});

function formatTableName(name){
    console.log(`== ${arguments.callee.name} called == `);
    let newName = name.charAt(0).toLowerCase()
    return newName + name.slice(1);
}

function getTableData(){
    console.log(`== ${arguments.callee.name} called == `);

    // Gets all input elements
    const inputs = document.querySelectorAll('input');
    // Initializes an object to hold table data
    const data = {}
    // Add the table name
    data['tableName'] = document.querySelector('h1').textContent
    // Goes through each input and uses its id to get the input name
    inputs.forEach(input => {
        let inputName = formatTableName(input.id);
        let val = input.value;
        // Data is added
        data[inputName] = val;
    })
    
    return data;
}

function clearInputs(){
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input =>{
        input.value = '';
    })
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
            var status = data["status"];
            if(status){
                console.log("== Successfully Created Row ==")
                clearInputs();
                location.reload();
            } else {
                console.log(data.message)
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



