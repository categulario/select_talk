'use strict';

var request = new XMLHttpRequest();
var scheduleData = [];

request.open('GET', 'schedule.json', true);
request.onload = function () {
	if (request.status == 200) {
		initApp(JSON.parse(request.responseText));
	} else {
		console.log('failed loading schedule data');
	}
};
request.onerror = function () {
	console.log('server error or something');
};
request.send();

// the progress bar component
Vue.component('item-progress', {
	props: ['from', 'to', 'hour'],

	computed: {
		progressBarWidth: function progressBarWidth() {
			var from_hour = this.hourToDecimal(this.from);
			var to_hour = this.hourToDecimal(this.to);
			var cur_hour = this.hourToDecimal(this.hour);
			var value = (cur_hour - from_hour) / (to_hour - from_hour) * 100;

			if (value < 0) {
				return '0%';
			} else if (value > 100) {
				return '100%';
			} else {
				return value + '%';
			}
		}
	},

	methods: {
		hourToDecimal: function hourToDecimal(hour) {
			var pieces = hour.split(':').map(function (p) {
				return parseInt(p);
			});

			return pieces[0] + pieces[1] / 60;
		}
	}
});

function initApp(scheduleData) {
	document.getElementById('loader').className = 'off';

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
							default_filter: 'talksHappeningNow'
						},
						next: {
							title: 'Charlas siguientes',
							default_filter: 'talksHappeningNext'
						},
						today: {
							title: 'Programa hoy',
							default_filter: 'talksToday'
						},

						// Routes by day
						day1: { title: 'Programa Lunes', default_filter: 'talksDay1' },
						day2: { title: 'Programa Martes', default_filter: 'talksDay2' },
						day3: { title: 'Programa Miércoles', default_filter: 'talksDay3' },
						day4: { title: 'Programa Jueves', default_filter: 'talksDay4' },
						day5: { title: 'Programa Viernes', default_filter: 'talksDay5' },

						// Routes by area
						area1: { title: 'Cursos', default_filter: 'talksArea1' },
						area2: { title: 'Ponencias', default_filter: 'talksArea2' },
						area3: { title: 'Reportes de tesis', default_filter: 'talksArea3' }
					}
				}
			}
		},

		created: function created() {
			var self = this;

			setInterval(function () {
				self.currentHour = moment().format('HH:mm');
			}, 2000);
		},

		computed: {
			talksHappeningNow: function talksHappeningNow() {
				var now = this.currentHour;
				var day = moment().format('d');

				return this.schedule.schedule.filter(function (talk) {
					return talk.day == day && talk.from <= now && talk.to > now;
				});
			},

			nextTime: function nextTime() {
				var now = this.currentHour;

				return this.schedule.marks.find(function (item) {
					return item > now;
				});
			},

			talksHappeningNext: function talksHappeningNext() {
				var day = moment().format('d');
				var nextTime = this.nextTime;

				return this.schedule.schedule.filter(function (talk) {
					return talk.day == day && talk.from <= nextTime && talk.to > nextTime;
				});
			},

			talksToday: function talksToday() {
				var day = moment().format('d');

				return this.schedule.schedule.filter(function (talk) {
					return talk.day == day;
				});
			},

			// filters by day
			talksDay1: function talksDay1() {
				return this.schedule.schedule.filter(function (talk) {
					return talk.day == '1';
				});
			},
			talksDay2: function talksDay2() {
				return this.schedule.schedule.filter(function (talk) {
					return talk.day == '2';
				});
			},
			talksDay3: function talksDay3() {
				return this.schedule.schedule.filter(function (talk) {
					return talk.day == '3';
				});
			},
			talksDay4: function talksDay4() {
				return this.schedule.schedule.filter(function (talk) {
					return talk.day == '4';
				});
			},
			talksDay5: function talksDay5() {
				return this.schedule.schedule.filter(function (talk) {
					return talk.day == '5';
				});
			},

			// filters by area
			talksArea1: function talksArea1() {
				return this.schedule.schedule.filter(function (talk) {
					return talk.area == 'Cursos';
				});
			},
			talksArea2: function talksArea2() {
				return this.schedule.schedule.filter(function (talk) {
					return talk.area == 'Ponencias';
				});
			},
			talksArea3: function talksArea3() {
				return this.schedule.schedule.filter(function (talk) {
					return talk.area == 'R. de tesis';
				});
			}
		},

		methods: {
			talksNowClick: function talksNowClick() {
				this.changeSection('schedule', 'now');
			},

			talksNextClick: function talksNextClick() {
				this.changeSection('schedule', 'next');
			},

			scheduleClick: function scheduleClick() {
				this.changeSection('schedule', 'today');
			},

			runLeftAction: function runLeftAction() {
				if (this.left_action === null) {
					this.showPanel();
					return;
				}

				this.changeSection(this.left_action);
			},

			scheduleByDay: function scheduleByDay(event) {
				var day = event.target.dataset.day;

				this.changeSection('schedule', 'day' + day);
			},

			scheduleByArea: function scheduleByArea(event) {
				var area = event.target.dataset.area;

				this.changeSection('schedule', 'area' + area);
			},

			showPanel: function showPanel() {
				document.getElementById('left-panel').classList = [];
				document.getElementById('overlay').classList = [];
			},

			hidePanel: function hidePanel() {
				document.getElementById('left-panel').className = "off";
				document.getElementById('overlay').className = "off";
			},

			changeSection: function changeSection(section, sub) {
				this.hidePanel();

				this.section = section;
				this.title = this.sections[section].title;
				this.left_icon = this.sections[section].left_icon;
				this.left_action = this.sections[section].left_action;

				if (this.sections[section].subs && sub) {
					this.title = this.sections[section].subs[sub].title;
					this.default_filter = this.sections[section].subs[sub].default_filter;
				}
			}
		}
	});
}
//# sourceMappingURL=app.js.map
