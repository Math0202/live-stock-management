// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    initializeSystem();
});

// Initialize the system
function initializeSystem() {
    setupNavigation();
    setupAnimalManagement();
    setupVaccinationAlerts();
    setupGrazingRotation();
    setupSlaughterManagement();
    setupSearchAndFilters();
    showSection();
    
}



// Navigation and Section Display
function setupNavigation() {
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            
            // Hide all sections
            document.querySelectorAll('main section').forEach(section => {
                section.style.display = 'none';
            });
            
            // Show target section
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.style.display = 'block';
            }
        });
    });
}

// Animal Management
function setupAnimalManagement() {
    const addAnimalBtn = document.querySelector('.btn-success');
    if (addAnimalBtn) {
        addAnimalBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showAddAnimalModal();
        });
    }
}

function showAddAnimalModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Add New Animal</h2>
            <form id="addAnimalForm">
                <div>
                    <label for="tagNumber">Tag Number:</label>
                    <input type="text" id="tagNumber" required>
                </div>
                <div>
                    <label for="type">Type:</label>
                    <select id="type" required onchange="updateSlaughterRange()">
                        <option value="Cattle">Cattle</option>
                        <option value="Sheep">Sheep</option>
                        <option value="Goat">Goat</option>
                    </select>
                </div>
                <div>
                    <label for="dob">Date of Birth:</label>
                    <input type="date" id="dob" required onchange="updateVaccinationSchedule()">
                </div>
                <div>
                    <label for="slaughterAge">Desired Slaughter Age (months):</label>
                    <input type="number" id="slaughterAge" required>
                    <span id="slaughterRange"></span>
                </div>
                <div>
                    <label for="vaccineType">Select Vaccine:</label>
                    <select id="vaccineType" required>
                        <!-- Options will be populated based on animal type -->
                    </select>
                </div>
                <div>
                    <label>Vaccination Schedule:</label>
                    <div id="vaccinationSchedule"></div>
                </div>
                <button type="submit" class="btn btn-success">Add Animal</button>
                <button type="button" class="btn btn-danger" onclick="closeModal()">Cancel</button>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Initialize slaughter range
    updateSlaughterRange();
    
    // Add form submission handler
    document.getElementById('addAnimalForm').addEventListener('submit', handleAddAnimal);
}

const vaccineTypes = {
    Cattle: [
        { name: 'Clostridial Vaccines', timing: '2-4 months, booster 4-6 weeks later' },
        { name: 'Bovine Respiratory Disease Complex', timing: '2-3 months, booster at weaning' },
        { name: 'Leptospirosis', timing: '4-6 months, annual boosters' }
    ],
    Sheep: [
        { name: 'CD-T', timing: '6-8 weeks, booster 3-4 weeks later' },
        { name: 'Campylobacter', timing: '30 days before breeding' },
        { name: 'Chlamydia', timing: '60 days before breeding, booster 30 days later' }
    ],
    Goat: [
        { name: 'CD-T', timing: '6-8 weeks, booster 3-4 weeks later' },
        { name: 'Caseous Lymphadenitis', timing: '3 months, annual boosters' },
        { name: 'Rabies', timing: '3 months, annual boosters' }
    ]
};

function updateSlaughterRange() {
    const typeSelect = document.getElementById('type');
    const slaughterAgeInput = document.getElementById('slaughterAge');
    const slaughterRangeSpan = document.getElementById('slaughterRange');
    const vaccineTypeSelect = document.getElementById('vaccineType');
    
    const ranges = {
        'Cattle': { min: 14, max: 18 },
        'Sheep': { min: 6, max: 8 },
        'Goat': { min: 8, max: 10 }
    };

    const range = ranges[typeSelect.value];
    slaughterAgeInput.min = range.min;
    slaughterAgeInput.max = range.max;
    slaughterRangeSpan.textContent = `(Range: ${range.min}-${range.max} months)`;
    
    // Update vaccine options
    vaccineTypeSelect.innerHTML = vaccineTypes[typeSelect.value]
        .map(vaccine => `<option value="${vaccine.name}">${vaccine.name} (${vaccine.timing})</option>`)
        .join('');
        
    updateVaccinationSchedule();
}



function updateVaccinationSchedule() {
    const dob = new Date(document.getElementById('dob').value);
    const type = document.getElementById('type').value;
    const vaccineType = document.getElementById('vaccineType').value;
    const scheduleDiv = document.getElementById('vaccinationSchedule');
    
    if (!dob || isNaN(dob.getTime())) return;
    
    const vaccine = vaccineTypes[type].find(v => v.name === vaccineType);
    if (!vaccine) return;
    
    let scheduleHTML = '<ul>';
    
    // Parse timing information and calculate dates
    const timingParts = vaccine.timing.split(',');
    timingParts.forEach(part => {
        const timing = part.trim();
        
        if (type === 'Cattle') {
            if (vaccineType === 'Clostridial Vaccines') {
                const initialDate = addMonths(dob, 2);
                const boosterDate = addMonths(initialDate, 1.5);
                scheduleHTML += `
                    <li>Initial: ${formatDate(initialDate)}</li>
                    <li>Booster: ${formatDate(boosterDate)}</li>
                `;
            } else if (vaccineType === 'Bovine Respiratory Disease Complex') {
                const initialDate = addMonths(dob, 2);
                const boosterDate = addMonths(dob, 6); // Assuming weaning at 6 months
                scheduleHTML += `
                    <li>Initial: ${formatDate(initialDate)}</li>
                    <li>Booster at weaning: ${formatDate(boosterDate)}</li>
                `;
            } else if (vaccineType === 'Leptospirosis') {
                const initialDate = addMonths(dob, 4);
                const firstAnnualBooster = addMonths(initialDate, 12);
                scheduleHTML += `
                    <li>Initial: ${formatDate(initialDate)}</li>
                    <li>First Annual Booster: ${formatDate(firstAnnualBooster)}</li>
                `;
            }
        } else if (type === 'Sheep') {
            if (vaccineType === 'CD-T') {
                const initialDate = addDays(dob, 42); // 6 weeks
                const boosterDate = addDays(initialDate, 28); // 4 weeks later
                scheduleHTML += `
                    <li>Initial: ${formatDate(initialDate)}</li>
                    <li>Booster: ${formatDate(boosterDate)}</li>
                `;
            } else if (vaccineType === 'Campylobacter') {
                const breedingDate = addDays(new Date(), 30);
                scheduleHTML += `
                    <li>Vaccination Date: ${formatDate(breedingDate)}</li>
                `;
            }
        } else if (type === 'Goat') {
            if (vaccineType === 'CD-T') {
                const initialDate = addDays(dob, 42); // 6 weeks
                const boosterDate = addDays(initialDate, 28); // 4 weeks later
                scheduleHTML += `
                    <li>Initial: ${formatDate(initialDate)}</li>
                    <li>Booster: ${formatDate(boosterDate)}</li>
                `;
            } else if (vaccineType === 'Caseous Lymphadenitis' || vaccineType === 'Rabies') {
                const initialDate = addMonths(dob, 3);
                const annualBooster = addMonths(initialDate, 12);
                scheduleHTML += `
                    <li>Initial: ${formatDate(initialDate)}</li>
                    <li>Annual Booster: ${formatDate(annualBooster)}</li>
                `;
            }
        }
    });
    
    scheduleHTML += '</ul>';
    scheduleDiv.innerHTML = scheduleHTML;
}



function handleAddAnimal(e) {
    e.preventDefault();
    const tagNumber = document.getElementById('tagNumber').value;
    const type = document.getElementById('type').value;
    const dob = document.getElementById('dob').value;
    const slaughterAge = document.getElementById('slaughterAge').value;
    const vaccineType = document.getElementById('vaccineType').value;
    
    // Calculate slaughter date
    const slaughterDate = addMonths(new Date(dob), parseInt(slaughterAge));
    
    // Calculate next rotation date
    const rotationDays = type === 'Cattle' ? 21 : 28; // 3 weeks for cattle, 4 weeks for sheep/goats
    const nextRotation = addDays(new Date(), rotationDays);
    
    // Add to table
    const tbody = document.querySelector('#animal-management table tbody');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${tagNumber}</td>
        <td>${type}</td>
        <td>${dob}</td>
        <td>${calculateAgeGroup(dob)}</td>
        <td>${formatDate(slaughterDate)}</td>
        <td>${vaccineType}</td>
        <td>${formatDate(nextRotation)}</td>
    `;
    tbody.appendChild(newRow);
    
    closeModal();
    updateDashboardCounts();
}

// Helper Functions
function addMonths(date, months) {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + months);
    return newDate;
}

function addDays(date, days) {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
}

function formatDate(date) {
    return date.toISOString().split('T')[0];
}

// Navigation and Section Display
function setupNavigation() {
    const navLinks = document.querySelectorAll('nav ul li a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href').substring(1);
            
            // Handle Home link differently
            if (targetId === 'home') {
                e.preventDefault();
                showAllSections();
            } else {
                showSection(targetId);
            }
            
            // Update active state
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            link.classList.add('active');
        });
    });
}

function showAllSections() {
    const sections = document.querySelectorAll('main section');
    sections.forEach(section => {
        section.style.display = 'block';
    });
    
    // Scroll to top smoothly
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function showSection(sectionId) {
    const sections = document.querySelectorAll('main section');
    
    sections.forEach(section => {
        if (section.id === sectionId) {
            section.style.display = 'block';
            section.scrollIntoView({ behavior: 'smooth' });
        } else {
            section.style.display = 'none';
        }
    });
}

// Vaccination Tracking
function setupVaccinationAlerts() {
    const vaccinationRows = document.querySelectorAll('#vaccinations tbody tr');
    
    vaccinationRows.forEach(row => {
        const dueDate = new Date(row.children[3].textContent);
        const status = row.querySelector('.btn');
        
        // Update status based on due date
        updateVaccinationStatus(dueDate, status);
    });
}

function updateVaccinationStatus(dueDate, statusElement) {
    const today = new Date();
    const timeDiff = dueDate - today;
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    
    if (daysDiff < 0) {
        statusElement.className = 'btn btn-danger';
        statusElement.textContent = 'Overdue';
    } else if (daysDiff <= 14) {
        statusElement.className = 'btn btn-warning';
        statusElement.textContent = 'Due Soon';
    } else {
        statusElement.className = 'btn btn-success';
        statusElement.textContent = 'Up to Date';
    }
}

// Grazing Rotation Management
function setupGrazingRotation() {
    const rotationRows = document.querySelectorAll('#grazing-camps tbody tr');
    
    rotationRows.forEach(row => {
        const daysCell = row.children[2];
        const days = parseInt(daysCell.textContent);
        
        if (days <= 2) {
            daysCell.style.color = 'red';
        } else if (days <= 5) {
            daysCell.style.color = 'orange';
        }
    });
}

// Slaughter Management
function setupSlaughterManagement() {
    const slaughterRows = document.querySelectorAll('#slaughter tbody tr');
    
    slaughterRows.forEach(row => {
        const age = parseInt(row.children[2].textContent);
        const weight = parseInt(row.children[3].textContent);
        const status = row.querySelector('.btn');
        
        updateSlaughterStatus(row.children[1].textContent, age, weight, status);
    });
}

function updateSlaughterStatus(type, age, weight, statusElement) {
    const readyConditions = {
        'Cattle': { minAge: 24, minWeight: 500 },
        'Sheep': { minAge: 12, minWeight: 40 },
        'Goat': { minAge: 10, minWeight: 30 }
    };
    
    const condition = readyConditions[type];
    if (age >= condition.minAge && weight >= condition.minWeight) {
        statusElement.className = 'btn btn-success';
        statusElement.textContent = 'Ready';
    } else if (age >= condition.minAge * 0.9 || weight >= condition.minWeight * 0.9) {
        statusElement.className = 'btn btn-warning';
        statusElement.textContent = 'Near Ready';
    } else {
        statusElement.className = 'btn btn-danger';
        statusElement.textContent = 'Not Ready';
    }
}

// Helper Functions
function calculateAgeGroup(dob) {
    const today = new Date();
    const birthDate = new Date(dob);
    const ageInMonths = (today.getFullYear() - birthDate.getFullYear()) * 12 + 
                       (today.getMonth() - birthDate.getMonth());
    
    if (ageInMonths < 6) return 'Young';
    if (ageInMonths < 12) return 'Growing';
    return 'Mature';
}

function getDesiredSlaughterAge(type) {
    const slaughterAges = {
        'Cattle': '24 months',
        'Sheep': '12 months',
        'Goat': '10 months'
    };
    return slaughterAges[type];
}

function closeModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
}

// Search and Filter Functionality
function setupSearchAndFilters() {
    const tables = document.querySelectorAll('table');
    
    tables.forEach(table => {
        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-container';
        searchContainer.innerHTML = `
            <input type="text" placeholder="Search..." class="search-input">
            <select class="filter-select">
                <option value="all">All Types</option>
                <option value="Cattle">Cattle</option>
                <option value="Sheep">Sheep</option>
                <option value="Goat">Goat</option>
            </select>
        `;
        
        table.parentNode.insertBefore(searchContainer, table);
        
        const searchInput = searchContainer.querySelector('.search-input');
        const filterSelect = searchContainer.querySelector('.filter-select');
        
        searchInput.addEventListener('input', () => filterTable(table, searchInput.value, filterSelect.value));
        filterSelect.addEventListener('change', () => filterTable(table, searchInput.value, filterSelect.value));
    });
}

function filterTable(table, searchText, filterValue) {
    const rows = table.querySelectorAll('tbody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        const type = row.children[1]?.textContent;
        
        const matchesSearch = text.includes(searchText.toLowerCase());
        const matchesFilter = filterValue === 'all' || type === filterValue;
        
        row.style.display = matchesSearch && matchesFilter ? '' : 'none';
    });
}

// Update Dashboard Counts
function updateDashboardCounts() {
    const counts = {
        'Cattle': 0,
        'Sheep': 0,
        'Goat': 0
    };
    
    const rows = document.querySelectorAll('#animal-management tbody tr');
    rows.forEach(row => {
        const type = row.children[1].textContent;
        counts[type]++;
    });
    
    // Update dashboard card
    const totalLivestockCard = document.querySelector('.dashboard .card:first-child');
    if (totalLivestockCard) {
        totalLivestockCard.innerHTML = `
            <h2>Total Livestock</h2>
            <p>Cattle: ${counts['Cattle']}</p>
            <p>Sheep: ${counts['Sheep']}</p>
            <p>Goats: ${counts['Goat']}</p>
        `;
    }
}

// Data structure for rotation history
let rotationHistory = [];

// Add rotation confirmation functionality
function setupRotationConfirmation() {
    const rotationTable = document.querySelector('#grazing-camps table');
    if (!rotationTable) return;
    
    // Add confirm button to each row
    const rows = rotationTable.querySelectorAll('tbody tr');
    rows.forEach(row => {
        const actionsCell = document.createElement('td');
        actionsCell.innerHTML = `
            <button class="btn btn-success btn-confirm-rotation">Rotate</button>
        `;
        row.appendChild(actionsCell);
        
        // Add click handler
        const confirmBtn = actionsCell.querySelector('.btn-confirm-rotation');
        confirmBtn.addEventListener('click', () => showRotationConfirmModal(row));
    });
    
    // Add header for new column
    const headerRow = rotationTable.querySelector('thead tr');
    const actionsHeader = document.createElement('th');
    actionsHeader.textContent = 'Actions';
    headerRow.appendChild(actionsHeader);
}

function showRotationConfirmModal(row) {
    const campName = row.children[0].textContent;
    const currentOccupants = row.children[1].textContent;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Rotation Detail Form</h2>
            <form id="rotationConfirmForm">
                <div>
                    <p><strong>Current Camp:</strong> ${campName}</p>
                    <p><strong>Current Occupants:</strong> ${currentOccupants}</p>
                </div>
                <div>
                    <label for="newCamp">Rotate to Camp:</label>
                    <select id="newCamp" required>
                        <option value="">Select Camp</option>
                        <option value="North Field">North Field</option>
                        <option value="East Pasture">East Pasture</option>
                        <option value="South Meadow">South Meadow</option>
                        <option value="West Paddock">West Paddock</option>
                    </select>
                </div>
                <div>
                    <label for="rotationDate">Rotation Date:</label>
                    <input type="date" id="rotationDate" required value="${new Date().toISOString().split('T')[0]}">
                </div>
                <div>
                    <label for="rotationNotes">Notes:</label>
                    <textarea id="rotationNotes" rows="3" placeholder="Any observations about pasture condition, livestock health, etc."></textarea>
                </div>
                <button type="submit" class="btn btn-success">Confirm Rotation</button>
                <button type="button" class="btn btn-danger" onclick="closeModal()">Cancel</button>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Remove current camp from options
    const newCampSelect = document.getElementById('newCamp');
    Array.from(newCampSelect.options).forEach(option => {
        if (option.value === campName) {
            option.remove();
        }
    });
    
    // Add form submission handler
    document.getElementById('rotationConfirmForm').addEventListener('submit', (e) => {
        e.preventDefault();
        handleRotationConfirm(row, newCampSelect.value);
    });
}

function handleRotationConfirm(row, newCamp) {
    const campName = row.children[0].textContent;
    const currentOccupants = row.children[1].textContent;
    const rotationDate = document.getElementById('rotationDate').value;
    const notes = document.getElementById('rotationNotes').value;
    
    // Record the rotation in history
    rotationHistory.push({
        fromCamp: campName,
        toCamp: newCamp,
        occupants: currentOccupants,
        date: rotationDate,
        notes: notes
    });
    
    // Update the table row
    row.children[0].textContent = newCamp;
    
    // Reset rotation timer based on livestock type
    const isGoatsOrSheep = currentOccupants.toLowerCase().includes('sheep') || 
                          currentOccupants.toLowerCase().includes('goat');
    const rotationDays = isGoatsOrSheep ? 28 : 21; // 4 weeks for sheep/goats, 3 weeks for cattle
    row.children[2].textContent = `${rotationDays} days`;
    
    // Update dashboard
    updateRotationDashboard();
    
    // Close modal
    closeModal();
    
    // Show success message
    showNotification('Rotation confirmed successfully!', 'success');
}

function updateRotationDashboard() {
    const dashboardCard = document.querySelector('.dashboard .card:nth-child(2)');
    if (!dashboardCard) return;
    
    // Get the most recent rotation for each type
    const latestCattle = rotationHistory.findLast(r => r.occupants.toLowerCase().includes('cattle'));
    const latestSheepGoats = rotationHistory.findLast(r => 
        r.occupants.toLowerCase().includes('sheep') || r.occupants.toLowerCase().includes('goat')
    );
    
    dashboardCard.innerHTML = `
        <h2>Next Rotations Due</h2>
        ${latestCattle ? `
            <p>Cattle: ${calculateNextRotation(latestCattle.date, 21)} days</p>
        ` : ''}
        ${latestSheepGoats ? `
            <p>Sheep & Goats: ${calculateNextRotation(latestSheepGoats.date, 28)} days</p>
        ` : ''}
    `;
}

function calculateNextRotation(lastRotationDate, rotationDays) {
    const lastRotation = new Date(lastRotationDate);
    const nextRotation = new Date(lastRotation);
    nextRotation.setDate(nextRotation.getDate() + rotationDays);
    
    const today = new Date();
    const daysUntilRotation = Math.ceil((nextRotation - today) / (1000 * 60 * 60 * 24));
    
    return daysUntilRotation;
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Add to initializeSystem()
function initializeSystem() {
    // ... existing initialization code ...
    setupRotationConfirmation();
}

// Add view rotation history functionality
function setupRotationHistory() {
    const rotationSection = document.querySelector('#grazing-camps');
    if (!rotationSection) return;
    
    const historyButton = document.createElement('button');
    historyButton.className = 'btn btn-info';
    historyButton.textContent = 'View Rotation History';
    historyButton.addEventListener('click', showRotationHistory);
    
    rotationSection.insertBefore(historyButton, rotationSection.querySelector('table'));
}

function showRotationHistory() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Rotation History</h2>
            <table class="rotation-history-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>From Camp</th>
                        <th>To Camp</th>
                        <th>Occupants</th>
                        <th>Notes</th>
                    </tr>
                </thead>
                <tbody>
                    ${rotationHistory.map(rotation => `
                        <tr>
                            <td>${new Date(rotation.date).toLocaleDateString()}</td>
                            <td>${rotation.fromCamp}</td>
                            <td>${rotation.toCamp}</td>
                            <td>${rotation.occupants}</td>
                            <td>${rotation.notes || '-'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <button class="btn btn-danger" onclick="closeModal()">Close</button>
        </div>
    `;
    
    document.body.appendChild(modal);
}