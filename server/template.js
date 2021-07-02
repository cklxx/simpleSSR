const htmlHeader = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SSR DEMO</title>
    <script id="raw-data"></script>
</head>`
const htmlBody = `
<body>
    <div id='root'></div>`
const requireJs = `<script type="text/javascript" src="page/require.js"></script>`
const script2 = `<script src="dist/comp.web.js"></script>
<script src="dist/runtime.web.js"></script>`

const htmlBottom = `${requireJs}${script2}
    <script data-script-1 ></script>
</body>
</html>`
module.exports = { htmlHeader, htmlBody, htmlBottom };