const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@0-9]{2,}$/;
const email = "ichsan@mail.com"
console.log(EMAIL_REGEX.test(email));

let tag1 = "#yes, #cool      "
let tag2 = "#wow#yeshh"
tag1.split("#").map(el => el.trim())
tag2.split("#").map(el => el.trim())