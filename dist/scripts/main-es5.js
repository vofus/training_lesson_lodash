'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

;(function () {
	'use strict';

	var _marked = [generateId].map(regeneratorRuntime.mark);

	var Painter = function () {
		function Painter(arrOfCities) {
			_classCallCheck(this, Painter);

			this.arrOfCities = arrOfCities;
		}

		_createClass(Painter, [{
			key: 'refresh',
			value: function refresh() {
				var templateHtml = document.getElementById('template').innerHTML,
				    templateHtmlMinify = document.getElementById('template-minify').innerHTML,
				    compiled = _.template(templateHtml),
				    compiledMinify = _.template(templateHtmlMinify);
				if (document.getElementById('minify-table').style.display === 'none' && document.getElementById('city_table').style.display === 'block') {
					document.getElementById("city_table__body").innerHTML = compiled({ items: this.arrOfCities });
				} else {
					document.getElementById("minify-table").innerHTML = compiledMinify({ items: this.arrOfCities });
				}
			}
		}]);

		return Painter;
	}();

	var CitiesManager = function () {
		function CitiesManager() {
			var arrOfCities = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

			_classCallCheck(this, CitiesManager);

			this.arrOfCities = arrOfCities;
		}

		_createClass(CitiesManager, [{
			key: 'addCity',
			value: function addCity(nameArg, streetArg, countHousesArg) {
				var id = genId.next().value,
				    name = nameArg || document.querySelector(".form-city").value,
				    street = streetArg || document.querySelector(".form-street").value,
				    countHouses = countHousesArg || document.querySelector(".form-count-houses").value;

				var newCity = new City(id, name, street, countHouses);

				this.arrOfCities.push(newCity);
			}
		}, {
			key: 'removeCity',
			value: function removeCity(id) {
				this.arrOfCities.forEach(function (item, index, arr) {
					item.id === id ? arr.splice(index, 1) : false;
				});
			}
		}, {
			key: 'findMin',
			value: function findMin() {
				var min = this.arrOfCities[0].countHouses,
				    minId = this.arrOfCities[0].id;
				this.arrOfCities.forEach(function (item, index, arr) {
					if (arr[index].countHouses < min) {
						min = arr[index].countHouses;
						minId = arr[index].id;
					}
				});
				document.getElementById('' + minId).style.background = 'pink';
			}
		}, {
			key: 'findMax',
			value: function findMax() {
				var max = this.arrOfCities[0].countHouses,
				    maxId = this.arrOfCities[0].id;
				this.arrOfCities.forEach(function (item, index, arr) {
					if (arr[index].countHouses > max) {
						max = arr[index].countHouses;
						maxId = arr[index].id;
					}
				});
				document.getElementById('' + maxId).style.background = 'green';
			}
		}, {
			key: 'get',
			value: function get() {
				return this.arrOfCities;
			}
		}]);

		return CitiesManager;
	}();

	var City = function City(id, name, street, countHouses) {
		_classCallCheck(this, City);

		this.id = id;
		this.name = name;
		this.street = street;
		this.countHouses = countHouses;
	};

	var genId = generateId();

	var test = new CitiesManager();

	var painter = new Painter(test.get());

	test.addCity('Samara', 'Lenina', 45);
	test.addCity('Togliatti', 'Zavodskaya', 67);
	test.addCity('Chapaevsk', 'Zheleznodorozhnaya', 37);

	painter.refresh();
	addEvent();

	var minBtn = document.querySelector('.find-min'),
	    maxBtn = document.querySelector('.find-max');

	minBtn.addEventListener("click", function (event) {
		event.preventDefault();
		test.findMin();
	});

	maxBtn.addEventListener("click", function (event) {
		event.preventDefault();
		test.findMax();
	});

	var addBtn = document.querySelector("#add-element input[type=submit]");
	addBtn.addEventListener("click", function (event) {
		event.preventDefault();
		test.addCity();
		painter.refresh();
		addEvent();
	});

	var minifyBtn = document.querySelector('.minify-btn');
	minifyBtn.addEventListener("click", function (event) {
		event.preventDefault();
		if (this.innerHTML === 'Compact version') {
			this.innerHTML = 'Full version';
			document.getElementById('minify-table').style.display = 'block';
			document.getElementById('city_table').style.display = 'none';
		} else {
			this.innerHTML = 'Compact version';
			document.getElementById('minify-table').style.display = 'none';
			document.getElementById('city_table').style.display = 'block';
		}
		painter.refresh();
		addEvent();
	});

	function addEvent() {
		var removeBtns = document.getElementsByClassName('remove-btn');

		for (var i = 0; i < removeBtns.length; i++) {
			removeBtns[i].addEventListener('click', function (event) {
				event.preventDefault();
				test.removeCity(+this.parentElement.parentElement.id);
				painter.refresh();
				addEvent();
			});
		}
	}

	function generateId() {
		var n;
		return regeneratorRuntime.wrap(function generateId$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						n = 1;

					case 1:
						if (!true) {
							_context.next = 6;
							break;
						}

						_context.next = 4;
						return n++;

					case 4:
						_context.next = 1;
						break;

					case 6:
					case 'end':
						return _context.stop();
				}
			}
		}, _marked[0], this);
	}
})();