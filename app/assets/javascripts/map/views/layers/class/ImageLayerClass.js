/**
 * The Image map layer module.
 *
 * @return ImageLayer class (extends Class).
 */
define([
  'Class',
  'underscore',
  'uri'
], function(Class, _, UriTemplate) {

  var ImageLayerClass = Class.extend({

    init: function (layer) {
      this.tileSize = new google.maps.Size(256, 256);
      this.tiles = {};
      this.name = layer.slug;
    },

    /**
     * Called whenever the Google Maps API determines that the map needs to
     * display new tiles for the given viewport.
     *
     * @param  {obj}     coord         Coordenades {x ,y}
     * @param  {integer} zoom          Current map zoom
     * @param  {object}  ownerDocument
     *
     * @return {div}     div           Tile div
     */
    getTile: function(coord, zoom, ownerDocument) {
      var zsteps = this._getZoomSteps(zoom);

      var url = this._getUrl.apply(this,
        this._getTileCoords(coord.x, coord.y, zoom));

      var image = new Image();
      image.src = url;
      image.className += this.name;

      if (zsteps <= 0) {
        return image;
      }

      image.width = 256 * Math.pow(2, zsteps);
      image.height = 256 * Math.pow(2, zsteps);

      var srcX = 256 * (coord.x % Math.pow(2, zsteps));
      var srcY = 256 * (coord.y % Math.pow(2, zsteps));

      image.style.position = 'absolute';
      image.style.top      = -srcY + 'px';
      image.style.left     = -srcX + 'px';

      var div = ownerDocument.createElement('div');
      div.appendChild(image);
      div.style.width = this.tileSize.width + 'px';
      div.style.height = this.tileSize.height + 'px';
      div.style.position = 'relative';
      div.style.overflow = 'hidden';
      div.className += this.name;

      return div;
    },

    _getZoomSteps: function(z) {
      return z - this.dataMaxZoom;
    },

    _getTileCoords: function(x, y, z) {
      if (z > this.dataMaxZoom) {
        x = Math.floor(x / (Math.pow(2, z - this.dataMaxZoom)));
        y = Math.floor(y / (Math.pow(2, z - this.dataMaxZoom)));
        z = this.dataMaxZoom;
      } else {
        y = (y > Math.pow(2, z) ? y % Math.pow(2, z) : y);
        if (x >= Math.pow(2, z)) {
          x = x % Math.pow(2, z);
        } else if (x < 0) {
          x = Math.pow(2, z) - Math.abs(x);
        }
      }

      return [x, y, z];
    }
  });

  return ImageLayerClass;
});