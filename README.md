# Editorium

Блочный визуальный редактор для веб-сайтов. Этот инструмент помогает быстро создавать красивые публикации. 

![Interface](https://pp.vk.me/c631816/v631816841/5ff6/5ctT7Lyc3Js.jpg "Interface")

На данном этапе доступно 5 основных контентных блоков: 

  - Абзац с текстом 
  - Заголовок
  - Изображение
  - Маркированый список
  - Цитата

Для того, чтобы установить Editorium на сайт, добавьте код из файла newArticle.html (начиная с тега main включительно) на Вашу веб-страницу. 

```sh
<main>
    <h1 class="mainTitle" contenteditable="true">Заголовок публикации</h1>

		<div class="addButton">
			<div class="icon-plus"></div>
			<div class="container">
				<div class="icon-title"></div>
				
				...
</main>
```

Далее поместите на сервер файлы normalize.css,  style.css, script.js и upload.php. укажите пути к ним. 

```sh
<link rel="stylesheet" href="normalize.css" type="text/css"/>
<link rel="stylesheet" href="style.css" type="text/css"/>
<script src="script.js"></script>
```

```sh
<form class="upload" action="upload.php" method="POST" enctype="multipart/form-data">
```

И наконец создайте папку uploads, в нее будут сохраняться изображения, загруженные пользователями.

Редактор не использует каких-либо сторонних JavaScript-библиотек, итоговый текст статьи отправляется на сервер POST-запросом из 

```sh
<textarea id="finalText">
```

а после отображаются на странице showArticles.php
