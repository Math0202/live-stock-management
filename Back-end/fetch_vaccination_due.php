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

// Define vaccination interval in days (e.g., every 180 days for demonstration)
$vaccinationIntervalDays = 180;

// Query to get the count of each animal type and the days since their last vaccination
$sql = "
    SELECT type,
           COUNT(*) as animal_count,
           DATEDIFF(NOW(), MAX(created_at)) AS days_since_last_vaccine
    FROM Animals
    GROUP BY type
";

$result = $conn->query($sql);
$vaccinationData = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $daysSinceLastVaccine = (int) $row['days_since_last_vaccine'];
        $timeLeft = max(0, $vaccinationIntervalDays - $daysSinceLastVaccine);

        // Determine if vaccination is due this week or next week
        $dueText = "";
        if ($timeLeft <= 7) {
            $dueText = "need vaccination this week";
        } elseif ($timeLeft <= 14) {
            $dueText = "need vaccination next week";
        }

        // Store vaccination data for each animal type
        $vaccinationData[$row['type']] = [
            'animal_count' => $row['animal_count'],
            'due_text' => $dueText,
        ];
    }
} else {
    echo "No animals found in the database.";
}

$conn->close();
?>

<div class="card">
    <h2>Vaccinations Due</h2>
    <?php foreach ($vaccinationData as $animalType => $data): ?>
        <?php if ($data['due_text']): ?>
            <p><?php echo $data['animal_count'] . " " . $animalType . " " . $data['due_text']; ?></p>
        <?php else: ?>
            <p><?php echo "No " . $animalType . " require vaccination soon."; ?></p>
        <?php endif; ?>
    <?php endforeach; ?>
    <a href="#vaccinations" class="btn btn-warning">View Details</a>
</div>
