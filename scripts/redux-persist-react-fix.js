var fs = require('fs');

module.exports = function(ctx) {
    console.log("Copy redux persist fix file");
  fs.writeFileSync("./node_modules/redux-persist/types/integration/react.d.ts", fs.readFileSync("./scripts/redux-persist-react-fix-file/react.d.ts"));
};
