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

// format date
function getDate(date) {
	var newDate = new Date(date);

	var mm = newDate.getMonth() + 1;
	switch(mm) {
		case 1: mm = "January"; break;
		case 2: mm = "February"; break;
		case 3: mm = "March"; break;
		case 4: mm = "April"; break;
		case 5: mm = "May"; break;
		case 6: mm = "June"; break;
		case 7: mm = "July"; break;
		case 8: mm = "August"; break;
		case 9: mm = "September"; break;
		case 10: mm = "October"; break;
		case 11: mm = "November"; break;
		case 12: mm = "December"; break;
	}

	var dd = newDate.getDate();
	var yy = newDate.getFullYear();

	return mm + " " + dd + ", " + yy;
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

	// DEFINE COURSE 
	$('button#publishCourseBTN').click(function() {
		var courseName = $('#courseName').val();
		var courseDesc = $('#courseDesc').val();
		var courseModules = $("#courseMod").val();

		$.post('/define-course', {courseName: courseName, courseDesc: courseDesc}, function(res) {
				switch (res.status){
					case 200: {
						window.location.href = '/';
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


	// ADD TRAINEES VALIDATION
	$('button#add-trainee').click(function() {
		var traineeRow = $(this).closest("tr"),
			traineeID = traineeRow.attr("id");

		var classSection = $("#classSection").text();
		console.log("script.js section: " + classSection);

		$.post('/add-trainees', {traineeID: traineeID, section: classSection}, function(res) {
			switch(res.status) {
					case 200: {
						traineeRow.remove();
						alert("Trainee added!");
						
						var added = JSON.parse(res.mssg);
						// add to the added trainees table
						var data = "<tr><td>"
                            + added.lastName + ", " + added.firstName + "</td> <td style='width: 20%;padding: 10px;text-align: center;'>"
							+ "<button class='btn btn-primary' type='button' id='remove-trainee'style='background-color: #3e914d;''><strong>-</strong></button></td></tr>";
                        console.log(data);
                        $('#addedtrainees').append(data);
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

	// Remove Trainee
	$('button#remove-trainee').click(function() {
		var traineeRow = $(this).closest("tr"),
			traineeID = traineeRow.attr("id");
		var classSection = $("#classSection").text();
		var conf = confirm("Remove this trainee?");

		if(conf == true) {
			$.post('/remove-trainee', {traineeID: traineeID, section: classSection}, function(res) {
				switch(res.status) {
					case 200: {
						alert("Trainee Removed!");
						traineeRow.remove();

						var endorsed = JSON.parse(res.mssg);
						// add to the endorsed trainees table
						var data = "<tr><td style='width: 25%'>"
                            + endorsed.lastName + ", " + endorsed.firstName + "</td>"
                            + "<td style='width: 15%'>" + endorsed.email + "</td> <td style='width: 10%;padding: 10px;text-align: center;'>"
							+ "<button class='btn btn-primary' type='button' id='add-trainee'style='background-color: #3e914d;''><strong>+</strong></button></td></tr>";
                        
                        console.log(data);
                        $('#endorsedtrainees').append(data);
						break;
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

	$('#class-day').change(function() {
		var daySelected = $(this).val();
		var sectionSelected = $('#scoresheet-section').val();

		window.location.href = '/scoresheets/' + sectionSelected + '/' + daySelected;
	});

	$('#scoresheet-section').change(function() {
		var sectionSelected = $(this).val();
		var daySelected = $('#class-day').val();

		window.location.href = '/scoresheets/' + sectionSelected + '/' + daySelected;
	});

	// edit scores
	$('.theScore').click(function() {
		var theScore = document.getElementsByClassName('theScore');
		var scoresheetEditor = document.getElementsByClassName('scoresheetEditor');
		var updatebtn = document.getElementById('updateScoresheet');
		var today = new Date();
		var date = $('#idhide').text();
		var compareDate = new Date(date);

		console.log(today);
		console.log(compareDate);
		console.log(compareDate < today);

	//	if(compareDate < today) {
	//		alert("This class ended in " + getDate(compareDate) + ". You cannot edit the scores for this class anymore.");
	//	}
	//	else {
			//hide text, show editor
			for(var i = 0; i < theScore.length; i++) 
				theScore[i].style.display = 'none';
			
			for(var i = 0; i < scoresheetEditor.length; i++) 
				scoresheetEditor[i].style.display = 'inline';
			
			updateScoresheet.style.display = 'inline';
	//	}
	});

	// update scores in db
	$('button#updateScoresheet').click(function() {
		var theScore = document.getElementsByClassName('theScore');
		var scoresheetEditor = document.getElementsByClassName('scoresheetEditor');
		var updateScoresheet = document.getElementById('updateScoresheet');
		var validNum = false;

		var classid = $('#classhide').text(); //classid
		var date = $('#idhide').text(); // date

		// accept only numbers 0-10
		for(var i = 0; i < scoresheetEditor.length; i++) {
			var num = scoresheetEditor[i].value;		
			if(!(Number(num) >= 0) || !(Number(num) <= 10))
				alert("Some inputs are invalid. Scores must be between 0 to 10.");
			else validNum = true;
		} 

		var scoresArr = []; // array of scores
		var traineeArr = []; // array of trainees

		// trainees
		$("#traineeScores tr").each(function() {
			traineeArr.push(this.id);
		});

		// scores
		$('tr input').each(function() {
			var value = $(this).val();
			if(value === '') 
				scoresArr.push($(this).attr('placeholder'));  // if trainer did not input any score, put the placeholder
			else scoresArr.push(value);		
		});

		console.log(scoresArr);
		console.log(traineeArr);
		// post
		if(validNum) {
			$.post('/scoresheets', {classid: classid, date: date, trainees: traineeArr, scores: scoresArr}, function(res) {
				switch(res.status) {
					case 200: {
						alert(res.mssg);
						for(var i = 0; i < scoresheetEditor.length; i++) {
							var subject = scoresheetEditor[i].value;
							//console.log(scoresheetEditor[i].value);
							if(subject != "")
								theScore[i].innerHTML = subject;
						}
					
						for(var i = 0; i < theScore.length; i++) 
							theScore[i].style.display = 'inline';
						
						for(var i = 0; i < scoresheetEditor.length; i++)
							scoresheetEditor[i].style.display = 'none';

						updateScoresheet.style.display = 'none';
					}
					case 500: {
						alert(res.mssg);
					}
				}
			});
		}
			
	});
});