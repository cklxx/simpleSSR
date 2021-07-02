var hydrate = require('runtime').default.hydrate;
define('react',[],require('runtime').default.modules.react);
hydrate(require('comp').default,_RAW_DATA_,document.getElementById('root'),()=>{});
