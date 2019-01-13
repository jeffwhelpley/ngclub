Blockly.Blocks['empty_object'] = {
    init: function() {
        this.setOutput(true, null);
        this.setColour(65);
        this.setTooltip('Use this for blah');
        this.setHelpUrl('Some help text here');
    }
};

Blockly.JavaScript['empty_object'] = function(block) {
    // TODO: Assemble JavaScript into code variable.
    var code = '{}';
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.JavaScript.ORDER_NONE];
  };


