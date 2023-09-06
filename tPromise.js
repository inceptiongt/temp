function timeout(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(reject, ms, 'done');
    });
}

// timeout(100).then((value) => {
//     console.log(value);
//     // throw new Error('error')
// },
//     err => { console.log(err, "err1"); throw new Error('error') }
// )
//     .then(err => console.log(err, "then1"))
//     .catch(err => console.log(err, "err"))
//     .then()
timeout(100)
.then(v => console.log(v))
.catch(err => console.log('err1'))
.then(v=>console.log(v))

