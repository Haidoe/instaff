class GlobalState {
  constructor() {
    this.preventPopState = false;
    this.user = null;
  }
}

const globalState = new GlobalState();

export default globalState;
