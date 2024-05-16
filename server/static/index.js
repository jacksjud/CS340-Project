const deleteButtons = document.querySelectorAll(".delete-button");

deleteButtons.forEach(button => {
    button.addEventListener('click', deleteRow);
    console.log("event listener added")
});

function deleteRow(event){
    const button = event.target
    const idElement = button.closest('tr').querySelector('td:first-child');
    const id = idElement.textContent;
    const table = document.querySelector('h1').textContent;

    fetch(`/delete/row?table=${table}&row=${id}`)
       .then(response => response.json())
       .then(data => {
        const response = data["status"];
        if(response){
            console.log("Row Deleted")
            location.reload();
        } else {
            console.error("Failed to delete row");
            alert("Unable to delete entry!")
        }
        })
        .catch(error => {
                console.error("ERROR: " , error)
        });
    
}


