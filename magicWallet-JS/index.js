/********************************************************
*********************UI Work*****************************
*********************************************************
********************************************************/

document.querySelector('#ewallet-form').addEventListener('submit', function (e) {
    e.preventDefault();

    //console.log('submitted');

    const type = document.querySelector('.add__type').value;
    const desc = document.querySelector('.add__description').value;
    const value = document.querySelector('.add__value').value;

    // console.log(type,desc,value);
    if (desc.length > 0 && value.length > 0) {

        addItems(type, desc, value);

        resetForm();
    }
});
function addItems(type, desc, value) {
    const time = getFormattedTime();
    const newHTML = `
    <div class="item">
          <div class="item-description-time">
            <div class="item-description">
              <p>${desc}</p>
            </div>
            <div class="item-time">
              <p>${time}</p>
            </div>
          </div>
          <div class="item-amount ${type === '+' ? 'income-amount' : 'expense-amount'}">
            <p>${type}${value}</p>
          </div>
        </div>
    `
    // console.log(newHTML);
    const collection = document.querySelector('.collection');
    collection.insertAdjacentHTML('afterbegin', newHTML);// it will add the new value at the begining 


    addTimesToLS(desc, time, type, value);
    showTotalIncome();
    showTotalExpenses();
    showTotalBalance();
}

function resetForm() {
    document.querySelector('.add__type').value = '+';
    document.querySelector('.add__description').value = '';
    document.querySelector('.add__value').value = '';
}

/********************************************************
*********************LS Work*****************************
*********************************************************
********************************************************/

function getItemsFromLS(){
    let items = localStorage.getItem('items');
    items = (items) ? JSON.parse(items) : [];//using ternary operator

    // if (items) {
    //     items = JSON.parse(items);
    // }
    // else {
    //     items = [];
    // }
    return items;
}

function addTimesToLS(desc, time, type, value) {
    let items=getItemsFromLS();
    items.push({ desc, time, type, value });
    localStorage.setItem('items', JSON.stringify(items));
}



/********************************************************
********Working with current date and time***************
************format = 25 Feb, 06:45 PM********************
********************************************************/

function getFormattedTime() {
    const now = new Date().toLocaleTimeString('en-us', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
    const date = now.split(',')[0].split(' ');
    const time = now.split(',')[1];
    const formattedTime = `${date[1]} ${date[0]}, ${time}`;
    return formattedTime;
}

/********************************************************
*********************LS Cookies**************************
*********************************************************
********************************************************/

showItems();
function showItems(){
    let items = getItemsFromLS();
    const collection = document.querySelector('.collection');
   
    for(let item of items){
        const newHTML = `
    <div class="item">
          <div class="item-description-time">
            <div class="item-description">
              <p>${item.desc}</p>
            </div>
            <div class="item-time">
              <p>${item.time}</p>
            </div>
          </div>
          <div class="item-amount ${item.type === '+' ? 'income-amount' : 'expense-amount'}">
            <p>${item.type}${item.value}</p>
          </div>
        </div>
    `;
        collection.insertAdjacentHTML('afterbegin', newHTML);
    }
}


/********************************************************
*********************Calculations************************
*********************************************************
********************************************************/
showTotalIncome();

function showTotalIncome(){
    let items = getItemsFromLS();
    let totalIncome =0;
    for(let item of items){
        if(item.type === '+'){
            totalIncome += parseInt(item.value);
        }
    }
    console.log(totalIncome);
    document.querySelector('.income__amount p').innerText=`$${totalIncome}`;
}

showTotalExpenses();

function showTotalExpenses() {
    let items = getItemsFromLS();
    let totalExpenses = 0;
    for (let item of items) {
        if (item.type === '-') {
            totalExpenses += parseInt(item.value);
        }
    }
    console.log(totalExpenses);
    document.querySelector('.expense__amount p').innerText = `$${totalExpenses}`;
}



/********************************************************
*********************Total Balance***********************
*********************************************************
********************************************************/

showTotalBalance();
function showTotalBalance(){
    const items = getItemsFromLS();
    let balance = 0;
    for(let item of items){
        if(item.type==='+'){
            balance += parseInt(item.value);
        }else{
            balance -= parseInt(item.value);
        }
    }
    document.querySelector('.balance__amount p').innerText = `$${balance}`;
    document.querySelector('header').className=(balance>=0)?'blue':'red';//using ternary operator
    // if(balance >0){
    //     document.querySelector('header').className='blue';
    // }else{
    //     document.querySelector('header').className = 'red';
    // }
}
