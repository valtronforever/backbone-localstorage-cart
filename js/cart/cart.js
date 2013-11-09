;(function(window) {
    
    var ProductModel = Backbone.Model.extend({
        
        defaults: function() {
            return {
                'count': 1,
                'price': 0
            };
        }
        
    });
    
    Backbone.CartCollection = Backbone.Collection.extend({
        
        localStorage: new Backbone.LocalStorage("Cart"),
        model: ProductModel,
        
        onStorage: function(e) {
            var that = this;

            if (typeof e.key === 'undefined') {
                return;
            }

            // Backbone localstorage adapter emit storage event twice (for create or destroy)
            // Let`s hack this
            if (
                e.key.indexOf('Cart') !== -1 &&
                e.key !== 'Cart'
            ) {
                var store = that.localStorage.localStorage().getItem(that.localStorage.name);
                that.localStorage.records = (store && store.split(",")) || [];
                that.fetch({ reset: true });
            }
        },
        
        onUpdate: function() {
    
        },
        
        constructor: function() {
            Backbone.Collection.apply(this, arguments);
            this.fetch();
        },
        
        initialize: function() {
            var that = this;
            if (window.addEventListener) {
                window.addEventListener("storage", function(e) {
                    if (!e) { e = window.event; }
                    that.onStorage(e);
                }, false);
            } else {
                window.attachEvent("onstorage", function(e) {
                    if (!e) { e = window.event; }
                    that.onStorage(e);
                });
            };
            
            that.on('reset', function() {
                that.onUpdate();
            });
        },
                
        clear: function() {
            var that = this;
            var storage = that.localStorage.localStorage();
            
            _.each(that.localStorage.records, function(id) {
                storage.removeItem(that.localStorage.name + '-' + id);
            });
            
            storage.setItem(that.localStorage.name, '');
            that.localStorage.records = [];
            
            that.reset([]);
        }
        
    });
    
})(window);