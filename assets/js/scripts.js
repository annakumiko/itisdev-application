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

function n(n) {
    return n > 9 ? "" + n: "0" + n;
}

function reverseDate(date) {
	var strDate = date.toString();
	var res = strDate.split(" ");
	
	if(res.length == 3) {
		var mm = res[0];
		var day = n(res[1].slice("", -1));
		var year = res[2];
	} else {
		var mm = res[1];
		var day = n(res[2].slice("", -1));
		var year = res[3];
	}
	
	console.log(res);

	switch(mm) {
		case "January": mm = "01"; break;
		case "February": mm = "02"; break;
		case "March": mm = "03"; break;
		case "April": mm = "04"; break;
		case "May": mm = "05"; break;
		case "June": mm = "06"; break;
		case "July": mm = "07"; break;
		case "August": mm = "08"; break;
		case "September": mm = "09"; break;
		case "October": mm = "10"; break;
		case "November": mm = "11"; break;
		case "December": mm = "12"; break;
	}

	var rev = year + "-" + mm + "-" + day;

	return rev;
}

function classOver() {
	var today = new Date();
	// manage trainees & delete btns

	$('.manageTrainees').each(function() {
		var e = $(this).closest('tr').children('td.eDate').text();

		var reverse = reverseDate(e);
		var newDate = new Date(reverse);

		console.log(e);
		console.log(reverse);
		console.log(newDate);

		if(newDate.valueOf() < today.valueOf())
			$(this).prop('disabled', true);
	}); 

	$('.deleteClassBtn').each(function() {
		var e = $(this).closest('tr').children('td.eDate').text();

		var reverse = reverseDate(e);
		var newDate = new Date(reverse);

		console.log(e);
		console.log(reverse);
		console.log(newDate);

		if(newDate.valueOf() < today.valueOf())
			$(this).prop('disabled', true);
	}); 
	
	// quizlist updates
	$('.updatebtn').each(function() {
		var e = $(this).closest('tr').children('td.eDate').text();

		var reverse = reverseDate(e);
		var newDate = new Date(reverse);

		console.log(e);
		console.log(reverse);
		console.log(newDate);

		if(newDate.valueOf() < today.valueOf())
			$(this).prop('disabled', true);

	}); 

	// update quiz + button
	var pageName = $('#pageName').text();
	if(pageName == "Update a quiz") $('.addQuestion').prop('disabled', true);
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

	// GET CODE
	$('button#getCodeBTN').click(function() {
		var email = validator.trim($('#email').val());
					
		var emailEmpty = validator.isEmpty(email);
		var emailFormat = validator.isEmail(email);
		
		$('p#emailError').text('');

		if (emailEmpty) $('p#emailError').text('Please enter your email.');
		
		else if (!emailFormat) $('p#emailError').text('Invalid email format.');
								
		if (!emailEmpty && emailFormat){

			$.post('/verification', { email: email }, function(res) {
				switch (res.status){
					case 200: {
						window.location.href = '/verify-account/' + email;
						break;
					}
					case 401: {
						$('p#emailError').text('Incorrect email.');
						break;								
					}
					case 409: {
						$('p#emailError').text('Account already verified.');
						break;								
					}
					case 410: {
						$('p#emailError').text('Account code already sent.');
						break;								
					}
					case 500: {
						$('p#emailError').text('Server Error.');
						break;
					}
				}
			});
		}
	});

	// VERIFY ACCOUNT
	$('button#verifyBTN').click(function() {
		var email = validator.trim($('#email').val());
		var verifyCode = validator.trim($('#verifyCode').val());
				
		console.log(email);
		console.log(verifyCode);
		
		var emailEmpty = validator.isEmpty(email);
		var codeEmpty = validator.isEmpty(verifyCode);
		var emailFormat = validator.isEmail(email);
		
		$('p#emailError').text('');
		$('p#codeError').text('');
		
		if (emailEmpty) $('p#emailError').text('Please enter your email.');
		
		else if (!emailFormat) $('p#emailError').text('Invalid email format.');
				
		if (codeEmpty) $('p#codeError').text('Please enter verification code.');
				
		if ((!emailEmpty && emailFormat) && !codeEmpty){

			$.post('/verify-account', {email: email, verifyCode: verifyCode}, function(res) {
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

	// UPDATE CLIENT DETAILS
	$('button#saveCLBTN').click(function() {
		var isActive = document.getElementsByClassName('active');
		var clientName = document.getElementsByClassName('clientName');
		// var clientName = $(".clientName").val();
		var companyName = document.getElementsByClassName('companyName');
		var email = document.getElementsByClassName('email');
		var contactNo = document.getElementsByClassName('contactNo');

		var activeArray = [];
		var idArray = [];
		var nameArray = [];
		var companyArray = [];
		var emailArray = [];
		var numberArray = [];
		$('p#eUpdateClients').text('');

		$("#clients tr").each(function() {
			idArray.push(this.id);
		});	

		for(var i = 0; i < idArray.length; i++){
			if(isActive[i].value === 'on')
				activeArray.push(true);
			else
				activeArray.push(false);
		}
		
		for(var i = 0; i < idArray.length; i++){
			nameArray.push(clientName[i].value);
			companyArray.push(companyName[i].value);
			emailArray.push(email[i].value);
			numberArray.push(contactNo[i].value);
		}

		// console.log(idArray);
		// console.log(activeArray);
		// console.log(nameArray);
		// console.log(companyArray);
		// console.log(emailArray);
		// console.log(numberArray);

		$.post('/update-clientlist', {clientID: idArray, clientName: nameArray, companyName: companyArray, email: emailArray, contactNo: numberArray, isActive: activeArray }, function(result){
			switch(result.status) {
				case 200: {
					alert(result.mssg);
					window.location.href = '/manage-clientlist';
				}
				case 500: {
					$('p#eUpdateClients').text(res.mssg);
					break;
				}
			}
		})
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

	// SCORESHEET

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
		// var date = $('#idhide').text();
		// var compareDate = new Date(date);
		var endDate = $('endhide').text()
		var compareDate = new Date(endDate);

		if(compareDate < today) {
			alert("This class ended in " + getDate(compareDate) + ". You cannot edit the scores for this class anymore.");
		}
		else {
			//hide text, show editor
			for(var i = 0; i < theScore.length; i++) 
				theScore[i].style.display = 'none';
			
			for(var i = 0; i < scoresheetEditor.length; i++) 
				scoresheetEditor[i].style.display = 'inline';
			
			updateScoresheet.style.display = 'inline';
		}
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
				scoresArr.push($(this).attr('value'));  // if trainer did not input any score, put the placeholder
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

	// add empty question
	$('button#addQuestion').click(function() {
		var qDiv = "<div class='form-row quizquestion'> <div class='col'> <label>Question</label>"
					+ "<input type='text' class='quizQuestion' style='margin: 5px; height: 32px;padding: 2px;border-color: rgb(0,0,0); width: 100%;border-radius: 5px;'>"
					+ "<label>Answer</label> <input type='text' class='quizAnswer' style='margin: 5px; height: 32px;padding: 2px;border-color: rgb(0,0,0); width: 100%; border-radius: 5px;'>"
                    + "</div> <div class='col' style='visibility: hidden; max-width: 10%;'><button id='addQuestion'class='btn btn-primary' type='button' style='background-color: #3e914d;margin: 30px;'>"
                    + "<strong>+</strong></button></div></div>"
	
		$('#questionlist').append(qDiv);		
	});

	// QUIZ VALIDATIONS
	$('button#createQuiz').click(function() {
		var quizDate = new Date($('#quizDate').val()); 
		var quizClass = $('#quizClass').val();
		var qstartTime = $('#qstartTime').val();
		var qendTime = $('#qendTime').val();
		var numTakes = $('#numTakes').val();
		var qID = $('#qID').text();
		var isRandomized = $('#randomize').checked();

		console.log("randomized: " + isRandomized); 

		console.log(qID);
		var questionArr = [];
		$('#questionlist .quizQuestion').each(function() {
			var value = $(this).val();
			questionArr.push(value);
		});

		var answerArr = [];
		$('#questionlist .quizAnswer').each(function() {
			var value = $(this).val();
			answerArr.push(value);		
		});

		var numHours = (calculateHours(qstartTime, qendTime) * 0.0001);

		var dateToday = new Date();
		var dateErrors = true,
			timeErrors = true,
			qaErrors = true;

		$('p#qDate').text('');
		$('p#qsTime').text('');
		$('p#qeTime').text('');
		$('p#qListError').text('');

		// date ; empty, earlier than today
		if(quizDate == "Invalid Date" || !quizDate) {
			$('p#qDate').text('Set date.');
		}
		else if(quizDate < dateToday) {
			$('p#qDate').text('Date should not be earlier than today.');
		}
		else dateErrors = false;

		// time ; min 30 mins max 1 hr 30 mins
		if(!qstartTime || !qendTime) {
			if(!qstartTime) $('p#qsTime').text('Set time.');
			if(!qendTime) $('p#qeTime').text('Set time.');
		}
		else if(numHours > 1.3 || numHours < 0.3) {
			if(!(numHours == 0.001)) {
				if(numHours > 1.3) $('p#qeTime').text('Time should not exceed 90 minutes.');
				if(numHours < 0.3) $('p#qeTime').text('Time should at least be 30 minutes.');
			}
			else timeErrors = false;
		}		
		else timeErrors = false;

		// question answer ; empty
		var numItems = questionArr.length;
		for(var i = 0; i < numItems; i++) {
			if(questionArr[i] === "" || answerArr[i] === "")
				$('p#qListError').text('Some fields are empty.');
			else qaErrors = false;
		}

		if(!timeErrors && !dateErrors && !qaErrors) {
			if($(this).text() === "Create") {
				$.post('/create-quiz', { section: quizClass, quizDate: quizDate, startTime: qstartTime, endTime: qendTime, numTakes: numTakes, numItems: numItems,
					qArr: questionArr, ansArr: answerArr}, function(res) {
					switch(res.status) {
						case 200: {
							alert(res.mssg);
							window.location.href = '/quiz-list';
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
			else {
				$.post('/update-quiz', { qID: qID, section: quizClass, quizDate: quizDate, startTime: qstartTime, endTime: qendTime, numTakes: numTakes, numItems: numItems,
					qArr: questionArr, ansArr: answerArr}, function(res) {
					switch(res.status) {
						case 200: {
							alert(res.mssg);
							window.location.href = '/quiz-list';
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
