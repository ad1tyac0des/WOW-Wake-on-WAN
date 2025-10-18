#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <WiFiClientSecure.h>

//=======================================================================
// --- CONFIGURATION ---
//=======================================================================
// --- WiFi & MQTT Credentials ---
const char* ssid = "your-home-wifi-ssid";
const char* password = "your-home-wifi-password";
const char* mqtt_server = "your-mqtt-broker-ip";
const int mqtt_port = 1883;
const char* mqtt_user = "your-mqtt-username";
const char* mqtt_pass = "your-mqtt-password";

// --- MQTT Topics ---
const char* command_topic = "pc/power/command";

// --- Hardware Pins ---
const int powerButtonPin = D2; // GPIO pin connected to the optocoupler

// --- Pulse Duration Settings ---
const long minPulseDuration = 200;   // 0.2 seconds
const long maxPulseDuration = 3000;  // 3 seconds (safe limit)
const long defaultPulseDuration = 500; // 0.5 second default

//=======================================================================
// --- CLIENT OBJECTS & FUNCTIONS ---
//=======================================================================
WiFiClientSecure espClientSecure;
PubSubClient client(espClientSecure);

// --- simulate a momentary power button press ---
// Now accepts a duration parameter
void pulsePowerButton(long pulseDuration) {
  // Enforce safety limits
  if (pulseDuration < minPulseDuration) {
    pulseDuration = minPulseDuration;
  }
  if (pulseDuration > maxPulseDuration) {
    pulseDuration = maxPulseDuration;
  }

  Serial.print("Pulsing the power button for ");
  Serial.print(pulseDuration);
  Serial.println(" ms...");
  
  digitalWrite(powerButtonPin, HIGH);
  delay(pulseDuration);
  digitalWrite(powerButtonPin, LOW);
}

// --- Callback fn to parse new message format ---
void callback(char* topic, byte* payload, unsigned int length) {
  String message;
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }
  Serial.print("Message received: ");
  Serial.println(message);

  if (String(topic) == command_topic) {
    
    // Check for new format: "PULSE:1500"
    if (message.startsWith("PULSE:")) {
      String durationStr = message.substring(6); // Get text after "PULSE:"
      long duration = durationStr.toInt();       // Convert to a number

      if (duration > 0) {
        pulsePowerButton(duration);
      } else {
        Serial.println("Invalid duration. Using default.");
        pulsePowerButton(defaultPulseDuration);
      }
    } 
    // Check for old format: "TURN_ON"
    else if (message == "TURN_ON") {
      Serial.println("Legacy 'TURN_ON' command received. Using default pulse.");
      pulsePowerButton(defaultPulseDuration); // Use default if old command is sent
    }
  }
}

// --- reconnect fn ---
void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    String clientId = "wakeonwan-";
    clientId += String(random(0xffff), HEX);
    if (client.connect(clientId.c_str(), mqtt_user, mqtt_pass)) {
      Serial.println("connected!");
      // Subscribe to the command topic
      client.subscribe(command_topic);
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

// --- setup fn ---
void setup() {
  Serial.begin(9600);
  pinMode(powerButtonPin, OUTPUT);
  digitalWrite(powerButtonPin, LOW); // Ensuring button is not "pressed" at start

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected!");

  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
  espClientSecure.setInsecure();
}

// --- loop fn ---
void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
}