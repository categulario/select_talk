var request = new XMLHttpRequest();
var scheduleData = [];

request.open('GET', 'datamining/organized_data.json', true);
request.onload = () => {
	if (request.status == 200) {
		initApp(JSON.parse(request.responseText));
	} else {
		console.log('failed loading schedule data');
	}
};
request.onerror = () => {
	console.log('server error or something');
};
request.send();

function initApp(scheduleData) {
	window.App = new Vue({
		el: '#app',

		data: {
			title: 'Encuentra charlas',
			schedule: scheduleData,
			section: 'home',
			left_icon: 'fa-bars',
			left_action: null,
			sections: {
				home: {
					title: 'Encuentra charlas',
					left_icon: 'fa-bars',
					left_action: null,
				},
				'schedule-now': {
					title: 'Charlas sucediendo ahora',
					left_icon: 'fa-arrow-left',
					left_action: 'home',
				},
			},
		},

		computed: {
			talksHappeningNow: function () {
				return this.schedule.filter((talk) => {
					var now = '10:00';
					var day = 'Martes';

					return talk.day == day && talk.from <= now && talk.to >= now;
				});
			},
		},

		methods: {
			talksNowClick: function () {
				this.changeSection('schedule-now');
			},

			talksNextClick: function () {
				console.log('click');
			},

			runLeftAction: function () {
				if (this.left_action === null) {
					// display left menu
					return;
				}

				this.changeSection(this.left_action);
			},

			changeSection: function (section) {
				this.section = section;
				this.title = this.sections[section].title;
				this.left_icon = this.sections[section].left_icon;
				this.left_action = this.sections[section].left_action;
			},
		},
	});
}
