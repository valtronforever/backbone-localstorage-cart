backbone-localstorage-cart
==========================

Shoping cart collection stored in local storage with real-time updates on all tabs

Has all Backbone.Collection methods and next:

clear() - clear collection, for current tab emit 'clear' event;
productCount() - get number of products;
productTotal() - total of all products;


'storage' event will be emited every time when local storage has changed by the other tab

Example:
````html
var Cart = new Backbone.CartCollection([], { 
    exdays: 7
});
Cart.on('storage', function() {
    console.log('Data updated!');
});

````
See source for details;
