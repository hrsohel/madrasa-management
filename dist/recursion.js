"use strict";
function factorial(count) {
    if (count === 0)
        return 1; // Base case: 0! = 1
    else
        return count * factorial(count - 1); // Recursive case
}
const result = factorial(5);
console.log(result);
