<?php
$servername = "localhost";
$username = "root";
$password = "MILLshe@73";
$dbname = "livestock_management";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Query to get the first animal added to each camp and the number of animals in each camp
$sql = "
    SELECT current_camp, 
           MIN(date_added_to_camp) AS first_animal_date,
           type,
           COUNT(*) AS animal_count
    FROM Animals
    GROUP BY current_camp, type
    ORDER BY current_camp, first_animal_date
";

$result = $conn->query($sql);

$campData = [];
$campTypes = ['Cattle', 'Sheep', 'Goat'];

while ($row = $result->fetch_assoc()) {
    $campData[$row['current_camp']][$row['type']] = [
        'first_animal_date' => $row['first_animal_date'],
        'animal_count' => $row['animal_count']
    ];
}

// Calculate days until rotation for each camp
$campRotationData = [];

foreach ($campData as $campName => $animals) {
    $firstAnimalDate = min(array_column($animals, 'first_animal_date'));
    $firstAnimalDateObj = new DateTime($firstAnimalDate);
    $rotationDate = $firstAnimalDateObj->add(new DateInterval('P30D')); // Adding 30 days for the rotation

    $currentDate = new DateTime();
    $interval = $currentDate->diff($rotationDate);
    $daysUntilRotation = $interval->days;

    // Collect the animal types and counts for the camp
    $currentOccupants = [];
    foreach ($campTypes as $type) {
        if (isset($animals[$type])) {
            $currentOccupants[] = "{$type} ({$animals[$type]['animal_count']} head)";
        }
    }

    $campRotationData[$campName] = [
        'current_occupants' => implode(", ", $currentOccupants),
        'days_until_rotation' => $daysUntilRotation
    ];
}

$conn->close();
?>

<section id="grazing-camps" class="card">
    <h2>Grazing Camp Rotation</h2>
    <table>
        <thead>
            <tr>
                <th>Camp Name</th>
                <th>Current Occupants</th>
                <th>Days Until Rotation</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($campRotationData as $campName => $data): ?>
                <tr>
                    <td><?php echo $campName; ?></td>
                    <td><?php echo $data['current_occupants']; ?></td>
                    <td><?php echo $data['days_until_rotation']; ?> days</td>
                    <td><button class="btn btn-success" onclick="showRotateModal('<?php echo $campName; ?>')">Rotate</button></td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
</section>

<!-- Pop-up Modal -->
<div id="rotate-modal" class="modal">
    <div class="modal-content">
        <span class="close-btn" onclick="closeModal()">&times;</span>
        <h3>Select a New Camp for Rotation</h3>
        <form id="rotationForm">
            <div>
                <label for="new-camp">New Camp:</label>
                <select id="new-camp" required>
                    <option value="">Select Camp</option>
                    <option value="North Field">North Field</option>
                    <option value="East Pasture">East Pasture</option>
                    <option value="South Meadow">South Meadow</option>
                    <option value="West Paddock">West Paddock</option>
                </select>
            </div>
            <button type="submit" class="btn btn-success">Rotate</button>
            <button type="button" class="btn btn-danger" onclick="closeModal()">Cancel</button>
        </form>
    </div>
</div>


<script>
    let selectedCampName = '';

function showRotateModal(campName) {
    selectedCampName = campName;
    document.getElementById("rotate-modal").style.display = 'block';
}

function closeModal() {
    document.getElementById("rotate-modal").style.display = 'none';
}

document.getElementById("rotationForm").addEventListener("submit", function(e) {
    e.preventDefault();
    rotateAnimals();
});

function rotateAnimals() {
    const newCamp = document.getElementById('new-camp').value;

    // Perform the AJAX request to update the database
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "Back-end/rotate_animals.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onload = function() {
        if (xhr.status === 200) {
            alert("Rotation successful");
            location.reload();  // Reload the page to reflect changes
        } else {
            alert("Error rotating animals");
        }
    };

    xhr.send("current_camp=" + selectedCampName + "&new_camp=" + newCamp);
    
    closeModal();
}

</script>
