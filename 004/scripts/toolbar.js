//
// Для методов
//
function table_grid_add(params) {

	var record = db.insert(params.tableName,
	
		{
			recname: "Добавлено из статического метода (значение берется из функции)",
			// test_num: params.values.test_num,
			// reccode: params.values.reccode,
			// test_date: params.values.test_date
			test_num: params.values ? params.values.test_num : params.test_num,
			reccode: params.values ? params.values.reccode : params.reccode,
			test_date: params.values ? params.values.test_date : params.test_date
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
	db2.update("test_toolbar", record);

	// вернем результат
	return {
		success: true,
		message: "Новая запись создана - " + JSON.stringify(record),
		data: record
	};
}

// /**
//  * Тестовый метод обновления записи через MethodProvider.UpdateByRecid
//  * @param {Object} params 
//  */
// function update_method_3(params) {
// 	try {
// 		var result = db2.update("test_toolbar", params)
// 		return ok("Запись успешно обновлена", result);
// 	} catch (e) {
// 		return badRequest("Ошибка при обновлении записи. " + e, null);
// 	}
// }

// Метод редактирования записи
function update_method_3(params) {
	try {
		var record = db2.findbyrecid(params.tableName, params.recid)
		record.test_num = params.values.test_num;
		record.reccode = params.values.reccode;
		record.test_date = params.values.test_date;
		var result = db2.update(params.tableName, record)
		return ok("Запись успешно обновлена", result);
	} catch (e) {
		return badRequest("Ошибка при обновлении записи. ", null);
	}
}

/**
 * Тестовый метод удаления записи через MethodProvider.DeleteByRecid
 * @param {Object} params 
 */
function delete_method_3(params) {
	try {
		var result = db2.delete(params.tableName, params.recid)
		return ok("Запись успешно удалена", result);
	} catch (e) {
		return badRequest("Ошибка при удалении записи. " + e, null);
	}
}

/**
 * Подписать файлы в поле 'Тестовый файл 1'
 * @param {*} params 
 */
 function test_method_for_sign_files_in_field_3(params) {
	var files_in_field = getattachedfileincolumn("test_toolbar", "test_file", params.selectedRecords[0].recid);
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

// Удаление файла
function delete_file_3(params) {
	
	//recid записи
	var recid = params.selectedRecords[0].recid;
	//название таблицы
	var tableName = params.tableName;
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
 function generate_files_3(params) {
	try {
		var fileIdList = [];

		if (params.recordIdList == null) {
			var recordList = db.find("test_toolbar");

			if (recordList && recordList.length > 0) {
				for (var i = 0; i < recordList.length; i++) {
					var fileRecords = getattachedfileincolumn("test_toolbar", "test_file", recordList[i].recid);

					if (fileRecords && fileRecords.length > 0) {
						for (var j = 0; j < fileRecords.length; j++) {
							fileIdList.push(fileRecords[j].recId);
						}
					}
				}
			}
		} else {
			for (var i = 0; i < params.recordIdList.length; i++) {
				var fileRecords = getattachedfileincolumn("test_toolbar", "test_file", params.recordIdList[i]);

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


/**
 * Тестовый метод удаления файла
 * @param {Object} params 
 */
 function delete_file_3(params) {
	
	//recid записи
	var recid = params.recid;
	//название таблицы
	var tableName = "test_toolbar";
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

function form_in(data) {
	return {
		success: true,
		message: "",
		data: data
	};
}

function form_out(data) {
	return {
		success: true,
		message: "",
		data: data
	};
}

function testmethod(data) {
	return {
		success: true,
		message: "vse ok",
		data: ""
	};
}

