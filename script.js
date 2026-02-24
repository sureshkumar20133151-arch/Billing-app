// --- SEED DATA ---
let sales = [
    { no: 'INV-001', date: '2025-02-23', customer: 'Sri Murugan Stores', items: 3, subtotal: 35000, gst: 1750, total: 36750, status: 'Paid' },
    { no: 'INV-002', date: '2025-02-22', customer: 'Kannan Supermarket', items: 2, subtotal: 15000, gst: 750, total: 15750, status: 'Unpaid' },
    { no: 'INV-003', date: '2025-02-20', customer: 'City Bakes & Sweets', items: 5, subtotal: 82000, gst: 4100, total: 86100, status: 'Paid' },
    { no: 'INV-004', date: '2025-02-18', customer: 'Lakshmi Traders', items: 1, subtotal: 5400, gst: 270, total: 5670, status: 'Unpaid' },
    { no: 'INV-005', date: '2025-02-15', customer: 'Vasantham Hotel', items: 4, subtotal: 45000, gst: 2250, total: 47250, status: 'Paid' }
];

let purchases = [
    { no: 'PUR-001', date: '2025-02-21', supplier: 'Gold Winner Distributors', items: 10, amount: 150000, gst: 7500, total: 157500, status: 'Received' },
    { no: 'PUR-002', date: '2025-02-19', supplier: 'Idhayam Agencies', items: 5, amount: 85000, gst: 4250, total: 89250, status: 'Ordered' },
    { no: 'PUR-003', date: '2025-02-10', supplier: 'Sri Ram Refineries', items: 20, amount: 120000, gst: 6000, total: 126000, status: 'Received' }
];

let notes = [
    { no: 'CN-001', date: '2025-02-22', party: 'Kannan Supermarket', against: 'INV-002', type: 'Credit Note', amount: 1500, reason: 'Damaged Pouch Leakage' },
    { no: 'DN-001', date: '2025-02-20', party: 'Gold Winner Distributors', against: 'PUR-001', type: 'Debit Note', amount: 3000, reason: 'Shortage in Tin Weight' }
];

let payments = [
    { no: 'RCP-001', date: '2025-02-23', party: 'Sri Murugan Stores', mode: 'Bank Transfer', type: 'Receipt', amount: 36750, ref: 'UTR987654321' },
    { no: 'PAY-001', date: '2025-02-22', party: 'Idhayam Agencies', mode: 'UPI', type: 'Payment', amount: 89250, ref: 'UPI123456789' }
];

let stock = [
    { code: 'ITM-001', name: 'Sunflower Oil 1L Pkt (Box/10)', cat: 'Refined Oil', unit: 'BOX', open: 50, in: 200, out: 150, close: 100, rate: 1050, status: 'OK' },
    { code: 'ITM-002', name: 'Sunflower Oil 15KG Tin', cat: 'Refined Oil', unit: 'TIN', open: 20, in: 50, out: 65, close: 5, rate: 1650, status: 'LOW' },
    { code: 'ITM-003', name: 'Groundnut Oil 1L Pkt', cat: 'Cold Pressed', unit: 'PKT', open: 150, in: 300, out: 400, close: 50, rate: 185, status: 'LOW' },
    { code: 'ITM-004', name: 'Sesame (Gingelly) Oil 15KG Tin', cat: 'Cold Pressed', unit: 'TIN', open: 10, in: 20, out: 15, close: 15, rate: 3200, status: 'OK' },
    { code: 'ITM-005', name: 'Palm Oil 1L Pkt (Box/10)', cat: 'Refined Oil', unit: 'BOX', open: 100, in: 0, out: 60, close: 40, rate: 850, status: 'OK' }
];

let parties = [
    { code: 'CUS-001', name: 'Sri Murugan Stores', type: 'Customer', phone: '9876543210', gst: '33AADCA1234A1Z5', bal: '0', limit: 100000, status: 'Active' },
    { code: 'CUS-002', name: 'Kannan Supermarket', type: 'Customer', phone: '9876543211', gst: '33AABCD1234A1Z5', bal: '15750 Dr', limit: 200000, status: 'Active' },
    { code: 'SUP-001', name: 'Gold Winner Distributors', type: 'Supplier', phone: '9876543212', gst: '33AABCT1234A1Z5', bal: '157500 Cr', limit: 0, status: 'Active' },
    { code: 'BTH-001', name: 'City Bakes & Sweets', type: 'Both', phone: '9876543213', gst: '33AABCN1234A1Z5', bal: '25000 Dr', limit: 300000, status: 'Active' }
];

let recentTxns = [
    { no: 'INV-001', date: '2025-02-23', party: 'Sri Murugan Stores', type: 'Sales', amount: 36750, status: 'Paid' },
    { no: 'RCP-001', date: '2025-02-23', party: 'Sri Murugan Stores', type: 'Receipt', amount: 36750, status: 'Success' },
    { no: 'INV-002', date: '2025-02-22', party: 'Kannan Supermarket', type: 'Sales', amount: 15750, status: 'Unpaid' },
    { no: 'PAY-001', date: '2025-02-22', party: 'Idhayam Agencies', type: 'Payment', amount: 89250, status: 'Success' },
    { no: 'PUR-001', date: '2025-02-21', party: 'Gold Winner Distributors', type: 'Purchase', amount: 157500, status: 'Received' }
];

// Counters
let invCounter = 6;
let purCounter = 4;
let noteCounter = 2;
let payCounter = 2;
let itemCounter = 6;

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

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    renderDashboard();
    renderSales();
    renderPurchase();
    renderNotes();
    renderPayments();
    renderStock();
    renderParties();

    // Setup closes for modals when clicking overlay
    document.getElementById('overlay').addEventListener('click', function (e) {
        if (e.target === this) {
            document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
            this.classList.remove('open');
        }
    });

    // Initial Dashboard computations
    let tSales = sales.reduce((sum, s) => sum + s.total, 0);
    let tPur = purchases.reduce((sum, p) => sum + p.total, 0);
    let oRec = sales.filter(s => s.status === 'Unpaid').reduce((sum, s) => sum + s.total, 0);
    let oPay = parties.filter(p => p.bal.includes('Cr')).reduce((sum, p) => sum + parseInt(p.bal), 0);

    document.getElementById('dash-sales').innerText = fmt(tSales);
    document.getElementById('dash-purchase').innerText = fmt(tPur);
    document.getElementById('dash-receivable').innerText = fmt(oRec);
    document.getElementById('dash-payable').innerText = fmt(oPay);

    document.getElementById('stat-invoices-today').innerText = '1';
    document.getElementById('stat-low-stock').innerText = stock.filter(s => s.status === 'LOW').length;
    document.getElementById('stat-active-parties').innerText = parties.length;
    document.getElementById('stat-gst-payable').innerText = fmt(sales.reduce((s, i) => s + i.gst, 0) - purchases.reduce((s, i) => s + i.gst, 0));
    document.getElementById('stat-net-profit').innerText = fmt(tSales - tPur);

    // Initial PL computations
    let pSales = sales.reduce((sum, s) => sum + s.subtotal, 0);
    let pCogs = purchases.reduce((sum, p) => sum + p.amount, 0);
    document.getElementById('pl-gross-sales').innerText = fmt(pSales);
    document.getElementById('pl-net-sales').innerText = fmt(pSales);
    document.getElementById('pl-cogs').innerText = fmt(pCogs);
    document.getElementById('pl-opex').innerText = fmt(pSales * 0.1); // mock 10%
    document.getElementById('pl-net').innerText = fmt(pSales - pCogs - (pSales * 0.1));
});

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
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    // Show target
    document.getElementById('page-' + pageId).classList.add('active');

    // Update nav classes
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    navElement.classList.add('active');

    // Update Title
    document.getElementById('page-title').innerText = pages[pageId];
}

// --- MODALS ---
function openModal(id) {
    document.getElementById('overlay').classList.add('open');
    document.getElementById(id).classList.add('active');

    // Setup specifics
    if (id === 'invoiceModal') {
        document.getElementById('inv-no').value = `INV-00${invCounter}`;
        document.getElementById('inv-date').valueAsDate = new Date();
        populateParties('inv-customer', ['Customer', 'Both']);
        document.getElementById('inv-lines').innerHTML = '';
        addInvRow();
        calcInvoice();
    }
    else if (id === 'purchaseModal') {
        document.getElementById('pur-no').value = `PUR-00${purCounter}`;
        document.getElementById('pur-date').valueAsDate = new Date();
        populateParties('pur-supplier', ['Supplier', 'Both']);
        document.getElementById('pur-lines').innerHTML = '';
        addPurRow();
        calcPurchase();
    }
    else if (id === 'itemModal') {
        document.getElementById('itm-code').value = `ITM-00${itemCounter}`;
    }
}

function closeModal(id) {
    document.getElementById(id).classList.remove('active');
    document.getElementById('overlay').classList.remove('open');
}

function openNoteModal(type) {
    document.getElementById('note-modal-title').innerText = type;
    document.getElementById('note-no').value = (type === 'Credit Note' ? 'CN-00' : 'DN-00') + noteCounter;
    populateParties('note-party', ['Customer', 'Supplier', 'Both']);
    openModal('noteModal');
}

function openPaymentModal(type) {
    document.getElementById('payment-modal-title').innerText = type;
    document.getElementById('pay-no').value = (type === 'Receipt' ? 'RCP-00' : 'PAY-00') + payCounter;
    populateParties('pay-party', ['Customer', 'Supplier', 'Both']);
    openModal('paymentModal');
}

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
                <button class="btn" style="padding:4px 8px; font-size:11px;" onclick="editRecord('sales', '${s.no}')">✎</button>
                <button class="btn btn-danger" style="padding:4px 9px; font-size:11px; margin-left:4px;" onclick="deleteRecord('sales', '${s.no}')">✕</button>
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
                <button class="btn" style="padding:4px 8px; font-size:11px;" onclick="editRecord('purchases', '${s.no}')">✎</button>
                <button class="btn btn-danger" style="padding:4px 9px; font-size:11px; margin-left:4px;" onclick="deleteRecord('purchases', '${s.no}')">✕</button>
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
                <button class="btn" style="padding:4px 8px; font-size:11px;" onclick="editRecord('notes', '${s.no}')">✎</button>
                <button class="btn btn-danger" style="padding:4px 9px; font-size:11px; margin-left:4px;" onclick="deleteRecord('notes', '${s.no}')">✕</button>
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
                <button class="btn" style="padding:4px 8px; font-size:11px;" onclick="editRecord('payments', '${s.no}')">✎</button>
                <button class="btn btn-danger" style="padding:4px 9px; font-size:11px; margin-left:4px;" onclick="deleteRecord('payments', '${s.no}')">✕</button>
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
                <button class="btn" style="padding:4px 8px; font-size:11px;" onclick="editRecord('stock', '${s.code}')">✎</button>
                <button class="btn btn-danger" style="padding:4px 9px; font-size:11px; margin-left:4px;" onclick="deleteRecord('stock', '${s.code}')">✕</button>
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
                <button class="btn" style="padding:4px 8px; font-size:11px;" onclick="editRecord('parties', '${s.code}')">✎</button>
                <button class="btn btn-danger" style="padding:4px 9px; font-size:11px; margin-left:4px;" onclick="deleteRecord('parties', '${s.code}')">✕</button>
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

    sales.unshift({
        no: num,
        date: document.getElementById('inv-date').value,
        customer: cus,
        items: document.getElementById('inv-lines').children.length,
        subtotal: total * 0.82,
        gst: total * 0.18,
        total: total,
        status: status
    });

    recentTxns.unshift({ no: num, date: new Date().toISOString().split('T')[0], party: cus, type: 'Sales', amount: total, status: status });
    if (recentTxns.length > 5) recentTxns.pop();

    invCounter++;
    renderSales();
    renderDashboard();
    closeModal('invoiceModal');
    showToast(`Invoice ${num} saved as ${status}`);
}

function savePurchase() {
    let num = document.getElementById('pur-no').value;
    let sup = document.getElementById('pur-supplier').value;
    let totalText = document.getElementById('pur-grand-total').innerText.replace(/[₹,]/g, '');
    let total = parseFloat(totalText);

    purchases.unshift({
        no: num,
        date: document.getElementById('pur-date').value,
        supplier: sup,
        items: document.getElementById('pur-lines').children.length,
        amount: total * 0.82,
        gst: total * 0.18,
        total: total,
        status: 'Ordered'
    });

    purCounter++;
    renderPurchase();
    closeModal('purchaseModal');
    showToast(`Purchase ${num} saved successfully`);
}

function saveNote() {
    let num = document.getElementById('note-no').value;
    let type = document.getElementById('note-modal-title').innerText;

    notes.unshift({
        no: num,
        date: new Date().toISOString().split('T')[0],
        party: document.getElementById('note-party').value,
        against: 'New Note',
        type: type,
        amount: parseFloat(document.getElementById('note-amt').value) || 0,
        reason: document.getElementById('note-reason').value
    });

    noteCounter++;
    renderNotes();
    closeModal('noteModal');
    showToast(`${type} ${num} saved`);
}

function savePayment() {
    let num = document.getElementById('pay-no').value;
    let type = document.getElementById('payment-modal-title').innerText;

    payments.unshift({
        no: num,
        date: new Date().toISOString().split('T')[0],
        party: document.getElementById('pay-party').value,
        mode: document.getElementById('pay-mode').value,
        type: type,
        amount: parseFloat(document.getElementById('pay-amt').value) || 0,
        ref: 'Auto-gen'
    });

    payCounter++;
    renderPayments();
    closeModal('paymentModal');
    showToast(`${type} ${num} saved`);
}

function saveItem() {
    let code = document.getElementById('itm-code').value;
    stock.unshift({
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

    itemCounter++;
    renderStock();
    closeModal('itemModal');
    showToast(`Stock Item ${code} added`);
}

function saveParty() {
    parties.unshift({
        code: 'PRT-NEW',
        name: document.getElementById('pty-name').value || 'New Party',
        type: document.getElementById('pty-type').value,
        phone: document.getElementById('pty-phone').value || '',
        gst: document.getElementById('pty-gst').value || '',
        bal: '0', limit: 0, status: 'Active'
    });

    renderParties();
    closeModal('partyModal');
    showToast(`Party added successfully`);
}

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
