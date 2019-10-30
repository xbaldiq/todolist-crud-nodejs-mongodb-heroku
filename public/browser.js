
//mengiterasi setiap hasil query database dan masing" sebagai passing parameter
let ourHTML = items.map((item) => {
    return itemTemplate(item);
}).join(''); //join array tanpa adanya separator (karena defaultnya ',')

// Initial page load render
// grap id dari UL, settings format, dan populate UL dengan template HTML
document.getElementById("item-list").insertAdjacentHTML("beforeend", ourHTML);

//memasukkan data dynamic dari database ke template html
function itemTemplate(item) {
    return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
    <span class="item-text">${item.text}</span>
    <div>
      <button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
      <button data-id="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
    </div>
  </li>`
}

//insert data
//grab id pada input field
let createField = document.getElementById("create-field");
//grab id pada form dan menambahkan listener
document.getElementById("create-form").addEventListener("submit", (e) => {
    e.preventDefault()
    if (createField.value) {
        axios.post('/create-item', { text: createField.value }).then((response) => {
            //mejalankan fungsi itemTemplate setelah mendapatkan feedback setelah insert
            document.getElementById("item-list").insertAdjacentHTML("beforeend", itemTemplate(response.data))
            createField.value = "";
            createField.focus();
        }).catch(() => {
            console.log("please check your connection");
        })
    }
    else{
        
    }
})

//inisialisasi event listener pada tombol delete dan edit
document.addEventListener("click", (e) => {
    //Delete feature
    if (e.target.classList.contains("delete-me")) {
        if (confirm("Are you sure?")) {
            axios.post('/delete-item', { id: e.target.getAttribute("data-id") }).then(() => {
                e.target.parentElement.parentElement.remove();
            }).catch(() => {
                console.log("please check your connection");
            })
        }
    }

    //Update feature
    if (e.target.classList.contains("edit-me")) {
        let userInput = prompt("Masukkan text yang anda inginkan", e.target.parentElement.parentElement.querySelector(".item-text").innerHTML)
        if (userInput) {
            axios.post('/update-item', { text: userInput, id: e.target.getAttribute("data-id") }).then(() => {
                e.target.parentElement.parentElement.querySelector(".item-text").innerHTML = userInput;
                // do something interesting here
            }).catch(() => {
                console.log("please try again later")
            })
        }
    }
});
// let userInput = prompt("Masukkan text yang anda inginkan")