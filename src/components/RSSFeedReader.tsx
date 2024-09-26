import React, { useEffect, useState } from "react";

const RSSFeedReader = ({ rssUrl }) => {
  const [feedData, setFeedData] = useState([]);

  useEffect(() => {
    const fetchRSSFeed = async () => {
      try {
        const response = await fetch(rssUrl);
        const text = await response.text();

        // Parse the XML
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, "text/xml");

        // Extract RSS items
        const items = xmlDoc.querySelectorAll("item");
        const feedItems = Array.from(items).map((item) => ({
          title: item.querySelector("title").textContent,
          link: item.querySelector("link").textContent,
          duration: item.querySelector("duration")?.textContent || "N/A",
          thumb: item.querySelector("thumb")?.textContent || "",
          thumb_large: item.querySelector("thumb_large")?.textContent || "",
          embed: item.querySelector("embed")?.textContent || "",
          pubDate: item.querySelector("pubDate")?.textContent || "Unknown",
        }));

        setFeedData(feedItems);
      } catch (error) {
        console.error("Failed to fetch RSS feed", error);
      }
    };

    fetchRSSFeed();
  }, [rssUrl]);

  return (
    <div>
      <h1>RSS Feed</h1>
      <ul>
        {feedData.map((item, index) => (
          <li key={index}>
            <h2>{item.title}</h2>
            <a href={item.link}>Watch Video</a>
            <p>Duration: {item.duration} seconds</p>
            <img src={item.thumb} alt={`Thumbnail of ${item.title}`} />
            <img src={item.thumb_large} alt={`Large thumbnail of ${item.title}`} />
            <p>Published on: {new Date(item.pubDate).toLocaleDateString()}</p>
            <div dangerouslySetInnerHTML={{ __html: item.embed }} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RSSFeedReader;
