"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function exponentialBackoff(startWaitTime, retryNumber, waitBackoff, fetchResult) {
    let waitTime = startWaitTime;
    for (let i = 0; i < retryNumber; i++) {
        const result = await fetchResult();
        if (result) {
            return result;
        }
        await sleep(waitTime);
        waitTime *= waitBackoff;
    }
    return null;
}
exports.default = exponentialBackoff;
// Sleep given number of millis.
function sleep(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
}
