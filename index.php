<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Livestock Monitoring System</title>
    <link rel="stylesheet" href="styles/style.css">
    <script src="Scripts/script.js"></script>
</head>
<body>
    <header>
        <table>
            <tr>
                <td>
                    <img src="Designer.jpeg" height="130" alt="logo">
                </td>
                <td><h1>Livestock Monitoring System</h1></td>
            </tr>
        </table>
    </header>
    <nav>
        <ul>
            <li><a href="#home" class="active">Home</a></li>
            <li><a href="#dashboard">Dashboard</a></li>
            <li><a href="#animal-management">Animal Management</a></li>
            <li><a href="#grazing-camps">Grazing Camps</a></li>
            <li><a href="#vaccinations">Vaccinations</a></li>
            <li><a href="#slaughter">Slaughter</a></li>
        </ul>
    </nav>
    <img src="vaccination.jpg" width="100%" alt="logo">
    <main>
        <section id="dashboard" class="dashboard">
        <?php include 'Back-end/fetch_total_livestock.php'; ?>
        <?php include 'Back-end/fetch_camp_rotation.php'; ?>
        <?php include 'Back-end/fetch_vaccination_due.php'; ?>
        <?php include 'back-end/slotter_details.php';?>
        </section>
        
        <?php include 'back-end/animal_management.php';?>
        <?php include 'back-end/rotation_table.php';?>
        <?php include 'back-end/vaccination_details.php';?>
        
        
        
        
        <section id="slaughter" class="card">
            <h2>Slaughter Time Determination</h2>
            <table>
                <thead>
                    <tr>
                        <th>Tag Number</th>
                        <th>Type</th>
                        <th>Age (months)</th>
                        <th>Weight (kg)</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>C042</td>
                        <td>Cattle</td>
                        <td>24</td>
                        <td>550</td>
                        <td><span class="btn btn-success">Ready</span></td>
                    </tr>
                    <tr>
                        <td>S098</td>
                        <td>Sheep</td>
                        <td>11</td>
                        <td>45</td>
                        <td><span class="btn btn-warning">Near Ready</span></td>
                    </tr>
                    <tr>
                        <td>G112</td>
                        <td>Goat</td>
                        <td>10</td>
                        <td>35</td>
                        <td><span class="btn btn-success">Ready</span></td>
                    </tr>
                </tbody>
            </table>
        </section>
    </main>
    <div class="content">
    </div>
    <footer class="footer">
        <div class="footer-content">
            <div class="footer-section">
                <h3>About Us</h3>
                <p>The Livestock Monitoring System is designed to assist farmers in efficiently managing their cattle, sheep, and goats across different grazing camps. This system automates key aspects of livestock management, including animal tracking, vaccination schedules, and determining the optimal slaughter time based on weight and age.</p>
            </div>
            <div class="footer-section">
                <h3>Quick Links</h3>
                <ul>
                    <li><a href="#">Home</a></li>
                </ul>
            </div>
            <div class="footer-section">
                <h3>Contact Us</h3>
                <ul>
                    <li>Email: info@farmTech.com</li>
                    <li>Phone: 081 80 31157</li>
                    <li>Address: 67 Windhoek West, Namibia</li>
                </ul>
            </div>
            <div class="footer-section">
                <h3>Follow Us</h3>
                <div class="social-icons">
                    <a href="#" aria-label="Facebook">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                    </a>
                    <a href="#" aria-label="Twitter">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
                    </a>
                    <a href="#" aria-label="Instagram">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                    </a>
                    <a href="#" aria-label="LinkedIn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                    </a>
                </div>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2024 Live-Stock Technology CC. All rights reserved.</p>
        </div>
    </footer>
</body>
</html>