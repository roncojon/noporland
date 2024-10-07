import React, { useEffect, useRef, useState } from "react";
import { allVideoSuggestions } from "../utils/getVideoSuggestions";

// const aLotOfVids = ;
type VideoPlayerProps = {
  videoUrl: string;
  videoIndex: number;
}

const VideoPlayer = ({ videoUrl, videoIndex }: VideoPlayerProps) => {
  const videoRef = useRef(null);
  const [adTag, setAdTag] = useState("https://s.magsrv.com/v1/vast.php?idzone=5435190"); // Primary VAST tag


  useEffect(() => {
    // Function to load the Fluid Player script dynamically
    const loadFluidPlayer = () => {
      const script = document.createElement("script");
      script.src = "https://cdn.fluidplayer.com/v3/current/fluidplayer.min.js";
      script.async = true; // Add async attribute to the script
      script.onload = () => {

        const suggestions12 = allVideoSuggestions(videoIndex).suggestions12;
        // console.log('suggestions12',suggestions12)
        // Initialize Fluid Player with a fallback mechanism for VAST tag
        const player = window.fluidPlayer("example-player", {
          vastOptions: {
            adList: [
              {
                roll: "preRoll", // Pre-roll ad
                vastTag: adTag, // Use the dynamic adTag state here
              },
              {
                roll: "onPauseRoll", // Pre-roll ad
                // vastTag: "https://s.magsrv.com/splash.php?idzone=5435248", // Use the dynamic adTag state here
                vastTag: "https://s.magsrv.com/splash.php?idzone=5435436", // Use the dynamic adTag state here
              },
              // {
              //   roll: "midRoll", // Pre-roll ad
              //   vastTag: "https://s.magsrv.com/splash.php?idzone=5435342", // Use the dynamic adTag state here
              // },
            ],
          },
          layoutControls: {
            autoPlay: true,
            preload: "auto",
            fillToContainer: true,
            allowTheatre: false,
            miniPlayer: {
              enabled: false,
              width: 400,
              height: 225
            },
            // mute: true,
            controlBar: {
              autoHide: true,
              autoHideTimeout: 2,
              animated: true,
              playbackRates: ['x2', 'x1.5', 'x1', 'x0.5']
            },
          },
          suggestedVideos: // JSON.stringify({suggestions12}) // allVideoSuggestions(videoIndex).suggestions12
          {
            // configUrl: '/scripts/suggestions/suggestions.json',
            configUrl: `/api/suggestions12?videoIndex=${videoIndex}`,
            // configUrl: allVideoSuggestions(videoIndex).suggestions12,
          }
        });

        // Add error handling for VAST failure
        player.on('error', (error) => {
          console.error("VAST ad error:", error);

          // Check if the error is related to VAST loading
          if (error.code === 900) { // 900 is the Fluid Player code for VAST failure
            // console.log("VAST ad failed to load. Switching to fallback VAST tag...");

            // Switch to another fallback VAST tag
            setAdTag("https://s.magsrv.com/v1/vast.php?idzone=5435280");
          }
        });

        player.on('play', (e) => {
          console.log("On Play Event Triggered", e)

          // console.log('window.location',window.location)
          console.log('window.location.href', window.location.href)
          function extractVideoKeyFromWindowLocation(url) {
            // Create a new URL object to easily extract the pathname
            const urlObj = new URL(url);

            // Get the pathname part of the URL and split it by "/" to get the last part (the videoKey)
            const encodedVideoKey = urlObj.pathname.split('/').pop();

            // Decode the videoKey to return it in unencoded format
            return decodeURI(encodedVideoKey);
          }
          function extractVideoKeyFromActualVideo(sourceTag: string) {
            // Use a regular expression to extract the src attribute value
            const srcMatch = sourceTag.match(/src="([^"]+)"/);

            if (srcMatch && srcMatch[1]) {
              const url = srcMatch[1];

              // Extract the videoKey (file name) from the URL
              const videoKey = url.split('/').pop();

              // Return the unencoded videoKey
              return decodeURI(videoKey);// videoKey;
            }

            // If src is not found, return null or some error handling
            return null;
          }

          const currentVideoKeyFromWindowLocation = extractVideoKeyFromWindowLocation(window.location.href);
          const currentVideoKeyInPlayer = extractVideoKeyFromActualVideo(e.target.innerHTML);
          function nextVideoPageLink(currentVideoInPlayer: string) {
            const videoKey = currentVideoInPlayer;
            const videoUrl = `/videos/${encodeURI(videoKey)}`;
            return videoUrl;
          }
          console.log('currentVideoKeyInPlayer', currentVideoKeyInPlayer)
          console.log('currentVideoKeyFromWindowLocation', currentVideoKeyFromWindowLocation)
          if (currentVideoKeyFromWindowLocation !== currentVideoKeyInPlayer) {
            player.pause();
            // console.log('DIFFERENTTTSSS')
            window.location.href = nextVideoPageLink(currentVideoKeyInPlayer);
          }
        })
      };
      document.body.appendChild(script);
    };

    loadFluidPlayer();

    // Create a function that modifies the element's paddingBottom
    const modifySuggestedGrid = () => {
      const suggestedTileGridss = document.getElementsByClassName("suggested_tile_grid");
      if (suggestedTileGridss.length > 0) {
        const suggestedGrid = suggestedTileGridss[0] as HTMLDivElement;
        suggestedGrid.style.paddingBottom = '18px';
      }
    };

    // Create a MutationObserver that listens for changes in the DOM
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(() => {
        modifySuggestedGrid(); // Check for the element and modify when it's found
      });
    });

    // Start observing the document's body for childList changes (e.g., new elements being added)
    observer.observe(document.body, {
      childList: true,  // Observe direct children
      subtree: true     // Observe all descendants
    });

    return () => {
      // Cleanup: remove the script when the component is unmounted
      const script = document.querySelector(
        'script[src="https://cdn.fluidplayer.com/v3/current/fluidplayer.min.js"]'
      );
      if (script) {
        script.remove();
      }
      if (observer)
        observer.disconnect();
    };
  }, [adTag, videoUrl]); // Re-run the effect when adTag or videoUrl changes

  return (
    <video
      id="example-player"  // Use a valid id that matches in fluidPlayer initialization
      ref={videoRef}
      className="w-full h-full bg-[#171313] rounded-lg aspect-[16/9]"
      controls
      preload="metadata"
    >
      <source src={videoUrl} type="video/mp4" />
    </video>
  );
};

export default VideoPlayer;

