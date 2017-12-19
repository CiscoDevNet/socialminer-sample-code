/* eslint-env mocha */
const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const utils = require("../../src/util/utils");
const logger = require("../../src/util/logger");

const { expect } = chai;
chai.use(sinonChai);
// suppress all logs on STDOUT
logger.transports.console.silent = true;

const _setEnvironmentDefaults = () => {
    process.env.PORT = "7777";
    process.env.FB_PAGE_ACCESS_TOKEN = "abcd123";
    process.env.FB_VERIFICATION_TOKEN = "abcd";
    process.env.VIRTUAL_ASSISTANT_NAME = "Melania";
    process.env.SOCIALMINER_HOST = "socialminer.example.com";
    process.env.SOCIALMINER_CHAT_FEED_ID = "100000";
    process.env.CCX_QUEUE_ID = "1";
};

describe("Tests for util/utils", () => {
    it("checks all mandatory env vars are defined", () => {
        _setEnvironmentDefaults();
        expect(utils.validateEnvironment).to.not.throw(ReferenceError);
    });

    it("throws ReferenceError when any env var is undefined", () => {
        _setEnvironmentDefaults();
        // deliberately remove this variable
        delete process.env.FB_PAGE_ACCESS_TOKEN;
        expect(utils.validateEnvironment).to.throw(ReferenceError);
    });

    it("throws ReferenceError when any env var is empty", () => {
        _setEnvironmentDefaults();
        // deliberately make this empty
        process.env.FB_PAGE_ACCESS_TOKEN = "       ";
        expect(utils.validateEnvironment).to.throw(ReferenceError);
    });

    it("logs provided error with its stack trace", () => {
        const spy = sinon.spy(logger, "error");
        const myError = new TypeError("This is a TypeError");
        utils.logErrorWithStackTrace(myError, "Logging a TypeError");
        expect(spy).to.have.been.calledWith("Something went wrong.", myError);
    });

    it("decodes encoded strings", () => {
        expect(utils.decodeString("<hello world>")).to.equal("&lt;hello world&gt;");
        expect(utils.decodeString("hello%20world")).to.equal("hello world");
        expect(utils.decodeString("hello+world")).to.equal("hello world");
    });
});
