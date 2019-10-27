var codeExport = [];
var textLoaded = false;
var codesLoaded = false;


//Save to Browser
$(document).on('click', '#browserSave', function() {
	localStorage.setItem('browserSave', $('#textBox').html());
	localStorage.setItem('codesSave', $('#codeBox').html());
	$(this).css('background-color', 'green');
	setTimeout(function() {
		$('#browserSave').css('background-color', '');
	}, 300);
});

//Load from Browser
$(document).on('click', '#browserLoad', function() {
	var data = localStorage.getItem('browserSave');
	var browserCodes = localStorage.getItem('codesSave');
	
	if (data !== null) {
		$('#textBox').html(data);
		$('#codeBox').html(browserCodes);
		readyToGo(true);
	} else {
		alert('No save found');
	};
});

//Ready to Go
function readyToGo(force) {
	if ((codesLoaded && textLoaded) || force == true) {
		$('#buttons').empty();
		$('#buttons').append('<div id="addCode" class="options">Add a Code</div>');
		$('#buttons').append('<div id="changeCode" class="options">Change a Code</div>');
		$('#buttons').append('<div id="deleteCode" class="options">Delete a Code</div>');
		$('#buttons').append('<div id="undo" class="options">Uncode Selected</div>');
		$('#buttons').append('<div id="browserSave" class="options">Save in Browser</div>');
		$('#buttons').append('<div id="laterSave" class="options">Export .bcd</div>');
		$('#buttons').append('<div id="export" class="options">Export .csv</div>');
	};
};

//Prepare Code List
$(document).on('click', '#codeList', function(){
	if ($('#codes').val() !== '') {
		var codeList = $('#codes').val().split('\n');
		
		$('#codeBox').empty();

		for (var i = 0; i < codeList.length; i++) {
			$('#codeBox').append('<button class="code ' + codeList[i].toUpperCase() + '" value="' + codeList[i].toUpperCase() + '">' + codeList[i].toUpperCase() + '</button>');
		};
		
		codesLoaded = true;
		readyToGo();
		
		if (!textLoaded) {
			$('#buttons').empty();
			$('#buttons').append('<div id="prepText" class="options">Prepare Text</div>');
		};
	} else {
		alert('No codes entered');
	};
});

//Inductive Coding
$(document).on('click', '#inductive', function(){
	$('#codeBox').empty();
	codesLoaded = true;
	
	readyToGo();
	
	if (!textLoaded) {
		$('#buttons').empty();
		$('#buttons').append('<div id="prepText" class="options">Prepare Text</div>');
	};
});

//Add a Code
$(document).on('click', '#addCode', function(){
	var newCode = prompt('Add a code');
	
	if (newCode !== null && newCode !== '') {
		$('#codeBox').append('<button class="code ' + newCode + '" value="' + newCode + '">' + newCode + '</button>');
	};
});

//Change a Code
$(document).on('click', '#changeCode', function(){
	var oldCode = prompt('Change code from...');
	var newCode = prompt('Change code to...');
	
	if (oldCode !== null && oldCode !== '' && newCode !== null && newCode !== '' ) {
		if(confirm('Are you sure? If this code exists, you are about to change ' + $('span.' + oldCode).length + ' instance(s) of ' + oldCode + ' to ' + newCode + '. You will not be able to undo this.')) {
			$('span.' + oldCode).addClass(newCode).removeClass(oldCode);
			$('button.' + oldCode).addClass(newCode).removeClass(oldCode).html(newCode);
		};
	};
});

//Delete a Code
$(document).on('click', '#deleteCode', function(){
	var deadCode = prompt('Delete a code');
	
	if (deadCode !== null && deadCode !== '') {
		if(confirm('Are you sure? If this code exists, you are about to clear ' + $('span.' + deadCode).length + ' instance(s) of ' + deadCode + '. You will not be able to undo this.')) {
			$('span.' + deadCode).replaceWith($('span.' + deadCode).html());
			$('button.' + deadCode).remove();
		};
	};
});

//Prepare Text Box
$(document).on('click', '#prepText', function(){
	if ($('#text').val() !== '') {
		var text = $('#text').val().split('\n');
	
		$(this).remove();
		$('#textBox').empty();
		$('#fileLoad').remove();
		$('#browserLoad').remove();
		$('#whichFile').remove();
		
		for (var i = 0; i < text.length; i++) {
			var display = text[i].replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
			$('#textBox').append(display + '<br />');
		};
		
		textLoaded = true;		
		readyToGo();
		
	} else {
		alert('No text entered');
	};
});

//Code Selected Text
$(document).on('click', '.code', function(){
	//Color the coded text
	if(document.all){
		var tr = document.selection.createRange();
		tr.execCommand("ForeColor", false, "#FF0000");
	} else {
		var tr = window.getSelection().getRangeAt(0);
		var span = document.createElement("span");
		span.className = this.value;
		span.style.cssText = "color:#ff0000";
		tr.surroundContents(span);
	};
	
	//Clear the selection
	if (window.getSelection) {
	  if (window.getSelection().empty) {  // Chrome
		window.getSelection().empty();
	  } else if (window.getSelection().removeAllRanges) {  // Firefox
		window.getSelection().removeAllRanges();
	  }
	} else if (document.selection) {  // IE?
	  document.selection.empty();
	};
});

//Show Codes on Hover
$(document).on('mouseenter', 'span', function(){
	$('.code.' + this.className).css('background-color', 'red');
});

$(document).on('mouseleave', 'span', function(){
	$('.code').css('background-color', '');
});

//Show Coded on Hover
$(document).on('mouseenter', '.code', function(){
	$('span.' + $(this).attr('class').split(' ')[1]).css('background-color', 'white');
});

$(document).on('mouseleave', '.code', function(){
	$('span.' + $(this).attr('class').split(' ')[1]).css('background-color', '');
});

//Select Coded Text
$(document).on('click', 'span', function(){
	if ($(this).hasClass('active')) {
		$('.active').removeClass('active');
	} else {
		$('.active').removeClass('active');
		$(this).addClass('active');
	};
});

//Uncode Selected Text
$(document).on('click', '#undo', function(){
	$('.active').contents().unwrap();	
});

//Create and Download .csv File
$(document).on('click', '#export', function(){
	$('.active').removeClass('active');
	
	$('span').each(function(){
		codeExport.push([this.className, '"' + this.innerHTML + '"']);
	});	
	
	const rows = codeExport;
	let csvContent = "data:text/csv;charset=utf-8,";
	rows.forEach(function(rowArray){
	   let row = rowArray.join(",");
	   csvContent += row + "\n";
	});
	
	var encodedUri = encodeURI(csvContent);
	var link = document.createElement("a");
	link.setAttribute("href", encodedUri);
	link.setAttribute("download", "my_data.csv");
	document.body.appendChild(link);

	link.click();
});

//Create and Download .bcd File
$(document).on('click', '#laterSave', function(){
	$('.active').removeClass('active');
	
	var data = "data:text/html;charset=utf-8," + $('#textBox').html() + '|||||' + $('#codeBox').html();
	
	var encodedUri = encodeURI(data);
	var link = document.createElement("a");
	link.setAttribute("href", encodedUri);
	link.setAttribute("download", "my_data.bcd");
	document.body.appendChild(link);

	link.click();
});

//Load .bcd File
$(document).on('click', '#fileLoad', function(){
	if (!window.FileReader) {
        alert('Your browser is not supported');
    };
    var input = $('#fileSelect').get(0);
    
    // Create a reader object
    var reader = new FileReader();
    if (input.files.length) {
        var textFile = input.files[0];
        reader.readAsText(textFile);
        $(reader).on('load', function(e){
			var file = e.target.result,
				results;
			if (file && file.length) {
				var text = file.split('\n').toString();				
				var loadStuff = text.split('|||||');				
				$('#textBox').html(loadStuff[0]);
				$('#codeBox').html(loadStuff[1]);
			};
		});
    } else {
        alert('Please upload a file before continuing')
    } 
});