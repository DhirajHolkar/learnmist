

// import SubjectCardsLayout from "../components/SubjectCardsLayout"
import Banner from "../components/Banner"
import TopicCardsLayout from "@/components/TopicCardsLayout"


export default async function Home() {


  return (
    <>

      {/* banner section  */}
      <Banner/>

      {/* subject cards section */}
      {/* <SubjectCardsLayout/> */}

      {/* topic cards section */}
      <TopicCardsLayout subject={'computer-science'} />;

    </>
  )
}