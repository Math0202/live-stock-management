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

// Query to get the number of animals and the nearest slaughter time for each animal type
$sql = "
    SELECT type,
           COUNT(*) as animal_count,
           MIN(DATEDIFF(CURRENT_DATE, DATE_ADD(date_of_birth, INTERVAL slaughter_age YEAR))) AS days_until_ready
    FROM Animals
    GROUP BY type
";

$result = $conn->query($sql);
$slaughterData = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        // Calculate remaining time for slaughter in weeks
        $daysUntilReady = (int) $row['days_until_ready'];
        $remainingWeeks = max(0, ceil($daysUntilReady / 7));  // Calculate weeks remaining

        // Store slaughter data for each animal type
        $slaughterData[$row['type']] = [
            'animal_count' => $row['animal_count'],
            'remaining_weeks' => $remainingWeeks,
        ];
    }
} else {
    echo "No animals found in the database.";
}

$conn->close();
?>

<div class="card">
    <h2>Ready for Slaughter</h2>
    <?php foreach ($slaughterData as $animalType => $data): ?>
        <p><?php echo $animalType . ": " . $data['remaining_weeks'] . " weeks"; ?></p>
    <?php endforeach; ?>
    <a href="#slaughter" class="btn btn-danger">View Details</a>
</div>
