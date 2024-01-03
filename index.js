import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, set, onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
    databaseURL: "https://adaydb-8efe8-default-rtdb.asia-southeast1.firebasedatabase.app/"
}

const app = initializeApp(appSettings);
const database = getDatabase(app);
const expenseListInDB = ref(database, "expenseList");
const totalInDB = ref(database, "total")

const descriptionFieldEl = document.getElementById("description-input");
const priceFieldEl = document.getElementById("price-input");
const totalEl = document.getElementById("total-el");
const addButtonEl = document.getElementById("add-button");
const expenseListEl = document.getElementById("expense-list");
let totalValue = 0;

addButtonEl.addEventListener("click", function() {
    let descriptionValue = descriptionFieldEl.value;
    let priceValue = priceFieldEl.value;
    let expense = {description: descriptionValue, price: priceValue};
    totalValue += Number(priceValue);
    let total = {value: totalValue};

    push(expenseListInDB, expense);
    set(totalInDB, total);

    appendItemToExpenseListEl(descriptionValue, priceValue);

    updateTotalValue(total.value);

    clearInputFieldEl();
});

onValue(expenseListInDB, function(snapshot){
    let expenseItemsArray = Object.values(snapshot.val());

    for (let i = 0; i < expenseItemsArray.length; i++) {
        let currentItem = expenseItemsArray[i];

        appendItemToExpenseListEl(currentItem.description, currentItem.price);
    }
})

onValue(totalInDB, function(snapshot){
    let totalExpenseValue = Object.values(snapshot.val());

    updateTotalValue(totalExpenseValue);
})

function clearInputFieldEl() {
    descriptionFieldEl.value = "";
    priceFieldEl.value = "";
}

function appendItemToExpenseListEl(itemDescription, itemPrice) {
    let html = `
        <li><span>${itemDescription}</span><span>₱ ${itemPrice}</span></li>
    `;

    expenseListEl.innerHTML += html;
}

function updateTotalValue(totalExpense) {
    totalEl.innerHTML = `₱ ${totalExpense}`;
}

