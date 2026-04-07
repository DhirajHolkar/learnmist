

import TopicCardsLayout from "@/components/TopicCardsLayout";

export default async function Page({ params }) {

  const { subject } = await params;


  return <TopicCardsLayout subject={subject} />;

}