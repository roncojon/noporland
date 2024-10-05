function loadAdProviderScript(scriptUrl, callback) {
    window.addEventListener('DOMContentLoaded', function() {
        const script = document.createElement('script');
        script.async = true;
        script.type = 'application/javascript';
        script.src = scriptUrl;

        // Detect when the script is loaded
        script.onload = function() {
            console.log(`${scriptUrl} has been loaded successfully.`);
            if (callback) {
                callback();
            }
        };

        // Handle script load errors
        script.onerror = function() {
            console.error(`Error loading script: ${scriptUrl}`);
        };

        document.body.appendChild(script);
    });
}

function initializeAdProvider() {
    window.AdProvider = window.AdProvider || [];
    window.AdProvider.push({"serve": {}});
}

// Load the ad-provider script and then initialize AdProvider
loadAdProviderScript('https://a.magsrv.com/ad-provider.js', initializeAdProvider);
