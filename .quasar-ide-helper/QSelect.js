
/**
 * Quasar QSelect component
 * 
 * @see {@link https://v1.quasar-framework.org/vue-components/select|Quasar Docs} (Generated link, may not always work)
 */  
export default {
  name: 'QSelect',
  props: {
    /**
     * Emitted when the virtual scroll occurs
     * @param {{index : Number, from : Number, to : Number, direction : 'increase'|'decrease'}} details Object of properties on the new scroll position 
     */      
    '@virtual-scroll': function (details) {},

    /**
     * Emitted when the component needs to change the model; Is also used by v-model
     * @param {*} value New model value 
     */      
    '@input': function (value) {},

    /**
     * Emitted when an option is removed from selection
     * @param {{index : Number, value : *}} details Removal details 
     */      
    '@remove': function (details) {},

    /**
     * Emitted when an option is added to the selection
     * @param {{index : Number, value : *}} details Addition details 
     */      
    '@add': function (details) {},

    /**
     * Enables creation of new values; Emitted when a new value has been created; You can override 'new-value-mode' property with it
     * @param {String} inputValue What the user typed 
     * @param {Function} doneFn Adds (optional) value to the model; Do not forget to call it after you validate the newly created value; Call it with no parameters if nothing should be added 
     */      
    '@new-value': function (inputValue,doneFn) {},

    /**
     * Emitted when user wants to filter a value
     * @param {String} inputValue What the user typed 
     * @param {Function} doneFn Supply a function which makes the necessary updates 
     * @param {Function} abortFn Call this function if something went wrong 
     */      
    '@filter': function (inputValue,doneFn,abortFn) {},

    /**
     * Emitted when a filtering was aborted; Probably a new one was requested?

     */      
    '@filter-abort': function () {},

    /**
     * Emitted when the select options menu or dialog is shown.
     * @param {Object} evt JS event object 
     */      
    '@popup-show': function (evt) {},

    /**
     * Emitted when the select options menu or dialog is hidden.
     * @param {Object} evt JS event object 
     */      
    '@popup-hide': function (evt) {},
    /**
     * Make virtual list work in horizontal mode
     * @type {Boolean}
     */
    virtualScrollHorizontal: {
      type: Boolean,
    },
    /**
     * Number of options to render in the virtual list
     * @type {Number}
     */
    virtualScrollSliceSize: {
      type: Number,
    },
    /**
     * Default size in pixels (height if vertical, width if horizontal) of an option; This value is used for rendering the initial list; Try to use a value close to the minimum size of an item
     * @type {Number}
     */
    virtualScrollItemSize: {
      type: Number,
    },
    /**
     * Size in pixels (height if vertical, width if horizontal) of the sticky part (if using one) at the start of the list; A correct value will improve scroll precision
     * @type {Number}
     */
    virtualScrollStickySizeStart: {
      type: Number,
    },
    /**
     * Size in pixels (height if vertical, width if horizontal) of the sticky part (if using one) at the end of the list; A correct value will improve scroll precision
     * @type {Number}
     */
    virtualScrollStickySizeEnd: {
      type: Number,
    },
    /**
     * Does field have validation errors?
     * @type {Boolean}
     */
    error: {
      type: Boolean,
    },
    /**
     * Validation error message (gets displayed only if 'error' is set to 'true')
     * @type {String}
     */
    errorMessage: {
      type: String,
    },
    /**
     * Hide error icon when there is an error
     * @type {Boolean}
     */
    noErrorIcon: {
      type: Boolean,
    },
    /**
     * Array of Functions/Strings; If String, then it must be a name of one of the embedded validation rules
     * @type {Array}
     */
    rules: {
      type: Array,
    },
    /**
     * Check validation status against the 'rules' only after field loses focus for first time
     * @type {Boolean}
     */
    lazyRules: {
      type: Boolean,
    },
    /**
     * A text label that will “float” up above the input field, once the field gets focus
     * @type {String}
     */
    label: {
      type: String,
    },
    /**
     * Label will be always shown above the field regardless of field content (if any)
     * @type {Boolean}
     */
    stackLabel: {
      type: Boolean,
    },
    /**
     * Helper (hint) text which gets placed below your wrapped form component
     * @type {String}
     */
    hint: {
      type: String,
    },
    /**
     * Hide the helper (hint) text when field doesn't have focus
     * @type {Boolean}
     */
    hideHint: {
      type: Boolean,
    },
    /**
     * Prefix
     * @type {String}
     */
    prefix: {
      type: String,
    },
    /**
     * Suffix
     * @type {String}
     */
    suffix: {
      type: String,
    },
    /**
     * Color name for component from the Quasar Color Palette
     * @type {String}
     */
    color: {
      type: String,
    },
    /**
     * Color name for component from the Quasar Color Palette
     * @type {String}
     */
    bgColor: {
      type: String,
    },
    /**
     * Notify the component that the background is a dark color
     * @type {Boolean}
     */
    dark: {
      type: Boolean,
    },
    /**
     * Signals the user a process is in progress by displaying a spinner; Spinner can be customized by using the 'loading' slot.
     * @type {Boolean}
     */
    loading: {
      type: Boolean,
    },
    /**
     * Appends clearable icon when a value (not undefined or null) is set; When clicked, model becomes null
     * @type {Boolean}
     */
    clearable: {
      type: Boolean,
    },
    /**
     * Custom icon to use for the clear button when using along with 'clearable' prop
     * @type {String}
     */
    clearIcon: {
      type: String,
    },
    /**
     * Use 'filled' design for the field
     * @type {Boolean}
     */
    filled: {
      type: Boolean,
    },
    /**
     * Use 'outlined' design for the field
     * @type {Boolean}
     */
    outlined: {
      type: Boolean,
    },
    /**
     * Use 'borderless' design for the field
     * @type {Boolean}
     */
    borderless: {
      type: Boolean,
    },
    /**
     * Use 'standout' design for the field; Specifies classes to be applied when focused (overriding default ones)
     * @type {Boolean|String}
     */
    standout: {
      type: [Boolean,String],
    },
    /**
     * Enables bottom slots ('error', 'hint', 'counter')
     * @type {Boolean}
     */
    bottomSlots: {
      type: Boolean,
    },
    /**
     * Does not reserves space for hint/error/counter anymore when these are not used; as a result, it also disables the animation for those
     * @type {Boolean}
     */
    hideBottomSpace: {
      type: Boolean,
    },
    /**
     * Show an automatic counter on bottom right
     * @type {Boolean}
     */
    counter: {
      type: Boolean,
    },
    /**
     * Applies a small standard border-radius for a squared shape of the component
     * @type {Boolean}
     */
    rounded: {
      type: Boolean,
    },
    /**
     * Remove border-radius so borders are squared; Overrides 'rounded' prop
     * @type {Boolean}
     */
    square: {
      type: Boolean,
    },
    /**
     * Dense mode; occupies less space
     * @type {Boolean}
     */
    dense: {
      type: Boolean,
    },
    /**
     * Align content to match QItem
     * @type {Boolean}
     */
    itemsAligned: {
      type: Boolean,
    },
    /**
     * Put component in disabled mode
     * @type {Boolean}
     */
    disable: {
      type: Boolean,
    },
    /**
     * Put component in readonly mode
     * @type {Boolean}
     */
    readonly: {
      type: Boolean,
    },
    /**
     * Focus field on initial component render
     * @type {Boolean}
     */
    autofocus: {
      type: Boolean,
    },
    /**
     * Model of the component; Must be Array if using 'multiple' prop; Either use this property (along with a listener for 'input' event) OR use v-model directive
     * @type {Number|String|Array}
     */
    value: {
      type: [Number,String,Array],
      required: true
    },
    /**
     * Allow multiple selection; Model must be Array
     * @type {Boolean}
     */
    multiple: {
      type: Boolean,
    },
    /**
     * Override default selection string, if not using 'selected' slot/scoped slot and if not using 'use-chips' prop
     * @type {Number|String}
     */
    displayValue: {
      type: [Number,String],
    },
    /**
     * Force use of textContent instead of innerHTML to render selected option(s); Use it when the selected option(s) might be unsafe (from user input); Does NOT apply when using 'selected' or 'selected-item' slots!
     * @type {Boolean}
     */
    displayValueSanitize: {
      type: Boolean,
    },
    /**
     * Available options that the user can select from. For best performance freeze the list of options.
     * @type {Array}
     */
    options: {
      type: Array,
    },
    /**
     * Property of option which holds the 'value'
     * @type {Function|String}
     */
    optionValue: {
      type: [Function,String],
    },
    /**
     * Property of option which holds the 'label'
     * @type {Function|String}
     */
    optionLabel: {
      type: [Function,String],
    },
    /**
     * Property of option which tells it's disabled; The value of the property must be a Boolean
     * @type {Function|String}
     */
    optionDisable: {
      type: [Function,String],
    },
    /**
     * Hides selection; Use the underlying input tag to hold the label (instead of showing it to the right of the input) of the selected option; Only works for non 'multiple' Selects
     * @type {Boolean}
     */
    hideSelected: {
      type: Boolean,
    },
    /**
     * Hides dropdown icon
     * @type {Boolean}
     */
    hideDropdownIcon: {
      type: Boolean,
    },
    /**
     * Icon name following Quasar convention; make sure you have the icon library installed unless you are using 'img:' prefix
     * @type {String}
     */
    dropdownIcon: {
      type: String,
    },
    /**
     * Allow a maximum number of selections that the user can do
     * @type {Number|String}
     */
    maxValues: {
      type: [Number,String],
    },
    /**
     * Dense mode for options list; occupies less space
     * @type {Boolean}
     */
    optionsDense: {
      type: Boolean,
    },
    /**
     * Options menu will be colored with a dark color
     * @type {Boolean}
     */
    optionsDark: {
      type: Boolean,
    },
    /**
     * CSS class name for options that are active/selected
     * @type {String}
     */
    optionsSelectedClass: {
      type: String,
    },
    /**
     * Expanded menu will cover the component (will not work along with 'use-input' prop for obvious reasons)
     * @type {Boolean}
     */
    optionsCover: {
      type: Boolean,
    },
    /**
     * Force use of textContent instead of innerHTML to render options; Use it when the options might be unsafe (from user input); Does NOT apply when using 'option' slot!
     * @type {Boolean}
     */
    optionsSanitize: {
      type: Boolean,
    },
    /**
     * Class definitions to be attributed to the popup content
     * @type {String}
     */
    popupContentClass: {
      type: String,
    },
    /**
     * Style definitions to be attributed to the popup content
     * @type {Array|String|Object}
     */
    popupContentStyle: {
      type: [Array,String,Object],
    },
    /**
     * Use an input tag where users can type
     * @type {Boolean}
     */
    useInput: {
      type: Boolean,
    },
    /**
     * Use QChip to show what is currently selected
     * @type {Boolean}
     */
    useChips: {
      type: Boolean,
    },
    /**
     * Fills the input with current value; Useful along with 'hide-selected'; Does NOT works along with 'multiple' selection
     * @type {Boolean}
     */
    fillInput: {
      type: Boolean,
    },
    /**
     * Enables creation of new values and defines behavior when a new value is added: 'add' means it adds the value (even if possible duplicate), 'add-unique' adds only unique values, and 'toggle' adds or removes the value (based on if it exists or not already); When using this prop then listening for @new-value becomes optional (only to override the behavior defined by 'new-value-mode')
     * @type {'add'|'add-unique'|'toggle'}
     */
    newValueMode: {
      type: String,
    },
    /**
     * Enables creation of new values and defines behavior when a new value is added: 'add' means it adds the value (even if possible duplicate), 'add-unique' adds only unique values, and 'toggle' adds or removes the value (based on if it exists or not already); When using this prop then listening for @new-value becomes optional (only to override the behavior defined by 'new-value-mode')
     * @type {'add'|'add-unique'|'toggle'}
     */
    'newValueMode="add"': {
      type: String,
    },
    /**
     * Enables creation of new values and defines behavior when a new value is added: 'add' means it adds the value (even if possible duplicate), 'add-unique' adds only unique values, and 'toggle' adds or removes the value (based on if it exists or not already); When using this prop then listening for @new-value becomes optional (only to override the behavior defined by 'new-value-mode')
     * @type {'add'|'add-unique'|'toggle'}
     */
    'newValueMode="addUnique"': {
      type: String,
    },
    /**
     * Enables creation of new values and defines behavior when a new value is added: 'add' means it adds the value (even if possible duplicate), 'add-unique' adds only unique values, and 'toggle' adds or removes the value (based on if it exists or not already); When using this prop then listening for @new-value becomes optional (only to override the behavior defined by 'new-value-mode')
     * @type {'add'|'add-unique'|'toggle'}
     */
    'newValueMode="toggle"': {
      type: String,
    },
    /**
     * Try to map labels of model from 'options' Array; has a small performance penalty; If you are using emit-value you will probably need to use map-options to display the label text in the select field rather than the value;  Refer to the 'Affecting model' section above
     * @type {Boolean}
     */
    mapOptions: {
      type: Boolean,
    },
    /**
     * Update model with the value of the selected option instead of the whole option
     * @type {Boolean}
     */
    emitValue: {
      type: Boolean,
    },
    /**
     * Debounce the input model update with an amount of milliseconds
     * @type {Number|String}
     */
    inputDebounce: {
      type: [Number,String],
    },
    /**
     * Transition when showing the menu/dialog; One of Quasar's embedded transitions
     * @type {String}
     */
    transitionShow: {
      type: String,
    },
    /**
     * Transition when hiding the menu/dialog; One of Quasar's embedded transitions
     * @type {String}
     */
    transitionHide: {
      type: String,
    },
    /**
     * Overrides the default dynamic mode of showing as menu on desktop and dialog on mobiles
     * @type {'default'|'menu'|'dialog'}
     */
    behavior: {
      type: String,
    },
    /**
     * Overrides the default dynamic mode of showing as menu on desktop and dialog on mobiles
     * @type {'default'|'menu'|'dialog'}
     */
    'behavior="default"': {
      type: String,
    },
    /**
     * Overrides the default dynamic mode of showing as menu on desktop and dialog on mobiles
     * @type {'default'|'menu'|'dialog'}
     */
    'behavior="menu"': {
      type: String,
    },
    /**
     * Overrides the default dynamic mode of showing as menu on desktop and dialog on mobiles
     * @type {'default'|'menu'|'dialog'}
     */
    'behavior="dialog"': {
      type: String,
    }
  }
}
