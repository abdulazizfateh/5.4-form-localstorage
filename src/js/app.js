const toDoListWrapperEl = document.querySelector(".to_do_list_wrapper");
const noToDoListWrapperEl = document.querySelector(".no_to_do_list");
const toDoListsWrapperEl = document.querySelector(".to_do_list_wrapper");
const checklistEl = document.querySelector(".checklist");
const allBtn = document.querySelector(".all");
const doneBtn = document.querySelector(".done");
const toBeDoneBtn = document.querySelector(".to_be_done");
const formEl = document.querySelector(".form");
const inputEl = document.querySelector(".to_do_input");
const formBtn = document.querySelector(".form_button");
const errorFill = document.querySelector(".fill_text_info");



let toDoData = JSON.parse(localStorage.getItem("data")) || [];
const inputFocus = () => {
    if (!toDoData.length) {
        inputEl.focus();
    }
}
inputFocus();

const renderToDoData = (filter) => {
    if (!toDoData.length) {
        toDoListWrapperEl.style.display = "none";
        noToDoListWrapperEl.style.display = "flex";
    } else {
        noToDoListWrapperEl.style.display = "none";
        toDoListWrapperEl.style.display = "flex";
    }

    let filteredData = toDoData;
    if (filter === "done") {
        filteredData = toDoData.filter(item => item.done)
    } else if (filter === "toBeDone") {
        filteredData = toDoData.filter(item => !item.done)
    }

    const formatData = (id) => {
        const date = new Date(id);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based

        const formattedDate = `${day}.${month}`;
        return formattedDate;
    }

    toDoListsWrapperEl.innerHTML = filteredData.map((item, index) => {
        return `
                <div class="to_do relative" data-id="${item.id}">
                <span class="absolute right-[32px] -top-[0%] -translate-y-[50%] text-xs text-gray-300">${formatData(item.id)}</span>
                    <div class="flex items-center gap-1.5">
                        <span>${index + 1}.</span>
                        <span>${item.desc}</span>
                    </div>
                    <div class="flex items-center gap-4">
                    <button class="edit_btn text-[#00bcff] select-none">Edit</button>
                    <button class="delete_btn text-red-500 select-none">Delete</button>
                        <button class="toggle_to_do border border-gray-400 size-6 flex items-center justify-center text-red-500">
                            ${item.done ? `<img class="toggle_to_do size-5" src="./src/assets/checked.svg" alt="">` : ``}
                        </button>
                    </div>
                </div>
        `
    }).join("");
}
renderToDoData();

let editingItem = null;

inputEl.addEventListener("keydown", () => {
    let count = 0;
    if (!inputEl.value && count) {
        errorFill.style.display = "block";
        return
    } else {
        errorFill.style.display = "none";
    }
    count = 1;
})

formEl.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!inputEl.value) {
        errorFill.style.display = "block";
        return
    } else {
        errorFill.style.display = "none";
    }
    if (editingItem) {
        const editedItem = {
            desc: inputEl.value,
            id: editingItem.id,
            done: editingItem.done
        }
        toDoData = toDoData.map((item) => item.id === editedItem.id ? editedItem : item);
        formBtn.textContent = "Create";
        formBtn.style.color = "black";
        formBtn.style.backgroundColor = "#cafe6e";
        editingItem = null;
    } else {
        const newTodo = {
            desc: inputEl.value,
            id: new Date().getTime(),
            done: false
        }
        toDoData.push(newTodo);
    }
    localStorage.setItem("data", JSON.stringify(toDoData));
    renderToDoData();
    countCheckedToDo();
    inputEl.value = "";
})

let tabsData = "";

toDoListsWrapperEl.addEventListener("click", (e) => {
    const eventTarget = e.target
    if (eventTarget.classList.contains("delete_btn")) {
        const datasetID = eventTarget.closest(".to_do").dataset.id;
        toDoData = toDoData.filter((item) => {
            return item.id != datasetID
        });
        localStorage.setItem("data", JSON.stringify(toDoData));
        renderToDoData();
        countCheckedToDo();
        inputFocus();
    }
    if (eventTarget.classList.contains("edit_btn")) {
        formBtn.textContent = "Save";
        formBtn.style.color = "white";
        formBtn.style.backgroundColor = "#00bcff";
        inputEl.focus();
        const id = eventTarget.closest(".to_do").dataset.id;
        editingItem = toDoData.find(item => item.id === Number(id));
        inputEl.value = editingItem.desc;
        eventTarget.closest(".to_do").style.borderColor = "white";
    }

    if (eventTarget.classList.contains("toggle_to_do")) {
        const datasetID = eventTarget.closest(".to_do").dataset.id;
        let toDo = toDoData.find(item => item.id == datasetID);
        toDo.done = (!toDo.done);
        toDoData = toDoData.map((item) => item.id === datasetID ? toDo : item);
        localStorage.setItem("data", JSON.stringify(toDoData));
        countCheckedToDo();
        renderToDoData(tabsData);
    }
})


const countCheckedToDo = () => {
    const checklistData = toDoData.filter(item => item.done === true);
    checklistEl.textContent = `${checklistData.length}/${toDoData.length} done`;
}
countCheckedToDo();


allBtn.style.borderColor = "white";
allBtn.addEventListener("click", () => {
    allBtn.style.borderColor = "white";
    doneBtn.style.borderColor = "";
    toBeDoneBtn.style.borderColor = "";
    tabsData = "all";
    renderToDoData(tabsData);
})


doneBtn.addEventListener("click", () => {
    allBtn.style.borderColor = "";
    doneBtn.style.borderColor = "white";
    toBeDoneBtn.style.borderColor = "";
    tabsData = "done"
    renderToDoData(tabsData);
})

toBeDoneBtn.addEventListener("click", () => {
    allBtn.style.borderColor = "";
    doneBtn.style.borderColor = "";
    toBeDoneBtn.style.borderColor = "white";
    tabsData = "toBeDone"
    renderToDoData(tabsData);
})