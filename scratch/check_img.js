const fs = require('fs');

function getPngDimensions(filePath) {
    const data = fs.readFileSync(filePath);
    if (data.toString('ascii', 1, 4) !== 'PNG') return null;
    return {
        width: data.readUInt32BE(16),
        height: data.readUInt32BE(20)
    };
}

console.log(getPngDimensions('public/images/logo_final_v2.png'));
