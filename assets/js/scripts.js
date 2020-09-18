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
				}
			});
		}
	});

	// VERIFICATION
	$('button#verifyBTN').click(function() {
		var email = validator.trim($('#email').val());
		var verifyCode = validator.trim($('#verifyCode').val());
				
		if((validator.isEmpty(email)) || (validator.isEmpty(verifyCode))){
			console.log("pls don't be empty !!") 
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
		var dateToday = new Date();
		var startDate = new Date($('#startDate').val());
		var endDate = new Date($('#endDate').val());
		var starTime = new Date($('#startTime').val());
		var endTime = new Date($('#endTime').val());

		var numDays = Math.round(endDate- startDate) / (1000 * 60 * 60 * 24) + 1;
		var numHours = Math.round(endTime- endDate) / (1000 * 60 * 60);

		var course = $('#course').val();
		console.log(course);
		// var startYear = startDate.getFullYear();
		// var startMonth = startDate.getMonth() + 1; 
		// var startDay = startDate.getDate();
		// var endMonth = startDate.getDate());

		console.log(course);


		$('p#sDate').text('');
		$('p#eDate').text('');
		$('p#sTime').text('');
		$('p#eTime').text('');

		if (course) $('p#courseError').text('Select a course.');

		if (startDate || endDate) $('p#sDate').text('Set date.');

		if (numDays != 8) $('p#eDate').text('Classes should last for eight (8) days.');
		if (startDate < dateToday) $('p#sDate').text('Date should not be earlier than today.');
		if (startDate > endDate) $('p#sDate').text('Start Date should be earlier than End Date.');

		if (startTime || endTime) $('p#sTime').text('Set time.');
 
		if (numHours != 10) $('p#eTime').text('Classes should last for 10 hours a day.');
		
		// if !(any above) -> alert {successfully added}
	});
}); 