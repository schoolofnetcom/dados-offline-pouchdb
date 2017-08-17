(() => {
	let db = new PouchDB('pouchdb_app')
	
	let remoteCouch = 'http://localhost:8080/db/pouchdb_app'

	db
		.info((err, info) => {
			if (err) {
				return
			}

			console.log(info)
			db
				.changes({
					since: 'now',
					live: true
				})
				.on('change', show)
		})

	const show = () => {
		db.allDocs({ include_docs: true }, (err, result) => {
			$('#table > tbody').empty()
			result.rows.forEach((person) => {
				$('#table > tbody:last').append(
					'<tr data-id="' + person.doc._id + '">' +
					'	<td> ' + person.doc.name + ' </td>' +
					'	<td> ' + 
					' 		<button type="button" id="btn_delete" class="btn btn-danger">Delete</button> ' +
					'		<button type="button" id="btn_edit" class="btn btn-info">Edit</button> ' +
					'	</td>' +
					'</tr>'
				)
			})
		})
	}

	$('#btn_submit').on('click', (e) => {
		let input_name = $('#input_name').val()
		let input_id   = $('#input_id').val()

		if (!input_id) {
			if (!input_name) {
				$('#error').show()
				return
			}

			const doc = { _id: uuid(), name: input_name }
			
			db.put(doc)
			
			$('#input_name').val('')
			$('#error').hide()
			return $('#input_id').val('')
		}

		db
			.get(input_id)
			.then((person) => {
				person.name = input_name

				$('#input_id').val('')

				return db.put(person)
			})
	})

	$('#table > tbody').on('click', '#btn_delete', function (e) {
		let row = $(this).closest('tr')

		db
			.get($(row).data('id'))
			.then((person) => {
				return db.remove(person)
			})
	})

	$('#table > tbody').on('click', '#btn_edit', function(e) {
		let row = $(this).closest('tr')
		let name = $(row).find('td:first').text().trim()

		$('#input_name').val(name)
		$('#input_id').val($(row).data('id'))
	})

	show()

	if (remoteCouch) {
		db
			.replicate.to(remoteCouch, { live: true }, () => {
				console.log(to)
			})
		db
			.replicate.from(remoteCouch, { live: true }, () => {
				console.log('from')
			})
	}
})()
