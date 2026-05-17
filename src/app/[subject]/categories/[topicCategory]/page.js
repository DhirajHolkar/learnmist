

import TopicCardsLayout from "@/components/TopicCardsLayout";


export default async function Page({params}){

    const {subject, topicCategory} = await params;

    return <TopicCardsLayout subject={subject} topicCategory={topicCategory}/>;

}