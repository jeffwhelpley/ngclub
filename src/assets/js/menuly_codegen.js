Blockly.JSON = new Blockly.Generator('JSON');

Blockly.JSON.fromWorkspace = function(workspace) {
    var json_text = '';

    var top_blocks = workspace.getTopBlocks(false);
    for (var i in top_blocks) {
        var top_block = top_blocks[i];

        if (top_block.type == 'start') {
            var json_structure = this.generalBlockToObj(top_block);

            json_text += JSON.stringify(json_structure, null, 4) + '\n\n';
        }
    }

    return json_text;
};

Blockly.JSON.generalBlockToObj = function(block) {
    if (block) {
        // dispatcher:
        var func = this[block.type];
        if (func) {
            return func.call(this, block);
        } else {
            console.log("Don't know how to generate JSON code for a '" + block.type + "'");
        }
    } else {
        return null;
    }
};

// Blockly.JSON['start'] = function(block) {
//     var json = this.generalBlockToObj( block.getInputTargetBlock( 'json' ) );
//     return json;
// };

// Blockly.JSON['true'] = function(block) {
//     return true;
// };

// Blockly.JSON['false'] = function(block) {
//     return false;
// };

// Blockly.JSON['string'] = function(block) {
//     var string_value = block.getFieldValue( 'string_value' );
//     return string_value ;
// };

// Blockly.JSON['number'] = function(block) {
//     var number_value = Number(block.getFieldValue( 'number_value' ));
//     return number_value ;
// };

// Blockly.JSON['dictionary'] = function(block) {
//     var dictionary = {};
//     for(var i = 0; i<block.length; i++) {
//         var pair_key    = block.getFieldValue( 'key_field_'+i );
//         var pair_value  = this.generalBlockToObj( block.getInputTargetBlock( 'element_'+i ) );

//         dictionary[pair_key] = pair_value;
//     }

//     return dictionary;
// };

// Blockly.JSON['array'] = function(block) {
//     var array = [];

//     for(var i = 0; i<block.length; i++) {
//         var element_value  = this.generalBlockToObj( block.getInputTargetBlock( 'element_'+i ) );

//         array[i] = element_value;
//     }

//     return array;
// };

// three blocks: one to set value in object
// another to get value in object
// third to call function in object

Blockly.JavaScript['true'] = function(block) {
    return true;
};

Blockly.JavaScript['false'] = function(block) {
    return false;
};

Blockly.JavaScript['string'] = function(block) {
    var string_value = block.getFieldValue('string_value');
    return string_value;
};

Blockly.JavaScript['number'] = function(block) {
    var number_value = Number(block.getFieldValue('number_value'));
    return number_value;
};

Blockly.JavaScript['dictionary'] = function(block, isSubval) {
    var dictionary = {};

    for (var i = 0; i < block.length; i++) {
        var pair_key = block.getFieldValue('key_field_' + i);
        var subval = block.getInputTargetBlock('element_' + i);

        if (subval) {
            var func = Blockly.JavaScript[subval.type];
            if (func) {
                var pair_value = Blockly.JavaScript[subval.type](subval, true);
                dictionary[pair_key] = pair_value;
            } else {
                console.log("Don't know how to generate JSON code for a '" + subval.type + "'");
            }
        }
    }

    if (isSubval) {
        return dictionary;
    } else {
        return [JSON.stringify(dictionary, null, 2), Blockly.JavaScript.ORDER_NONE];
    }
};

Blockly.JavaScript['array'] = function(block, isSubval) {
    var array = [];

    for (var i = 0; i < block.length; i++) {
        var subval = block.getInputTargetBlock('element_' + i);
        var element_value = Blockly.JavaScript[subval.type](subval);
        array[i] = element_value;
    }

    if (isSubval) {
        return array;
    } else {
        return JSON.stringify(array, null, 2);
    }
};
