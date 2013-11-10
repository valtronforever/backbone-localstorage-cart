;(function(window, document, Backbone) {
    
    if (typeof Backbone === 'undefined') {
        throw('Backbone not included');
    }
    
    var fpFix = function (n) {
        return Math.round(n * 100)/100;
    };
    
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
        
        setCookie: function() {
            var that = this;
            var exdays = that.options.exdays;
            if (typeof exdays === 'undefined') {
                exdays = 7;
            }

            var exdate=new Date();
            exdate.setDate(exdate.getDate() + exdays);
            var c_value = "1; expires=" + exdate.toUTCString();
            document.cookie=that.localStorage.name + "=" + c_value;
        },
        
        cookieExists: function() {
            var that = this;
            return !!((document.cookie.indexOf(that.localStorage.name + "=") !== -1));
        },
        
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
                _.defer(function() {
                    var store = that.localStorage.localStorage().getItem(that.localStorage.name);
                    that.localStorage.records = (store && store.split(",")) || [];
                    that.fetch();
                    that.trigger('storage');
                });
            }
        },

        constructor: function() {
            var that = this;
            Backbone.Collection.apply(that, arguments);
            
            if (!that.cookieExists()) {
                that.clearStorage();
            }
            that.setCookie();
            that.fetch();
        },
        
        initialize: function(models, options) {
            var that = this;
            that.options = options;
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
            }
        },
        
        clearStorage: function() {
            var that = this;
            var storage = that.localStorage.localStorage();
            var store = storage.getItem(that.localStorage.name);
            var records = (store && store.split(",")) || [];

            _.each(records, function(id) {
                storage.removeItem(that.localStorage.name + '-' + id);
            });
            
            storage.setItem(that.localStorage.name, '');
        },
        
        clear: function() {
            var that = this;

            that.clearStorage();
            that.localStorage.records = [];
            
            that.reset([]);
            that.trigger('clear');
        },
                
        productCount: function() {
            var that = this;
            var count = 0;
            if (that.length !== 0) {
                count = that.reduce(function(memo, model) {
                    return memo + model.get('count');
                }, 0);
            }
            
            return count;
        },
                
        productTotal: function() {
            var that = this;
            var total = 0;
            if (that.length !== 0) {
                total = that.reduce(function(memo, model) {
                    return fpFix(memo + fpFix(model.get('count') * model.get('price')));
                }, 0);
            }
            
            return total;
        }
        
    });
    
})(window, document, Backbone);