
const addName = document.querySelector('.add-name');
const addDisc = document.querySelector('.add-disc');
const priorImportant = document.querySelector('.important');
const priorNormal = document.querySelector('.normal');
const addDate = document.querySelector('#add-date');
const addBtn = document.querySelector('.btn-add');
const list = document.querySelector('.list');

const findNameRadio = document.querySelector('#name');
const findPriorityRadio = document.querySelector('#priority');
const findDescRadio = document.querySelector('#desc');
const findDateRadio = document.querySelector('#date');
const findInput = document.querySelector('.find-input');
const searchBtn = document.querySelector('.search-btn');

const dispDayRadio = document.querySelector('#day');
const dispWeekRadio = document.querySelector('#week');
const dispMonthRadio = document.querySelector('#month');
const displayBtn = document.querySelector('.display-btn');

const sortPriopityRadio = document.querySelector('#sort-priority');
const sortDateRadio = document.querySelector('#sort-date');
const sortBtn = document.querySelector('.sort-btn');

const currentDate = document.querySelector('.cur-date');
currentDate.textContent = new Date().toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"});

addBtn.addEventListener('click', addItem);
list.addEventListener('click', deleteItem);
searchBtn.addEventListener('click', searchItem);
displayBtn.addEventListener('click', displayByDate);
sortBtn.addEventListener('click', sortItems);

function addItem(){
    let isImportant = '';
    let isNormal = '';
    if(priorImportant.checked){
        isNormal = 'none';
    }else{
        isImportant = 'none';
    }
    if(!addName.value || !addDisc.value || !addDate.value){
        alert('Потрібно заповнити всі поля!');
    }else{
        let listItem = `
        <div class="list-item">
            <div class="list-item-part">
                <img src="img/important.png" alt="" class="img-important ${isImportant}">
                <img src="img/usually.png" alt="" class="img-normal ${isNormal}">
                <p class="item-name">${addName.value}</p>
                <p class="item-date">До: <span>${addDate.value}</span></p>
            </div>
            <div class="list-item-part">
                <p class="list-desc">${addDisc.value}</p>
                <button class="btn-edit"><img src="img/edit.png" alt=""></button>
                <button class="btn-del"><img src="img/bin_del.png" alt=""></button>
            </div>
        </div>     
        `
        list.insertAdjacentHTML('beforeend', listItem);
        cleanForm(); 
    }
}

function deleteItem(e){
    if(e.target.classList.contains('btn-del')){
        const parentItem = e.target.closest('.list-item');
        parentItem.remove();
    }
}

function cleanForm(){
    addName.value = '';
    addDisc.value = '';
    addDate.value = '';
}

function searchItem() {
    const searchTerm = findInput.value.toLowerCase();
    const listItems = document.querySelectorAll('.list-item');

    listItems.forEach(item => {
        const itemName = item.querySelector('.item-name').textContent.toLowerCase();
        const itemDesc = item.querySelector('.list-desc').textContent.toLowerCase();
        const itemDate = item.querySelector('.item-date span').textContent;

        item.style.display = 'block';

        if (findNameRadio.checked && !itemName.includes(searchTerm)) {
            item.style.display = 'none';
        } else if (findPriorityRadio.checked && !item.querySelector('.img-important').classList.contains('none') && searchTerm !== 'важлива') {
            item.style.display = 'none';
        } else if (findPriorityRadio.checked && !item.querySelector('.img-normal').classList.contains('none') && searchTerm !== 'звичайна') {
            item.style.display = 'none';
        } else if (findDescRadio.checked && !itemDesc.includes(searchTerm)) {
            item.style.display = 'none';
        } else if (findDateRadio.checked && itemDate !== searchTerm) {
            item.style.display = 'none';
        }
    });
}

function displayByDate() {
    const currentDate = new Date();

    if(dispDayRadio.checked){
        showItemsForDay(currentDate)
    }else if(dispWeekRadio.checked){
        showItemsForWeek(currentDate)
    }else if(dispMonthRadio.checked){
        showItemsForMonth(currentDate)
    }
}

function showItemsForDay(currentDate) {
    const listItems = document.querySelectorAll('.list-item');

    listItems.forEach(item => {
        const itemDate = new Date(item.querySelector('.item-date span').textContent);
        item.style.display = itemDate.getDate() === currentDate.getDate() ? 'block' : 'none';
    });
}

function showItemsForWeek(currentDate) {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay()); // Начало недели - воскресенье
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6); // Конец недели - суббота
    endOfWeek.setHours(23, 59, 59, 999);

    const listItems = document.querySelectorAll('.list-item');

    listItems.forEach(item => {
        const itemDate = new Date(item.querySelector('.item-date span').textContent);
        item.style.display = itemDate >= startOfWeek && itemDate <= endOfWeek ? 'block' : 'none';
    });
}

function showItemsForMonth(currentDate) {
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59, 999);

    const listItems = document.querySelectorAll('.list-item');

    listItems.forEach(item => {
        const itemDate = new Date(item.querySelector('.item-date span').textContent);
        item.style.display = itemDate >= startOfMonth && itemDate <= endOfMonth ? 'block' : 'none';
    });
}

function sortItems() {
    const listItems = document.querySelectorAll('.list-item');

    const sortedList = Array.from(listItems).sort((a, b) => {
        const dateA = new Date(a.querySelector('.item-date span').textContent);
        const dateB = new Date(b.querySelector('.item-date span').textContent);
        
        if (sortDateRadio.checked) {
            return dateA - dateB;
        } else if (sortPriopityRadio.checked) {
            const priorityA = a.querySelector('.img-important').classList.contains('none') ? 'normal' : 'important';
            const priorityB = b.querySelector('.img-important').classList.contains('none') ? 'normal' : 'important';
            return priorityA.localeCompare(priorityB);
        } else {
            return 0;
        }
        
    });

    list.innerHTML = '';
    sortedList.forEach(item => list.appendChild(item));
}