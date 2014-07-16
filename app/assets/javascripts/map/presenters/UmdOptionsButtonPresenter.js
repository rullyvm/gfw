/**
 * The UmdOptionsButtonPresenter class for the UmdOptionsButtonView.
 *
 * @return UmdOptionsButtonPresenter class.
 */
define([
  'Class',
  'underscore',
  'mps'
], function(Class, _, mps) {

  'use strict';

  var UmdOptionsButtonPresenter = Class.extend({

    /**
     * Constructs new UmdOptionsButtonPresenter.
     *
     * @param  {UmdOptionsButtonView} view Instance of UmdOptionsButtonView
     *
     * @return {class} The UmdOptionsButtonPresenter class
     */
    init: function(view) {
      this.view = view;
      this.subscribe();
    },

    /**
     * Subscribe to application events.
     */
    subscribe: function() {
      mps.subscribe('Place/go', _.bind(function(place) {
        this.toggle(place.layerSpec);
      }, this)).length > 0;

      mps.subscribe('LayerNav/change', _.bind(function(layerSpec) {
        this.toggle(layerSpec);
      }, this))

      mps.subscribe('UmdOptionsButton/setEnabled', _.bind(function(enabled) {
        this.view.setEnabled(enabled);
      }, this));
    },

    toggle: function(argument) {
    },

    /**
     * Handles an onClick UI event from the view by publishing a new
     * 'UmdOptionsButton/clicked'.
     */
    onClick: function() {
        mps.publish('UmdOptionsButton/clicked', []);
        this.view.toggleDialog();
    }

  });

  return UmdOptionsButtonPresenter;

});
