// // components/VideoPlayer.jsx
// import React from "react";

// const VideoPlayer = ({ videoUrl }) => {
//     return (
//         <video
//             className=" w-full bg-[#171313] rounded-lg"
//             controls
//             preload="auto"
//             VAST-URL="https://s.magsrv.com/v1/vast.php?idzone=5435190"
//             src={videoUrl}
//             style={{ height: "100%", aspectRatio: "16/9" }}
//         >
//         </video>
//     );
// };

// export default VideoPlayer;







// import React, { useEffect, useRef } from "react";

// const VideoPlayer = ({ videoUrl }) => {
//   const videoRef = useRef(null);

//   useEffect(() => {
//     // Function to load the Fluid Player script dynamically
//     const loadFluidPlayer = () => {
//       const script = document.createElement("script");
//       script.src = "https://cdn.fluidplayer.com/v3/current/fluidplayer.min.js";
//       script.onload = () => {
//         // if (window.fluidPlayer) {
//         //   // Use the id of the video element to initialize Fluid Player
//         //   window.
//         //@ts-ignore
//           fluidPlayer("example-player", {
//             vastOptions: {
//               adList: [
//                 {
//                   roll: "preRoll", // Pre-roll ad
//                   vastTag: "https://s.magsrv.com/v1/vast.php?idzone=5435190",/* 5435190   5435280 */
//                 },
//                 // {
//                 //   roll: "midRoll", // Mid-roll ad
//                 //   vastTag: "https://s.magsrv.com/splash.php?idzone=5435248",
//                 // },
//               ],
//             },
//             layoutControls: {
//               autoPlay: false,
//               preload: "auto",
//               fillToContainer: true
//             },
//           });
//         // }
//       };
//       document.body.appendChild(script);
//     };

//     loadFluidPlayer();

//     return () => {
//       // Cleanup: remove the script when the component is unmounted
//       const script = document.querySelector(
//         'script[src="https://cdn.fluidplayer.com/v3/current/fluidplayer.min.js"]'
//       );
//       if (script) {
//         script.remove();
//       }
//     };
//   }, [videoUrl]);

//   return (
//     <div className=" w-full h-full">
//       <video
//         id="example-player"  // Use a valid id that matches in fluidPlayer initialization
//         ref={videoRef}
//         className="w-full h-full bg-[#171313] rounded-lg " /* aspect-[16/9] */
//         controls
//         // src={videoUrl}
//       >
//         <source src={videoUrl} type="video/mp4" />
//       </video>
//       </div>
//   );
// };

// export default VideoPlayer;


import React, { useEffect, useRef, useState } from "react";

const VideoPlayer = ({ videoUrl }) => {
  const videoRef = useRef(null);
  const [adTag, setAdTag] = useState("https://s.magsrv.com/v1/vast.php?idzone=5435190"); // Primary VAST tag

  useEffect(() => {
    // Function to load the Fluid Player script dynamically
    const loadFluidPlayer = () => {
      const script = document.createElement("script");
      script.src = "https://cdn.fluidplayer.com/v3/current/fluidplayer.min.js";
      script.onload = () => {
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
                vastTag: "https://s.magsrv.com/splash.php?idzone=5435248", // Use the dynamic adTag state here
              },
              // {
              //   roll: "onPauseRoll", // Pre-roll ad
              //   vastTag: "https://s.magsrv.com/splash.php?idzone=5435342", // Use the dynamic adTag state here
              // },
            ],
          },
          layoutControls: {
            autoPlay: false,
            preload: "auto",
            fillToContainer: true,
          },
        });

        // Add error handling for VAST failure
        player.on('error', (error) => {
          console.error("VAST ad error:", error);

          // Check if the error is related to VAST loading
          if (error.code === 900) { // 900 is the Fluid Player code for VAST failure
            console.log("VAST ad failed to load. Switching to fallback VAST tag...");

            // Switch to another fallback VAST tag
            setAdTag("https://s.magsrv.com/v1/vast.php?idzone=5435280");
          }
        });
      };
      document.body.appendChild(script);
    };

    loadFluidPlayer();

    return () => {
      // Cleanup: remove the script when the component is unmounted
      const script = document.querySelector(
        'script[src="https://cdn.fluidplayer.com/v3/current/fluidplayer.min.js"]'
      );
      if (script) {
        script.remove();
      }
    };
  }, [adTag, videoUrl]); // Re-run the effect when adTag or videoUrl changes

  return (
      <video
        id="example-player"  // Use a valid id that matches in fluidPlayer initialization
        ref={videoRef}
        className="w-full h-full bg-[#171313] rounded-lg"
        controls
      >
        <source src={videoUrl} type="video/mp4" />
      </video>
  );
};

export default VideoPlayer;

