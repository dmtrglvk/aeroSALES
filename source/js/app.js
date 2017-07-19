var $ = require('jquery');

$(function(){
	forgotLogin();
});


function forgotLogin() {
	var forgotLink = $('.js-forgot-password'),
		loginContent = $('.js-login-content'),
		forgotContent = $('.js-forgot-content'),
		backBtn = $('.js-btn-back');

	forgotLink.on('click', function(e){
		e.preventDefault();
		loginContent.fadeOut(300, function(){
			forgotContent.fadeIn(300);
		})
	});
	backBtn.on('click', function(e){
		e.preventDefault();
		forgotContent.fadeOut(300, function(){
			loginContent.fadeIn(300);
		})
	})
}