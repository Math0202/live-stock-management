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

$camps = ['North Field', 'East Pasture', 'South Meadow', 'West Paddock'];
$campRotationData = [];

// Fetch animals grouped by camp
foreach ($camps as $camp) {
    // Query to get the first animal's date added and types of animals in this camp
    $sql = "
        SELECT MIN(date_added_to_camp) as first_added_date, GROUP_CONCAT(DISTINCT type ORDER BY type) as animal_types
        FROM Animals
        WHERE current_camp = ?
    ";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $camp);
    $stmt->execute();
    $stmt->bind_result($first_added_date, $animal_types);
    $stmt->fetch();
    $stmt->close();

    if ($first_added_date) {
        // Calculate days remaining for rotation
        $daysInCamp = (new DateTime())->diff(new DateTime($first_added_date))->days;
        $daysRemaining = max(0, 30 - $daysInCamp);
        
        $campRotationData[$camp] = [
            'status' => $daysRemaining . ' days (' . $animal_types . ')',
            'daysRemaining' => $daysRemaining,
        ];
    } else {
        // No animals in this camp
        $campRotationData[$camp] = [
            'status' => 'Empty camp',
            'daysRemaining' => null,
        ];
    }
}

$conn->close();
?>

<div class="card">
    <h2>Upcoming Rotations</h2>
    <?php foreach ($campRotationData as $campName => $campData): ?>
        <p><?php echo $campName; ?>: <?php echo $campData['status']; ?></p>
    <?php endforeach; ?>
</div>
