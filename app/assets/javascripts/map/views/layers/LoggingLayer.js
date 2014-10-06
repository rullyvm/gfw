/**
 * The Logging layer module.
 *
 * @return LoggingLayer class (extends CartoDBLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
], function(CartoDBLayerClass) {

  'use strict';

  var LoggingLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT \'logging\' as tablename, cartodb_id, the_geom_webmercator, company, country, area_ha, name, source,status, \'{tableName}\' AS layer, {analysis} AS analysis FROM {tableName}',
      infowindow: true,
      interactivity: 'cartodb_id, tablename, name, company, country, permit_num, nat_origin, area_ha, analysis',
      analysis: true
    }

  });

  return LoggingLayer;

});
