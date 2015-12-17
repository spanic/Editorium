<?php
	$link = mysqli_connect("codex", "root", "");
	mysqli_select_db($link, "codex");
	mysqli_query($link, "SET CHARACTER SET cp1251;") or die(mysql_error());
?>