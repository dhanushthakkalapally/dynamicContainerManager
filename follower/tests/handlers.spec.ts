import * as chai from "chai";
import sinonChai from "sinon-chai";
import chaiAsPromised from "chai-as-promised";
import {v4} from "uuid"
import {BrokerAsPromised, withTestConfig} from "rascal";
import _ from "lodash";
import rascalConfig from "../rascalConfig";
import {publishReadyMessage} from "../src/app";

const {expect} = chai;
chai.use(sinonChai)
chai.use(chaiAsPromised);


describe("handlers", () => {

})