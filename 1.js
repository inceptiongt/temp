new Promise((resolve) => {
    console.log('promise1');
    resolve(Promise.resolve());
})
    .then(() => {
        console.log('promise1 then1');
    })
    .then(() => {
        console.log('promise1 then2');
    });

new Promise((resolve) => {
    console.log('promise2');
    resolve();
})
    .then(() => {
        console.log('promise2 then1');
    })
    .then(() => {
        console.log('promise2 then2');
    })
    .then(() => {
        console.log('promise2 then3');
    })
    .then(() => {
        console.log('promise2 then4');
    });