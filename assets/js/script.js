//                   a2thztk_4Zo4MdDUej76d_-QQDg   // my API KEY

//           https://ci-jshint.herokuapp.com/api?api_key=a2thztk_4Zo4MdDUej76d_-QQDg

// const response = fetch("https://ci-jshint.herokuapp.com/api", {
//                         method: "POST",
//                         headers: {
//                                     "Authorization": API_KEY,
//                                  }
//                         })

// sample URL FOR TESTING https://mattrudge.net/assets/js/menu.js
// ******************************  API KEY STATUS MODAL *********************************
const API_KEY = 'a2thztk_4Zo4MdDUej76d_-QQDg';
const API_URL = 'https://ci-jshint.herokuapp.com/api';
const resultsModal = new bootstrap.Modal(document.getElementById('resultsModal'));

document.getElementById('status').addEventListener('click', e => getStatus(e));

async function getStatus(e) {
    const queryString = `${API_URL}?api_key=${API_KEY}`;

    const response = await fetch(queryString);

    const data = await response.json();

    if (response.ok) {
        displayStatus(data);
    } else {
        displayExceptions(data);
        throw new Error(data.error);
    }
}

function displayStatus(data) {
    let title = 'API KEY STATUS';                           // firstly set the heading text to 'API KEY STATUS'
    let results = `<div>Your key is valid until :</div>`;   // secondly set the reults variable to the content we want 
    results += `<div class="key-status">${data.expiry}</div>`;  //   using template literals

    document.getElementById('resultsModalTitle').innerText = title;    // thirdly  set the content of the two of these elements
    document.getElementById('results-content').innerHTML = results;


    resultsModal.show();     // display the modal
};

// ******************************  Run checks *********************************

document.getElementById('submit').addEventListener('click', e => postForm(e));

function processOptions(form){

    let optArray = [];

    for(let entry of form.entries()){
        if(entry[0] === 'options'){
            optArray.push(entry[1]);
        }
    };
    form.delete('options');

    form.append('options', optArray.join());

    return(form);

}

function displayExceptions(data){

    let errorModalHeading = `An Exception Occurred`                         
    let errorResults = `<div>The API returned status code ${data.status_code}</div>`;  
    errorResults += `<div>Error number: <strong>${data.error_no}</strong></div>`;   
    errorResults += `<div class="key-status">Error text: <strong>${data.error}</strong></div>`;      

    document.getElementById('resultsModalTitle').innerText = errorModalHeading;    
    document.getElementById('results-content').innerHTML = errorResults;    
    resultsModal.show();     
}

async function postForm(e) {
    const form = processOptions(new FormData(document.getElementById('checksform')));

    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Authorization": API_KEY,
        },
        body: form,
    })
    const data = await response.json();

    if (response.ok) {
        displayErrors(data);
        
    } else {
        displayExceptions(data);
        throw new Error(data.error);
        
    }
}

function displayErrors(data){
    let heading = `JS HINT results for ${data.file}`;

    if (data.total_errors === 0){
        results = `<div class="no_errors">No errors reported!</div>`;
    } else {
        results = `<div>Total errors:<span class="error_count">${data.total_errors}</span></div>`;
        for(let error of data.error_list){
            results += `<div>At line<span class="line">${error.line}</span>,`
            results += `column <span class="column">${error.col}</div>`
            results += `<div class="error">${error.error}</div>`;
        }
    }   

    document.getElementById('resultsModalTitle').innerText = heading;    
    document.getElementById('results-content').innerHTML = results;
    resultsModal.show();    
}
