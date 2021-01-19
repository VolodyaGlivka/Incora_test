class User {
  name;
  money;

  constructor(name, money) {
    this.name = name;
    this.money = money;
  }

  play(gameMachine, moneyForGame) {
    this.money -= moneyForGame;
    this.money += gameMachine.play(moneyForGame);
  }
}

class SuperUser extends User {
  constructor(name, money) {
    super(name, money);
  }

  _casinos = [];

  get casinosList() {
    return this._casinos;
  }

  getCasino(name) {
    return this.casinosList.find((casino) => casino.casinoName === name);
  }

  createCasino(name, money) {
    this._casinos.push(new Casino(name, money));
  }
}

class Casino {
  _name;
  _money;

  _gameMachines = [];

  constructor(name, money) {
    this._name = name;
    this._money = money;
  }

  get casinoName() {
    return this._name
  }

  createGameMachine(money, name) {
    // reduce all Casino money because we add this money to GameMachine
    this._money -= money;
    this._gameMachines.push(new GameMachine(money, name));
  }

  getGameMachine(name) {
    return this._gameMachines.find(
      (gameMashine) => gameMashine.machineName === name
    );
  }

  removeGameMachine(name) {
    const selectedGameMachine = this._gameMachines.find(
      (gameMachine) => gameMachine.machineName === name
    );
    if (selectedGameMachine) {
      const machineMoney = selectedGameMachine.removeAllMoney();
      this.gameMachines = this._gameMachines.filter(
        (gameMachine) => gameMachine.machineName !== name
      );
      this.gameMachines = this._gameMachines.map((gameMachine) => {
        gameMachine.addMoney(machineMoney / this.gameMachines.length);
        return gameMachine;
      });
    } else {
      throw new Error("No gameMachine found");
    }
  }

  get getMoney() {
    // get money from all gameMachines and money that left in casino
    let allMoney = 0;
    this._gameMachines.forEach((gameMachine) => {
      allMoney += gameMachine.moneyCount;
    });
    return allMoney + this._money;
  }

  get getMachineCount() {
    return this._gameMachines.length;
  }
}

class GameMachine {
  _name;
  _money;

  get machineName() {
    return this._name;
  }

  constructor(money, name) {
    this._name = name;
    this._money = money;
  }

  get moneyCount() {
    return this._money;
  }

  removeMoney(moneyCount) {
    if (moneyCount <= this._money) {
      this._money -= moneyCount;
    }
  }

  removeAllMoney() {
    const allMoney = this.moneyCount;
    this._money = 0;
    return allMoney;
  }

  addMoney(moneyCount) {
    this._money += moneyCount;
  }

  play(userMoney) {
    this._money += userMoney;
    if (userMoney * 2 > this._money || userMoney * 3 > this._money) {
      this._money -= userMoney;
      return userMoney;
    }
    const randomNumber = Math.floor(Math.random() * (999 - 100 + 1) + 100);
    var counts = {};
    let winningMoney = 0;
    randomNumber
      .toString()
      .split("")
      .forEach((x) => {
        counts[x] = (counts[x] || 0) + 1;
      });
    // Just for 3 digits number
    Object.keys(counts).forEach((keys) => {
      if (counts[keys] === 3) {
        winningMoney = userMoney * 3;
        return;
      } else if (counts[keys] === 2) {
        winningMoney = userMoney * 2;
        return;
      }
    });
    this._money -= winningMoney;
    return winningMoney;
  }
}

const superAdmin = new SuperUser("superUser", 500);
superAdmin.createCasino("Casino1", 200);
superAdmin.getCasino("Casino1").createGameMachine(70, "gameMachine1");
superAdmin.getCasino("Casino1").createGameMachine(70, "gameMachine2");
const selectedGameMachine = superAdmin
  .getCasino("Casino1")
  .getGameMachine("gameMachine1");

selectedGameMachine.addMoney(130);

const user1 = new User("Petro", 50);
user1.play(selectedGameMachine, 30);

superAdmin.getCasino("Casino1").removeGameMachine("gameMachine1");
const machineCount = superAdmin.getCasino("Casino1").getMachineCount;
const selectedMachineMoneyCount = superAdmin
  .getCasino("Casino1")
  .getGameMachine("gameMachine2").moneyCount;