var BMapLib = window.BMapLib = BMapLib || {};
(function() {
    var b, a = b = a || {
        version: "1.5.1"
    };
    a.guid = "$BAIDU$";
    (function() {
        window[a.guid] = window[a.guid] || {};
        a.object = a.object || {};
        a.extend = a.object.extend = function(f, d) {
            for (var e in d) {
                if (d.hasOwnProperty(e)) {
                    f[e] = d[e]
                }
            }
            return f
        }
        ;
        b.undope = true
    })();
    var c = BMapLib.MarkerManager = function(f, e) {
        this._opts = e || {};
        this._map = f;
        this._zoom = f.getZoom();
        this._numMarkers = [];
        if (typeof e.maxZoom === "number") {
            this._opts.maxZoom = this._opts.maxZoom
        } else {
            this._opts.maxZoom = 19
        }
        if (typeof e.borderPadding === "number") {
            this._opts.borderPadding = e.borderPadding
        } else {
            this._opts.borderPadding = 0
        }
        var d = this;
        this._map.addEventListener("zoomend", function() {
            d._showMarkers()
        });
        this._map.addEventListener("dragend", function() {
            d._showMarkers()
        })
    }
    ;
    c.prototype.addMarker = function(e, f, d) {
        f = f && f > 0 ? f : 1;
        d = d && d <= 19 ? d : this._opts.maxZoom;
        e.minZoom = f;
        e.maxZoom = d;
        e.bAdded = false;
        this._numMarkers.push(e);
        e.enableDragging()
    }
    ;
    c.prototype.addMarkers = function(h, j, e) {
        var d = h.length
          , g = this;
        for (var f = d; f--; ) {
            this.addMarker(h[f], j, e)
        }
    }
    ;
    c.prototype.removeMarker = function(d) {
        if (d instanceof BMap.Marker) {
            this._map.removeOverlay(d);
            this._removeMarkerFromArray(d)
        }
    }
    ;
    c.prototype.getMarkerCount = function(h) {
        var d = this._numMarkers.length
          , f = this._numMarkers
          , g = 0;
        for (var e = d; e--; ) {
            g = f[e].bInBounds ? ((f[e].minZoom <= h && f[e].maxZoom >= h) ? ++g : g) : g
        }
        return this._visible ? g : 0
    }
    ;
    c.prototype.show = function() {
        var d = this._numMarkers.length;
        for (var e = d; e--; ) {
            this._numMarkers[e].bInBounds && this._numMarkers[e].show()
        }
        this._visible = true
    }
    ;
    c.prototype.hide = function() {
        var d = this._numMarkers.length;
        for (var e = d; e--; ) {
            this._numMarkers[e].bInBounds && this._numMarkers[e].hide()
        }
        this._visible = false
    }
    ;
    c.prototype.toggle = function() {
        this._visible ? this.hide() : this.show()
    }
    ;
    c.prototype.showMarkers = function() {
        this._visible = true;
        this._showMarkers()
    }
    ;
    c.prototype.clearMarkers = function() {
        var d = this._numMarkers.length;
        for (var e = d; e--; ) {
            this._numMarkers[e].bInBounds && this._map.removeOverlay(this._numMarkers[e])
        }
        this._numMarkers.length = 0
    }
    ;
    a.object.extend(c.prototype, {
        _showMarkers: function() {
            var d = this._numMarkers.length
              , h = this._map.getZoom()
              , f = this._numMarkers
              , g = this._getRealBounds();
            for (var e = d; e--; ) {
                if (g.containsPoint(f[e].getPosition()) && h >= f[e].minZoom && h <= f[e].maxZoom) {
                    f[e].bInBounds = true;
                    if (!f[e].bAdded) {
                        this._map.addOverlay(f[e]);
                        !this._visible && f[e].hide();
                        f[e].bAdded = true
                    } else {
                        this._visible && f[e].show()
                    }
                } else {
                    if (f[e].bAdded) {
                        f[e].bInBounds = false;
                        f[e].hide()
                    }
                }
            }
        },
        _getRealBounds: function() {
            var g = this._map.getBounds()
              , f = this._map.pointToPixel(g.getSouthWest())
              , e = this._map.pointToPixel(g.getNorthEast())
              , j = {
                x: f.x - this._opts.borderPadding,
                y: f.y + this._opts.borderPadding
            }
              , i = {
                x: e.x + this._opts.borderPadding,
                y: e.y - this._opts.borderPadding
            }
              , d = this._map.pixelToPoint(j)
              , h = this._map.pixelToPoint(i);
            return new BMap.Bounds(d,h)
        },
        _removeMarkerFromArray: function(e) {
            var f = this._numMarkers.length
              , g = f
              , d = 0;
            for (g = f; g--; ) {
                if (e === this._numMarkers[g]) {
                    this._numMarkers.splice(g--, 1);
                    d++
                }
            }
            return d
        }
    })
})();
