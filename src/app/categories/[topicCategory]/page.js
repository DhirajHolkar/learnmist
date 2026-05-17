

import TopicCardsLayout from "@/components/TopicCardsLayout";


export default async function Page({params}){

    const {topicCategory} = await params;

    return <TopicCardsLayout topicCategory={topicCategory}/>;

}