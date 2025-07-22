document.addEventListener('DOMContentLoaded', () => {
    const balance = document.getElementById('balance');
    const totalIncome = document.getElementById('total-income');
    const totalExpense = document.getElementById('total-expense');
    const transactionList = document.getElementById('transaction-list');
    const form = document.getElementById('transaction-form');
    const textInput = document.getElementById('text');
    const amountInput = document.getElementById('amount');
    const chartCanvas = document.getElementById('myChart').getContext('2d');

    // Get transactions from local storage
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    let myChart;

    // Add a transaction
    const addTransaction = (e) => {
        e.preventDefault();
        if (textInput.value.trim() === '' || amountInput.value.trim() === '') {
            alert('Please add a description and amount.');
        } else {
            const transaction = {
                id: generateID(),
                text: textInput.value,
                amount: +amountInput.value
            };
            transactions.push(transaction);
            addTransactionDOM(transaction);
            updateValues();
            updateLocalStorage();
            textInput.value = '';
            amountInput.value = '';
        }
    };

    // Generate a random ID
    const generateID = () => Math.floor(Math.random() * 1000000);

    // Add transactions to the DOM list
    const addTransactionDOM = (transaction) => {
        const sign = transaction.amount < 0 ? '-' : '+';
        const item = document.createElement('li');
        item.classList.add(transaction.amount < 0 ? 'expense' : 'income');
        item.innerHTML = `
            ${transaction.text} <span>${sign} Rs. ${Math.abs(transaction.amount)}</span>
            <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
        `;
        transactionList.appendChild(item);
    };

    // Update the balance, income, and expense
    const updateValues = () => {
        const amounts = transactions.map(t => t.amount);
        const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
        const income = amounts.filter(item => item > 0).reduce((acc, item) => (acc += item), 0).toFixed(2);
        const expense = (amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1).toFixed(2);

        balance.innerText = `Rs. ${total}`;
        totalIncome.innerText = `Rs. ${income}`;
        totalExpense.innerText = `Rs. ${expense}`;

        updateChart(income, expense);
    };

    // Remove a transaction by ID
    window.removeTransaction = (id) => {
        transactions = transactions.filter(t => t.id !== id);
        updateLocalStorage();
        init();
    };

    // Update local storage
    const updateLocalStorage = () => {
        localStorage.setItem('transactions', JSON.stringify(transactions));
    };
    
    // Update the pie chart
    const updateChart = (income, expense) => {
        if (myChart) {
            myChart.destroy();
        }
        myChart = new Chart(chartCanvas, {
            type: 'pie',
            data: {
                labels: ['Income', 'Expense'],
                datasets: [{
                    data: [income, expense],
                    backgroundColor: ['#2ecc71', '#e74c3c'],
                    borderColor: ['#2ecc71', '#e74c3c'],
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
            }
        });
    };

    // Initialize the app
    const init = () => {
        transactionList.innerHTML = '';
        transactions.forEach(addTransactionDOM);
        updateValues();
    };

    init();

    // Event Listeners
    form.addEventListener('submit', addTransaction);
});