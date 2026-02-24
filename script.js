import { ref, set, push, onValue, remove } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-database.js";

// --- GLOBAL STATE ---
let sales = [];
let purchases = [];
let notes = [];
let payments = [];
let stock = [];
let parties = [];
let recentTxns = [];

// Counters will now be based on data length or separate counter node
let invCounter = 1;
let purCounter = 1;
let noteCounter = 1;
let payCounter = 1;
let itemCounter = 1;

// --- FORMATTING UTILS ---
const fmt = (num) => {
    return '₹' + Number(num).toLocaleString('en-IN', { maximumFractionDigits: 2 });
};

const getBadge = (text) => {
    if (!text) return '';
    let t = text.toLowerCase();
    let color = 'gray';
    if (t === 'paid' || t === 'received' || t === 'ok' || t === 'success' || t === 'active') color = 'green';
    else if (t === 'unpaid' || t === 'low') color = 'red';
    else if (t === 'credit note' || t === 'receipt' || t === 'customer') color = 'blue';
    else if (t === 'debit note' || t === 'payment' || t === 'supplier') color = 'amber';
    return `<span class="badge badge-${color}">${text}</span>`;
};

// Expose utils to window
window.fmt = fmt;
window.getBadge = getBadge;

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    setupFirebaseListeners();

    // Setup closes for modals when clicking overlay
    document.getElementById('overlay').addEventListener('click', function (e) {
        if (e.target === this) {
            document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
            this.classList.remove('open');
        }
    });
});

function setupFirebaseListeners() {
    const db = window.db; // From index.html inline script

    // Listen to Sales
    onValue(ref(db, 'sales'), (snapshot) => {
        sales = [];
        let rTxns = [];
        snapshot.forEach(child => {
            let data = child.val();
            data.id = child.key; // Store firebase key for edits/deletes
            sales.push(data);
            rTxns.push({ no: data.no, date: data.date, party: data.customer, type: 'Sales', amount: data.total, status: data.status });
        });
        sales.reverse(); // Newest first
        invCounter = sales.length > 0 ? parseInt(sales[0].no.replace(/\D/g, '')) + 1 : 1;

        // update recents temporarily
        recentTxns = rTxns.reverse().slice(0, 5);

        renderSales();
        renderDashboard();
    });

    // Listen to Purchases
    onValue(ref(db, 'purchases'), (snapshot) => {
        purchases = [];
        snapshot.forEach(child => {
            let data = child.val();
            data.id = child.key;
            purchases.push(data);
        });
        purchases.reverse();
        purCounter = purchases.length > 0 ? parseInt(purchases[0].no.replace(/\D/g, '')) + 1 : 1;
        renderPurchase();
        renderDashboard();
    });

    onValue(ref(db, 'notes'), (snapshot) => {
        notes = [];
        snapshot.forEach(child => { let d = child.val(); d.id = child.key; notes.push(d); });
        notes.reverse();
        noteCounter = notes.length > 0 ? parseInt(notes[0].no.replace(/\D/g, '')) + 1 : 1;
        renderNotes();
    });

    onValue(ref(db, 'payments'), (snapshot) => {
        payments = [];
        snapshot.forEach(child => { let d = child.val(); d.id = child.key; payments.push(d); });
        payments.reverse();
        payCounter = payments.length > 0 ? parseInt(payments[0].no.replace(/\D/g, '')) + 1 : 1;
        renderPayments();
    });

    onValue(ref(db, 'stock'), (snapshot) => {
        stock = [];
        snapshot.forEach(child => { let d = child.val(); d.id = child.key; stock.push(d); });
        stock.reverse();
        itemCounter = stock.length > 0 ? parseInt(stock[0].code.replace(/\D/g, '')) + 1 : 1;
        renderStock();
        renderDashboard();
    });

    onValue(ref(db, 'parties'), (snapshot) => {
        parties = [];
        snapshot.forEach(child => { let d = child.val(); d.id = child.key; parties.push(d); });
        parties.reverse();
        renderParties();
        renderDashboard();
    });
}

// --- NAVIGATION ---
const pages = {
    'dashboard': 'Dashboard',
    'sales': 'Sales & Invoices',
    'purchase': 'Purchases',
    'notes': 'Credit & Debit Notes',
    'payments': 'Payments & Receipts',
    'stock': 'Stock & Inventory',
    'parties': 'Parties & Ledgers',
    'reports': 'Reports'
};

function showPage(pageId, navElement) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('page-' + pageId).classList.add('active');
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    navElement.classList.add('active');
    document.getElementById('page-title').innerText = pages[pageId];
}
window.showPage = showPage;

// --- MODALS ---
function openModal(id) {
    document.getElementById('overlay').classList.add('open');
    document.getElementById(id).classList.add('active');

    if (id === 'invoiceModal') {
        document.getElementById('inv-no').value = `INV-${String(invCounter).padStart(3, '0')}`;
        document.getElementById('inv-date').valueAsDate = new Date();
        populateParties('inv-customer', ['Customer', 'Both']);
        document.getElementById('inv-lines').innerHTML = '';
        addInvRow();
        calcInvoice();
    }
    else if (id === 'purchaseModal') {
        document.getElementById('pur-no').value = `PUR-${String(purCounter).padStart(3, '0')}`;
        document.getElementById('pur-date').valueAsDate = new Date();
        populateParties('pur-supplier', ['Supplier', 'Both']);
        document.getElementById('pur-lines').innerHTML = '';
        addPurRow();
        calcPurchase();
    }
    else if (id === 'itemModal') {
        document.getElementById('itm-code').value = `ITM-${String(itemCounter).padStart(3, '0')}`;
    }
}
window.openModal = openModal;

function closeModal(id) {
    document.getElementById(id).classList.remove('active');
    document.getElementById('overlay').classList.remove('open');
}
window.closeModal = closeModal;

function openNoteModal(type) {
    document.getElementById('note-modal-title').innerText = type;
    document.getElementById('note-no').value = (type === 'Credit Note' ? 'CN-' : 'DN-') + String(noteCounter).padStart(3, '0');
    populateParties('note-party', ['Customer', 'Supplier', 'Both']);
    openModal('noteModal');
}
window.openNoteModal = openNoteModal;

function openPaymentModal(type) {
    document.getElementById('payment-modal-title').innerText = type;
    document.getElementById('pay-no').value = (type === 'Receipt' ? 'RCP-' : 'PAY-') + String(payCounter).padStart(3, '0');
    populateParties('pay-party', ['Customer', 'Supplier', 'Both']);
    openModal('paymentModal');
}
window.openPaymentModal = openPaymentModal;

// --- RENDERERS ---
function renderDashboard() {
    let tbody = document.getElementById('recent-tbody');
    tbody.innerHTML = recentTxns.map(t => `
        <tr>
            <td>${t.no}</td>
            <td>${t.date}</td>
            <td>${t.party}</td>
            <td>${t.type}</td>
            <td>${fmt(t.amount)}</td>
            <td>${getBadge(t.status)}</td>
        </tr>
    `).join('');

    // Bar chart
    let chart = document.getElementById('sales-chart');
    let days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    let values = [30, 50, 40, 70, 60, 90, 100]; // Heights in %

    chart.innerHTML = days.map((day, i) => `
        <div class="bar-wrapper">
            <div class="bar ${i === 6 ? 'highlight' : ''}" style="height: ${values[i]}%"></div>
            <div class="bar-label">${day}</div>
        </div>
    `).join('');
}

function renderSales(data = sales) {
    document.getElementById('sales-tbody').innerHTML = data.map(s => `
        <tr>
            <td>${s.no}</td>
            <td>${s.date}</td>
            <td>${s.customer}</td>
            <td>${s.items}</td>
            <td>${fmt(s.subtotal)}</td>
            <td>${fmt(s.gst)}</td>
            <td><b>${fmt(s.total)}</b></td>
            <td>${getBadge(s.status)}</td>
            <td>
                <button class="btn" style="padding:4px 8px; font-size:11px;" onclick="editRecord('sales', '${s.id}')">✎</button>
                <button class="btn btn-danger" style="padding:4px 9px; font-size:11px; margin-left:4px;" onclick="deleteRecord('sales', '${s.id}')">✕</button>
            </td>
        </tr>
    `).join('');
}

function renderPurchase(data = purchases) {
    document.getElementById('purchase-tbody').innerHTML = data.map(s => `
        <tr>
            <td>${s.no}</td>
            <td>${s.date}</td>
            <td>${s.supplier}</td>
            <td>${s.items}</td>
            <td>${fmt(s.amount)}</td>
            <td>${fmt(s.gst)}</td>
            <td><b>${fmt(s.total)}</b></td>
            <td>${getBadge(s.status)}</td>
            <td>
                <button class="btn" style="padding:4px 8px; font-size:11px;" onclick="editRecord('purchases', '${s.id}')">✎</button>
                <button class="btn btn-danger" style="padding:4px 9px; font-size:11px; margin-left:4px;" onclick="deleteRecord('purchases', '${s.id}')">✕</button>
            </td>
        </tr>
    `).join('');
}

function renderNotes(data = notes) {
    document.getElementById('notes-tbody').innerHTML = data.map(s => `
        <tr>
            <td>${s.no}</td>
            <td>${s.date}</td>
            <td>${s.party}</td>
            <td>${s.against}</td>
            <td>${getBadge(s.type)}</td>
            <td><b>${fmt(s.amount)}</b></td>
            <td>${s.reason}</td>
            <td>
                <button class="btn" style="padding:4px 8px; font-size:11px;" onclick="editRecord('notes', '${s.id}')">✎</button>
                <button class="btn btn-danger" style="padding:4px 9px; font-size:11px; margin-left:4px;" onclick="deleteRecord('notes', '${s.id}')">✕</button>
            </td>
        </tr>
    `).join('');
}

function renderPayments(data = payments) {
    document.getElementById('payments-tbody').innerHTML = data.map(s => `
        <tr>
            <td>${s.no}</td>
            <td>${s.date}</td>
            <td>${s.party}</td>
            <td>${s.mode}</td>
            <td>${getBadge(s.type)}</td>
            <td><b>${fmt(s.amount)}</b></td>
            <td>${s.ref}</td>
            <td>
                <button class="btn" style="padding:4px 8px; font-size:11px;" onclick="editRecord('payments', '${s.id}')">✎</button>
                <button class="btn btn-danger" style="padding:4px 9px; font-size:11px; margin-left:4px;" onclick="deleteRecord('payments', '${s.id}')">✕</button>
            </td>
        </tr>
    `).join('');
}

function renderStock(data = stock) {
    document.getElementById('stock-tbody').innerHTML = data.map(s => `
        <tr>
            <td>${s.code}</td>
            <td>${s.name}</td>
            <td>${s.cat}</td>
            <td>${s.unit}</td>
            <td>${s.open}</td>
            <td style="color:var(--accent-green)">${s.in}</td>
            <td style="color:var(--danger-red)">${s.out}</td>
            <td><b>${s.close}</b></td>
            <td>${fmt(s.rate)}</td>
            <td>${fmt(s.rate * s.close)}</td>
            <td>${getBadge(s.status)}</td>
            <td>
                <button class="btn" style="padding:4px 8px; font-size:11px;" onclick="editRecord('stock', '${s.id}')">✎</button>
                <button class="btn btn-danger" style="padding:4px 9px; font-size:11px; margin-left:4px;" onclick="deleteRecord('stock', '${s.id}')">✕</button>
            </td>
        </tr>
    `).join('');
}

function renderParties(data = parties) {
    document.getElementById('parties-tbody').innerHTML = data.map(s => `
        <tr>
            <td>${s.code}</td>
            <td>${s.name}</td>
            <td>${getBadge(s.type)}</td>
            <td>${s.phone}</td>
            <td>${s.gst}</td>
            <td style="color: ${s.bal.includes('Cr') ? 'var(--danger-red)' : 'var(--accent-green)'}"><b>${fmt(parseInt(s.bal) || 0)} ${s.bal.includes('Cr') ? 'Cr' : 'Dr'}</b></td>
            <td>${fmt(s.limit)}</td>
            <td>${getBadge(s.status)}</td>
            <td>
                <button class="btn" style="padding:4px 8px; font-size:11px;" onclick="editRecord('parties', '${s.id}')">✎</button>
                <button class="btn btn-danger" style="padding:4px 9px; font-size:11px; margin-left:4px;" onclick="deleteRecord('parties', '${s.id}')">✕</button>
            </td>
        </tr>
    `).join('');
}

function populateParties(selectId, types) {
    let sel = document.getElementById(selectId);
    sel.innerHTML = parties.filter(p => types.includes(p.type)).map(p => `<option value="${p.name}">${p.name}</option>`).join('');
}

function populateItems(selectElement) {
    selectElement.innerHTML = stock.map(s => `<option value="${s.rate}" data-name="${s.name}">${s.name}</option>`).join('');
    // fire change to set rate
    selectElement.dispatchEvent(new Event('change'));
}

// --- LINE ITEMS LOGIC ---
const getLineTemplate = (type) => `
    <div class="item-row">
        <div>
            <select class="input line-item-select" onchange="updateLineRate(this, '${type}')"></select>
        </div>
        <div>
            <input type="number" class="input line-qty" value="1" min="1" oninput="calc${type}()">
        </div>
        <div>
            <input type="number" class="input line-rate" value="0" oninput="calc${type}()">
        </div>
        <div>
            <input type="number" class="input line-amt" value="0" readonly>
        </div>
        <div>
            <button class="del-btn" onclick="removeRow(this, '${type}')">✕</button>
        </div>
    </div>
`;

function addInvRow() {
    let div = document.createElement('div');
    div.innerHTML = getLineTemplate('Invoice');
    document.getElementById('inv-lines').appendChild(div.firstElementChild);
    populateItems(document.getElementById('inv-lines').lastElementChild.querySelector('.line-item-select'));
    calcInvoice();
}

function addPurRow() {
    let div = document.createElement('div');
    div.innerHTML = getLineTemplate('Purchase');
    document.getElementById('pur-lines').appendChild(div.firstElementChild);
    populateItems(document.getElementById('pur-lines').lastElementChild.querySelector('.line-item-select'));
    calcPurchase();
}

function removeRow(btn, type) {
    btn.closest('.item-row').remove();
    if (type === 'Invoice') calcInvoice(); else calcPurchase();
}

function updateLineRate(select, type) {
    let rate = select.value;
    select.closest('.item-row').querySelector('.line-rate').value = rate;
    if (type === 'Invoice') calcInvoice(); else calcPurchase();
}

function calcInvoice() {
    let rows = document.getElementById('inv-lines').querySelectorAll('.item-row');
    let subtotal = 0;

    rows.forEach(row => {
        let q = parseFloat(row.querySelector('.line-qty').value) || 0;
        let r = parseFloat(row.querySelector('.line-rate').value) || 0;
        let amt = q * r;
        row.querySelector('.line-amt').value = amt.toFixed(2);
        subtotal += amt;
    });

    let gstRate = parseFloat(document.getElementById('inv-gst-rate').value) || 0;
    let gstAmt = subtotal * (gstRate / 100);
    let discount = parseFloat(document.getElementById('inv-discount').value) || 0;

    let total = subtotal + gstAmt - discount;

    document.getElementById('inv-subtotal').innerText = fmt(subtotal);
    document.getElementById('inv-gst-amt').innerText = fmt(gstAmt);
    document.getElementById('inv-grand-total').innerText = fmt(total);
}

function calcPurchase() {
    let rows = document.getElementById('pur-lines').querySelectorAll('.item-row');
    let subtotal = 0;

    rows.forEach(row => {
        let q = parseFloat(row.querySelector('.line-qty').value) || 0;
        let r = parseFloat(row.querySelector('.line-rate').value) || 0;
        let amt = q * r;
        row.querySelector('.line-amt').value = amt.toFixed(2);
        subtotal += amt;
    });

    let gstAmt = subtotal * 0.18; // fixed 18% for purchase demo
    let total = subtotal + gstAmt;

    document.getElementById('pur-subtotal').innerText = fmt(subtotal);
    document.getElementById('pur-gst-amt').innerText = fmt(gstAmt);
    document.getElementById('pur-grand-total').innerText = fmt(total);
}

// --- SAVE FUNCTIONS ---
function saveInvoice(status) {
    let num = document.getElementById('inv-no').value;
    let cus = document.getElementById('inv-customer').value;
    let totalText = document.getElementById('inv-grand-total').innerText.replace(/[₹,]/g, '');
    let total = parseFloat(totalText);

    let dbRef = editMode.active && editMode.type === 'sales' ? ref(window.db, 'sales/' + editMode.id) : push(ref(window.db, 'sales'));
    set(dbRef, {
        no: num,
        date: document.getElementById('inv-date').value,
        customer: cus,
        items: document.getElementById('inv-lines').children.length,
        subtotal: total * 0.82,
        gst: total * 0.18,
        total: total,
        status: status
    });

    closeModal('invoiceModal');
    showToast(`Invoice ${num} saved as ${status}`);
    editMode = { active: false, type: null, id: null };
}
window.saveInvoice = saveInvoice;

function savePurchase() {
    let num = document.getElementById('pur-no').value;
    let sup = document.getElementById('pur-supplier').value;
    let totalText = document.getElementById('pur-grand-total').innerText.replace(/[₹,]/g, '');
    let total = parseFloat(totalText);

    let dbRef = editMode.active && editMode.type === 'purchases' ? ref(window.db, 'purchases/' + editMode.id) : push(ref(window.db, 'purchases'));
    set(dbRef, {
        no: num,
        date: document.getElementById('pur-date').value,
        supplier: sup,
        items: document.getElementById('pur-lines').children.length,
        amount: total * 0.82,
        gst: total * 0.18,
        total: total,
        status: 'Ordered'
    });

    closeModal('purchaseModal');
    showToast(`Purchase ${num} saved successfully`);
    editMode = { active: false, type: null, id: null };
}
window.savePurchase = savePurchase;

function saveNote() {
    let num = document.getElementById('note-no').value;
    let type = document.getElementById('note-modal-title').innerText;

    let dbRef = editMode.active && editMode.type === 'notes' ? ref(window.db, 'notes/' + editMode.id) : push(ref(window.db, 'notes'));
    set(dbRef, {
        no: num,
        date: new Date().toISOString().split('T')[0],
        party: document.getElementById('note-party').value,
        against: 'New Note',
        type: type,
        amount: parseFloat(document.getElementById('note-amt').value) || 0,
        reason: document.getElementById('note-reason').value
    });

    closeModal('noteModal');
    showToast(`${type} ${num} saved`);
    editMode = { active: false, type: null, id: null };
}
window.saveNote = saveNote;

function savePayment() {
    let num = document.getElementById('pay-no').value;
    let type = document.getElementById('payment-modal-title').innerText;

    let dbRef = editMode.active && editMode.type === 'payments' ? ref(window.db, 'payments/' + editMode.id) : push(ref(window.db, 'payments'));
    set(dbRef, {
        no: num,
        date: new Date().toISOString().split('T')[0],
        party: document.getElementById('pay-party').value,
        mode: document.getElementById('pay-mode').value,
        type: type,
        amount: parseFloat(document.getElementById('pay-amt').value) || 0,
        ref: 'Auto-gen'
    });

    closeModal('paymentModal');
    showToast(`${type} ${num} saved`);
    editMode = { active: false, type: null, id: null };
}
window.savePayment = savePayment;

function saveItem() {
    let code = document.getElementById('itm-code').value;

    let dbRef = editMode.active && editMode.type === 'stock' ? ref(window.db, 'stock/' + editMode.id) : push(ref(window.db, 'stock'));
    set(dbRef, {
        code: code,
        name: document.getElementById('itm-name').value || 'New Item',
        cat: document.getElementById('itm-cat').value || 'General',
        unit: document.getElementById('itm-unit').value,
        open: parseInt(document.getElementById('itm-open').value) || 0,
        in: 0, out: 0,
        close: parseInt(document.getElementById('itm-open').value) || 0,
        rate: parseFloat(document.getElementById('itm-sale').value) || 0,
        status: 'OK'
    });

    closeModal('itemModal');
    showToast(`Stock Item ${code} saved`);
    editMode = { active: false, type: null, id: null };
}
window.saveItem = saveItem;

function saveParty() {
    let dbRef = editMode.active && editMode.type === 'parties' ? ref(window.db, 'parties/' + editMode.id) : push(ref(window.db, 'parties'));
    set(dbRef, {
        code: editMode.active ? parties.find(p => p.id === editMode.id).code : 'PRT-' + Date.now().toString().slice(-4),
        name: document.getElementById('pty-name').value || 'New Party',
        type: document.getElementById('pty-type').value,
        phone: document.getElementById('pty-phone').value || '',
        gst: document.getElementById('pty-gst').value || '',
        bal: '0', limit: 0, status: 'Active'
    });

    closeModal('partyModal');
    showToast(`Party saved successfully`);
    editMode = { active: false, type: null, id: null };
}
window.saveParty = saveParty;

// --- UTILS ---
function filterSales(type, btn) {
    document.querySelectorAll('.filter-group .btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    if (type === 'All') renderSales(sales);
    else renderSales(sales.filter(s => s.status === type));
}

function searchTable(text, tbodyId) {
    let filter = text.toLowerCase();
    let rows = document.getElementById(tbodyId).getElementsByTagName('tr');

    for (let row of rows) {
        let cells = row.getElementsByTagName('td');
        let match = false;
        for (let cell of cells) {
            if (cell.innerText.toLowerCase().indexOf(filter) > -1) {
                match = true;
                break;
            }
        }
        row.style.display = match ? '' : 'none';
    }
}

function showToast(msg) {
    let toast = document.getElementById('toast');
    toast.innerText = msg;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}
