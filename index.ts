class User {
  public name: string;
  public money: number;

  constructor(name: string, money: number) {
    this.name = name;
    this.money = money;
  }

  play(gameMachine: GameMachine, moneyForGame: number) {
    this.money -= moneyForGame;
    this.money += gameMachine.play(moneyForGame);
  }
}

class SuperUser extends User {
  constructor(name: string, money: number) {
    super(name, money);
  }

  private casinos = [];

  get casinosList(): any[] {
    return this.casinos;
  }

  getCasino(name: string): Casino {
    return this.casinosList.find((casino) => casino.name === name);
  }

  createCasino(name: string, money: number) {
    this.casinos.push(new Casino(name, money));
  }
}

class Casino {
  private name: string;
  private money: number;

  private gameMachines: GameMachine[] = [];

  createGameMachine(money: number, name: string) {
    // reduce all Casino money because we add this money to GameMachine
    this.money -= money;
    this.gameMachines.push(new GameMachine(money, name));
  }

  getGameMachine(name: string): GameMachine {
    return this.gameMachines.find((gameMashine) => gameMashine.machineName === name);
  }

  constructor(name: string, money: number) {
    this.name = name;
    this.money = money;
  }

  removeGameMachine(name: string) {
    const selectedGameMachine = this.gameMachines.find(
      (gameMachine) => gameMachine.machineName === name
    );
    if (selectedGameMachine) {
      const machineMoney = selectedGameMachine.removeAllMoney();
      this.gameMachines = this.gameMachines.filter(
        (gameMachine) => gameMachine.machineName !== name
      );
      this.gameMachines = this.gameMachines.map((gameMachine) => {
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
    this.gameMachines.forEach((gameMachine) => {
      allMoney += gameMachine.moneyCount;
    });
    return allMoney + this.money;
  }

  get getMachineCount() {
    return this.gameMachines.length;
  }
}

class GameMachine {
  private name: string;
  private money: number;

  get machineName() {
    return this.name
  }

  constructor(money: number, name: string) {
    this.name = name;
    this.money = money;
  }

  get moneyCount() {
    return this.money;
  }

  get getMoney() {
    return this.money;
  }

  removeMoney(moneyCount: number) {
    if (moneyCount <= this.money) {
      this.money = this.money - moneyCount;
    }
  }

  removeAllMoney() {
    const allMoney = this.moneyCount;
    this.money = 0;
    return allMoney;
  }

  addMoney(moneyCount: number) {
    this.money += moneyCount;
  }

  play(userMoney: number) {
    this.money += userMoney;
    if (userMoney * 2 > this.money || userMoney * 3 > this.money) {
      this.money -= userMoney;
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
    this.money -= winningMoney;
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
