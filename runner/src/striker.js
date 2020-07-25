const program = require("commander");
const Stryker_1 = require("@stryker-mutator/core/src/Stryker");
const LogConfigurator_1 = require("@stryker-mutator/core/src/logging/LogConfigurator");

class StrykerCli {

  constructor(argv, config) {
    this.argv = argv;
    this.config = config;
  }
  run() {
    program.parse(this.argv);
    program.configFile = this.config;
    LogConfigurator_1.default.configureMainProcess(program.logLevel);
    return new Stryker_1.default(program).runMutationTest();
  }
}

module.exports = StrykerCli;