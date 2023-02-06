import Pages from "../classes/Page";
import { readURL } from "../js/utils";
import "./home.scss";
class Home extends Pages {
  constructor() {
    super("Home");
  }

  async load() {
    return `
      <div class="home-page">
        <h2> Home Page</h2>

        <ul>
          <li>
            <a href="/test/1asdas" data-link>
              Redirect I
            </a>
          </li>

          <li>
            <a href="/test/another" data-link>
            Redirect II
            </a>
          </li>
        </ul>

        <form action="#" id="formUpload">
          <label for="fileInput"></label>
          <input type="file" id="fileInput" accept="image/png, image/jpeg" required />
          <button type="Upload"> Submit</button>
        </form>
      
        <img src="" alt="uploaded image" id="imgDisplay">
      </div>
    `;
  }

  async mounted() {
    let image;

    fileInput.addEventListener("change", async (e) => {
      image = e.target.files[0];
      const url = await readURL(image);
      imgDisplay.src = url;
    });
  }
}

export default Home;
