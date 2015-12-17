<?php
	require_once("connection.php");
	if ($_POST["finalText"]) {
		$article = $_POST["finalText"];
		$result = mysqli_query($link, "INSERT INTO `codex`.`articles` (`id`, `time`, `article`) VALUES (NULL, CURRENT_TIMESTAMP, '$article')");
		header("Location: showArticles.php");
    	exit();
	}
?>