class GlobalState {
  constructor() {
    this.preventPopState = false;
  }
}

const globalState = new GlobalState();

export default globalState;
