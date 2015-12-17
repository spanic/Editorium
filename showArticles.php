<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<title>All articles - CodeX</title>
	<link rel="shortcut icon" href="showIcon.ico" type="image/x-icon">
	<link rel="stylesheet" href="normalize.css" type="text/css"/>
	<link rel="stylesheet" href="style.css" type="text/css"/>
	<link rel="stylesheet" href="output.css" type="text/css"/>
</head>
<body>
	<main>
		<?php
			require_once("connection.php");
			$result = mysqli_query($link, "SELECT * FROM articles");
			while ($newArr = mysqli_fetch_assoc($result)) {
				?>
				<div class="date">
					<?php echo date("l jS F Y - H:i", strtotime($newArr['time']));?>
				</div>
				<?php
				echo $newArr['article'];
			}
		?>
	</main>
</body>
</html>
