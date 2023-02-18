import * as chai from "chai";
import sinonChai from "sinon-chai";
import chaiAsPromised from "chai-as-promised";
const {expect} = chai;
chai.use(sinonChai)
chai.use(chaiAsPromised);


describe("INIT", () => {

    it("should execute this test", () => {
            expect("hii").to.be.equal("hii")
    })
})