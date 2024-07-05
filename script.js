// Event listener for form submission
document.getElementById('addMemberForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission -> would normally refresh the page

    // Collecting data from form fields
    // document.getElementById('...').value; -> retrieves value of each input field
    const name = document.getElementById('name').value;
    const dateOfBirth = document.getElementById('dateOfBirth').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const membershipType = document.getElementById('membershipType').value;
    const payment = document.getElementById('payment').value;
    const joinDate = new Date().toLocaleDateString(); // Current date as join date
    const expiryDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString(); // One year from join date as expiry date

    // Create a new member object with collected data
    const newMember = {
        id: Date.now(), // generates unique id based on current timestamp
        name,
        dateOfBirth,
        email,
        phone,
        address,
        membershipType,
        payment,
        joinDate,
        expiryDate
    };

    // Store new member data (using an array to simulate database)
    members.push(newMember); // push method adds a member to the end of the array

    // Update member list -> refreshes dispolayed member list
    updateMembersList();

    // Reset the form to default values 
    document.getElementById('addMemberForm').reset();
});

// Array that holds members
const members = [];

// Function to update members list
function updateMembersList() {
    const membersCardsContainer = document.getElementById('membersCardsContainer');
    membersCardsContainer.innerHTML = ''; // Clear the container

    members.forEach(member => { // iterates over each member array 
        const card = document.createElement('div'); // creates new div element for each member
        card.classList.add('member-card'); // adds member-card class to new div
        // sets inner HTML of card to display members basic info
        card.innerHTML = `
            <div class="member-info">
                <p><strong>ID:</strong> ${member.id}</p>
                <p class="expandable"><strong>Name:</strong> ${member.name}</p>
                <p><strong>Join Date:</strong> ${member.joinDate}</p>
                <p><strong>Date of Birth:</strong> ${member.dateOfBirth}</p>
                <p><strong>Expiry Date:</strong> ${member.expiryDate}</p>
            </div>
        `;

        // Add event listener for expandable details
        card.querySelector('.expandable').addEventListener('click', () => {
            const detailsDiv = document.createElement('div');
            detailsDiv.classList.add('member-details');
            detailsDiv.innerHTML = `
                <p><strong>Email:</strong> ${member.email}</p>
                <p><strong>Phone:</strong> ${member.phone}</p>
                <p><strong>Address:</strong> ${member.address}</p>
                <p><strong>Membership Type:</strong> ${member.membershipType}</p>
                <p><strong>Payment Details:</strong> ${member.payment}</p>
            `;
            // Toggle the display of the details row
            if (card.querySelector('.member-details')) {
                card.querySelector('.member-details').remove();
            } else {
                card.appendChild(detailsDiv);
            }
        });

        membersCardsContainer.appendChild(card);
    });
}

// Populate the members list on page load
document.addEventListener('DOMContentLoaded', () => {
    updateMembersList();
});

// Search functionality
document.getElementById('searchMembers').addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const cards = document.querySelectorAll('.member-card');

    cards.forEach(card => {
        const name = card.querySelector('.expandable').textContent.toLowerCase();
        if (name.includes(searchTerm)) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
});

// Function to show main tabs
function showTab(tabId, element) {
    // Hide all main tabs
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => {
        tab.style.display = 'none';
    });

    // Show the selected main tab
    const activeTab = document.getElementById(tabId);
    if (activeTab) {
        activeTab.style.display = 'block';
    }

    // Remove 'active' class from all tab links
    const tabLinks = document.querySelectorAll('.navbar a');
    tabLinks.forEach(link => {
        link.classList.remove('active');
    });

    // Add 'active' class to the clicked tab link
    element.classList.add('active');

    // Reset sub-tabs when switching main tabs
    const subTabs = document.querySelectorAll('.sub-tab-content');
    subTabs.forEach(subTab => {
        subTab.style.display = 'none';
    });
}

// Function to show sub-tabs
function showMembershipContent(subTabId, element) {
    // Hide all sub-tabs
    const subTabs = document.querySelectorAll('.sub-tab-content');
    subTabs.forEach(subTab => {
        subTab.style.display = 'none';
    });

    // Show the selected sub-tab
    const activeSubTab = document.getElementById(subTabId);
    if (activeSubTab) {
        activeSubTab.style.display = 'block';
    }

    // Remove 'active' class from all membership buttons
    const membershipButtons = document.querySelectorAll('.mini-navbar-memberships .memberships-navbar-button');
    membershipButtons.forEach(button => {
        button.classList.remove('active');
    });

    // Add 'active' class to the clicked membership button
    element.classList.add('active');
}

// Function to enable editing of a membership plan
function editPlan(planId) {
    const planCard = document.getElementById(planId); // Select the plan card by its ID
    const priceElement = planCard.querySelector('.price'); // Select the price element within the plan card
    const benefitsElement = planCard.querySelector('.benefits'); // Select the benefits list within the plan card
    
    // Create input fields for editing the price
    const priceInput = document.createElement('input'); // Create a new input element
    priceInput.type = 'text'; // Set the input type to text
    priceInput.value = priceElement.textContent.replace('$', ''); // Set the input value to the current price, without the "$" prefix
    priceElement.innerHTML = '$'; // Clear the current price text
    priceElement.appendChild(priceInput); // Append the input field to the price element
    
    const benefitsList = benefitsElement.querySelectorAll('li'); // Select all list items within the benefits list
    benefitsElement.innerHTML = ''; // Clear the benefits list
    benefitsList.forEach(benefit => { // Iterate over each benefit
        const benefitInput = document.createElement('input'); // Create a new input element for each benefit
        benefitInput.type = 'text'; // Set the input type to text
        benefitInput.value = benefit.textContent; // Set the input value to the current benefit text
        benefitsElement.appendChild(benefitInput); // Append the input field to the benefits element
        benefitsElement.appendChild(document.createElement('br')); // Add a line break after each input field
    });

    // Change the edit button to a save button
    const editButton = planCard.querySelector('.editButton'); // Select the edit button within the plan card
    editButton.textContent = 'Save'; // Change the button text to "Save"
    editButton.onclick = function() { savePlan(planId); }; // Change the button's onclick event to call the savePlan function
}

// Function to save the edited membership plan
function savePlan(planId) {
    const planCard = document.getElementById(planId); // Select the plan card by its ID
    const priceElement = planCard.querySelector('.price'); // Select the price element within the plan card
    const benefitsElement = planCard.querySelector('.benefits'); // Select the benefits list within the plan card

    // Get the values from the input fields
    const priceInput = priceElement.querySelector('input').value; // Retrieve the value of the price input field
    const benefitInputs = benefitsElement.querySelectorAll('input'); // Select all input fields within the benefits element

    // Update the text content with the new values
    priceElement.innerHTML = `$${priceInput}`; // Update the price element's text content with the new price

    benefitsElement.innerHTML = ''; // Clear the benefits list
    benefitInputs.forEach(input => { // Iterate over each benefit input field
        const li = document.createElement('li'); // Create a new list item element
        li.textContent = input.value; // Set the list item's text content to the input field's value
        benefitsElement.appendChild(li); // Append the list item to the benefits element
    });

    // Change the save button back to an edit button
    const saveButton = planCard.querySelector('.editButton'); // Select the save button within the plan card
    saveButton.textContent = 'Edit'; // Change the button text back to "Edit"
    saveButton.onclick = function() { editPlan(planId); }; // Change the button's onclick event to call the editPlan function
}



