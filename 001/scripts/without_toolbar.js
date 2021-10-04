
// Таблица 1 (without_toolbar_1) // Таблица 1 (without_toolbar_1) // Таблица 1 (without_toolbar_1) // Таблица 1 (without_toolbar_1)
// Таблица 1 (without_toolbar_1) // Таблица 1 (without_toolbar_1) // Таблица 1 (without_toolbar_1) // Таблица 1 (without_toolbar_1)

// Метод добавление записи
function add_method(params) {

	var record = db.insert("without_toolbar_1",
	
		{
			recname: "Добавлено из статического метода (значение берется из функции)",
			test_num: params.test_num,
			reccode: params.reccode,
			test_date: params.test_date
		});


	// db.insert возвращает запись со всеми свойствами
	// и первым идет лишнее свойство "@odata.context" - удалим его из объекта, если мы хотим
	// направить объект записи прямяком в db2.update
	delete record["@odata.context"];

	// db.insert возвращает recstate = 1, что говорит о том что запись актуальна
	// если мы хотим, чтобы пользователь мог отказаться от такой записи
	// мы можем выставить recstate = 0
	record.recstate = 1;

	// обновим запись
	db2.update("without_toolbar_1", record);

	// вернем результат
	return {
		success: true,
		message: "Новая запись создана - " + JSON.stringify(record),
		data: record
	};
}

// Метод редактирования записи
function update_method(params) {
	try {
		var record = db2.findbyrecid("without_toolbar_1", params.selectedRecords[0].recid)
		record.test_num = params.test_num;
		record.reccode = params.reccode;
		record.test_date = params.test_date;
		var result = db2.update("without_toolbar_1", record)
		return ok("Запись успешно обновлена", result);
	} catch (e) {
		return badRequest("Ошибка при обновлении записи. ", null);
	}
}

/**
 * Тестовый метод удаления записи через MethodProvider.DeleteByRecid
 * @param {Object} params 
 */
function delete_method(params) {
	try {
		var result = db2.delete("without_toolbar_1", params.selectedRecords[0].recid)
		return ok("Запись успешно удалена", result);
	} catch (e) {
		return badRequest("Ошибка при удалении записи. " + e, null);
	}
}

/**
 * Подписать файлы в поле 'Тестовый файл 1'
 * @param {*} params 
 */
 function test_method_for_sign_files_in_field_1(params) {
	var url = String().concat(host, "/api/files/list/", "without_toolbar_1", "/", params.selectedRecords[0].recid);
	var files_record = sendRequest("GET", null, url, null);
	// var files_in_field = getattachedfileincolumn("without_toolbar_1", "test_file", params.selectedRecords[0].recid);
	// if (files_in_field == null) {
	// 	return {
	// 		success: true,
	// 		message: "Нет файлов для подписи",
	// 		data: []
	// 	}
	// }

	//Проверяем, есть ли файлы вообще
	if(files_record.data == null || files_record.data.length <= 0){
		return badResponse("Файлов не найдено");
		}
		
		//Заготовка для записи файла
		var files_in_field = [];
		
		//Выбираем из списка файлов тот, что нам нужен по названию поля (теоретически их может быть несколько в поле, но мы пока представим что один)
		for(var i = 0; i < files_record.data.length; i++){
			var file_record = files_record.data[i];
			if(file_record.columnName == "test_file"){
			files_in_field.push(file_record);
			}
		}
		
		//Проверяем, есть ли файл тот что нужен
		if(files_in_field == null || files_in_field.length <= 0){
			return badResponse("Файлов не найдено");
			}

	// if (files_in_field.length == 0) {
	// 	return {
	// 		success: true,
	// 		message: "Нет файлов для подписи",
	// 		data: []
	// 	}
	// }

	var files_to_sign = [];
	for (var i = 0; i < files_in_field.length; i++) {
		var file_in_field = files_in_field[i];
		if (file_in_field.isVerify != true) {
			files_to_sign.push(file_in_field.recId);
		}
	}
	return {
		success: true,
		message: String().concat("Найдено файлов для подписи: ", files_to_sign.length),
		data: files_to_sign
	}
}

/**
 * Тестовый метод удаления файла
 * @param {Object} params 
 */
 function delete_file_1(params) {
	
		//recid записи
		var recid = params.selectedRecords[0].recid;
		//название таблицы
		var tableName = "without_toolbar_1";
		//название поля с файлом
		var column_name = "test_file";

		//Получаем все файлы у записи
		var url = String().concat(host, "/api/files/list/", tableName, "/", recid);
		var files_record = sendRequest("GET", null, url, null);

		//Проверяем, есть ли файлы вообще
		if (files_record.data == null || files_record.data.length <= 0)

		//Заготовка для записи файла
		var file_for_delete;

		// //Выбираем из списка файлов тот, что нам нужен по названию поля (теоретически их может быть несколько в поле, но мы пока представим что один)
		// for(var i = 0; i < files_record.data; i++){
		// 	var file_record = files_record.data[i];
		// 	if(file_record.columnName == column_name){
		// 		file_for_delete = file_record;
		// 	}
		// }

		//Проверяем, есть ли файл тот что нужен
		if(files_record.data[0] == null){
			return badRequest("Файл не найден ", files_record.data[0]);
		}

		//Удаляем
		var url = String().concat(host, "/api/files/delete_file/", files_record.data[0].recId);
		var result = sendRequest("DELETE", null, url, null);

		return {
			success: true,
			message: "Файл удален",	
			data: result
		};
}



/**
 * Тестовый метод генерации файла
 * @param {Object} params 
 */
 function generate_files_1(params) {
	try {
		var fileIdList = [];

		if (params.recordIdList == null) {
			var recordList = db.find("without_toolbar_1");

			if (recordList && recordList.length > 0) {
				for (var i = 0; i < recordList.length; i++) {
					var fileRecords = getattachedfileincolumn("without_toolbar_1", "test_file", recordList[i].recid);

					if (fileRecords && fileRecords.length > 0) {
						for (var j = 0; j < fileRecords.length; j++) {
							fileIdList.push(fileRecords[j].recId);
						}
					}
				}
			}
		} else {
			for (var i = 0; i < params.recordIdList.length; i++) {
				var fileRecords = getattachedfileincolumn("without_toolbar_1", "test_file", params.recordIdList[i]);

				if (fileRecords && fileRecords.length > 0) {
					for (var j = 0; j < fileRecords.length; j++) {
						fileIdList.push(fileRecords[j].recId);
					}
				}
			}
		}

		return { success: true, message: "Complete generate files", data: fileIdList };
	} catch (ex) {
		return { success: false, message: "Ошибка получения файлов: " + ex, data: null };
	}
}








// Таблица 2 (without_toolbar_2) // Таблица 2 (without_toolbar_2) // Таблица 2 (without_toolbar_2) // Таблица 2 (without_toolbar_2)
// Таблица 2 (without_toolbar_2) // Таблица 2 (without_toolbar_2) // Таблица 2 (without_toolbar_2) // Таблица 2 (without_toolbar_2)

// Добавление записи
function add_method_2(params) {

	var record = db.insert("without_toolbar_2",
	
		{
			recname: "Добавлено из статического метода (значение берется из функции)",
			test_num: params.test_num,
			reccode: params.reccode,
			test_date: params.test_date
		});

	// db.insert возвращает запись со всеми свойствами
	// и первым идет лишнее свойство "@odata.context" - удалим его из объекта, если мы хотим
	// направить объект записи прямяком в db2.update
	delete record["@odata.context"];

	// db.insert возвращает recstate = 1, что говорит о том что запись актуальна
	// если мы хотим, чтобы пользователь мог отказаться от такой записи
	// мы можем выставить recstate = 0
	record.recstate = 1;

	// обновим запись
	db2.update("without_toolbar_2", record);

	// вернем результат
	return {
		success: true,
		message: "Новая запись создана - " + JSON.stringify(record),
		data: record
	};
}

// Метод редактирования записи
function update_method_2(params) {
	try {
		var record = db2.findbyrecid("without_toolbar_2", params.selectedRecords[0].recid)
		record.test_num = params.test_num;
		record.reccode = params.reccode;
		record.test_date = params.test_date;
		var result = db2.update("without_toolbar_2", record)
		return ok("Запись успешно обновлена", result);
	} catch (e) {
		return badRequest("Ошибка при обновлении записи. ", null);
	}
}

/**
 * Тестовый метод удаления записи через MethodProvider.DeleteByRecid
 * @param {Object} params 
 */
function delete_method_2(params) {
	try {
		var result = db2.delete("without_toolbar_2", params.selectedRecords[0].recid)
		return ok("Запись успешно удалена", result);
	} catch (e) {
		return badRequest("Ошибка при удалении записи. " + e, null);
	}
}

/**
 * Подписать файлы в поле 'Тестовый файл 1'
 * @param {*} params 
 */
 function test_method_for_sign_files_in_field_2(params) {
	var files_in_field = getattachedfileincolumn("without_toolbar_2", "test_file", params.selectedRecords[0].recid);
	if (files_in_field == null) {
		return {
			success: true,
			message: "Нет файлов для подписи",
			data: []
		}
	}

	if (files_in_field.length == 0) {
		return {
			success: true,
			message: "Нет файлов для подписи",
			data: []
		}
	}

	var files_to_sign = [];
	for (var i = 0; i < files_in_field.length; i++) {
		var file_in_field = files_in_field[i];
		if (file_in_field.isVerify != true) {
			files_to_sign.push(file_in_field.recId);
		}
	}
	return {
		success: true,
		message: String().concat("Найдено файлов для подписи: ", files_to_sign.length),
		data: files_to_sign
	}
}

/**
 * Тестовый метод генерации файла
 * @param {Object} params 
 */

 function generate_files_2(params) {
	try {
		var fileIdList = [];

		if (params.recordIdList == null) {
			var recordList = db.find("without_toolbar_2");

			if (recordList && recordList.length > 0) {
				for (var i = 0; i < recordList.length; i++) {
					var fileRecords = getattachedfileincolumn("without_toolbar_2", "test_file", recordList[i].recid);

					if (fileRecords && fileRecords.length > 0) {
						for (var j = 0; j < fileRecords.length; j++) {
							fileIdList.push(fileRecords[j].recId);
						}
					}
				}
			}
		} else {
			for (var i = 0; i < params.recordIdList.length; i++) {
				var fileRecords = getattachedfileincolumn("without_toolbar_2", "test_file", params.recordIdList[i]);

				if (fileRecords && fileRecords.length > 0) {
					for (var j = 0; j < fileRecords.length; j++) {
						fileIdList.push(fileRecords[j].recId);
					}
				}
			}
		}

		return { success: true, message: "Complete generate files", data: fileIdList };
	} catch (ex) {
		return { success: false, message: "Ошибка получения файлов: " + ex, data: null };
	}
}

// Удаление файла
function delete_file_2(params) {
	
	//recid записи
	var recid = params.selectedRecords[0].recid;
	//название таблицы
	var tableName = "without_toolbar_2";
	//название поля с файлом
	var column_name = "test_file";

	//Получаем все файлы у записи
	var url = String().concat(host, "/api/files/list/", tableName, "/", recid);
	var files_record = sendRequest("GET", null, url, null);

	//Проверяем, есть ли файлы вообще
	if (files_record.data == null || files_record.data.length <= 0)

	//Заготовка для записи файла
	var file_for_delete;

	// //Выбираем из списка файлов тот, что нам нужен по названию поля (теоретически их может быть несколько в поле, но мы пока представим что один)
	// for(var i = 0; i < files_record.data; i++){
	// 	var file_record = files_record.data[i];
	// 	if(file_record.columnName == column_name){
	// 		file_for_delete = file_record;
	// 	}
	// }

	//Проверяем, есть ли файл тот что нужен
	if(files_record.data[0] == null){
		return badRequest("Файл не найден ", files_record.data[0]);
	}

	//Удаляем
	var url = String().concat(host, "/api/files/delete_file/", files_record.data[0].recId);
	var result = sendRequest("DELETE", null, url, null);

	return {
		success: true,
		message: "Файл удален",	
		data: result
	};
}

/**
 * Переопределение кнопки добавить
 */
 function without_toolbar_2_onadd(data){
	
	var record	= db.insert("without_toolbar_2", 
			{ 
				recname: "Переопределение кнопки добавить", 
				reccode: 1000 
			});
	// db.insert возвращает запись со всеми свойствами
    // и первым идет лишнее свойство "@odata.context" - удалим его из объекта, если мы хотим
	// направить объект записи примяком в db2.update
	delete record["@odata.context"];
	
	// db.insert возвращает recstate = 1, что говорит о том что запись актуальна
	// если мы хотим, чтобы пользователь мог отказаться от такой записи
	// мы можем выставить recstate = 0
	record.recstate = 0;
	
	// обновим запись
	db2.update("without_toolbar_2", record);
	
	// вернем результат
	return {
		success: true,
		message: "Новая запись создана - " + JSON.stringify(record),
		data: record
	};
}

/**
 * Обработка события OnOpen
 * @param {Object} params {
 * 		tableName: "",
 * 		recId: ""
 * }
 */
function onopen_test_method(params){
	for(var i = 0; i < 50000; i++) {} // delay
	return { success: true, message: "Метод-обработчик события вернул положительный результат", data: params };
}













// ОБЩИЕ СКРИПТЫ // ОБЩИЕ СКРИПТЫ // ОБЩИЕ СКРИПТЫ // ОБЩИЕ СКРИПТЫ
// ОБЩИЕ СКРИПТЫ // ОБЩИЕ СКРИПТЫ // ОБЩИЕ СКРИПТЫ // ОБЩИЕ СКРИПТЫ

/**
 * Метод для возврата сообщения об успехе
 * @param {string} message сообщение
 * @param {any} data данные
 */
 function ok(message, data) {
	return {
		success: true,
		message: message,
		data: data
	};
}

/**
 * Метод для возврата сообщения об ошибке
 * @param {string} message сообщение
 * @param {any} data данные
 */
function badRequest(message, data) {
	return {
		success: false,
		message: message,
		data: data
	};
}

/**
 * Метод для тестирования успешного результата выполнения
 */
function test_success() {
	return ok("Сообщение об успехе из метода");
}

/**
 * Метод для тестирования результата с ошибкой
 */
function test_error() {
	return badRequest("Сообщение об ошибке из метода");
}

/**
 * Метод отправки файла
 * @param {Object} params 
 */
 function send_data_file(params) {
	// Искусственная задержка
	for (var i = 0; i < 5000000; i++) { }
	return { success: true, message: "send_data_file", data: params };
}


function getattachedfileincolumn(table_name, column_name, recid){
    
    var files_record = getattachedfiles(table_name, recid);
    var files_records_data = files_record.data;
    if(isEmptyOrNullArray(files_records_data)){
        errorLog("getattachedfileincolumn", "Не найдено ни одного файла в таблице recid: " + recid);
        return []
    }
    var files = [];
    for(var i = 0; i < files_records_data.length; i++){
        var file_record = files_records_data[i];
        if(file_record.columnName == column_name){
            files.push(file_record);
        }
    }
    return files;
}

function getattachedfiles(tableName, recid) {
	if (tableName == "" || tableName == null)
	{
	errorLog("getattachedfiles", "Ошибка, значение tableName не может быть равно Null или Empty.");
	throw new Error("Ошибка, значение tableName не может быть равно Null или Empty.");
	}
	
	if (recid == "" || recid == null)
	{
	errorLog("getattachedfiles", "Ошибка, значение recid не может быть равно Null или Empty.");
	throw new Error("Ошибка, значение recid не может быть равно Null или Empty.");
	}
	
	var url = String().concat(host, "/api/files/list/", tableName, "/", recid);
	
	return sendRequest("GET", null, url, null);
	}
	

function isEmptyString(value) {
    return (value == null || value === "undefined" || value === "" || value.length === 0);
}

function isNotEmptyString(value) {
    return (value != null && value !== "undefined" && value !== "" && value.length !== 0);
}

function isNullObject(value) {
    return (value == null || value === "undefined" || !value || (typeof value !== "string" && Object.keys(value).length === 0));
}

function isNotNullObject(value) {
    return (value != null && value !== "undefined" && !!value && (typeof value === "string"  || Object.keys(value).length !== 0 ) );
}

function isEmptyOrNullArray(value) {
    return (!value || value == null || value === "undefined" || value.length <= 0);
}

function isNotEmptyOrNullArray(value) {
    return (value && value != null && value !== "undefined" && value.length > 0);
}