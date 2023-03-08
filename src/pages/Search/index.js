import Page from "../../classes/Page";
// import { collection, getFirestore } from "firebase/firestore";
import { getFirestore, collection, getDocs } from "firebase/firestore";


class Search extends Page {
    constructor() {
        super("Search")
    }

    async load() {
        return `
        <div id="search-page"> 
        <h2> Welcome to Searching Page </h2>
        sdadsadadad
        </div>
    `;
    }


    async mounted() {
        // const searchPage = document.querySelector("#search-page");
        // searchPage.innerHTML = "Hello World world @@@";

        const db = getFirestore();
        const docRef = collection(db, "jobPostings")

        // const jobPostingCol = collection(db, "jobPostings");
        // const jobPostiongSnap = await getDoc(jobPostingCol);
        const docSnap = await getDocs(docRef)
        const list = docSnap.docs.map(doc => {
            return doc.data();
        })

        console.log(list);
        // if (docSnap.exists()) {
        //     console.log("Document data:", docSnap.data());
        //   } else {
        //     // doc.data() will be undefined in this case
        //     console.log("No such document!");
        //   }
    }


}

export default Search;