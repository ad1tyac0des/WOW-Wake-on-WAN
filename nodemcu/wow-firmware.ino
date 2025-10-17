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

//=======================================================================
// --- CLIENT OBJECTS & FUNCTIONS ---
//=======================================================================
WiFiClientSecure espClientSecure;
PubSubClient client(espClientSecure);

// --- simulate a momentary power button press ---
void pulsePowerButton() {
  Serial.println("Received TURN_ON command. Pulsing the power button...");
  digitalWrite(powerButtonPin, HIGH);
  delay(500);
  digitalWrite(powerButtonPin, LOW);
}

// --- Callback function for incoming MQTT messages ---
void callback(char* topic, byte* payload, unsigned int length) {
  String message;
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }
  Serial.print("Message received: ");
  Serial.println(message);

  // If we receive a "TURN_ON" command, pulse the button unconditionally.
  if (String(topic) == command_topic && message == "TURN_ON") {
    pulsePowerButton();
  }
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    String clientId = "NodeMCU-PC-Controller-";
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

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
}