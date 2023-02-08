import AuthenticatedPage from "../../classes/AuthenticatedPage";

class RatingAndFeedback extends AuthenticatedPage {
  constructor() {
    super("RatingAndFeedback") 
  }

  async load() {
    return `
    <h1>Hello World</h1>
    `
  }

  async mounted() {
    console.log("Hello from Rating")
  }
}