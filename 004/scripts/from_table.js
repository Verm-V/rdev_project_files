function test_test(params) {
	db.findbyparams("test_toolbar", { "recstate": 1 })
	return '1';
}

function test_test2(params) {
	for (let isf = 0; isf < 10; isf++) {
		db.findbyparams("test_toolbar", { "recstate": 1 })
	}
	return 22;
}

function prop_action_object_grid_table_delete(params) {
	try {
		var result = db2.delete("context_menu_toolbar_table", params.recid)
		return ok("Запись успешно удалена", result);
	} catch (e) {
		return badRequest("Ошибка при удалении записи. " + e, null);
	}
}

//
// Для форм
//
function context_menu_toolbar_table_grid_onadd_form(params) {

	var record = db.insert("context_menu_toolbar_table",
		{
			recname: "Добавлено из статического метода (значение берется из функции)",
			test_num: params.test_num
		});

	// db.insert возвращает запись со всеми свойствами
	// и первым идет лишнее свойство "@odata.context" - удалим его из объекта, если мы хотим
	// направить объект записи примяком в db2.update
	delete record["@odata.context"];

	// db.insert возвращает recstate = 1, что говорит о том что запись актуальна
	// если мы хотим, чтобы пользователь мог отказаться от такой записи
	// мы можем выставить recstate = 0
	record.recstate = 1;

	// обновим запись
	var result = db2.update("context_menu_toolbar_table", db2.findbyrecid("context_menu_toolbar_table", record.recid));

	// вернем результат
	return {
		success: true,
		message: "Новая запись создана - " + JSON.stringify(result),
		data: result
	};
}

function context_menu_toolbar_table_grid_update_form(params) {
	try {
		var record = db2.findbyrecid("context_menu_toolbar_table", params.recid)
		record.test_num = params.test_num;
		var result = db2.update("context_menu_toolbar_table", record)
		return ok("Запись успешно обновлена" + JSON.stringify(params), result);
	} catch (e) {
		return badRequest("Ошибка при обновлении записи. " + e, record);
	}
}

function context_menu_toolbar_table_grid_delete_form(params) {
	try {
		var result = db2.delete("context_menu_toolbar_table", params.recid)
		return ok("Запись успешно удалена", result);
	} catch (e) {
		return badRequest("Ошибка при удалении записи. " + e, null);
	}
}

//
// Для контекстного меню
//
function context_menu_toolbar_table_subitem_onadd(params) {

	var record = db.insert("context_menu_toolbar_table",
		{
			recname: "Добавлено из статического метода (значение берется из функции)",
			test_num: params.test_num
		});

	// db.insert возвращает запись со всеми свойствами
	// и первым идет лишнее свойство "@odata.context" - удалим его из объекта, если мы хотим
	// направить объект записи примяком в db2.update
	delete record["@odata.context"];

	// db.insert возвращает recstate = 1, что говорит о том что запись актуальна
	// если мы хотим, чтобы пользователь мог отказаться от такой записи
	// мы можем выставить recstate = 0
	record.recstate = 1;

	// обновим запись
	var result = db2.update("context_menu_toolbar_table", db2.findbyrecid("context_menu_toolbar_table", record.recid));

	// вернем результат
	return {
		success: true,
		message: "Новая запись создана - " + JSON.stringify(result),
		data: result
	};
}

function context_menu_toolbar_table_subitem_update(params) {
	try {
		var record = db2.findbyrecid("context_menu_toolbar_table", params.recid)
		record.test_num = params.test_num;
		var result = db2.update("context_menu_toolbar_table", record)
		return ok("Запись успешно обновлена" + JSON.stringify(params), result);
	} catch (e) {
		return badRequest("Ошибка при обновлении записи. " + e, record);
	}
}

function context_menu_toolbar_table_subitem_delete(params) {
	try {
		var result = db2.delete("context_menu_toolbar_table", params.recid)
		return ok("Запись успешно удалена", result);
	} catch (e) {
		return badRequest("Ошибка при удалении записи. " + e, null);
	}
}