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
		var startTime = $('#startTime').val();
		var endTime = $('#endTime').val();
		var numDays = Math.round(endDate- startDate) / (1000 * 60 * 60 * 24) + 1;
		//var numHours = endTime- startTime;

        hours = endTime.split(':')[0] - startTime.split(':')[0],
        minutes = endTime.split(':')[1] - startTime.split(':')[1];

	    minutes = minutes.toString().length<2?'0'+minutes:minutes;
	    if(minutes<0){ 
	        hours--;
	        minutes = 60 + minutes;
	    }

	    hours = hours.toString().length<2?'0'+hours:hours;

	    numHours = hours + (minutes*100);

		var course = $('#course').val();
		console.log(numHours);
		//console.log(course);

		// dis not resetting ??
		$('p#sDate').text('');
		$('p#eDate').text('');
		$('p#sTime').text('');
		$('p#eTime').text('');
		$('p#courseError').text('');

		console.log("Course: " + course);
				
		// date
		if (!startDate || !endDate) {
			if (!startDate) $('p#sDate').text('Set date.');
			//console.log("SDate: " + startDate);

			else $('p#eDate').text('Set date.');
		}
		else {
			if (numDays != 8) $('p#eDate').text('Classes should last for eight (8) days.');
			console.log("numDays: " + numDays);
			if (startDate < dateToday) $('p#sDate').text('Date should not be earlier than today.');

			if (startDate > endDate) $('p#sDate').text('Start Date should be earlier than End Date.'); 
		}
		
		// time
		if (!startTime || !endTime) {
			if (!startTime) $('p#sTime').text('Set time.');
			if (!endTime) $('p#eTime').text('Set time.');
		}
		else {
			if (numHours != 10) $('p#eTime').text('Classes should last for 10 hours a day.');
			console.log("numHours: " + numHours);

			if (startTime > endTime) $('p#eTime').text('Start Time should be earlier than End Time.');
		}
		
		// if no empty submit to backend
		if (startDate && endDate && startTime && endTime && course) {
			$.post('/create-class', {course: course, startDate: startDate, endDate: endDate,
									startTime: starTime, endTime: endTime}, function(res) {
				switch (res.status){
					case 200: {
						window.location.href = '/dashboard';
						alert('Class created!');
						break;
					}
					case 401: {
						
						break;								
					}
					case 500: {
						
						break;
					}
				}
			});
		}
	});
}); 