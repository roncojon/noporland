// components/VideoPlayer.jsx
import React from "react";

const VideoPlayer = ({ videoUrl }) => {
    return (
        <video
            className=" w-full bg-[#171313] rounded-lg"
            controls
            preload="auto"
            VAST-URL="https://s.magsrv.com/v1/vast.php?idzone=5435190"
            src={videoUrl}
            style={{ height: "100%", aspectRatio: "16/9" }}
        >
        </video>
    );
};

export default VideoPlayer;

// import React, { useEffect, useRef } from "react";
// import videojs from "video.js";
// import "videojs-contrib-ads"; // Video.js ads plugin
// import "videojs-ima"; // Google IMA plugin for VAST ads

// const VideoPlayer = ({ videoUrl }) => {
//   const videoRef = useRef(null);

//   useEffect(() => {
//     // Initialize the Video.js player
//     const player = videojs(videoRef.current, {
//       controls: true,
//       autoplay: false,
//       preload: "auto",
//       fluid: true, // Responsive video
//       sources: [{ src: videoUrl, type: "video/mp4" }],
//     });

//     // Initialize the IMA plugin for VAST ads
//     // @ts-ignore
//     player.ima({
//       id: "content_video", // The ID of your video element
//       adTagUrl: "https://s.magsrv.com/v1/vast.php?idzone=5435190", // Your VAST-URL
//     });
//     // player.ima({
//     //   id: "content_video",
//     //   adTagUrl: "https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/21775744923/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dlinear&correlator=", // Google test VAST URL
//     // });
    
//     // Clean up the player when the component is unmounted
//     return () => {
//       if (player) {
//         player.dispose();
//       }
//     };
//   }, [videoUrl]);

//   return (
//     <div>
//       {/* Video.js Player */}
//       <video
//         id="content_video"
//         className="video-js vjs-default-skin w-full bg-[#171313] rounded-lg"
//         ref={videoRef}
//         // style={{ height: "100%", aspectRatio: "16/9" }}
//       ></video>
//     </div>
//   );
// };

// export default VideoPlayer;

