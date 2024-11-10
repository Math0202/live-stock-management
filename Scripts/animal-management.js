
// Animal Management ---------------------------
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
                    <input type="text" name="tag_number" id="tagNumber" required pattern="[A-Za-z0-9-]+" 
                           title="Only letters, numbers, and hyphens allowed">
                </div>
                <div>
                    <label for="type">Type:</label>
                    <select name="type" id="type" required onchange="updateSlaughterRange()">
                        <option value="Cattle">Cattle</option>
                        <option value="Sheep">Sheep</option>
                        <option value="Goat">Goat</option>
                    </select>
                </div>
                <div>
                    <label for="dob">Date of Birth:</label>
                    <input type="date" name="dob" id="dob" required onchange="updateVaccinationSchedule()">
                </div>
                <div>
                    <label for="slaughterAge">Desired Slaughter Age (months):</label>
                    <input type="number" name="slaughterAge" id="slaughterAge" required>
                    <span id="slaughterRange"></span>
                </div>
                <div>
                    <label for="vaccineType">Select Vaccine:</label>
                    <select name="vaccineType" id="vaccineType" required onchange="updateVaccinationSchedule()">
                        <!-- Options will be populated based on animal type -->
                    </select>
                </div>
                <div>
                    <label>Vaccination Schedule:</label>
                    <div id="vaccinationSchedule" class="schedule-list"></div>
                </div>
                <div id="formMessage" class="message"></div>
                <button type="submit" class="btn btn-success">Add Animal</button>
                <button type="button" class="btn btn-danger" onclick="closeModal()">Cancel</button>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    updateSlaughterRange();
    document.getElementById('addAnimalForm').addEventListener('submit', handleAddAnimal);
}

function updateVaccinationSchedule() {
    const dob = new Date(document.getElementById('dob').value);
    const type = document.getElementById('type').value;
    const vaccineType = document.getElementById('vaccineType').value;
    const scheduleDiv = document.getElementById('vaccinationSchedule');
    
    if (!dob || isNaN(dob.getTime())) {
        scheduleDiv.dataset.schedules = JSON.stringify([]); // Set empty array as default
        return;
    }
    
    const vaccine = vaccineTypes[type].find(v => v.name === vaccineType);
    if (!vaccine) {
        scheduleDiv.dataset.schedules = JSON.stringify([]); // Set empty array as default
        return;
    }
    
    let scheduleHTML = '<ul class="schedule-items">';
    const schedules = [];
    
    const timingParts = vaccine.timing.split(',');
    timingParts.forEach(part => {
        const timing = part.trim();
        let schedule = null;
        
        if (type === 'Cattle') {
            if (vaccineType === 'Clostridial Vaccines') {
                const initialDate = addMonths(dob, 2);
                const boosterDate = addMonths(initialDate, 1.5);
                schedules.push(
                    {
                        vaccineType,
                        date: formatDate(initialDate),
                        description: 'Initial vaccination'
                    },
                    {
                        vaccineType,
                        date: formatDate(boosterDate),
                        description: 'Booster shot'
                    }
                );
            } else if (vaccineType === 'Bovine Respiratory Disease Complex') {
                const initialDate = addMonths(dob, 2);
                const boosterDate = addMonths(dob, 6);
                schedules.push(
                    {
                        vaccineType,
                        date: formatDate(initialDate),
                        description: 'Initial vaccination'
                    },
                    {
                        vaccineType,
                        date: formatDate(boosterDate),
                        description: 'Weaning booster'
                    }
                );
            }
            // Add other vaccine schedules as needed
        }
        
        if (schedule) {
            schedules.push(schedule);
        }
    });
    
    schedules.forEach(schedule => {
        scheduleHTML += `
            <li class="schedule-item">
                ${schedule.description} - ${schedule.date}
                <span class="status">Scheduled</span>
            </li>
        `;
    });
    
    scheduleHTML += '</ul>';
    scheduleDiv.innerHTML = scheduleHTML;
    scheduleDiv.dataset.schedules = JSON.stringify(schedules);
}

async function handleAddAnimal(e) {
    e.preventDefault();
    
    const formMessage = document.getElementById('formMessage');
    const submitButton = e.target.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    
    try {
        const scheduleDiv = document.getElementById('vaccinationSchedule');
        let vaccinationSchedules = [];
        
        // Add error checking for the schedules parsing
        try {
            if (scheduleDiv.dataset.schedules) {
                vaccinationSchedules = JSON.parse(scheduleDiv.dataset.schedules);
            }
        } catch (parseError) {
            console.error('Error parsing schedules:', parseError);
            vaccinationSchedules = [];
        }
        
        const formData = {
            tag_number: document.getElementById('tagNumber').value,
            type: document.getElementById('type').value,
            dob: document.getElementById('dob').value,
            slaughterAge: document.getElementById('slaughterAge').value,
            vaccineType: document.getElementById('vaccineType').value,
            vaccinationSchedules: vaccinationSchedules
        };

        // Validate required fields
        if (!formData.tag_number || !formData.type || !formData.dob || !formData.slaughterAge || !formData.vaccineType) {
            throw new Error('Please fill in all required fields');
        }

        const response = await fetch('Back-end/add_animal.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.success) {
            updateAnimalTable({
                tag_number: formData.tag_number,
                type: formData.type,
                dob: formData.dob,
                slaughter_age: formData.slaughterAge,
                vaccine_type: formData.vaccineType,
                schedules: vaccinationSchedules
            });
            
            formMessage.textContent = result.message;
            formMessage.className = "message success";
            setTimeout(closeModal, 1500);
            updateDashboardCounts();
        } else {
            throw new Error(result.error || 'Unknown error occurred');
        }
    } catch (error) {
        formMessage.textContent = `Error: ${error.message}`;
        formMessage.className = "message error";
    } finally {
        submitButton.disabled = false;
    }
}

// Helper function to fetch vaccination schedules
async function getVaccinationSchedules(tagNumber) {
    try {
        const response = await fetch(`Back-end/add_animal.php?tag_number=${tagNumber}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        return data.success ? data.schedules : [];
    } catch (error) {
        console.error('Error fetching vaccination schedules:', error);
        return [];
    }
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

function closeModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
}

function updateAnimalTable(animalData) {
    const table = document.getElementById('animalTable').querySelector('tbody');

    if (!table) {
        console.error('Animal table not found');
        return;
    }

    const row = table.insertRow();
    
    const tagNumberCell = row.insertCell(0);
    tagNumberCell.textContent = animalData.tag_number;

    const typeCell = row.insertCell(1);
    typeCell.textContent = animalData.type;

    const dobCell = row.insertCell(2);
    dobCell.textContent = animalData.dob;

    const ageGroupCell = row.insertCell(3);
    ageGroupCell.textContent = animalData.age_group || "Unknown"; // Assuming age group might be calculated elsewhere

    const slaughterAgeCell = row.insertCell(4);
    slaughterAgeCell.textContent = animalData.slaughter_age;
}