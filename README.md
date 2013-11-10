backbone-localstorage-cart
==========================

Shoping cart collection stored in local storage with real-time updates on all tabs

Has all Backbone.Collection methods and next:

clear() - clear collection, call onUpdate method on all tabs including current;
productCount() - get number of products;
productTotal() - total of all products;


onUpdate method will be called every time when local storage has changed by the other tab

Example:

var Cart = new Backbone.CartCollection([], { 
    exdays: 7,
    onUpdate: function(collection) {
        console.log('Update');
    }
});


See source for details;
