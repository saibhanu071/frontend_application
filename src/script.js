// In src/script.js
import Amplify from 'aws-amplify';
import awsExports from './aws-exports'; // Correct path from src to aws-exports.js

Amplify.configure(awsExports);

// Your existing script.js code will go here below these lines
// ...

// C:\Users\msrin\my-web-app\frontend\script.js
// This code runs in the user's web browser to interact with your backend

async function fetchAndDisplayItems() {
    document.getElementById('message').textContent = 'Fetching items from database...';
    try {
        const response = await fetch('http://localhost:3000/api/items');
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        console.log('Received items from database:', data);

        const itemsList = document.getElementById('itemsList');
        itemsList.innerHTML = '';

        if (data && data.length > 0) {
            data.forEach(item => {
                const listItem = document.createElement('li');
                listItem.textContent = `ID: ${item._id}, Name: ${item.name}, Value: ${item.value || 'N/A'}, Category: ${item.category || 'N/A'}`;
                itemsList.appendChild(listItem);
            });
            document.getElementById('message').textContent = `Successfully fetched ${data.length} items.`;
        } else {
            const listItem = document.createElement('li');
            listItem.textContent = 'No items found in the database.';
            itemsList.appendChild(listItem);
            document.getElementById('message').textContent = 'No items found.';
        }
    } catch (error) {
        document.getElementById('message').textContent = 'Error fetching items: ' + error.message;
        console.error('Error fetching items:', error);
    }
}

document.getElementById('getButton').addEventListener('click', fetchAndDisplayItems);

document.getElementById('postButton').addEventListener('click', async function() {
    document.getElementById('message').textContent = 'Sending POST data to create item...';
    const dataToSend = {
        name: `New Item ${Math.floor(Math.random() * 1000)}`,
        value: Math.floor(Math.random() * 100),
        category: 'Dynamic'
    };

    try {
        const response = await fetch('http://localhost:3000/api/items', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToSend)
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Network response was not ok: ${response.statusText} - ${errorText}`);
        }
        const data = await response.json();
        document.getElementById('message').textContent = 'POST Response: ' + data.message + ' (ID: ' + data.item._id + ')';
        console.log('Received POST response:', data); // This is where you get the _id!
        await fetchAndDisplayItems();
    } catch (error) {
        document.getElementById('message').textContent = 'Error sending POST data: ' + error.message;
        console.error('There was a problem with the POST operation:', error);
    }
});

document.getElementById('putButton').addEventListener('click', async function() {
    document.getElementById('message').textContent = 'Sending PUT data to update item...';

    // *** IMPORTANT: AFTER YOU POST A NEW ITEM (using "Send POST Data" button),
    // *** COPY THE "_id" FROM THE CONSOLE (e.g., '685ea72a0e998d2a41f9b962')
    // *** AND PASTE IT BELOW, REPLACING THIS ENTIRE STRING:
    const itemIdToUpdate = "685fb29beee561361810ecc8"; 

    const dataToUpdate = {
        name: 'UPDATED Item Name',
        status: 'completed',
        value: 999
    };

    // This 'if' condition checks if you've updated the ID. It will cause the error if you haven't.
    if (itemIdToUpdate === 'PASTE_YOUR_ACTUAL_MONGODB_ID_HERE') {
        document.getElementById('message').textContent = 'Error: Please put an actual MongoDB ID in script.js for the PUT request.';
        console.error('PUT Error: Need a valid ID to update.');
        return; // Stop function execution
    }

    try {
        const response = await fetch(`http://localhost:3000/api/items/${itemIdToUpdate}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToUpdate)
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Network response was not ok: ${response.statusText} - ${errorText}`);
        }
        const data = await response.json();
        document.getElementById('message').textContent = 'PUT Response: ' + data.message;
        console.log('Received PUT response:', data);
        await fetchAndDisplayItems();
    } catch (error) {
        document.getElementById('message').textContent = 'Error sending PUT data: ' + error.message;
        console.error('There was a problem with the PUT operation:', error);
    }
});

document.getElementById('deleteButton').addEventListener('click', async function() {
    document.getElementById('message').textContent = 'Sending DELETE request...';

    // *** IMPORTANT: AFTER YOU POST A NEW ITEM, COPY ITS "_id" FROM THE CONSOLE
    // *** AND PASTE IT BELOW, REPLACING THIS ENTIRE STRING:
    const itemIdToDelete =  "685fb6217cee189afc840d48"; 

    // This 'if' condition checks if you've updated the ID. It will cause the error if you haven't.
    if (itemIdToDelete === 'PASTE_YOUR_ACTUAL_MONGODB_ID_HERE_FOR_DELETE') {
        document.getElementById('message').textContent = 'Error: Please put an actual MongoDB ID in script.js for the DELETE request.';
        console.error('DELETE Error: Need a valid ID to delete.');
        return; // Stop function execution
    }

    try {
        const response = await fetch(`http://localhost:3000/api/items/${itemIdToDelete}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Network response was not ok: ${response.statusText} - ${errorText}`);
        }
        const data = await response.json();
        document.getElementById('message').textContent = 'DELETE Response: ' + data.message;
        console.log('Received DELETE response:', data);
        await fetchAndDisplayItems();
    } catch (error) {
        document.getElementById('message').textContent = 'Error sending DELETE data: ' + error.message;
        console.error('There was a problem with the DELETE operation:', error);
    }
});

document.getElementById('message').textContent = 'Click a button to interact with the backend.';
fetchAndDisplayItems();