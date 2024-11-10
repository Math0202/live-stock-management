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

// Query to get all animals
$sql = "SELECT tag_number, type, date_of_birth, slaughter_age FROM Animals";
$result = $conn->query($sql);

$animals = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $animals[] = $row;  // Store each animal's data
    }
} else {
    echo "No animals found.";
}

$conn->close();
?>

<section id="animal-management" class="card">
    <h2>Animal Management</h2>
    <table id="animalTable">
        <thead>
            <tr>
                <th>Tag Number</th>
                <th>Type</th>
                <th>Date of Birth</th>
                <th>Age Group</th>
                <th>Desired Slaughter Age</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($animals as $animal): ?>
                <tr>
                    <td><?php echo $animal['tag_number']; ?></td>
                    <td><?php echo $animal['type']; ?></td>
                    <td><?php echo $animal['date_of_birth']; ?></td>
                    <td>
                        <?php
                        // Assuming slaughter age for categorizing
                        $age = (new DateTime($animal['date_of_birth']))->diff(new DateTime())->y;
                        if ($age < 1) {
                            echo "Kid";
                        } elseif ($age < 2) {
                            echo "Lamb";
                        } else {
                            echo "Young";
                        }
                        ?>
                    </td>
                    <td><?php echo $animal['slaughter_age']; ?> months</td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
    <a href="#" onclick="showAddAnimalModal()" class="btn btn-success">Add New Animal</a>
</section>
