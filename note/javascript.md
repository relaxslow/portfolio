# hasOwnProperty
Iterating over properties requires this additional hasOwnProperty check:

for (var property in object) {
    if (object.hasOwnProperty(property)) {
        // do stuff
    }
}
It's necessary because an object's prototype contains additional properties for the object which are technically part of the object. These additional properties are inherited from the base object class, but are still properties of object.

hasOwnProperty simply checks to see if this is a property specific to this class, and not one inherited from the base class.