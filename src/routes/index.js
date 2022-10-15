const fs = require("fs");
const path = require("path");

const routerManager = (app) => {
    try {
        const destPath = path.join(__dirname, "../../src/components");
        fs.readdirSync(destPath).forEach(folder => {
            const module = path.join(destPath, folder);
            const indexFile = path.join(module, "index.js");
            if (fs.lstatSync(module).isDirectory() && fs.existsSync(indexFile)) {
                try {
                    require(module)(app);
                } catch (err) {
                    console.log(`${module} not exported. Could not require.`, err);
                }
            }
        });
    } catch (error) {
        console.error(":::::::::::::[routerManager] has error:::::::::::::", error);
    }
};

module.exports = routerManager;