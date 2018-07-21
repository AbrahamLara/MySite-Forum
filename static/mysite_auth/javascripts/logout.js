$(document).ready(function() {
	$('#user_popover').popover({
		html: true,
		content: function() {
			return $('#user_popover_content').html();
		}
	});
});