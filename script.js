var codeExport = [];

$(document).on('click', '#codeList', function(){
	var codeList = $('#codes').val().split('\n')

	for (var i = 0; i < codeList.length; i++) {
		$('#codeBox').append('<button class="code" value="' + codeList[i] + '">' + codeList[i] + '</button>');
	};
	
	$(this).remove();
	$('#codes').remove();
});

$(document).on('click', '#prepText', function(){
	var text = $('#text').val().split('\n');
	
	$(this).remove();
	$('#text').remove();
	
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
		span.style.cssText = "color:#ff0000";
		tr.surroundContents(span);
	};
	
	//Add the code and text to the variable
	var selObj = JSON.stringify(window.getSelection().toString());
    codeExport.push([$(this).val(), selObj]);
	
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