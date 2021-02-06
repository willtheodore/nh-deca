import * as React from "react";
import marked from "marked";
import { NewsArticle } from "../utils/news";

interface StoryPreviewProps {
  story: NewsArticle;
}

export default function StoryPreview({ story }: StoryPreviewProps) {
  return (
    <>
      <h1 className="font-bold text-2xl tablet:text-3xl">{story.title}</h1>
      <hr className="my-3 tablet:my-5 h-2 w-6 bg-black" />
      <div
        className="h-64 prose-sm overflow-hidden"
        dangerouslySetInnerHTML={{ __html: marked(story.content) }}
      />
    </>
  );
}
