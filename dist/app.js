var request = new XMLHttpRequest();
var scheduleData = [];

request.open('GET', 'schedule.json', true);
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

// the progress bar component
Vue.component('item-progress', {
	props: ['from', 'to', 'hour'],

	computed: {
		progressBarWidth: function () {
			var from_hour = this.hourToDecimal(this.from);
			var to_hour = this.hourToDecimal(this.to);
			var cur_hour = this.hourToDecimal(this.hour);
			var value = (cur_hour - from_hour) / (to_hour - from_hour) * 100;

			if (value < 0) {
				return '0%';
			} else {
				return `${ value }%`;
			}
		}
	},

	methods: {
		hourToDecimal: function (hour) {
			var pieces = hour.split(':').map(p => parseInt(p));

			return pieces[0] + pieces[1] / 60;
		}
	}
});

function initApp(scheduleData) {
	window.App = new Vue({
		el: '#app',

		data: {
			title: 'Encuentra charlas',
			schedule: scheduleData,
			section: 'home',
			left_icon: 'fa-bars',
			left_action: null,
			currentHour: moment().format('HH:mm'),
			sections: {
				home: {
					title: 'Encuentra charlas',
					left_icon: 'fa-bars',
					left_action: null
				},
				schedule: {
					title: 'Charlas',
					left_icon: 'fa-arrow-left',
					left_action: 'home',

					subs: {
						now: {
							title: 'Charlas ahora',
							default_filter: 'talksHappeningNow',
							default_key: 'area'
						},
						next: {
							title: 'Charlas siguientes',
							default_filter: 'talksHappeningNext',
							default_key: 'area'
						}
					}
				}
			}
		},

		created: function () {
			var self = this;

			setInterval(function () {
				self.currentHour = moment().format('HH:mm');
			}, 2000);
		},

		computed: {
			talksHappeningNow: function () {
				var now = this.currentHour;
				var day = moment().format('d');

				return this.schedule.schedule.filter(talk => {
					return talk.day == day && talk.from <= now && talk.to > now;
				});
			},

			nextTime: function () {
				var now = this.currentHour;

				return this.schedule.marks.find(item => item > now);
			},

			talksHappeningNext: function () {
				var day = moment().format('d');
				var nextTime = this.nextTime;

				return this.schedule.schedule.filter(talk => {
					return talk.day == day && talk.from <= nextTime && talk.to > nextTime;
				});
			}
		},

		methods: {
			talksNowClick: function () {
				this.changeSection('schedule', 'now');
			},

			talksNextClick: function () {
				this.changeSection('schedule', 'next');
			},

			runLeftAction: function () {
				if (this.left_action === null) {
					// display left menu
					return;
				}

				this.changeSection(this.left_action);
			},

			changeSection: function (section, sub) {
				this.section = section;
				this.title = this.sections[section].title;
				this.left_icon = this.sections[section].left_icon;
				this.left_action = this.sections[section].left_action;

				if (this.sections[section].subs && sub) {
					this.title = this.sections[section].subs[sub].title;
					this.default_filter = this.sections[section].subs[sub].default_filter;
					this.default_key = this.sections[section].subs[sub].default_key;
				}
			}
		}
	});
}
//# sourceMappingURL=app.js.map
