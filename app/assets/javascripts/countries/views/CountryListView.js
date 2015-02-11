/**
 * The Feed view.
 */
define([
  'jquery',
  'backbone',
  'underscore',
  'amplify',
  'd3',
  'mps',
  'countries/helpers/CountryHelper'

], function($, Backbone, _, amplify, d3, mps, CountryHelper) {

  'use strict';

  var CountryListView = Backbone.View.extend({

    el: '#countryListView',

    events : {
      'keyup #searchCountry' : '_searchCountries'
    },

    initialize: function() {
      if (!this.$el.length) {
        return
      }

      this.$searchBox = $('#searchCountry');
      this.$countries = $('.country');
      this.helper = CountryHelper;
      this.countries_topology = amplify.store('countries_topology');

      // INITS
      this.$searchBox.focus();
      this._getListCountries();
      this._storeCountries();
      this._searchCountries();
    },

    _getListCountries : function(){
      this.countries_list = _.map($('.country-name'),function(el){
        return $(el).text();
      });
    },

    _searchCountries : function(e){
      var searchText = this.$searchBox.val(),
          val = $.trim(searchText).replace(/ +/g, ' ').toLowerCase(),
          count = [];

      this.$countries.show().filter(function() {
          var text = $(this).find('.country-name').text().replace(/\s+/g, ' ').toLowerCase();
          (text.indexOf(val) != -1) ? count.push($(this)) : null;
          return !~text.indexOf(val);
      }).hide();

      (count.length == 1) ? this.$searchBox.addClass('is-active') : this.$searchBox.removeClass('is-active');

      if (e) {
        if (e.keyCode == 13 && count.length == 1) {
          var href = $(count[0]).find('.country-href').attr('href');
          window.location = href;
        }
      }
    },

    _storeCountries: function() {
      var that = this;
      // Check if topology of all countries is stored in localStorage
      if (this.countries_topology) {
        this.drawCountries();
      }else{
        var sql = ['SELECT c.iso, c.enabled, m.the_geom',
                   'FROM ne_50m_admin_0_countries m, gfw2_countries c',
                   'WHERE c.iso = m.adm0_a3 AND c.enabled',
                   '&format=topojson'].join(' ');

        d3.json('https://wri-01.cartodb.com/api/v2/sql?q='+sql, _.bind(function(error, topology) {
          this.countries_topology = topology;
          amplify.store('countries_topology', topology);
          this.drawCountries();
        }, this ));

      }
    },

    drawCountries: function () {
      for (var i = 0; i < Object.keys(this.countries_topology.objects).length; i++) {
        var iso = this.countries_topology.objects[i].properties.iso;
        var bounds = this.helper.draw(this.countries_topology, i, iso, { alerts: false });
      }
    },

    // _drawCountries: function() {
    //   var that = this;

    //   var sql = ['SELECT c.iso, c.enabled, m.the_geom',
    //              'FROM ne_50m_admin_0_countries m, gfw2_countries c',
    //              'WHERE c.iso = m.adm0_a3 AND c.enabled',
    //              '&format=topojson'].join(' ');

    //   var sql_ = ['SELECT c.iso, m.the_geom',
    //               'FROM ne_50m_admin_0_countries m, gfw2_countries c',
    //               'WHERE c.iso = m.adm0_a3',
    //               "AND c.iso = 'TWN'&format=topojson"].join(' ');

    //   if (this.countries_topology) {
    //     console.log(this.countries_topology);
    //   }


    //   d3.json('https://wri-01.cartodb.com/api/v2/sql?q='+sql, _.bind(function(error, topology) {
    //     amplify.store('countries_topology', topology);
    //     for (var i = 0; i < Object.keys(topology.objects).length; i++) {
    //       var iso = topology.objects[i].properties.iso;

    //       var bounds = this.helper.draw(topology, i, iso, { alerts: false });
    //       if (iso === 'CHN') {
    //         that.bounds = bounds;

    //         d3.json('https://wri-01.cartodb.com/api/v2/sql?q='+sql_, _.bind(function(error, topology) {
    //           this.helper.draw(topology, 0, 'CHN', { alerts: false, bounds: that.bounds});
    //         }, this ));
    //       }
    //     }
    //   }, this ));
    // }


  });
  return CountryListView;

});
