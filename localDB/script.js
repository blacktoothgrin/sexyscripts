var App = {};
var Int = function(val){
    return parseInt(val, 10);
};
/**
 * @desc localStorage abstraction. Designed to store and retrieve objects. localStorage by default can only store data as String
 */
if(window.hasOwnProperty('localStorage') && window.localStorage !== null) {
    var l = window.localStorage;
    App.db = {
        /**
         * @desc Selects the table for the current transaction
         * @param 'tableName' String which represents the name of the table in localStorage
         * @return Cleartrip Database Object i.e App.db
         */
        table : function(tableName) {
            return new App.db.table.prototype.init(tableName);
        }
    };

    App.db.table.prototype = {
        
        init : function(tableName){
            this.tableName = tableName;
            l[this.tableName + ':index'] = l[this.tableName + ':index'] || 0;
        },

        /**
         * @desc Inserts data/value in the table ( as selected by App.db.table('tablename') )
         * @param 'key' optional key name under which the passed value will be saved
         * @param 'value' required data which will be saved
         * @usage App.db.table('myTable').insert({ 'name' : 'Parag', 'surname' : 'Majumdar'}); // 'key' is not passed here. auto-incremented id will be used
         * @usage App.db.table('myTable').insert('myPassKey', 'qwerty1234');
         * @usage App.db.table('myTable').insert('parag', { 'age' : 27, 'race' : 'Indian', 'weight' : '66kg' });
         * @return Cleartrip Database Object i.e App.db
         */
        insert : function() {
            var a = arguments,
            arg_len = a.length,
            hasKey = arg_len === 2,
            current_key = this.tableName + ':index',
            new_id = hasKey ? a[0] : Int(l[current_key]) + 1,
            value = hasKey ? a[1] : a[0];

            value = Object.prototype.toString.call(value) === "[object Object]" ? JSON.stringify(value) : value;
            l.setItem(this.tableName + ':' + new_id, value);
            l[current_key] = Int(l[current_key]) + 1;
            return this;
        },
        /**
         * @desc Removes a key-value pair from the localStorage
         * @param 'key' Required to pick the right entry to remove from the table
         * @return Cleartrip Database Object i.e App.db
         */
        remove : function(key) {
            var current_key = this.tableName + ':index';
            l.removeItem(this.tableName + ':' + key);
            l[current_key] = Int(l[current_key]) - 1;
            return this;
        },
        /**
         * @desc Returns the value of the table key
         * @usage App.db.table('myTable').select('myPassKey'); // Selects 'myPassKey' from table 'myTable'
         * @usage App.db.table('myTable').select('*'); // Selects all entries from table 'myTable' only if keys were stored as auto-incremented numbers
         * @return Array of results or a String value
         */
        select : function(key) {
            var that = this;
            function _getValue(key) {
                try {
                    return JSON.parse(l[that.tableName + ':' + key]);
                } catch(ex) {
                    return l[that.tableName + ':' + key] || false;
                }
            }

            if(key === "*") {
                var idx = Int(l[this.tableName + ':index']), res = [];
                while(idx > 0) {
                    res[res.length] = _getValue(idx);
                    idx -= 1;
                }
                return res;
            } else {
                return _getValue(key);
            }
        }
    };
    
    App.db.table.prototype.init.prototype = App.db.table.prototype;
} // if block ends

