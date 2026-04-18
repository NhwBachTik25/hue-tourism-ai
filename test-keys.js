const https = require('https');

const keysString = "AIzaSyB_UWDXpArNJaGlSWrIwW0UFpsjDB6TCJg,AIzaSyA73y2NZn5BcmQnrdYfEjFLQA3vwL8KIcc,AIzaSyBU65D7ri-lgzq2GSkKILnlCucNM8V5ksk,AIzaSyBrbV1MQUNOd94GzF6Xmkf3TK0rQgxtk30,AIzaSyBhyxfBP2bzHAr1LF0vdp4SKoJqFN-XXv8,AIzaSyBM7aaVqM1JFnpjZdWsoarCfVpWm2_lSrY,AIzaSyAT9HfRdaA5sRykIea2PcxuCnw99weQl-I,AIzaSyCk9J4ZJ0D8keMlyvPq5QV1mLfEFq13CCY,AIzaSyBU65D7ri-lgzq2GSkKILnlCucNM8V5ksk,AIzaSyAkgBVWOGnXuPP2Ob58r9iOR8gOv12jNFg,AIzaSyCpwhnckPgIVhquQNcZw61ylRlrRWrVa-Y,AIzaSyD4afrHKWLSss2hNCvsvejqCcOBkOdgoOU,AIzaSyAUm19p98EEaTPVyi4WPaxCps4w4llBIx0,AIzaSyCt5BRGW_cT2Mwn_cVGcOTlan_0xZbzyOg";
let keys = keysString.split(',').map(k => k.trim()).filter(k => k.length > 0);
keys = [...new Set(keys)];

function testKey(key) {
    return new Promise((resolve) => {
        const body = JSON.stringify({
            contents: [{ parts: [{ text: "hello" }] }],
        });

        const req = https.request({
            hostname: 'generativelanguage.googleapis.com',
            path: '/v1beta/models/gemini-2.5-flash:generateContent?key=' + key,
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, res => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    resolve(`Key ${key.substring(0, 15)}... works`);
                } else {
                    resolve(`Key ${key.substring(0, 15)}... failed with status ${res.statusCode}: ${data}`);
                }
            });
        });
        req.on('error', (e) => resolve(`Key ${key.substring(0, 15)}... error: ${e.message}`));
        req.write(body);
        req.end();
    });
}

async function run() {
    for (const key of keys) {
        console.log(await testKey(key));
    }
}
run();
