import { ref, remove } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-database.js";

// --- EDIT & DELETE LOGIC ---
window.editMode = { active: false, type: null, id: null };

function deleteRecord(type, id) {
    if (!confirm(`Are you sure you want to delete this record?`)) return;

    // id is now the firebase autogen key
    let dbRef = ref(window.db, type + '/' + id);
    remove(dbRef).then(() => {
        showToast(`Record deleted successfully`);
    }).catch(err => {
        console.error(err);
        showToast(`Error deleting record`);
    });
}
window.deleteRecord = deleteRecord;

function editRecord(type, id) {
    editMode = { active: true, type: type, id: id };

    if (type === 'sales') {
        let rs = sales.find(s => s.no === id);
        if (!rs) return;
        document.getElementById('inv-no').value = rs.no;
        document.getElementById('inv-date').value = rs.date;
        populateParties('inv-customer', ['Customer', 'Both']);
        document.getElementById('inv-customer').value = rs.customer;

        // Clear and add a single placeholder row for demo
        document.getElementById('inv-lines').innerHTML = '';
        addInvRow();
        let row = document.getElementById('inv-lines').firstElementChild;
        row.querySelector('.line-qty').value = rs.items;
        row.querySelector('.line-rate').value = (rs.subtotal / rs.items).toFixed(2);

        calcInvoice();
        openModal('invoiceModal');
    }
    else if (type === 'purchases') {
        let rp = purchases.find(p => p.no === id);
        if (!rp) return;
        openModal('purchaseModal'); // Setup empty state
        document.getElementById('pur-no').value = rp.no;
        document.getElementById('pur-date').value = rp.date;
        document.getElementById('pur-supplier').value = rp.supplier;
        document.getElementById('pur-lines').innerHTML = '';
        addPurRow();
    }
    else if (type === 'stock') {
        let st = stock.find(s => s.code === id);
        if (!st) return;
        openModal('itemModal');
        document.getElementById('itm-code').value = st.code;
        document.getElementById('itm-name').value = st.name;
        document.getElementById('itm-cat').value = st.cat;
        document.getElementById('itm-unit').value = st.unit;
        document.getElementById('itm-sale').value = st.rate;
        document.getElementById('itm-open').value = st.open;
    }
    else if (type === 'parties') {
        let pt = parties.find(p => p.code === id);
        if (!pt) return;
        openModal('partyModal');
        document.getElementById('pty-name').value = pt.name;
        document.getElementById('pty-type').value = pt.type;
        document.getElementById('pty-phone').value = pt.phone;
        document.getElementById('pty-gst').value = pt.gst;
    }
    // Notes and Payments would follow the exact same pattern
    else {
        showToast('Editing ' + type + ' works similarly (Demo)');
    }
}
window.editRecord = editRecord;
