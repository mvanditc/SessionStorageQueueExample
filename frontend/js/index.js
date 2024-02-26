const port = 3022;

let queueStatusText = document.getElementById("queueStatusText")

let getLatestQueueButton = document.getElementById("getLatestQueueButton")
let addToQueueButton = document.getElementById("addToQueueButton")
let popFromQueueButton = document.getElementById("popFromQueueButton")
let joinTheQueueButton = document.getElementById("joinTheQueueButton")
let leaveTheQueueButton = document.getElementById("leaveTheQueueButton")

joinTheQueueButton.disabled = true
leaveTheQueueButton.disabled = true

let currentQueuePositionText = document.getElementById("currentQueuePositionText")

let currentQueuePosition = sessionStorage.getItem('queuePosition');

function handleLeavingQueue(){
    sessionStorage.removeItem('queuePosition');
    currentQueuePositionText.innerHTML = ""
}

function updateQueueOnFrontend(){
    fetch("http://localhost:" + port + "/get-latest-queue")
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        };

        return response.json();
    })
    .then(data => {
        console.log('Data from the backend:', data);
        queueStatusText.innerHTML = "Queue = {" + data + "}";

        currentQueuePosition = sessionStorage.getItem('queuePosition');
        if (currentQueuePosition == null){
            currentQueuePosition = ""
            joinTheQueueButton.disabled = false
            leaveTheQueueButton.disabled = true
        }else{
            if (!data.includes(currentQueuePosition)) {
                handleLeavingQueue()
                joinTheQueueButton.disabled = false
                leaveTheQueueButton.disabled = true
            }else{
                joinTheQueueButton.disabled = true
                leaveTheQueueButton.disabled = false
            }
        }
    })
    .catch(error => {
        console.error('Fetch error:', error.message);
    });
}

getLatestQueueButton.addEventListener("click", updateQueueOnFrontend)

addToQueueButton.addEventListener("click", ()=>{
    fetch("http://localhost:" + port + "/add-to-queue")
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        };

        return response.json();
    })
    .then(data => {
        console.log('Data from the backend:', data);
        updateQueueOnFrontend()
    })
    .catch(error => {
        console.error('Fetch error:', error.message);
    });
})

popFromQueueButton.addEventListener("click", ()=>{
    fetch("http://localhost:" + port + "/pop-from-queue")
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        };

        return response.json();
    })
    .then(data => {
        console.log('Data from the backend:', data);
        currentQueuePosition = sessionStorage.getItem('queuePosition');
        if (data["nextUp"] == currentQueuePosition){
            alert("It's your turn!")
            window.location.href = "../html/theClub.html";
        }
        updateQueueOnFrontend()
    })
    .catch(error => {
        console.error('Fetch error:', error.message);
    });
})

joinTheQueueButton.addEventListener("click", ()=>{
    fetch("http://localhost:" + port + "/join-queue")
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        };

        return response.json();
    })
    .then(data => {
        console.log('Data from the backend:', data);
        currentQueuePosition = data["position"]
        currentQueuePositionText.innerHTML = "Your Position: " + currentQueuePosition
        sessionStorage.setItem('queuePosition', currentQueuePosition);
        updateQueueOnFrontend()
    })
    .catch(error => {
        console.error('Fetch error:', error.message);
    });
})

leaveTheQueueButton.addEventListener("click", ()=>{
    fetch("http://localhost:" + port + "/leave-queue", {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({"position": currentQueuePosition})
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        };

        return response.json();
    })
    .then(data => {
        console.log('Data from the backend:', data);
        if (data["status"] == "success"){
            handleLeavingQueue()
        }
        updateQueueOnFrontend()
    })
    .catch(error => {
        console.error('Fetch error:', error.message);
    });
})

window.addEventListener('load', function() {
    if (currentQueuePosition == null){
        currentQueuePosition = ""
        updateQueueOnFrontend()
    }else{
        updateQueueOnFrontend()
        currentQueuePositionText.innerHTML = "Your Position: " + currentQueuePosition
    }
});

function myAsyncFunction() {
    // Your asynchronous code here

    // Log a message as an example
    console.log('This function runs asynchronously every 3 seconds.');
    
    // Schedule the function to run again after 3 seconds
    setTimeout(myAsyncFunction, 3000);
}

// Start the asynchronous function
myAsyncFunction();
