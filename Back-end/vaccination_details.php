<?php
// Database connection
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

// Function to get vaccination schedule based on animal type and vaccine type
function getVaccinationSchedule($dob, $type, $vaccineType) {
    $schedule = [];

    // Convert date of birth to DateTime object
    $dob = new DateTime($dob);

    // Calculate next vaccination dates based on vaccine type
    switch ($type) {
        case 'Cattle':
            if ($vaccineType == 'Clostridial Vaccines') {
                $initialDate = $dob->modify('+2 months');
                $boosterDate = clone $initialDate;
                $boosterDate->modify('+1.5 months');
                $schedule[] = ['Initial' => $initialDate->format('Y-m-d')];
                $schedule[] = ['Booster' => $boosterDate->format('Y-m-d')];
            } elseif ($vaccineType == 'Bovine Respiratory Disease Complex') {
                $initialDate = $dob->modify('+2 months');
                $boosterDate = clone $dob;
                $boosterDate->modify('+6 months');
                $schedule[] = ['Initial' => $initialDate->format('Y-m-d')];
                $schedule[] = ['Booster at weaning' => $boosterDate->format('Y-m-d')];
            }
            break;
        case 'Sheep':
            if ($vaccineType == 'CD-T') {
                $initialDate = $dob->modify('+42 days'); // 6 weeks
                $boosterDate = clone $initialDate;
                $boosterDate->modify('+28 days'); // 4 weeks later
                $schedule[] = ['Initial' => $initialDate->format('Y-m-d')];
                $schedule[] = ['Booster' => $boosterDate->format('Y-m-d')];
            }
            break;
        case 'Goat':
            if ($vaccineType == 'CD-T') {
                $initialDate = $dob->modify('+42 days'); // 6 weeks
                $boosterDate = clone $initialDate;
                $boosterDate->modify('+28 days'); // 4 weeks later
                $schedule[] = ['Initial' => $initialDate->format('Y-m-d')];
                $schedule[] = ['Booster' => $boosterDate->format('Y-m-d')];
            }
            break;
    }

    return $schedule;
}

// Fetch animals data from the database
$sql = "SELECT * FROM Animals";
$result = $conn->query($sql);
$animals = [];

if ($result->num_rows > 0) {
    // Output each row
    while($row = $result->fetch_assoc()) {
        $vaccinationSchedule = getVaccinationSchedule($row['date_of_birth'], $row['type'], $row['vaccine_type']);
        $animals[] = [
            'tag_number' => $row['tag_number'],
            'type' => $row['type'],
            'last_vaccination' => $row['date_added_to_camp'], // This could be updated based on actual vaccination records
            'vaccination_schedule' => $vaccinationSchedule
        ];
    }
} else {
    echo "0 results";
}

$conn->close();
?>

<section id="vaccinations" class="card">
    <h2>Vaccination Tracking</h2>
    <table>
        <thead>
            <tr>
                <th>Tag Number</th>
                <th>Type</th>
                <th>Last Vaccination</th>
                <th>Next Due Date</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($animals as $animal): ?>
                <?php
                    // Calculate next due date and determine status
                    $lastVaccinationDate = new DateTime($animal['last_vaccination']);
                    $nextDueDate = $lastVaccinationDate->modify('+6 months'); // Just an example calculation
                    $today = new DateTime();
                    $daysUntilDue = $today->diff($nextDueDate)->days;
                    $statusClass = 'btn btn-success';
                    $statusText = 'Up to Date';

                    if ($daysUntilDue < 0) {
                        $statusClass = 'btn btn-danger';
                        $statusText = 'Overdue';
                    } elseif ($daysUntilDue <= 14) {
                        $statusClass = 'btn btn-warning';
                        $statusText = 'Due Soon';
                    }
                ?>
                <tr>
                    <td><?php echo $animal['tag_number']; ?></td>
                    <td><?php echo $animal['type']; ?></td>
                    <td><?php echo $animal['last_vaccination']; ?></td>
                    <td><?php echo $nextDueDate->format('Y-m-d'); ?></td>
                    <td><span class="<?php echo $statusClass; ?>"><?php echo $statusText; ?></span></td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
</section>

<script>
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

</script>