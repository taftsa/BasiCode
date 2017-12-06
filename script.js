var codeExport = [];

$(document).on('click', '#codeList', function(){
	if ($('#codes').val() !== '') {
		var codeList = $('#codes').val().split('\n');

		for (var i = 0; i < codeList.length; i++) {
			$('#codeBox').append('<button class="code" value="' + codeList[i].toUpperCase() + '">' + codeList[i].toUpperCase() + '</button>');
		};
		
		$('#codeBox').append('<button id="undo">Undo Selected</button>');
		$('#codeBox').append('<button id="browserSave">Save in Browser</button>');
		$('#codeBox').append('<button id="laterSave">Save for Later</button>');
		$('#codeBox').append('<button id="export">Export .csv</button>');
		
		$(this).remove();
		$('#codes').remove();
	} else {
		alert('No codes entered');
	};
});

$(document).on('click', '#browserSave', function() {
	localStorage.setItem('browserSave', $('#textBox').html());
	localStorage.setItem('codesSave', $('#codeBox').html());
	$(this).css('background-color', 'green');
	setTimeout(function() {
		$('#browserSave').css('background-color', '');
	}, 300);
});

$(document).on('click', '#browserLoad', function() {
	var data = localStorage.getItem('browserSave');
	var browserCodes = localStorage.getItem('codesSave');
	
	if (data !== null) {
		$('#textBox').html(data);
		$('#codeBox').html(browserCodes);
	} else {
		alert('No save found');
	};
	
	$('#prepText').remove();
	$('#text').remove();
	$('#fileLoad').remove();
	$('#browserLoad').remove();
	$('#fileSelect').remove();
});

$(document).on('click', '#prepText', function(){
	var text = $('#text').val().split('\n');
	
	$(this).remove();
	$('#text').remove();
	$('#fileLoad').remove();
	$('#browserLoad').remove();
	$('#fileSelect').remove();
	
	for (var i = 0; i < text.length; i++) {
		var display = text[i].replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
		$('#textBox').append('<p>' + display + '<p>');
	};
});

$(document).on('click', '.code', function(){
	//Color the coded text
	if(document.all){
		var tr = document.selection.createRange();
		tr.execCommand("ForeColor", false, "#FF0000");
	}else{
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

$(document).on('click', '#export', function(){
	$('.active').removeClass('active');
	
	$('span').each(function(){
		codeExport.push([this.className, this.innerHTML]);
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

$(document).on('click', '#laterSave', function(){
	$('.active').removeClass('active');
	
	var data = "data:text/html;charset=utf-8," + $('#textBox').html();
	
	var encodedUri = encodeURI(data);
	var link = document.createElement("a");
	link.setAttribute("href", encodedUri);
	link.setAttribute("download", "my_data.html");
	document.body.appendChild(link);

	link.click();
});

$(document).on('click', 'span', function(){
	if ($(this).hasClass('active')) {
		$('.active').removeClass('active');
	} else {
		$('.active').removeClass('active');
		$(this).addClass('active');
	};	
});

$(document).on('click', '#fileLoad', function(){
	if (!window.FileReader) {
        alert('Your browser is not supported')
    }
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
				var text = file.split('\n');
				
				$('#prepText').remove();
				$('#text').remove();
				$('#fileLoad').remove();
				$('#browserLoad').remove();
				$('#fileSelect').remove();
				
				$('#textBox').append(text);
			};
		});
    } else {
        alert('Please upload a file before continuing')
    } 
});

$(document).on('click', '#undo', function(){
	$('.active').contents().unwrap();
});