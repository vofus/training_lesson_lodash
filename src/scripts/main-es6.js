;(function() {
	'use strict';

	class Painter {
		constructor(arrOfCities) {
			this.arrOfCities = arrOfCities;
		}
		refresh() {
			let templateHtml = document.getElementById('template').innerHTML,
				templateHtmlMinify = document.getElementById('template-minify').innerHTML,
				compiled = _.template(templateHtml),
				compiledMinify = _.template(templateHtmlMinify);
			if(document.getElementById('minify-table').style.display === 'none' && document.getElementById('city_table').style.display === 'block') {
				document.getElementById("city_table__body").innerHTML = compiled({items: this.arrOfCities});
			} else {
				document.getElementById("minify-table").innerHTML = compiledMinify({items: this.arrOfCities});
			}
		}
	}

	class CitiesManager {
		constructor(arrOfCities = []) {
			this.arrOfCities = arrOfCities;
		}
		addCity(nameArg, streetArg, countHousesArg) {
			let id = genId.next().value,
			    name = nameArg || document.querySelector(".form-city").value,
			    street = streetArg || document.querySelector(".form-street").value,
			    countHouses = countHousesArg || document.querySelector(".form-count-houses").value;
			
			let newCity = new City(id, name, street, countHouses);

			this.arrOfCities.push(newCity);
		}
		removeCity(id) {
			this.arrOfCities.forEach((item, index, arr) => {
				item.id === id ? arr.splice(index, 1) : false;
			});
		}
		findMin() {
			let min = this.arrOfCities[0].countHouses,
				minId = this.arrOfCities[0].id;
			this.arrOfCities.forEach((item, index, arr) => {
				if (arr[index].countHouses < min) {
					min = arr[index].countHouses;
					minId = arr[index].id;
				}
			});
			document.getElementById(`${minId}`).style.background = 'pink';
		}
		findMax() {
			let max = this.arrOfCities[0].countHouses,
				maxId = this.arrOfCities[0].id;
			this.arrOfCities.forEach((item, index, arr) => {
				if (arr[index].countHouses > max) {
					max = arr[index].countHouses;
					maxId = arr[index].id;
				}
			});
			document.getElementById(`${maxId}`).style.background = 'green';
		}
		get() {
			return this.arrOfCities;
		}
	}

	class City {
		constructor(id, name, street, countHouses) {
			this.id = id;
			this.name = name;
			this.street = street;
			this.countHouses = countHouses;
		}
	}

	let genId = generateId();

	let test = new CitiesManager();

	let painter = new Painter(test.get());



	test.addCity('Samara', 'Lenina', 45);
	test.addCity('Togliatti', 'Zavodskaya', 67);
	test.addCity('Chapaevsk', 'Zheleznodorozhnaya', 37);

	painter.refresh();
	addEvent();

	let minBtn = document.querySelector('.find-min'),
		maxBtn = document.querySelector('.find-max');

		minBtn.addEventListener("click", function(event) {
			event.preventDefault();
			test.findMin();
		});

		maxBtn.addEventListener("click", function(event) {
			event.preventDefault();
			test.findMax();
		});

	let addBtn = document.querySelector("#add-element input[type=submit]");
		addBtn.addEventListener("click", function(event) {
			event.preventDefault();
			test.addCity();
			painter.refresh();
			addEvent();
		});

	let minifyBtn = document.querySelector('.minify-btn');
		minifyBtn.addEventListener("click", function(event) {
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
		let removeBtns = document.getElementsByClassName('remove-btn');

		for(let i=0; i<removeBtns.length; i++) {
			removeBtns[i].addEventListener('click', function(event) {
				event.preventDefault();
				test.removeCity(+this.parentElement.parentElement.id);
				painter.refresh();
				addEvent();
			});
		}
	}

	function* generateId() {
	    let n = 1;
	    while (true) {
	        yield n++;
	    }
	}

})();