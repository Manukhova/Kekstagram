'use strict';

var load = require('./load');
var gallery = require('./gallery');
var Picture = require('./get-picture-element');
var footer = document.querySelector('footer');
var container = document.querySelector('.pictures');
var filters = document.querySelector('.filters');
var activeFilter = localStorage.getItem('filter');

if (!activeFilter) {
  localStorage.setItem('filter', 'filter-popular');
  activeFilter = localStorage.getItem('filter');
}

document.getElementById(activeFilter).checked = true;
var pageSize = 12;
var pageNumber = 0;

var getPictures = function(pictures) {
  gallery.setPictures(pictures);
  pictures.forEach(function(picture, i) {
  // pictures.forEach(function(picture) {
    var photoElement = new Picture(picture, i);
    // photoElement.onclick = function(event) {
    //   event.preventDefault();
    //   gallery.show(i);
    //   photoElement.onclick = null;
    // };
  });
};

function throttle(func, ms) {
  return function() {
    var savedThis = this;
    var savedArgs = arguments;

    setTimeout(function() {
      func.apply(savedThis, savedArgs);
    }, ms);
  };
}

var optimizedScroll = throttle(function() {
  if (footer.getBoundingClientRect().bottom - window.innerHeight <= 100) {
    loadPictures(activeFilter, ++pageNumber);
  }
}, 100);

window.addEventListener('scroll', optimizedScroll);

var loadPictures = function(filter, currentPageNumber) {
  load('/api/pictures', {
    from: currentPageNumber * pageSize,
    to: currentPageNumber * pageSize + pageSize,
    filter: filter
  }, getPictures);
};

var changeFilter = function(filterID) {
  container.innerHTML = '';
  activeFilter = filterID;
  localStorage.setItem('filter', filterID);
  pageNumber = 0;
  loadPictures(filterID, pageNumber);
};

filters.addEventListener('change', function(evt) {
  if(evt.target.classList.contains('filters-radio')) {
    changeFilter(evt.target.id);
  }
}, true);

module.exports = loadPictures;
