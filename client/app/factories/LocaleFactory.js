'use strict';

( function () {
app.factory("LocaleFactory", function() {
  var locale = {};
  var languages = locale.langs = [{
    code: "cs",
    name: "Czech",
    "native": "Česky"
  }, {
    code: "da",
    name: "Danish",
    "native": "Dansk"
  }, {
    code: "de",
    name: "German",
    "native": "Deutsch"
  }, {
    code: "en",
    name: "English",
    "native": "English"
  }, {
    code: "es",
    name: "Spanish",
    "native": "Español"
  }, {
    code: "fr",
    name: "French",
    "native": "Français"
  }, {
    code: "it",
    name: "Italian",
    "native": "Italiano"
  }, {
    code: "lv",
    name: "Latvian",
    "native": "Latviešu"
  }, {
    code: "lt",
    name: "Lithuanian",
    "native": "Lietuvių"
  }, {
    code: "hu",
    name: "Hungarian",
    "native": "Magyar"
  }, {
    code: "nl",
    name: "Dutch",
    "native": "Nederlands"
  }, {
    code: "no",
    name: "Norwegian",
    "native": "Norsk"
  }, {
    code: "pl",
    name: "Polish",
    "native": "Polski"
  }, {
    code: "pt",
    name: "Portuguese",
    "native": "Português"
  }, {
    code: "ro",
    name: "Romanian",
    "native": "Română"
  }, {
    code: "sq",
    name: "Albanian",
    "native": "Shqip"
  }, {
    code: "sk",
    name: "Slovak",
    "native": "Slovenčina"
  }, {
    code: "sl",
    name: "Slovene",
    "native": "Slovenščina"
  }, {
    code: "fi",
    name: "Finnish",
    "native": "Suomi"
  }, {
    code: "sv",
    name: "Swedish",
    "native": "Svenska"
  }, {
    code: "tr",
    name: "Turkish",
    "native": "Türkçe"
  }, {
    code: "el",
    name: "Greek",
    "native": "Ελληνικά"
  }, {
    code: "bg",
    name: "Bulgarian",
    "native": "български"
  }, {
    code: "ru",
    name: "Russian",
    "native": "Pусский"
  }, {
    code: "uk",
    name: "Ukrainian",
    "native": "Українська"
  }];
  return locale._ = {
    id:"Cell Id",
    editCell: "Edit Cell",
    newCell: "New Cell",
    addToSet: "Add to Set",
    renameSet: "Rename Set",
    shareSet: "Share Set",
    settings: "Settings",
    noConnection: "Could not connect to the server!",
    outOfSync: "cellPane is out of sync. Please make sure you have an active internet connection.",
    quotaExceeded: "The local storage limit has been reached or local storage is disabled.",
    alert: "Alert",
    copy: "copy",
    keyboard: "Keyboard Shortcuts",
    illegalOperation: "You tried to perform an illegal operation!",
    key: "Key",
    currentKey: "Current Key",
    originalKey: "Original Key",
    timeSignature: "Time Signature",
    description: "Description",
    copyright: "Copyright",
    profile: "Profile",
    buddies: "Buddies",
    remove: "Remove",
    owner: "Owner",
    save: "Save",
    add: "Add",
    addToNewSet: "Add the cell to a new set",
    addToExistingSet: "or an existing set",
    selectSet: "Select a set",
    hideChords: "Hide chords",
    toggleXZGrid: "Show XZ Grid",
    toggleYZGrid: "Show YZ Grid",
    toggleXYGrid: "Show XY Grid",
    toggleGround: "Show Ground",
    toggleAxes: "Show Axes",
    disconnect: "Disconnect",
    disconnectAccount: "Disconnect account",
    cellname: "Cell Name",
    cellDescription: "Cell Description",
    nameSet: "Give this set a name",
    done: "Done",
    email: "Email",
    password: "Password",
    createAccount: "Create Account",
    resetPassword: "Reset Password",
    searchcells: "Search cells",
    filtercells: "Filter cells",
    sets: "Sets",
    catalog: "Catalog",
    search: "Search",
    noSets: "No Sets",
    creatingSets: "Sets are created by adding cells to them.",
    emptyCatalog: "Empty Catalog",
    aboutCatalog: "The catalog contains all the cells that you use or cells that you add to cellPane.",
    noResults: "No Results",
    searching: "Searching...",
    wait: "Wait...",
    standalone: "To enjoy this app to the fullest we recommend adding it to your Home Screen.",
    loggedOut: "You have been logged out.",
    notFound: "The resource was not found on the server.",
    genericError: "Something went wrong and it’s probably our fault.",
    confirm: "Are you sure?",
    explainDelcell: "Deleting the cell makes it unavailable to any set that is currently using it!",
    del: "Delete",
    cancel: "Cancel",
    nextcellOrSet: "Next cell or set",
    prevcellOrSet: "Previous cell or set",
    toggleChords: "Toggle chord display",
    changeFontSize: "Decrease/increase font size",
    fontSize: "Font size",
    small: "Small",
    medium: "Medium",
    large: "Large",
    priv: "Private",
    pub: "Public",
    language: "Language",
    visibility: "Visibility",
    toggleFullscreen: "Toggle fullscreen",
    toggleInfo: "Toggle cell info",
    toggleHelp: "Toggle help (this screen)",
    toggleSettings: "Toggle settings",
    esc: "Cancel actions, close modal windows",
    checkBody: "Please check the body of the cell.",
    sharedSet: "A new set has been shared with you!",
    checkEmail: "Please check your email.",
    invalidCredentials: "Invalid credentials!",
    SPInvalidData: "The data you submitted was invalid.",
    SPOperationNotPermitted: "You are trying to perform an illegal operation.",
    SPInvalidQuery: ""
  }, languages.forEach(function(lang) {
    languages[lang.code] = lang
  }), locale
});
})();