import marked from "marked";
import cn from "classnames";
import * as React from "react";
import { NewsArticle } from "../../utils/news";

interface FeedStoryProps {
  story: NewsArticle;
  key: string;
}

export default function FeedStory({ story, key }: FeedStoryProps) {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <div
      className="flex flex-col items-start bg-white rounded-md p-5 mt-10"
      key={key}
    >
      <div className="flex flex-col tablet:flex-row space-y-5 tablet:space-y-0 items-start tablet:items-center">
        <h1 className="font-bold text-4xl tablet:mr-5">{story.title}</h1>
        <div className="flex space-x-5">
          {story.tags.length > 0 &&
            story.tags.map((tag, index) => (
              <p
                className="px-3 py-1 bg-blue-800 text-white uppercase rounded-md flex-wrap text-xs"
                key={tag.length * (index + 1)}
              >
                {tag}
              </p>
            ))}
        </div>
      </div>

      <hr className="h-1 w-8 bg-black my-4" />
      <div
        className={cn({
          "prose prose-green max-w-none w-full": true,
          "max-h-80 overflow-hidden": !expanded,
        })}
        dangerouslySetInnerHTML={{ __html: marked(story.content) }}
      />

      <div className="grid place-items-center w-full">
        <button
          className=" hover:bg-blue-100 uppercase px-3 py-1 text-decaBlue transition-colors duration-300 rounded-md"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "COLLAPSE" : "EXPAND"}
        </button>
      </div>
    </div>
  );
}
