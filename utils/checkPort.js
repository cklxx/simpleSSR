
const net = require('net');
 
function portInUse(port){
    return new Promise((resolve, reject)=>{
        let server = net.createServer().listen(port);
        server.on('listening',function(){
            server.close();
            resolve(server);
        });
        server.on('error',function(err){
            if(err.code == 'EADDRINUSE'){
                resolve(err);
            }
        });             
    });
}
async function checkPort(port){
    let res = await portInUse(port);
    if(res instanceof Error){
        console.error(`port:${port} is in used!`);
        return true;
    }
    res.close();
    return false;
}
module.exports = checkPort;