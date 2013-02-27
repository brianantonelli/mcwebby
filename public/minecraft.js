// Generate skin: http://www.mcskinsearch.com
(function($){
	var userCount = 0,
		lastUpdated = moment(),
		loadData = function(){
			$('#serverStatus').text('Loading..');
			$.ajax('/online.json').done(function(data){
				userCount = data.onlineCount;
				var lastBackup = data.lastBackup.split('storage/')[1].replace(/.tgz/, ''),
					users = $('#users').empty();

				$('#userCount').text([data.onlineCount, data.maxOnline].join('/'));
				$('#lastBackup').text(moment(lastBackup, 'YYYYMMDDhhmmss').fromNow());
				$('#serverStatus').text(data.status ? 'Online' : 'Offline').css('color', data.status ? 'green' : 'red');

				$(data.userList).each(function(i, user){
					user = user.replace(/ /g, '');
					users
						.append($('<li/>')
							.text(user)
							.append($('<img src="http://i.mcss.me/'+user+'.png"/>')
								.addClass('avatar')));
				});

				users
					.listview('refresh')
					.toggle(parseInt(data.onlineCount, 10) > 0);

				lastUpdated = moment();
			});			
		},
		loadLog = function(){
			$.ajax('/log.json').done(function(data){
				$('#logContent').html(data.log.replace(/\n/g, '<hr/>'));
			});
		},
		start = function(){
			loadData();
			window.setInterval(loadData, 30000);
			window.setInterval(function(){ 
				$('#lastUpdated').text(lastUpdated.fromNow());
			}, 1000);

			$('#logs').live('pageshow', loadLog);
		};

		$('#refresh').click(loadData);

	$(document).ready(start);
})(jQuery);