import { isConnectionFast } from './connectionSpeed.js';
// zoneid 5435448  
// SCRIPTS:
// <script async type="application/javascript" src="https://a.magsrv.com/ad-provider.js"></script> 
// <script>(AdProvider = window.AdProvider || []).push({"serve": {}});</script>

// document.addEventListener("DOMContentLoaded", function () {
  const showImgsOrVidsAccordingToConnectionSpeed = () => {
  if (isConnectionFast()) {
    // const adContainer = document.getElementById('conditionalAd');
    // const adElement = document.createElement('ins');
    // adElement.className = 'eas6a97888e20';
    // adElement.setAttribute('data-zoneid', '5435448');
    // adContainer.appendChild(adElement);
    
    // Load external script for the ad
    // const script = document.createElement('script');
    // script.src = 'https://your-ad-network.com/ad-script.js'; // Replace with the correct script URL
    // adContainer.appendChild(script);


    const vidAdContainer = document.getElementById('item_02');
    const vidAdElement = document.createElement('ins');
    vidAdElement.className = 'eas6a97888e37';
    vidAdElement.setAttribute('data-zoneid', '5435438');
    vidAdContainer.appendChild(vidAdElement);

    const vidAdContainer2 = document.getElementById('item_03');
    const vidAdElement2 = document.createElement('ins');
    vidAdElement2.className = 'eas6a97888e37';
    vidAdElement2.setAttribute('data-zoneid', '5435474');
    vidAdContainer2.appendChild(vidAdElement2);


  }
  else {
    const imgAdContainer = document.getElementById('item_02');
    const imgAdElement = document.createElement('ins');
    imgAdElement.className = 'eas6a97888e2';
    imgAdElement.setAttribute('data-zoneid', '5435438');
    imgAdContainer.appendChild(imgAdElement);

    const imgAdContainer2 = document.getElementById('item_03');
    const imgAdElement2 = document.createElement('ins');
    imgAdElement2.className = 'eas6a97888e2';
    imgAdElement2.setAttribute('data-zoneid', '5437988');
    imgAdContainer2.appendChild(imgAdElement2);
  }
}
showImgsOrVidsAccordingToConnectionSpeed();
// });


