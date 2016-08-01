'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

;(function () {
    'use strict';

    /* ================== Begin Classes ================== */

    var Painter = function () {
        function Painter() {
            _classCallCheck(this, Painter);

            this.arrOfCities = [];
        }

        _createClass(Painter, [{
            key: 'refresh',
            value: function refresh() {
                // Перерисовка шаблона
                var templateHtml = document.getElementById('template').innerHTML,
                    templateHtmlMinify = document.getElementById('templateMinify').innerHTML,
                    compiled = _.template(templateHtml),
                    compiledMinify = _.template(templateHtmlMinify),
                    minTable = document.getElementById('minifyTable'),
                    fullTable = document.getElementById('cityTable'),
                    tableBody = document.getElementById("cityTableBody");

                if (minTable.classList.contains('hidden') && !fullTable.classList.contains('hidden')) {
                    tableBody.innerHTML = compiled({ items: this.arrOfCities });
                } else {
                    minTable.innerHTML = compiledMinify({ items: this.arrOfCities });
                }
            } // refresh

        }, {
            key: 'set',
            value: function set() {
                var arrOfCities = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

                this.arrOfCities = arrOfCities;
            }
        }]);

        return Painter;
    }();

    var CitiesManager = function () {
        function CitiesManager() {
            _classCallCheck(this, CitiesManager);

            this.arrOfCities = [];
        }

        _createClass(CitiesManager, [{
            key: 'addCity',
            value: function addCity(nameArg, streetArg, countHousesArg) {
                var id = this.genId(),
                    name = nameArg || document.getElementById('form-city').value,
                    street = streetArg || document.getElementById('form-street').value,
                    countHouses = countHousesArg || document.getElementById('form-count-houses').value;

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
                document.getElementById('' + minId).classList.add('min');
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
                document.getElementById('' + maxId).classList.add('max');
            }
        }, {
            key: 'get',
            value: function get() {
                return this.arrOfCities;
            }
        }, {
            key: 'set',
            value: function set() {
                var arrOfCities = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

                var length = arrOfCities.length;
                if (length !== 0) {
                    this.arrOfCities = arrOfCities;
                    this.genId = this.generateId(this.arrOfCities[length - 1].id + 1);
                } else {
                    this.genId = this.generateId();
                }
            }
            /* === Генератор ID === */

        }, {
            key: 'generateId',
            value: function generateId() {
                var nowId = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];

                var n = nowId;
                return function () {
                    return n++;
                };
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
    /* ==================== End Classes ==================== */

    var dataManager = {
        arrOfCities: [],
        httpGet: function httpGet() {
            var _this = this;

            fetch('https://cities-manager.firebaseio.com/cities.json', { method: 'GET' }).then(function (response) {
                return response.json();
            }).then(function (data) {
                if (data) {
                    _this.arrOfCities = data.slice();
                }
                console.log(_this.arrOfCities);
                return _this.arrOfCities;
            }).then(function (arr) {
                manager.set(arr);
                painter.set(arr);
                painter.refresh();
            }).catch(function (error) {
                console.log(error);
            });
        },
        httpPut: function httpPut(arr) {
            fetch('https://cities-manager.firebaseio.com/cities.json', { method: 'PUT', body: JSON.stringify(arr) }).catch(function (error) {
                console.log(error);
            });
        }
    };

    var manager = new CitiesManager(),
        // создаем объект класса CityManager
    painter = new Painter(); // создаем объект класса Painter

    dataManager.httpGet(); // получаем данные с сервера

    /* ================ Тестовые данные ================ */
    // manager.addCity('Samara', 'Lenina', 45);
    // manager.addCity('Togliatti', 'Zavodskaya', 67);
    // manager.addCity('Chapaevsk', 'Zheleznodorozhnaya', 37);
    /* ================ =============== ================ */

    var minBtn = document.getElementById('find-min'),
        maxBtn = document.getElementById('find-max'),
        addBtn = document.getElementById('addCity'),
        minifyBtn = document.getElementById('minify-btn'),
        minTable = document.getElementById('minifyTable'),
        fullTable = document.getElementById('cityTable');

    /* === Навешиваем обработчики на кнопки === */
    minBtn.addEventListener("click", function (event) {
        event.preventDefault();
        manager.findMin();
    });

    maxBtn.addEventListener("click", function (event) {
        event.preventDefault();
        manager.findMax();
    });

    addBtn.addEventListener("click", function (event) {
        event.preventDefault();
        manager.addCity();
        dataManager.httpPut(manager.get());
        painter.refresh();
    });

    minifyBtn.addEventListener("click", function (event) {
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
    fullTable.addEventListener('click', function (event) {
        var target = event.target;
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