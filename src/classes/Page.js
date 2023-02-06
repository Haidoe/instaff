class Page {
  constructor(title) {
    this.title = title;
    this.setDocumentTitle();
  }

  setDocumentTitle() {
    document.title = `${this.title} | Instaff`;
  }

  preload() {}

  load() {
    return "";
  }

  mounted() {}

  close() {
    console.log(`${this.title} Page Closed`);
  }
}

export default Page;
