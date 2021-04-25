const fs = require('fs');
const path = require('path');
const fsExtra = require('fs-extra');

class FileController {
    saveImage(req, res) {
        try {
            const data = req.body.img.replace('data:image/png;base64,', '');
            const lineWidth = req.body.lineWidth;
            const strokeColor = req.body.strokeColor;
            const fillColor = req.body.fillColor;

            
            fs.stat(path.join(__dirname, '/../files', `${req.query.id}`), function(err) {
                
                fsExtra.emptyDirSync(path.join(__dirname, '/../files'));
                if (!err) {
                    fsExtra.emptyDirSync(path.join(__dirname, '/../files', `${req.query.id}`));
                } 
                else if (err.code === 'ENOENT') {
                    fs.mkdirSync( path.join(__dirname, '/../files', `${req.query.id}`));
                }
                fs.writeFileSync( path.join(__dirname, `/../files/${req.query.id}/`, `${req.query.id}.jpg`), data, 'base64' );
                fs.writeFileSync( path.join(__dirname, `/../files/${req.query.id}/`, `${lineWidth}_${strokeColor}_${fillColor}`), data);
                return res.json({message: "Image was upload"});
            });
    
        } catch(e) {
            return res.status(500).json({message: e.message});
        }
    }
    getImage(req, res) {
        try {
            if (!fs.existsSync(path.join(__dirname, `/../files/${req.query.id}`, `${req.query.id}.jpg`))) {
                return false;
            }
            const file = fs.readFileSync(path.join(__dirname, `/../files/${req.query.id}`, `${req.query.id}.jpg`));
            const dir = fs.readdirSync( path.join(__dirname, `/../files/${req.query.id}`) );
            const settingsStr = dir.filter(el => el.indexOf(req.query.id) < 0);
            const settingsArr = settingsStr[0].split('_');
            const data = {};

            data.img = 'data:image/png;base64,' + file.toString('base64');
            data.lineWidth = settingsArr[0];
            data.strokeColor = settingsArr[1];
            data.fillColor = settingsArr[2];
            return res.json(data);
        } catch(e) {
            return res.status(500).json({message: e.message});
        }
    }
    
}
module.exports = new FileController();