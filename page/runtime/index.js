import React from 'react';
import ReactDom from 'react-dom/server'
import hydrate from './hydrate';
export default {
    modules: {
        react: React,
        'react-dom': ReactDom
    },
    render: (component, props) =>{
        return {
            html: ReactDom.renderToString(React.createElement(component, props))
        }
    },
    hydrate: (component, props, root, callback)=>{
        hydrate.hydrate(React.createElement(component, props), root, callback);
    }
}
