function calculateHours(startTime, endTime) {
	hours = endTime.split(':')[0] - startTime.split(':')[0],
    minutes = endTime.split(':')[1] - startTime.split(':')[1];

    minutes = minutes.toString().length<2?'0'+minutes:minutes;
    
    if(minutes<0) { 
        hours--;
        minutes = 60 + minutes;
    }

    hours = hours.toString().length<2?'0'+hours:hours;

    return hours + (minutes*100);
}

$(document).ready(function() {
	// LOG-IN VALIDATION
	$('button#login-btn').click(function() {
		var email = validator.trim($('#email').val());
		var password = validator.trim($('#password').val());
		
		var emailEmpty = validator.isEmpty(email);
		var passEmpty = validator.isEmpty(password);
		var emailFormat = validator.isEmail(email);
		
		// resets input form when log-in button is clicked
		$('p#emailError').text('');
		$('p#pwError').text('');
		
		if (emailEmpty){
			$('p#emailError').text('Please enter your email.');
		}
		else if (!emailFormat){
			$('p#emailError').text('Invalid email format.');
		}
		
		if (passEmpty){
			$('p#pwError').text('Please enter your password.');
		}
		
		// successful client-side validation: no empty fields and valid email
		if (!emailEmpty && emailFormat && !passEmpty){
			// passes data to the server
			$.post('/login', {email: email, password: password}, function(res) {
				switch (res.status){
					case 200: {
						window.location.href = '/';
						break;
					}
					case 401: {
						$('p#pwError').text('Incorrect Email and/or Password.');
						break;								
					}
					case 500: {
						$('p#pwError').text('Server Error.');
						break;
					}
					case 409: {
						$('p#pwError').text('Verify account to login.');
						break;
					}
					case 410: {
						$('p#pwError').text('Account inactive.');
						break;
					}
				}
			});
		}
	});

	// VERIFICATION
	$('button#verifyBTN').click(function() {
		var email = validator.trim($('#email').val());
		var verifyCode = validator.trim($('#verifyCode').val());
				
		if((validator.isEmpty(email)) || (validator.isEmpty(verifyCode))){
			console.log("Missing input credentials.") 
		}
		else{

		var verifyCode = validator.trim($('#code').val());
		
		var emailEmpty = validator.isEmpty(email);
		var codeEmpty = validator.isEmpty(verifyCode);
		var emailFormat = validator.isEmail(email);
		
		$('p#emailError').text('');
		$('p#codeError').text('');
		
		if (emailEmpty) $('p#emailError').text('Please enter your email.');
		
		else if (!emailFormat) $('p#emailError').text('Invalid email format.');
				
		if (codeEmpty) $('p#codeError').text('Please enter verification code.');
				
		if ((!emailEmpty && emailFormat) && !codeEmpty){

			$.post('/verification', {email: email, verifyCode: verifyCode}, function(res) {
				switch (res.status){
					case 200: {
						window.location.href = '/login';
						break;
					}
					case 401: {
						$('p#codeError').text('Incorrect Email and/or code.');
						break;								
					}
					case 500: {
						$('p#codeError').text('Server Error.');
						break;
					}
				}
			});
		}
		}
	});


	// CREATE CLASS VALIDATION 
	$('button#create-class-btn').click(function() {
		var course = $('#course').val();
		var dateToday = new Date();
		var startDate = new Date($('#startDate').val());
		var endDate = new Date($('#endDate').val());
		var startTime = $('#startTime').val();
		var endTime = $('#endTime').val();
		var numDays = Math.round(endDate- startDate) / (1000 * 60 * 60 * 24) + 1;
		//var numHours = endTime- startTime;
		console.log('startdate + ' + startDate);
		var numHours = calculateHours(startTime, endTime);

		var dateErrors = true,
			timeErrors = true;

		$('p#sDate').text('');
		$('p#eDate').text('');
		$('p#sTime').text('');
		$('p#eTime').text('');
		$('p#courseError').text('');

				
		// date
		if ((startDate == "Invalid Date") || (endDate == "Invalid Date") || (!startDate || !endDate)) {
			if (startDate == "Invalid Date" || !startDate) $('p#sDate').text('Set date.');

			if (endDate =="Invalid Date" || !startDate) $('p#eDate').text('Set date.');
		}
		else if (startDate && endDate) {
			if ((numDays != 8) || (startDate < dateToday) || (startDate > endDate)) {
				if (numDays != 8) $('p#eDate').text('Classes should last for eight (8) days.');
				console.log("numDays: " + numDays);
				if (startDate < dateToday) $('p#sDate').text('Date should not be earlier than today.');

				if (startDate > endDate) $('p#sDate').text('Start Date should be earlier than End Date.'); 
			}
			else dateErrors = false;
		}
		else dateErrors = false;
		
		// time
		if (!startTime || !endTime) {
			if (!startTime) $('p#sTime').text('Set time.');
			if (!endTime) $('p#eTime').text('Set time.');
		}
		else if (startTime && endTime) {
			if ((numHours != 10) || (startTime > endTime)) {
				if (numHours != 10) $('p#eTime').text('Classes should last for 10 hours a day.');

				if (startTime > endTime) $('p#eTime').text('Start Time should be earlier than End Time.');
			}
			else timeErrors = false;
			
		}
		else timeErrors = false;

		// console.log(dateErrors);
		// console.log(timeErrors);

		// if no errors submit to backend
		if (!dateErrors && !timeErrors) {
			$.post('/create-class', {course: course, startDate: startDate, endDate: endDate,
									startTime: startTime, endTime: endTime}, function(res) {
				switch (res.status){
					case 200: {
						window.location.href = '/dashboard';
						alert(res.mssg);
						break;
					}
					case 401: {
						alert(res.mssg);
						break;								
					}
					case 500: {
						alert(res.mssg);
						break;
					}
				}
			});
		}
	});

	// DEFINE COURSE 
	$('button#publishCourseBTN').click(function() {
		var courseName = $('#courseName').val();
		var courseDesc = $('#courseDesc').val();
		var courseModules = $("#courseMod").val();

		$('p#courseDescError').text('');
		$('p#fileError').text('');

		if(validator.isEmpty(courseDesc))
			$('p#courseDescError').text('Please write course description.');

		//insert file error

		if (!(validator.isEmpty(courseDesc))) { 
			$.post('/define-course', {courseName: courseName, courseDesc: courseDesc}, function(res) {
				window.location.href = '/';
				console.log("email sent");
			});
		}
	});

	// SEND EMAILS 
	$('button#sendEmailBTN').click(function() {
		var email = $("#email").text()
		var emailText = $("#emailText").val();

		$('p#eEmail').text('');

		if(validator.isEmpty(emailText))
			$('p#eEmail').text('Please write message.');
		
		if (!(validator.isEmpty(emailText))) { 
			$.post('/contact-client', { email: email, emailText: emailText}, function(res) {
					switch (res.status){
						case 200: {
							window.location.href = '/clientlist';
							alert(res.mssg);
							break;
						}
						case 500: { 
							$('p#eEmail').text(res.mssg);
							break;
						}
						}
					});
		}
	});

	// ADD NEW CLIENTS 
	$('button#addClientBTN').click(function() {
		var clientName = $("#clientName").val()
		var companyName = $("#companyName").val()
		var email = $("#email").val()
		var contactNo = $("#contactNo").val();

		$('p#eAddClient').text('');

		if(validator.isEmpty(clientName))
			$('p#eAddClient').text('Please input client name.');
		
		else if(validator.isEmpty(companyName))
			$('p#eAddClient').text('Please input company name.');

		else if(validator.isEmpty(email))
			$('p#eAddClient').text('Please input client email.');

		else if(validator.isEmpty(contactNo))
			$('p#eAddClient').text('Please input client contact number.');
		
		else { 
			$.post('/add-client', { clientName: clientName, companyName: companyName, email: email, contactNo: contactNo}, function(res) {
					switch (res.status){
						case 200: {
							alert(res.mssg);
							window.location.href = '/manage-clientlist';
							break;
						}
						case 500: { 
							$('p#eAddClient').text(res.mssg);
							break;
						}
						}
					});
		}
	});

	// DELETE CLIENT
	$('button#deleteBTN').click(function() {
		var row = $(this).parent().parent(); //get row of clicked button
		var clientID = row.attr("id"); //get clientID from row
		var deleteConfirm = confirm("Remove client from list?");
		
		$('p#eDeleteClient').text('');

		if(deleteConfirm) {
			$.post('/remove-client', {clientID: clientID}, function(result) {
				switch(result.status) {
					case 200: {
						alert(result.mssg);
						row.remove();
						break;
					}
					case 500: {
						$('p#eDeleteClient').text(res.mssg);
						break;
					}
				}
			});
		}			
	});

	// COLLECT DATA FROM TABLE
	$('button#saveCLBTN').click(function() {
		console.log("hi there");
		// $('#clientTable').find('input[type=text]').each(function() {
		// 	console.log(this.value)			
		// });

		// var tableData = document.getElementById('clientTable');
		// var info = "";

		// 	// LOOP THROUGH EACH ROW OF THE TABLE AFTER HEADER.
		// 	for (i = 1; i < tableData.rows.length; i++) {

		// 		// GET THE CELLS COLLECTION OF THE CURRENT ROW.
		// 		var objCells = tableData.rows.item(i).cells;

		// 		// LOOP THROUGH EACH CELL OF THE CURENT ROW TO READ CELL VALUES.
		// 		for (var j = 0; j < objCells.length; j++) {
		// 				info.innerHTML = info.innerHTML + ' ' + objCells.item(j).innerHTML;
		// 		}
		// 		info.innerHTML = info.innerHTML + '<br />';     // ADD A BREAK (TAG).
		// }

		// console.log(info);

	});

	// ADD TRAINEES VALIDATION
	$('button#add-trainee').click(function() {
		var traineeRow = $(this).closest("tr"),
			traineeID = row.attr("id");

		$.post('/add-trainees', {traineeID: traineeID}, function(res) {
			switch(res.status) {
					case 200: {
						alert(res.mssg);
						// add to the added trainees table
						break;
					}
					case 401: {
						alert(res.mssg);
						break;
					}
					case 500: {
						alert(res.mssg);
						break;
					}
			}
		});

	});

	// Delete Class
	$('button#delClass').click(function() {
		var row = $(this).parent().parent();
		var delClassNum = row.attr("id");
		var conf = confirm("Delete this class?");

		if(conf == true) {
			$.post('/delete-class', {classNum: delClassNum}, function(result) {
				switch(result.status) {
					case 200: {
						alert(result.mssg);
						row.remove();
						break;
					}
					case 401: {
						alert(result.mssg);
						break;
					}
					case 500: {
						alert(result.mssg);
						break;
					}
				}
			});
		}			
	});

	// DEACTIVATE ACCOUNT
	$('button#finalDA').click(function() {
		// var userID = $("#userID").text()
		var password = $("#password").val()
		
		$('p#ePass').text('');

		if(validator.isEmpty(password))
			$('p#ePass').text('Please input password to proceed.');
		
		else{
			$.post('/deactivate-account', { password: password}, function(result) {
				switch(result.status) {
					case 200: {
						window.location.href = '/login';
						alert(result.mssg);
						break;
					}
					case 401: {
						$('p#ePass').text(result.mssg);
						break;
					}				
					case 500: {
						alert(result.mssg);
						break;
					}
				}
			});
		}			
	});
});
