// A $( document ).ready() block.
$( document ).ready(function() {
	

	$('body').on('change', 'select', function(){
		update();
	});

	$('body').on('change', 'input, select', function(){
		update();
	});

	$('body').on('keyup', 'input, select', function(){
		update();
	});

	$('select option').each(function(){
		if($(this).attr('data-image')!=undefined){
				(new Image()).src = $(this).attr('data-image');
		}
	});

	$('button').on('click', function(){
		var selection = {};
		selection.name = $("[name='x1234']").val();
		selection.donot = $('select').find(":selected").text();

		$.post(`/OrderMyDonot`, selection)
		  .done(function() {
			setCookie("name", selection.name);
			setCookie("donot", selection.donot);
			location.reload();
		  })
		  .fail(function() {
			console.log("Error. Try again later or email dean.meehan@irishlife.ie");
		  });
	});

	if(getCookie("name")!=null){
		$.post('/WhatDidIChoose', {name:getCookie("name")})
		.done(function(data){
			$('[data-message]').html(`Hi ${data.name}, you ordered your '${data.order}' at ${data.date}'`);
		});
	}

});

var selected = getCookie("donot")!=null
	
if(getCookie("name")!=null){
	$("[name='x1234']").val(getCookie("name"));
}

if(getCookie("donot")!=null){
	$("select").val(getCookie("donot"));
	$('img').attr("src", $('select').find(":selected").attr("data-image"));
	$('input, select, button').prop("disabled", true);
	$('button').html(`Your '${getCookie("donot")}' is on it's way!`);
}

function update(){
	if(selected)return;
	var selection = {};
	selection.name = $("[name='x1234']").val();
	selection.donot = $('select').find(":selected").text();
	selection.image = $('select').find(":selected").attr("data-image");

	$('img').attr("src", selection.image);

	if(selection.name!=undefined && selection.donot!="Please choose an Offbeat donot"){
		$('button').prop('disabled', false);
	}else{
		$('button').prop('disabled', true);
	}

	if(selection.donot!="Please choose an Offbeet donot"){
		$('button').html(`Click to Eat '${selection.donot}'`);
	}else{
		$('button').html(`Choose a Donot ${selection.name.substring(0,1).toUpperCase()}${selection.name.substring(1)}`);
	}
}

/*COOKIE*/
function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
	document.cookie = name + "=" + (value || "")  + expires + "; path=/";
	console.log(`Cookie set ${name} ${value}`);
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function eraseCookie(name) {   
    document.cookie = name+'=; Max-Age=-99999999;';  
}