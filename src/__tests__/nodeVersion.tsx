import fs from 'fs';
import path from 'path';

describe("node version running this test is...", () => {
    const nodeVersion = process.version.replace(/^v/, '');
    it("same as in eas.json (for EAS Build)", () => {
        const easJson = require('../../eas.json');
        expect(easJson.build.production.node).toEqual(nodeVersion);
    });
    it("same as in .node-version (for local development and GitHub Actions)", () => {
        const nodeVersionFilePath = path.join(__dirname, "../../.node-version");
        const nodeVersionFile = fs.readFileSync(nodeVersionFilePath, {encoding: 'utf8'});
        expect(nodeVersionFile).toEqual(nodeVersion);
    });

});
  