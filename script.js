//Копирование блоков
var main = document.getElementsByTagName('main')[0],
	mainChildren = main.children,
	article = document.querySelector('.article').cloneNode(true),
	button = document.querySelector('.addButton').cloneNode(true),
	heading = document.querySelector('.l2Heading').cloneNode(true),
	image = document.querySelector('.image').cloneNode(true),
	quote = document.querySelector('.quote').cloneNode(true),
	list = document.querySelector('.newList').cloneNode(true),
	finalButton = document.getElementById('final'),
	focusedNode,
	imageArray = [],
	i;
//Удаление блоков из стартовой разметки
main.removeChild(document.querySelector('.l2Heading'));
main.removeChild(document.querySelector('.image'));
main.removeChild(document.querySelector('.quote'));
main.removeChild(document.querySelector('.newList'));
//Прикрепление кнопок на старте
addOnClickHandler(document.querySelector('.addButton'));
appendButtonsOnLoad();

//Добавление конпок ко всем отображаемым при загрузке страницы блокам.
//Позже можно использовать для создания формы редактирования статьи
function appendButtonsOnLoad() {
	for (i = 0; i < mainChildren.length; i++) {
		var mainChild = mainChildren[i];
		if (mainChild.nextElementSibling != null && mainChild.className != "addButton" && mainChild.nextElementSibling.className != "addButton") {
			main.insertBefore(addOnClickHandler(button.cloneNode(true)), mainChild.nextElementSibling);
		}
	}
	//main.appendChild(addOnClickHandler(button.cloneNode(true)));
}

//Добавление обработчика нажатия на icon-кнопки для добавления блоков
function addOnClickHandler(chosenButton) {
	var iconContainer = chosenButton.children[1];
	for (var i = 0; i < iconContainer.children.length; i++) {
		iconContainer.children[i].onclick = function() {
			showBlock(this);
		};
	};
	return chosenButton;
}

// Определение, какой блок пользователь захотел добавить
function showBlock(obj) {
	var block;
	switch (obj.className) {
		//Список
		case "icon-list":
			block = list.cloneNode(true);
			//Отлов нажатия на Backspace и Delete, чтобы не удалялся последний пункт <li> и чтобы в Мозилле не вставлялись <br>, если список пустой
			block.addEventListener("keydown", function(event) {
				if (event.keyCode == 8 || event.keyCode == 46) {
					if (event.target.children.length == 1 && event.target.textContent.length == 0) {
					event.preventDefault();
					}
				}
			});
			break;
		//Заголовок второго уровня
		case "icon-title":
			block = heading.cloneNode(true);
			break;
		//Абзац
		case "icon-article":
			block = article.cloneNode(true);
			break;
		//Цитату
		case "icon-quote":
			block = quote.cloneNode(true);
			break;
		//Картинку
		case "icon-image":
			block = image.cloneNode(true);
			break;
	}
	addContent(block, obj);
	//Проверка на добавление блока с изображениями
	var nextMainSibling = obj.parentElement.parentElement.nextElementSibling;
	if (nextMainSibling.className == "image") {
		startUpload(nextMainSibling);
	}
}

//Добавление выбранного блока и кнопки добавления после него
function addContent(content, obj) {
	content.style.display = "block";
	var clickedButton = obj.parentElement.parentElement,
		nextElement = clickedButton.nextElementSibling;
	main.insertBefore(content, nextElement);
	main.insertBefore(addOnClickHandler(button.cloneNode(true)), nextElement);
}

//Удаление блока по клику
function sayGoodbyeTo(obj) {
	for (i = 0; i < mainChildren.length; i++) {
		if (mainChildren[i] == obj.parentElement) {
			main.removeChild(mainChildren[i+1]);
			main.removeChild(mainChildren[i]);
		}
	}
}

//Запуск скрипта загрузки картинок
function startUpload(nextMainSibling) {
	var thisForm = nextMainSibling.children[1],
		thisProgress = nextMainSibling.children[2],
		thisMessages = nextMainSibling.children[3],
		thisMaxFileSize = thisForm.childNodes[1],
		thisFileSelect = thisForm.childNodes[3].children[1],
		thisFileDrag = thisForm.childNodes[3].children[2],
		thisSubmitButton = thisForm.childNodes[5],
		uploaded = false;

	if (window.File && window.FileList && window.FileReader) {
		init();
	}

	function init() {
		//Установка обработчика на факт выбора файла
		thisFileSelect.addEventListener("change", fileSelectHandler, false);
		var xhr = new ajaxRequest();
		if (xhr.upload) {
			thisFileDrag.addEventListener("dragover", fileDragHover, false);
			thisFileDrag.addEventListener("dragleave", fileDragHover, false);
			thisFileDrag.addEventListener("drop", fileSelectHandler, false);
			thisSubmitButton.style.display = "none";
		}
	}

	function fileDragHover(e) {
		e.stopPropagation();
		e.preventDefault();
		e.target.className = (e.type == "dragover" ? "filedragHover" : "filedrag");
	}

	function fileSelectHandler(e) {
		fileDragHover(e);
		var files = e.target.files || e.dataTransfer.files;
		for (var i = 0, f; f = files[i]; i++) {
			parseFile(f);
			uploadFile(f);
		}
	}

	function parseFile(file) {
		if (file.type.indexOf("image") == 0) {
			var reader = new FileReader();
			reader.onload = function(e) {
				output(
					'<img src="' + e.target.result + '"/>'
				);
				imageArray.push(file.name);
				console.log(imageArray);
			}
			reader.readAsDataURL(file);
		}
	}

	//Функция загрузки файла
	function uploadFile(file) {
		var xhr = new ajaxRequest();
		if (xhr.upload && file.type == "image/jpeg" && file.size <= thisMaxFileSize.value) {
			//Создание индикатора загрузки
			var o = thisProgress;
			var progress = o.appendChild(document.createElement("p"));
			xhr.upload.addEventListener("progress", function(e) {
				if (e.loaded/e.total < 1) {
					progress.innerHTML = "Loading...";
				} else {
					progress.innerHTML = "Saving...";
				}
			}, false);
			//Отслеживание результата загрузки
			xhr.onreadystatechange = function(e) {
				if (xhr.readyState == 4) {
					if (xhr.status == 200) {
						progress.className = "success";
						progress.innerHTML = "Successfully loaded!";
						uploaded = true;
					} else {
						progress.className = "failure";
						progress.innerHTML = "Something went wrong =(";
					}
				}
			};
			//Запуск загрузки
			xhr.open("POST", thisForm.action, true);
			xhr.setRequestHeader("X_FILENAME", file.name);
			xhr.send(file);
		}
		if (uploaded = true) {
			nextMainSibling.removeChild(thisForm);
		}
	}

	function output(msg) {
		var m = thisMessages;
		m.innerHTML = msg + m.innerHTML;
	}

	function ajaxRequest() {
		try {
			var request = new XMLHttpRequest();
		} catch(error1) {
			try {
			request = new ActiveXObject("Msxml2.XMLHTTP");
			} catch(error2) {
				try {
					request = new ActiveXObject("Microsoft.XMLHTTP");
				} catch(error3) {
					request = false;
					alert("Ваш браузер не поддреживается");
				}
			}
		}
		return request;
	}
}

//Подготовка и вывод готового HTML-кода для вставки в базу
finalButton.addEventListener('click', function(event) {
	var finalHTML = "",
		n = 0;
		finalMain = document.getElementsByTagName('main')[0].cloneNode(true);
	if (finalMain.children.length > 3) {
		for (var i = 0; i < finalMain.children.length; i++) {
			var childNode = finalMain.children[i];
			if (childNode.className != "addButton" && childNode.id != "final") {
			 	switch (childNode.className) {
			 		case "mainTitle" : {
			 			removeEditableAttribute(childNode);
			 			finalHTML += childNode.outerHTML + "\n";
			 			break;
			 		}
			 		case "l2Heading" : {
			 			finalHTML += removeEditableAttribute(childNode.getElementsByTagName('h2')[0]).outerHTML + "\n";
			 			break;
			 		}
			 		case "article" : {
			 			childNode.removeChild(childNode.querySelector('.delete'));
			 			removeEditableAttribute(childNode.getElementsByTagName('p')[0]).style.marginRight = 0;
			 			finalHTML += childNode.outerHTML + "\n";
			 			break;
			 		}
			 		case "quote" : {
			 			childNode.removeChild(childNode.querySelector('.delete'));
			 			for (var j = 0; j < childNode.children.length; j++) {
			 				removeEditableAttribute(childNode.children[j]);
			 			}
			 			finalHTML += childNode.outerHTML + "\n";
			 			break;
			 		}
			 		case "newList" : {
			 			childNode.removeChild(childNode.querySelector('.delete'));
			 			removeEditableAttribute(childNode.getElementsByTagName('ul')[0]).style.marginRight = 0;
			 			finalHTML += childNode.outerHTML + "\n";
			 			break;
			 		}
			 		case "image" : {
			 			if (childNode.querySelector(".messages").innerHTML) {
				 			for (var j = 0; j < childNode.children.length; j++) {
				 				if (childNode.children[j].className != "messages") {
				 					childNode.removeChild(childNode.children[j]);
				 					j--;
				 				}
				 			}
				 			finalHTML += '<img src="uploads/' + imageArray[n] + '">' + "\n";
				 			n++;
				 			break;
				 		} else {
				 			finalMain.removeChild(childNode);
				 		}
			 		}
			 	}
			 	finalHTML += "\n";
			}
		}
		document.getElementById('finalText').value = finalHTML;
		document.getElementById('publish').action = "publishing.php";
	} else {
		alert("Add at least one block!");
	}
});

//Удаление атрибута ContentEditable
function removeEditableAttribute(node) {
	node.removeAttribute('contenteditable');
	return node;
}