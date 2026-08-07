'use strict';

const billRaw = "480";
const partySize = 4;
const paymentMethod = "telebirr";

const bill = Number(billRaw);

const tip = bill > 300 ? bill * 0.10 : bill * 0.05;

let serviceFee;

switch (paymentMethod) {
    case "telebirr":
        serviceFee = bill * 0.005;
        break;
    case "cbebirr":
        serviceFee = bill * 0.01;
        break;
    default:
        serviceFee = bill * 0.02;
}

const total = bill + tip + serviceFee;
const perPerson = total / partySize;

console.log('Bill Amount: ${bill} ETB');
console.log('Tip: ${tip} ETB');
console.log('Service Fee: ${servicFee} ETB');
console.log('Total Bill: ${total} ETB');
console.log('Each Person Pays: ${perPerson} ETB');