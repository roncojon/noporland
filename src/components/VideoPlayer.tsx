import React, { useEffect, useRef, useState } from "react";
import { allVideoSuggestions } from "../utils/getVideoSuggestions";
import { extractTitleFromCloudfrontUrlMainVideos, extractVideoKeyFromActualVideo, extractVideoKeyFromWindowLocation } from "../utils/globalHelpers";

// const aLotOfVids = ;
type VideoPlayerProps = {
  videoUrl: string;
  videoIndex: number;
  videoTags: string[];
  thumbnailUrl: string;
  lastMod:string
}

const VideoPlayer = ({ videoUrl, videoIndex, videoTags, thumbnailUrl, lastMod }: VideoPlayerProps) => {
  const videoRef = useRef(null);
  const [adTag, setAdTag] = useState("https://s.magsrv.com/v1/vast.php?idzone=5435190"); // Primary VAST tag
  const [isStyleBeforeAnimation, setIsStyleBeforeAnimation] = useState(true);
  // const [suggestions24, setSuggestions24] = useState(allVideoSuggestions(videoIndex).suggestions24);
  const [suggestions12, setSuggestions12] = useState(allVideoSuggestions(videoIndex).suggestions12);
  // const [isPaused, setIsPaused] = useState(false);
  const [isEnded, setIsEnded] = useState(true);

  const [duration, setDuration] = useState(null);
  // This function will be called when the video's metadata is loaded
  const handleLoadedMetadata = (event) => {
    const videoElement = event.target;
    setDuration(videoElement.duration); // Get duration in seconds
  };
  useEffect(() => {

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "VideoObject",
      "name": extractTitleFromCloudfrontUrlMainVideos(videoUrl)?? '',// extractVideoKeyFromActualVideo(encodeURI(videoUrl)),
      "description": extractTitleFromCloudfrontUrlMainVideos(videoUrl) ?? '',// video.description,
      "thumbnailUrl": encodeURI(thumbnailUrl) ?? '',
      "uploadDate": lastMod ?? '',
      "duration": `PT${Math.floor(duration / 60)}M${Math.floor(duration % 60)}S` ?? '', // e.g., "PT1H30M"
      "contentUrl": encodeURI(videoUrl) ?? '',
      // "embedUrl": video.embedUrl,
      // "interactionStatistic": {
      //   "@type": "InteractionCounter",
      //   "interactionType": { "@type": "WatchAction" },
      //   "userInteractionCount": video.views
      // },
      "keywords": videoTags.join(", ") ?? '' // Tags as keywords
    };
    const script = document.createElement('script');
    if (duration) {
      // Create a script element to add structured data
      script.id = "structureddata"
      script.type = 'application/ld+json';
      script.innerHTML = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }

    return () => {
      // document.head.removeChild(script); // Clean up script on unmount
      const scriptInTheDom = document.getElementById('structureddata');
      if (scriptInTheDom) {
        scriptInTheDom.remove();
      }
    };
  }, [duration]);

  useEffect(() => {
    // Function to load the Fluid Player script dynamically
    const loadFluidPlayer = () => {
      const script = document.createElement("script");
      script.src = "https://cdn.fluidplayer.com/v3/current/fluidplayer.min.js";
      script.async = true; // Add async attribute to the script
      script.onload = () => {

        // const suggestions12 = allVideoSuggestions(videoIndex).suggestions12;
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

        // Video end
        player.on('ended', (e) => {
          console.log("Video ended:", e);
          // console.log("VideoPausedFromEnded:", isPaused);
          setIsEnded(true);
          if (e.isTrusted)
            setIsStyleBeforeAnimation(false);
        });
        // Video end
        // player.on('pause', (e) => {
        //   console.log("VideoPaused:", e);
        //   setIsPaused(true);
        // });
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
          // setIsPaused(false);
          setIsEnded(false);
          // console.log('window.location',window.location)
          // console.log('window.location.href', window.location.href)
        
          try {
            const currentVideoKeyFromWindowLocation = extractVideoKeyFromWindowLocation(window.location.href);
            const currentVideoKeyInPlayer = extractVideoKeyFromActualVideo(e.target.innerHTML);
            function nextVideoPageLink(currentVideoInPlayer: string) {
              const videoKey = currentVideoInPlayer;
              console.log('videoKeyvideoKey', videoKey)
              // console.log('videoKeyvideoKeysuggestions12', suggestions12[0].title)
              const index = suggestions12.findIndex((video) => { console.log('videoKeyvideoKeysuggestions12', video.title); return extractVideoKeyFromWindowLocation(video.sources[0].url) === videoKey });
              console.log('indexxxxx', index)
              const nextVideoTags = suggestions12.find(v => v.id === index.toString()).tags;
              const videoUrl = `/videos/${encodeURI(videoKey)}?tags=${encodeURIComponent(JSON.stringify(nextVideoTags))}&index=${index}`;
              return videoUrl;
            }

            console.log('currentVideoKeyInPlayer', currentVideoKeyInPlayer)
            console.log('currentVideoKeyFromWindowLocation', currentVideoKeyFromWindowLocation)
            console.log('nextVideoPageLink(currentVideoKeyInPlayer)', nextVideoPageLink(currentVideoKeyInPlayer))

            if (currentVideoKeyFromWindowLocation !== currentVideoKeyInPlayer) {
              player.pause();
              // console.log('DIFFERENTTTSSS')
              window.location.href = nextVideoPageLink(currentVideoKeyInPlayer);
            }
          } catch (error) {
            console.log('errorWhenClickingVideoSuggestion', error)
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

  // useEffect(() => {
  //   if (!isEnded)
  //     setIsStyleBeforeAnimation(true);
  // }, [isEnded])

  useEffect(() => {
    if (!isEnded)
      setIsStyleBeforeAnimation(true);
    const progressBarDivv = document.querySelector('#reverse_progress_bar');
    if (videoRef.current && /* isEnded &&  */ !progressBarDivv) {
      const fluid_video_wrapper = document.querySelector('.fluid_video_wrapper');
      if (fluid_video_wrapper) {
        // skipOffsetElement.classList.add('z-[101]');
        const progressBarDiv = document.createElement('div');
        progressBarDiv.id = 'reverse_progress_bar';
        progressBarDiv.className = `absolute top-0 z-[150] left-0 h-[3px] bg-red-600 transition-[width] duration-[45s] ease-linear w-full bg-transparent`;
        fluid_video_wrapper.appendChild(progressBarDiv);
      }
    }
  }, [isEnded])

  useEffect(() => {
    function getRandomInt(max: number): number {
      // Ensure max is a positive integer
      max = Math.floor(Math.abs(max));

      // Generate a random number between 0 and max (inclusive)
      return Math.floor(Math.random() * (max + 1));
    }

    const goToNextVideo = setTimeout(() => {
      if (videoRef.current && isEnded && !isStyleBeforeAnimation) {
        const randomVidIndex = getRandomInt(12);
        const nextVideoSrcUrl = suggestions12[randomVidIndex].sources[0].url;
        const nextVideoTags = suggestions12[randomVidIndex].tags;
        const index = suggestions12[randomVidIndex].id;
        const currentVideoKey = nextVideoSrcUrl.split('MainVideos/').pop();
        const nextVideoUrl = `/videos/${currentVideoKey}?tags=${encodeURIComponent(JSON.stringify(nextVideoTags))}&index=${index}`;
        window.location.href = nextVideoUrl;
      }
    }, 45000);
    if (videoRef.current) {
      const progressBarDiv = document.querySelector('#reverse_progress_bar');
      if (progressBarDiv) {
        progressBarDiv.className = `absolute top-0 z-[150] left-0 h-[3px] bg-red-600 transition-[width] duration-[45s] ease-linear ${isStyleBeforeAnimation ? 'w-full bg-transparent' : 'w-0'
          }`;
      }
    }
    return () => {
      clearTimeout(goToNextVideo);
    };
  }, [isStyleBeforeAnimation]);

  return (
    <div className="relative w-full h-full aspect-[16/9]">
      <video
        id="example-player"
        ref={videoRef}
        className="w-full h-full bg-[#171313] rounded-lg  border-t-2 border-t-transparent"
        controls
        preload="metadata"
        onLoadedMetadata={handleLoadedMetadata}
      >
        <source src={videoUrl} type="video/mp4" />
      </video>
    </div>
  );
};

export default VideoPlayer;

