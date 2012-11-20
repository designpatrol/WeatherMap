// Generated by CoffeeScript 1.3.3
(function() {
  var $, Ajax, AutoComplete, Cities, City, Geocoder, LocalStorage, Maps, WeatherMapPresenter,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  WeatherMapPresenter = (function() {

    WeatherMapPresenter.eventTestInstance = null;

    WeatherMapPresenter.localStorageInstance = null;

    WeatherMapPresenter.mapInstance = null;

    WeatherMapPresenter.cities = null;

    function WeatherMapPresenter() {
      this.handleAutocompleteLocationNotFound = __bind(this.handleAutocompleteLocationNotFound, this);

      this.handleAutocompleteAddCity = __bind(this.handleAutocompleteAddCity, this);

      this.handleLocationRemovedFromMap = __bind(this.handleLocationRemovedFromMap, this);

      this.handleCitiesIsUnknown = __bind(this.handleCitiesIsUnknown, this);

      this.handleCityRefreshError = __bind(this.handleCityRefreshError, this);

      this.handleCityWasRefreshed = __bind(this.handleCityWasRefreshed, this);

      this.handleAllCitiesLoaded = __bind(this.handleAllCitiesLoaded, this);

      this.handleNewCityLoaded = __bind(this.handleNewCityLoaded, this);
      this.initialize();
      this.run();
    }

    WeatherMapPresenter.prototype.initialize = function() {
      var gmapInstance,
        _this = this;
      this.cities = new Cities;
      this.cities.addListener(Cities.CITIES_NEW, this.handleNewCityLoaded);
      this.cities.addListener(Cities.CITIES_COMPLETE, this.handleAllCitiesLoaded);
      this.cities.addListener(Cities.CITIES_UPDATE, this.handleCityWasRefreshed);
      this.cities.addListener(Cities.CITIES_FAILURE, this.handleCityRefreshError);
      this.cities.addListener(Cities.CITIES_UNKNOWN, this.handleCitiesIsUnknown);
      this.mapInstance = new Maps('container');
      this.mapInstance.addListener(Maps.LOCATION_IS_REMOVED, this.handleLocationRemovedFromMap);
      this.autocompleteInstance = new AutoComplete('searchbox');
      this.autocompleteInstance.addListener(AutoComplete.AUTOCOMPLETE_QUERY, this.handleAutocompleteAddCity);
      this.autocompleteInstance.addListener(AutoComplete.AUTOCOMPLETE_NOTFOUND, this.handleAutocompleteLocationNotFound);
      gmapInstance = this.mapInstance.getGoogleMapsInstance();
      this.autocompleteInstance.bindToGoogleMap(gmapInstance);
      return $('.blue-pill').bind('click', function(e) {
        return _this.cities.coldRefreshForecasts();
      });
    };

    WeatherMapPresenter.prototype.run = function() {
      return this.cities.populate();
    };

    WeatherMapPresenter.prototype.handleNewCityLoaded = function(params) {
      return this.mapInstance.addCityToMap(params);
    };

    WeatherMapPresenter.prototype.handleAllCitiesLoaded = function() {
      return this.cities.mildRefreshForecasts();
    };

    WeatherMapPresenter.prototype.handleCityWasRefreshed = function(params) {
      return this.mapInstance.updateCity(params);
    };

    WeatherMapPresenter.prototype.handleCityRefreshError = function(params) {
      return console.log("Failed updating forecast for " + params.name);
    };

    WeatherMapPresenter.prototype.handleCitiesIsUnknown = function(params) {
      return console.log("Could not geolocate " + params.name);
    };

    WeatherMapPresenter.prototype.handleLocationRemovedFromMap = function(cityID) {
      return this.cities.removeCity(cityID);
    };

    WeatherMapPresenter.prototype.handleAutocompleteAddCity = function(cityName) {
      return this.cities.generateIdAndAddCity(cityName);
    };

    WeatherMapPresenter.prototype.handleAutocompleteLocationNotFound = function() {
      return console.log('Location not found');
    };

    return WeatherMapPresenter;

  })();

  /* --------------------------------------------
       Begin utils.coffee
  --------------------------------------------
  */


  Date.prototype.yyyymmdd = function() {
    var RE_findSingleDigits, dateStamp;
    dateStamp = [this.getFullYear(), this.getMonth() + 1, this.getDate()].join("-");
    RE_findSingleDigits = /\b(\d)\b/g;
    dateStamp = dateStamp.replace(RE_findSingleDigits, "0$1");
    dateStamp.replace(/\s/g, "");
    return dateStamp;
  };

  /* --------------------------------------------
       Begin start.coffee
  --------------------------------------------
  */


  document.addEventListener('DOMContentLoaded', function() {
    return window.weatherMapPresenter = new WeatherMapPresenter;
  }, false);

  /* --------------------------------------------
       Begin EventEmitter.coffee
  --------------------------------------------
  */


  (function(exports) {
    var EventEmitter, indexOfListener, nativeIndexOf, proto;
    EventEmitter = function() {};
    indexOfListener = function(listener, listeners) {
      var i;
      if (nativeIndexOf) {
        return listeners.indexOf(listener);
      }
      i = listeners.length;
      if ((function() {
        var _results;
        _results = [];
        while (i--) {
          _results.push(listeners[i] === listener);
        }
        return _results;
      })()) {
        return i;
      }
    };
    proto = EventEmitter.prototype;
    nativeIndexOf = (Array.prototype.indexOf ? true : false);
    proto.getListeners = function(evt) {
      var events;
      events = this._events || (this._events = {});
      return events[evt] || (events[evt] = []);
    };
    proto.addListener = function(evt, listener) {
      var listeners;
      listeners = this.getListeners(evt);
      if (indexOfListener(listener, listeners) === -1) {
        listeners.push(listener);
      }
      return this;
    };
    proto.removeListener = function(evt, listener) {
      var index, listeners;
      listeners = this.getListeners(evt);
      index = indexOfListener(listener, listeners);
      if (index !== -1) {
        listeners.splice(index, 1);
        if (listeners.length === 0) {
          this._events[evt] = null;
        }
      }
      return this;
    };
    proto.addListeners = function(evt, listeners) {
      return this.manipulateListeners(false, evt, listeners);
    };
    proto.removeListeners = function(evt, listeners) {
      return this.manipulateListeners(true, evt, listeners);
    };
    proto.manipulateListeners = function(remove, evt, listeners) {
      var i, multiple, single, value;
      i = void 0;
      value = void 0;
      single = (remove ? this.removeListener : this.addListener);
      multiple = (remove ? this.removeListeners : this.addListeners);
      if (typeof evt === "object") {
        for (i in evt) {
          if (evt.hasOwnProperty(i) && (value = evt[i])) {
            if (typeof value === "function") {
              single.call(this, i, value);
            } else {
              multiple.call(this, i, value);
            }
          }
        }
      } else {
        i = listeners.length;
        while (i--) {
          single.call(this, evt, listeners[i]);
        }
      }
      return this;
    };
    proto.removeEvent = function(evt) {
      if (evt) {
        this._events[evt] = null;
      } else {
        this._events = null;
      }
      return this;
    };
    proto.emitEvent = function(evt, args) {
      var i, listeners, response;
      listeners = this.getListeners(evt);
      i = listeners.length;
      response = void 0;
      while (i--) {
        response = (args ? listeners[i].apply(null, args) : listeners[i]());
        if (response === true) {
          this.removeListener(evt, listeners[i]);
        }
      }
      return this;
    };
    return exports.EventEmitter = EventEmitter;
  })(this);

  /* --------------------------------------------
       Begin LocalStorage.coffee
  --------------------------------------------
  */


  LocalStorage = (function(_super) {

    __extends(LocalStorage, _super);

    function LocalStorage() {
      return LocalStorage.__super__.constructor.apply(this, arguments);
    }

    LocalStorage.prototype.store = function(key, data) {
      return localStorage.setItem(key, JSON.stringify(data));
    };

    LocalStorage.prototype.retrieve = function(key) {
      var parsedObject, retrievedObject;
      retrievedObject = localStorage.getItem(key);
      parsedObject = JSON.parse(retrievedObject);
      return parsedObject;
    };

    LocalStorage.prototype.remove = function(key) {
      return localStorage.removeItem(key);
    };

    return LocalStorage;

  })(EventEmitter);

  /* --------------------------------------------
       Begin Ajax.coffee
  --------------------------------------------
  */


  Ajax = (function(_super) {
    var endPoint;

    __extends(Ajax, _super);

    Ajax.LOAD_FAILED = 'ajax_load_failed';

    Ajax.LOAD_SUCCESS = 'ajax_load_success';

    endPoint = null;

    function Ajax(uri) {
      endPoint = uri;
    }

    Ajax.prototype.perform = function(queryObject) {
      var _this = this;
      return jQuery.ajax({
        url: endPoint,
        type: 'GET',
        dataType: 'jsonp',
        data: queryObject,
        error: function(jqXHR, textStatus, errorThrown) {
          return _this.emitEvent(Ajax.LOAD_FAILED, [textStatus]);
        },
        success: function(data, textStatus, jqXHR) {
          return _this.emitEvent(Ajax.LOAD_SUCCESS, [data]);
        }
      });
    };

    return Ajax;

  })(EventEmitter);

  /* --------------------------------------------
       Begin AutoComplete.coffee
  --------------------------------------------
  */


  $ = jQuery;

  AutoComplete = (function(_super) {

    __extends(AutoComplete, _super);

    AutoComplete.AUTOCOMPLETE_QUERY = "autocomplete_query_string";

    AutoComplete.AUTOCOMPLETE_NOTFOUND = "autocomplete_query_not_found";

    AutoComplete.autocompleteInstance = null;

    AutoComplete.element = null;

    AutoComplete.selectorID = null;

    function AutoComplete(inputSelectorID) {
      this.handleAutocomplete = __bind(this.handleAutocomplete, this);

      var autocompleteOptions;
      this.selectorID = inputSelectorID;
      this.element = ($('#' + inputSelectorID))[0];
      autocompleteOptions = {
        types: ['(cities)']
      };
      this.autocompleteInstance = new google.maps.places.Autocomplete(this.element, autocompleteOptions);
    }

    AutoComplete.prototype.bindToGoogleMap = function(gmapInstance) {
      this.autocompleteInstance.bindTo('bounds', gmapInstance);
      return google.maps.event.addListener(this.autocompleteInstance, 'place_changed', this.handleAutocomplete);
    };

    AutoComplete.prototype.handleAutocomplete = function() {
      var component, country, locality, place, placeName, _i, _len, _ref;
      place = this.autocompleteInstance.getPlace();
      if (!place.geometry) {
        this.emitEvent(AutoComplete.AUTOCOMPLETE_NOTFOUND, []);
        return;
      }
      _ref = place.address_components;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        component = _ref[_i];
        if (__indexOf.call(component.types, 'locality') >= 0 && !locality) {
          locality = component.long_name;
        }
        if (__indexOf.call(component.types, 'country') >= 0 && !country) {
          country = component.long_name;
        }
      }
      placeName = locality + ', ' + country;
      console.log(place);
      this.emitEvent(AutoComplete.AUTOCOMPLETE_QUERY, [placeName]);
      return false;
    };

    return AutoComplete;

  })(EventEmitter);

  /* --------------------------------------------
       Begin Geocoder.coffee
  --------------------------------------------
  */


  Geocoder = (function(_super) {
    var instance, location;

    __extends(Geocoder, _super);

    Geocoder.SUCCESS = 'geocoder_success';

    Geocoder.FAILURE = 'geocoder_failure';

    location = null;

    instance = null;

    function Geocoder(city) {
      location = city;
      instance = new google.maps.Geocoder;
    }

    Geocoder.prototype.perform = function() {
      var geocoderParams, results,
        _this = this;
      console.log("Geocoder performing: " + location);
      geocoderParams = {
        address: location
      };
      return results = instance.geocode(geocoderParams, function(results, status) {
        var component, country, locality, output, result, _i, _j, _len, _len1, _ref;
        if (status === google.maps.GeocoderStatus.OK) {
          locality = '';
          country = '';
          for (_i = 0, _len = results.length; _i < _len; _i++) {
            result = results[_i];
            _ref = result.address_components;
            for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
              component = _ref[_j];
              if (__indexOf.call(component.types, 'locality') >= 0 && !locality) {
                locality = component.long_name;
              }
              if (__indexOf.call(component.types, 'country') >= 0 && !country) {
                country = component.long_name;
              }
            }
          }
          output = {
            'location': locality + ', ' + country,
            'coordinates': {
              'latitude': results[0].geometry.location.lat(),
              'longitude': results[0].geometry.location.lng()
            }
          };
          return _this.emitEvent(Geocoder.SUCCESS, [output]);
        } else {
          return _this.emitEvent(Geocoder.FAILURE);
        }
      });
    };

    return Geocoder;

  })(EventEmitter);

  /* --------------------------------------------
       Begin City.coffee
  --------------------------------------------
  */


  City = (function(_super) {

    __extends(City, _super);

    City.id = null;

    City.location = null;

    City.coordinates = null;

    City.forecast = null;

    City.isGeolocated = null;

    City.hasForecast = null;

    City.weatherAPI = null;

    City.CITY_LOADED = "city_cache_loaded";

    City.CITY_UNKNOWN = "city_is_unknown";

    City.CITY_FORECAST_FAILED = "city_forecast_failed";

    City.CITY_FORECAST_SUCCESS = "city_forecast_success";

    function City(params) {
      this.forecastFailure = __bind(this.forecastFailure, this);

      this.forecastSuccess = __bind(this.forecastSuccess, this);

      this.geolocationFailure = __bind(this.geolocationFailure, this);

      this.geolocationSuccess = __bind(this.geolocationSuccess, this);
      this.id = params.id;
      this.location = params.name;
      this.forecast = {};
      this.coordinates = null;
      this.hasForecast = false;
      this.isGeolocated = false;
      this.weatherAPI = "http://free.worldweatheronline.com/feed/weather.ashx";
    }

    City.prototype.populate = function() {
      var isInitialized;
      isInitialized = this.cacheLoad();
      if (isInitialized) {
        return this.emitEvent(City.CITY_LOADED, [this]);
      }
    };

    City.prototype.cacheLoad = function() {
      var data, loaded, validForecast;
      loaded = false;
      if (this.id != null) {
        data = this.retrieve(this.id);
        if (data != null) {
          this.isGeolocated = this.populateCoordinates(data);
          if (!this.isGeolocated) {
            this.geolocateMe();
          } else {
            loaded = true;
            if ((data.forecast != null) && (data.forecast.current != null)) {
              this.forecast = data.forecast;
              validForecast = this.hasValidForecast();
              if (validForecast) {
                this.hasForecast = true;
              }
            }
          }
        } else {
          this.geolocateMe();
        }
      }
      return loaded;
    };

    City.prototype.cacheSave = function() {
      var saved;
      saved = false;
      if (this.id != null) {
        this.store(this.id, this);
        saved = true;
      }
      return saved;
    };

    City.prototype.destroy = function() {
      this.remove(this.id);
      this.isGeolocated = false;
      this.hasForecast = false;
      return this.forecast = {};
    };

    City.prototype.populateCoordinates = function(data) {
      var foundCoordinates;
      foundCoordinates = false;
      if (data.coordinates != null) {
        this.location = data.location;
        this.coordinates = {};
        this.coordinates.latitude = data.coordinates.latitude;
        this.coordinates.longitude = data.coordinates.longitude;
        foundCoordinates = true;
      }
      return foundCoordinates;
    };

    City.prototype.geolocateMe = function() {
      var coder;
      this.forecast = {};
      this.hasForecast = false;
      coder = new Geocoder(this.location);
      coder.addListener(Geocoder.SUCCESS, this.geolocationSuccess);
      coder.addListener(Geocoder.FAILURE, this.geolocationFailure);
      return coder.perform();
    };

    City.prototype.geolocationSuccess = function(data) {
      this.location = data.location;
      this.isGeolocated = this.populateCoordinates(data);
      this.cacheSave();
      return this.emitEvent(City.CITY_LOADED, [this]);
    };

    City.prototype.geolocationFailure = function(text) {
      return this.emitEvent(City.CITY_UNKNOWN, [this]);
    };

    City.prototype.refreshForecast = function() {
      var params, request;
      console.log("Refreshing forecast for: " + this.location);
      request = new Ajax(this.weatherAPI);
      request.addListener(Ajax.LOAD_SUCCESS, this.forecastSuccess);
      request.addListener(Ajax.LOAD_FAILED, this.forecastFailure);
      params = {
        'q': this.location,
        'format': 'json',
        'num_of_days': 2,
        'key': 'bbfbbfb160072942122708'
      };
      return request.perform(params);
    };

    City.prototype.forecastSuccess = function(result) {
      if (!(result.data.error != null)) {
        this.populateForecast(result.data);
        this.hasForecast = true;
        this.cacheSave();
        return this.emitEvent(City.CITY_FORECAST_SUCCESS, [this]);
      } else {
        return this.emitEvent(City.CITY_FORECAST_FAILED, [this]);
      }
    };

    City.prototype.forecastFailure = function(data) {
      return this.emitEvent(City.CITY_FORECAST_FAILED, [this]);
    };

    City.prototype.populateForecast = function(data) {
      var currentForecast, dayforecast, newForecast, _i, _len, _ref, _results;
      currentForecast = {
        'date': data.weather[0].date,
        'time': data.current_condition[0].observation_time,
        'precip_mm': data.current_condition[0].precipMM,
        'temp': {
          'f': data.current_condition[0].temp_F,
          'c': data.current_condition[0].temp_C
        },
        'visibility': data.current_condition[0].visibility,
        'description': data.current_condition[0].weatherDesc[0].value,
        'icon': data.current_condition[0].weatherIconUrl[0].value,
        'wind': {
          'm': data.current_condition[0].windspeedMiles,
          'km': data.current_condition[0].windspeedKmph,
          'direction': data.current_condition[0].winddir16Point
        },
        'clouds': data.current_condition[0].cloudcover,
        'humidity': data.current_condition[0].humidity,
        'pressure': data.current_condition[0].pressure
      };
      this.forecast.current = currentForecast;
      this.forecast.days = {};
      _ref = data.weather;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        dayforecast = _ref[_i];
        newForecast = {
          'date': dayforecast.date,
          'precip_mm': dayforecast.precipMM,
          'temp_min': {
            'f': dayforecast.tempMinF,
            'c': dayforecast.tempMinC
          },
          'temp_max': {
            'f': dayforecast.tempMaxF,
            'c': dayforecast.tempMaxC
          },
          'description': dayforecast.weatherDesc[0].value,
          'icon': dayforecast.weatherIconUrl[0].value,
          'wind': {
            'm': dayforecast.windspeedMiles,
            'km': dayforecast.windspeedKmph,
            'direction': dayforecast.winddir16Point
          }
        };
        this.forecast.days[dayforecast.date] = newForecast;
        _results.push(newForecast = null);
      }
      return _results;
    };

    City.prototype.hasValidForecast = function() {
      var currentDate, status;
      status = false;
      currentDate = new Date;
      currentDate = currentDate.yyyymmdd();
      if (this.forecast && this.forecast['current']) {
        if (this.forecast.current.date === currentDate) {
          status = true;
        }
      }
      return status;
    };

    City.prototype.getForecastOverview = function() {
      var contentText, validForecast;
      contentText = this.location;
      validForecast = this.hasValidForecast();
      if (validForecast) {
        contentText = this.location + ' at ' + this.forecast.current.time + ': ' + this.forecast.current.temp.c + '&deg;C, ' + this.forecast.current.description;
      }
      return contentText;
    };

    City.prototype.showData = function() {};

    return City;

  })(LocalStorage);

  /* --------------------------------------------
       Begin Cities.coffee
  --------------------------------------------
  */


  Cities = (function(_super) {
    var cacheKey, defaults, loadCount;

    __extends(Cities, _super);

    cacheKey = null;

    Cities.autoIncrement = null;

    Cities.locations = null;

    Cities.cityDescriptors = null;

    defaults = ['Dublin', 'London', 'Paris', 'Barcelona'];

    loadCount = null;

    Cities.CITIES_NEW = "city_new_added";

    Cities.CITIES_COMPLETE = "cities_are_loaded";

    Cities.CITIES_UPDATE = "city_forecast_update";

    Cities.CITIES_FAILURE = "city_forecast_error";

    Cities.CITIES_UNKNOWN = "city_unknown";

    function Cities() {
      this.handleCityForecastFail = __bind(this.handleCityForecastFail, this);

      this.handleCityForecastSuccess = __bind(this.handleCityForecastSuccess, this);

      this.handleCityUnknown = __bind(this.handleCityUnknown, this);

      this.handleCityLoaded = __bind(this.handleCityLoaded, this);
      cacheKey = 'cities';
      this.locations = {};
      this.cityDescriptors = [];
      this.autoIncrement = 0;
      loadCount = 0;
    }

    Cities.prototype.cacheSave = function() {
      var cacheObject;
      cacheObject = {
        'autoIncrement': this.autoIncrement,
        'cities': this.cityDescriptors
      };
      return this.store(cacheKey, cacheObject);
    };

    Cities.prototype.populate = function() {
      var cityDescriptor, cityName, data, i, params, _i, _j, _len, _len1, _ref, _results;
      data = this.retrieve(cacheKey);
      if ((data != null) && (data.autoIncrement != null) && (data.cities != null)) {
        this.autoIncrement = data.autoIncrement;
        this.cityDescriptors = data.cities;
      } else {
        i = 0;
        for (_i = 0, _len = defaults.length; _i < _len; _i++) {
          cityName = defaults[_i];
          i++;
          this.cityDescriptors.push({
            'id': i,
            'name': cityName
          });
        }
        this.autoIncrement = i + 1;
        this.cacheSave();
      }
      _ref = this.cityDescriptors;
      _results = [];
      for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
        cityDescriptor = _ref[_j];
        params = {
          id: cityDescriptor.id,
          name: cityDescriptor.name
        };
        _results.push(this.addCityToStructure(params));
      }
      return _results;
    };

    Cities.prototype.addCityToStructure = function(params) {
      var city;
      city = new City(params);
      city.addListener(City.CITY_LOADED, this.handleCityLoaded);
      city.addListener(City.CITY_UNKNOWN, this.handleCityUnknown);
      city.addListener(City.CITY_FORECAST_SUCCESS, this.handleCityForecastSuccess);
      city.addListener(City.CITY_FORECAST_FAILED, this.handleCityForecastFail);
      return city.populate();
    };

    Cities.prototype.generateIdAndAddCity = function(cityName) {
      var cityID, params;
      if (!this.cityExists(cityName)) {
        cityID = this.autoIncrement;
        this.cityDescriptors.push({
          'id': cityID,
          'name': cityName
        });
        this.autoIncrement++;
        this.cacheSave();
        params = {
          id: cityID,
          name: cityName
        };
        return this.addCityToStructure(params);
      }
    };

    Cities.prototype.cityExists = function(cityName) {
      var descriptor, _i, _len, _ref;
      _ref = this.cityDescriptors;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        descriptor = _ref[_i];
        if (cityName === descriptor.name) {
          return true;
        }
      }
      return false;
    };

    Cities.prototype.removeCity = function(cityID) {
      var realCityID;
      realCityID = parseInt(cityID, 10);
      this.cityDescriptors = this.cityDescriptors.filter(function(descriptor) {
        return descriptor.id !== realCityID;
      });
      if (this.locations[cityID]) {
        this.locations[cityID].destroy();
        delete this.locations[cityID];
      }
      this.cacheSave();
      return loadCount--;
    };

    Cities.prototype.handleCityLoaded = function(cityData) {
      var descriptor, i, params, _i, _len, _ref;
      i = 0;
      _ref = this.cityDescriptors;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        descriptor = _ref[_i];
        if (cityData.id === descriptor.id) {
          this.cityDescriptors[i].name = cityData.location;
        }
        i++;
      }
      this.cacheSave();
      this.locations[cityData.id] = cityData;
      params = {
        id: cityData.id,
        name: cityData.location,
        coords: cityData.coordinates,
        overview: cityData.getForecastOverview(),
        forecast: cityData.forecast
      };
      this.emitEvent(Cities.CITIES_NEW, [params]);
      loadCount++;
      if (loadCount >= this.cityDescriptors.length) {
        return this.emitEvent(Cities.CITIES_COMPLETE, []);
      }
    };

    Cities.prototype.handleCityUnknown = function(cityData) {
      var params;
      params = {
        id: cityData.id,
        name: cityData.location
      };
      return this.emitEvent(Cities.CITIES_UNKNOWN, [params]);
    };

    Cities.prototype.handleCityForecastSuccess = function(cityData) {
      var params, status;
      params = {
        id: cityData.id,
        name: cityData.location,
        coords: cityData.coordinates,
        overview: cityData.getForecastOverview(),
        forecast: cityData.forecast
      };
      status = cityData.hasValidForecast();
      if (status) {
        return this.emitEvent(Cities.CITIES_UPDATE, [params]);
      } else {
        return this.emitEvent(Cities.CITIES_FAILURE, [params]);
      }
    };

    Cities.prototype.handleCityForecastFail = function(cityData) {
      var params;
      params = {
        id: cityData.id,
        name: cityData.location,
        coords: cityData.coordinates,
        overview: cityData.getForecastOverview()
      };
      return this.emitEvent(Cities.CITIES_FAILURE, [params]);
    };

    Cities.prototype.coldRefreshForecasts = function() {
      var city, cityID, _results;
      _results = [];
      for (cityID in this.locations) {
        city = this.locations[cityID];
        _results.push(city.refreshForecast());
      }
      return _results;
    };

    Cities.prototype.mildRefreshForecasts = function() {
      var city, cityID, validForecast, _results;
      _results = [];
      for (cityID in this.locations) {
        city = this.locations[cityID];
        validForecast = city.hasValidForecast();
        if (!validForecast) {
          _results.push(city.refreshForecast());
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Cities.prototype.showData = function() {
      return console.log(this);
    };

    return Cities;

  })(LocalStorage);

  /* --------------------------------------------
       Begin Maps.coffee
  --------------------------------------------
  */


  $ = jQuery;

  Maps = (function(_super) {

    __extends(Maps, _super);

    Maps.parentSelectorID = null;

    Maps.parentElement = null;

    Maps.mapInstance = null;

    Maps.markers = null;

    Maps.LOCATION_IS_REMOVED = "maps_location_removed_is_me";

    function Maps(selectorID) {
      var dublin, mapOptions;
      this.markers = [];
      this.parentSelectorID = selectorID;
      this.parentElement = ($('#' + selectorID))[0];
      window.mapsWrapper = this;
      dublin = new google.maps.LatLng(53.3494426, -6.260082499999953);
      mapOptions = {
        zoom: 4,
        center: dublin,
        maxZoom: 5,
        mapTypeId: google.maps.MapTypeId.TERRAIN
      };
      this.mapInstance = new google.maps.Map(this.parentElement, mapOptions);
    }

    Maps.prototype.getGoogleMapsInstance = function() {
      return this.mapInstance;
    };

    Maps.prototype.addCityToMap = function(params) {
      var box, forecastIcon, markerSymbol, myOptions;
      forecastIcon = this.addForecastIcon(params);
      myOptions = {
        id: params.id,
        content: forecastIcon,
        disableAutoPan: true,
        zIndex: null,
        pixelOffset: new google.maps.Size(6, -17),
        boxClass: 'tooltip',
        closeBoxURL: 'img/close.png',
        closeBoxMargin: '-25px -22px 0 0',
        position: new google.maps.LatLng(params.coords.latitude, params.coords.longitude),
        isHidden: false,
        pane: "floatPane",
        enableEventPropagation: false,
        map: this.mapInstance
      };
      box = new InfoBox(myOptions);
      markerSymbol = new google.maps.Marker({
        map: this.mapInstance,
        position: new google.maps.LatLng(params.coords.latitude, params.coords.longitude),
        visible: false
      });
      this.markers.push({
        'id': params.id,
        'city': params.name,
        'box': box,
        'symbol': markerSymbol
      });
      return this.placeMarkersOnMap();
    };

    Maps.prototype.addForecastIcon = function(params) {
      var boxText, contentText, currentForecast, day, forecastHolder, forecastImage, holder, prognoseFor;
      contentText = params.overview;
      boxText = $('<div></div>').attr('rel', params.id).html(contentText);
      if (params.forecast.current != null) {
        forecastImage = $('<img></img>').attr('src', params.forecast.current.icon).width(26);
        holder = $('<div></div>').addClass('forecast-icon');
        forecastImage.appendTo(holder);
        holder.appendTo(boxText);
      }
      if (params.forecast.days != null) {
        forecastHolder = $('<div></div>').addClass('forecast-prognose').addClass('hide').attr('id', 'prognose-' + params.id);
        for (day in params.forecast.days) {
          if (day === params.forecast.current.date) {
            prognoseFor = 'Today: ';
          } else {
            prognoseFor = 'Tomorrow: ';
          }
          currentForecast = params.forecast.days[day];
          contentText = prognoseFor + 'Min ' + currentForecast.temp_min.c + '&deg;C - Max ' + currentForecast.temp_max.c + '&deg;C, ' + currentForecast.description;
          holder = $('<div></div>').addClass('forecast').html(contentText);
          holder.appendTo(forecastHolder);
        }
        forecastHolder.appendTo(boxText);
      }
      boxText.bind('mouseover', function(e) {
        var elementID, parent;
        $('.tooltip').each(function() {
          return $(this).css('background-color', '#40506c');
        });
        parent = $(this).parent();
        parent.css('background-color', '#000');
        elementID = $(e.currentTarget).attr('rel');
        $('.forecast-prognose').each(function() {
          return $(this).removeClass('show').addClass('hide');
        });
        return $('#prognose-' + elementID).removeClass('hide').addClass('show');
      });
      return boxText[0];
    };

    Maps.prototype.updateCity = function(params) {
      var forecastIcon, marker, _i, _len, _ref, _results;
      if (this.markers.length) {
        _ref = this.markers;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          marker = _ref[_i];
          if (marker.id === params.id) {
            forecastIcon = this.addForecastIcon(params);
            _results.push(marker['box'].setContent(forecastIcon));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    };

    Maps.prototype.clearOverlays = function() {
      var marker, _i, _len, _ref, _results;
      $('.tooltip').each(function() {
        return $(this).css('background-color', '#40506c');
      });
      $('.forecast-prognose').each(function() {
        return $(this).removeClass('show').addClass('hide');
      });
      if (this.markers.length) {
        _ref = this.markers;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          marker = _ref[_i];
          google.maps.event.clearListeners(marker['box'], 'closeclick');
          marker['box'].close;
          _results.push(marker['symbol'].close);
        }
        return _results;
      }
    };

    Maps.prototype.placeMarkersOnMap = function() {
      var bounds, marker, position, _i, _len, _ref;
      this.clearOverlays();
      if (this.markers.length) {
        bounds = new google.maps.LatLngBounds;
        _ref = this.markers;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          marker = _ref[_i];
          position = marker['box'].getPosition();
          bounds.extend(position);
          google.maps.event.addListener(marker['box'], 'closeclick', this.locationRemoved);
          marker['box'].open(this.mapInstance, marker['symbol']);
        }
        return this.mapInstance.fitBounds(bounds);
      }
    };

    Maps.prototype.locationRemoved = function() {
      var cityID, content;
      content = this.getContent();
      cityID = $(content).attr('rel');
      return window.mapsWrapper.removeMarker(cityID);
    };

    Maps.prototype.removeMarker = function(cityID) {
      var marker, _i, _len, _ref;
      _ref = this.markers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        marker = _ref[_i];
        if (marker.id === +cityID) {
          google.maps.event.clearListeners(marker['box'], 'closeclick');
        }
      }
      this.markers = this.markers.filter(function(marker) {
        return marker.id !== +cityID;
      });
      this.emitEvent(Maps.LOCATION_IS_REMOVED, [cityID]);
      return this.placeMarkersOnMap();
    };

    return Maps;

  })(EventEmitter);

}).call(this);
