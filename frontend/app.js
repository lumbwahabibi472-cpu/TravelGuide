const API_URL = 'http://localhost:3000/api/destinations';

const destinationForm = document.getElementById('destinationForm');
const destinationList = document.getElementById('destinationList');
const statusMessage = document.getElementById('status');
const formTitle = document.getElementById('formTitle');
const saveButton = document.getElementById('saveButton');
const cancelButton = document.getElementById('cancelButton');

let editingId = null;

// Display a message to the user
function showStatus(message) {
    statusMessage.textContent = message;
}

// Load and display all destinations
async function loadDestinations() {
    destinationList.textContent = 'Loading destinations...';

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error('Could not load destinations.');
        }

        const destinations = await response.json();

        destinationList.replaceChildren();

        if (destinations.length === 0) {
            destinationList.textContent = 'No destinations have been added yet.';
            return;
        }

        destinations.forEach(destination => {
            const card = document.createElement('div');
            card.className = 'destination-card';

            const title = document.createElement('h3');
            title.textContent = destination.destination;

            const country = document.createElement('p');
            country.textContent = `Country: ${destination.country}`;

            const description = document.createElement('p');
            description.textContent =
                `Description: ${destination.description || 'Not provided'}`;

            const bestTime = document.createElement('p');
            bestTime.textContent =
                `Best time to visit: ${destination.best_time_to_visit || 'Not provided'}`;

            const budget = document.createElement('p');
            budget.textContent =
                `Estimated budget: ${destination.estimated_budget ?? 'Not provided'}`;

            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.addEventListener('click', () => {
                editDestination(destination);
            });

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.className = 'delete';
            deleteButton.addEventListener('click', () => {
                deleteDestination(destination.id);
            });

            card.append(
                title,
                country,
                description,
                bestTime,
                budget,
                editButton,
                deleteButton
            );

            destinationList.appendChild(card);
        });
    } catch (error) {
        destinationList.textContent =
            'Could not load destinations. Make sure the API server is running.';
        showStatus(error.message);
    }
}

// Add a new destination or update an existing one
destinationForm.addEventListener('submit', async event => {
    event.preventDefault();

    const budgetValue = document.getElementById('budget').value;

    const destinationData = {
        destination: document.getElementById('destination').value.trim(),
        country: document.getElementById('country').value.trim(),
        description: document.getElementById('description').value.trim(),
        best_time_to_visit: document.getElementById('bestTime').value.trim(),
        estimated_budget: budgetValue === '' ? null : Number(budgetValue)
    };

    if (!destinationData.destination || !destinationData.country) {
        showStatus('Please enter both a destination and a country.');
        return;
    }

    const isEditing = editingId !== null;
    const url = isEditing ? `${API_URL}/${editingId}` : API_URL;
    const method = isEditing ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(destinationData)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Unable to save destination.');
        }

        showStatus(isEditing
            ? 'Destination updated successfully!'
            : 'Destination added successfully!'
        );

        resetForm();
        await loadDestinations();
    } catch (error) {
        showStatus(`Error: ${error.message}`);
    }
});

// Fill the form with the destination being edited
function editDestination(destination) {
    editingId = destination.id;

    document.getElementById('destination').value = destination.destination;
    document.getElementById('country').value = destination.country;
    document.getElementById('description').value = destination.description || '';
    document.getElementById('bestTime').value =
        destination.best_time_to_visit || '';
    document.getElementById('budget').value =
        destination.estimated_budget ?? '';

    formTitle.textContent = 'Edit Destination';
    saveButton.textContent = 'Update Destination';
    cancelButton.hidden = false;

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Delete a destination
async function deleteDestination(id) {
    if (!confirm('Are you sure you want to delete this destination?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Unable to delete destination.');
        }

        showStatus('Destination deleted successfully!');
        await loadDestinations();
    } catch (error) {
        showStatus(`Error: ${error.message}`);
    }
}

// Clear the form and exit edit mode
function resetForm() {
    destinationForm.reset();
    editingId = null;

    formTitle.textContent = 'Add a Destination';
    saveButton.textContent = 'Save Destination';
    cancelButton.hidden = true;
}

// Cancel editing
cancelButton.addEventListener('click', () => {
    resetForm();
    showStatus('Editing cancelled.');
});

// Load destinations when the page starts
loadDestinations();