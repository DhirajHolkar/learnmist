

// import SubjectCardsLayout from "../components/SubjectCardsLayout"
import TopicCategoryCardsLayout from "@/components/TopicCategoryCardsLayout"
import Banner from "../components/Banner"
// import TopicCardsLayout from "@/components/TopicCardsLayout"


export default async function Home() {


  return (
    <>

      {/* banner section  */}
      <Banner/>

      {/* subject cards section */}
      {/* <SubjectCardsLayout/> */}

      {/* topic cards section */}
      {/* <TopicCardsLayout subject={'computer-science'} />; */}

      <TopicCategoryCardsLayout subject={'computer-science'}/>

    </>
  )
}




// **************************************************************************************************






// // subject cards

// import Banner from "@/components/Banner";
// import SubjectCardsLayout from "@/components/SubjectCardsLayout";
// import { sanityClient } from "@/lib/sanityClient";

// export default async function Home() {

//   const subjects = await sanityClient.fetch(`
//     *[_type == "subject"]
//     | order(order asc) {
//       _id,
//       title,
//       image,
//       "slug": slug.current
//     }
//   `);

//   return (
//     <>
//       {/* banner section */}
//       <Banner />

//       {/* subject cards */}
//       <SubjectCardsLayout subjects={subjects} />
//     </>
//   );
// }