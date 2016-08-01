;(function() {
    'use strict';

    /* ================== Begin Classes ================== */
    class Painter {
        constructor() {
            this.arrOfCities = [];
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
        set(arrOfCities = []) {
            this.arrOfCities = arrOfCities;
        }
    }

    class CitiesManager {
        constructor() {
            this.arrOfCities = [];
        }
        addCity(nameArg, streetArg, countHousesArg) {
            let id = this.genId(),
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
        set(arrOfCities = []) {
            let length = arrOfCities.length;
            if (length !== 0) {
                this.arrOfCities = arrOfCities;
                this.genId = this.generateId(this.arrOfCities[length-1].id + 1);
            } else {
                this.genId = this.generateId();
            }
        }
        /* === Генератор ID === */
        generateId(nowId = 1) {
            let n = nowId;
            return function() {
                return n++;
            }
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

    let dataManager = {
        arrOfCities: [],
        httpGet() {
            fetch('https://cities-manager.firebaseio.com/cities.json', {method: 'GET'})
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    if (data) { this.arrOfCities = data.slice(); } 
                    console.log(this.arrOfCities);
                    return this.arrOfCities;
                })
                .then(arr => {
                    manager.set(arr);
                    painter.set(arr);
                    painter.refresh();
                })
                .catch(error => {
                    console.log(error);
                });
        },
        httpPut(arr) {
            fetch('https://cities-manager.firebaseio.com/cities.json', {method: 'PUT', body: JSON.stringify(arr)})
                .catch(error => {
                    console.log(error);
                });
        }
    }

    let manager = new CitiesManager(),    // создаем объект класса CityManager
        painter = new Painter();          // создаем объект класса Painter

    dataManager.httpGet();                // получаем данные с сервера

    /* ================ Тестовые данные ================ */
    // manager.addCity('Samara', 'Lenina', 45);
    // manager.addCity('Togliatti', 'Zavodskaya', 67);
    // manager.addCity('Chapaevsk', 'Zheleznodorozhnaya', 37);
    /* ================ =============== ================ */

    let minBtn = document.getElementById('find-min'),
        maxBtn = document.getElementById('find-max'),
        addBtn = document.getElementById('addCity'),
        minifyBtn = document.getElementById('minify-btn'),
        minTable = document.getElementById('minifyTable'),
        fullTable = document.getElementById('cityTable');

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
        dataManager.httpPut(manager.get());
        painter.refresh();
    });

    minifyBtn.addEventListener("click", (event) => {
        event.preventDefault();
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
    });
    
    /* === Обработчик для кнопок REMOVE === */
    fullTable.addEventListener('click', (event) => {
        let target = event.target;
        while (target.tagName !== 'TABLE') {
            if (target.tagName === 'BUTTON' && target.classList.contains('remove-btn')) {
                event.preventDefault();
                manager.removeCity(+target.parentElement.parentElement.id);
                dataManager.httpPut(manager.get());
                painter.refresh();
                return;
            }
            target = target.parentNode;
        }
    });

})();