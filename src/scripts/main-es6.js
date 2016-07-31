;(function() {
    'use strict';

    /* ================== Begin Classes ================== */
    class Painter {
        constructor(arrOfCities) {
            this.arrOfCities = arrOfCities;
        }
        refresh() { // Перерисовка шаблона
            let templateHtml = document.getElementById('template').innerHTML,
                templateHtmlMinify = document.getElementById('templateMinify').innerHTML,
                compiled = _.template(templateHtml),
                compiledMinify = _.template(templateHtmlMinify),
                minTable = document.getElementById('minifyTable'),
                fullTable = document.getElementById('cityTable'),
                tableBody = document.getElementById("cityTableBody");

            if(minTable.classList.contains('hidden') && !fullTable.classList.contains('hidden')) {
                tableBody.innerHTML = compiled({items: this.arrOfCities});
            } else {
                minTable.innerHTML = compiledMinify({items: this.arrOfCities});
            }
        } // refresh
    }

    class CitiesManager {
        constructor(arrOfCities = []) {
            this.arrOfCities = arrOfCities;
        }
        addCity(nameArg, streetArg, countHousesArg) {
            let id = genId.next().value,
                name = nameArg || document.getElementById('form-city').value,
                street = streetArg || document.getElementById('form-street').value,
                countHouses = countHousesArg || document.getElementById('form-count-houses').value;
            
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
            document.getElementById(`${minId}`).classList.add('min');
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
            document.getElementById(`${maxId}`).classList.add('max');
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
    /* ==================== End Classes ==================== */

    let genId = generateId(),                   // создаем генератор
        manager = new CitiesManager(),          // создаем объект класса CityManager
        painter = new Painter(manager.get());   // создаем объект класса Painter


    /* ================ Тестовые данные ================ */
    manager.addCity('Samara', 'Lenina', 45);
    manager.addCity('Togliatti', 'Zavodskaya', 67);
    manager.addCity('Chapaevsk', 'Zheleznodorozhnaya', 37);
    /* ================ =============== ================ */

    painter.refresh();        // отрисовываем таблицу
    removeBtnsAddListener();  // навешиваем обработчик на кнопки "Remove"

    let minBtn = document.getElementById('find-min'),
        maxBtn = document.getElementById('find-max'),
        addBtn = document.getElementById('addCity'),
        minifyBtn = document.getElementById('minify-btn');

    /* === Навешиваем обработчики на кнопки === */
    minBtn.addEventListener("click", (event) => {
        event.preventDefault();
        manager.findMin();
    });

    maxBtn.addEventListener("click", (event) => {
        event.preventDefault();
        manager.findMax();
    });

    addBtn.addEventListener("click", (event) => {
        event.preventDefault();
        manager.addCity();
        painter.refresh();
        removeBtnsAddListener();
    });

    minifyBtn.addEventListener("click", (event) => {
        event.preventDefault();
        let minTable = document.getElementById('minifyTable'),
            fullTable = document.getElementById('cityTable');
        if (!event.target.classList.contains('minify')) {
            event.target.classList.add('minify');
            event.target.innerHTML = 'Full version';
            minTable.classList.remove('hidden');
            fullTable.classList.add('hidden');
            minBtn.classList.add('hidden');
            maxBtn.classList.add('hidden');
        } else {
            event.target.classList.remove('minify');
            event.target.innerHTML = 'Compact version';
            minTable.classList.add('hidden');
            fullTable.classList.remove('hidden');
            minBtn.classList.remove('hidden');
            maxBtn.classList.remove('hidden');
        }
        painter.refresh();
        removeBtnsAddListener();
    });
    
    
    function removeBtnsAddListener() {
        let removeBtns = document.getElementsByClassName('remove-btn');
        for(let i=0; i<removeBtns.length; i++) {
            removeBtns[i].addEventListener('click', (event) => {
                event.preventDefault();
                manager.removeCity(+event.target.parentElement.parentElement.id);
                painter.refresh();
                removeBtnsAddListener();
            });
        }
    }

    /* === Генератор ID === */
    function* generateId() {
        let n = 1;
        while (true) {
            yield n++;
        }
    }

})();