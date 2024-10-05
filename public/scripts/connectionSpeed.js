export function isConnectionFast() {
  if ('connection' in navigator) {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const effectiveType = connection.effectiveType;
    
    console.log('connectionconnection', connection)
    console.log('effectiveType', effectiveType)

    // Consider connection fast if it's 4G or WiFi
    return effectiveType === '4g' || effectiveType === 'wifi';
  }
  return false;
}
