# ⚡ WOW - Hardware & Firmware Implementation Guide

This technical documentation outlines the implementation process for the Wake on WAN (WOW) system, including hardware configuration and firmware deployment.

## 1. Hardware Configuration

### Required Components

* **NodeMCU (ESP8266)** - Microcontroller unit with integrated WiFi
* **5V 1-Channel Active-HIGH Relay Module** - Switching mechanism for power control
* **Jumper Wires (3-5)** - Standard male-to-female Dupont connectors
* **Micro-USB Cable** - For programming and power delivery
* **5V USB Power Adapter** - Stable power source (5V 1A minimum specification)

---

### Wiring Specifications

The implementation consists of two primary connection interfaces: the microcontroller-to-relay connection and the relay-to-motherboard connection.

#### Interface 1: NodeMCU to Relay Module

Connect the following pins according to this specification:

| **NodeMCU Pin** | **Relay Module Pin** | **Function** |
| :-------------- | :------------------- | :--------------------------------- |
| `GND`           | `GND`                | Common Ground                      |
| `VIN`           | `VCC`                | 5V Power Supply                    |
| `D2`            | `IN`                 | Signal Control (3.3V)              |

**Technical Notes:**
* The ground connection establishes a common reference potential.
* The VIN pin on NodeMCU provides 5V pass-through from the USB power source.
* GPIO D2 is configured as the control signal for relay activation.

#### Interface 2: Relay Module to PC Motherboard

The relay module provides three terminals with the following designations:
* **`COM`** - Common terminal
* **`NO`** - Normally Open terminal
* **`NC`** - Normally Closed terminal

For this implementation, utilize the COM and NO terminals to create a normally-open circuit configuration.

**Implementation Steps:**
1. Locate the `power_sw` (or `PWR_SW`) header on the motherboard.
2. Disconnect any existing power switch connections.
3. Connect jumper wires from the relay's COM and NO terminals to the motherboard's power switch pins.
4. Terminal polarity is non-critical for this connection.

---

## 2. Firmware Implementation

The firmware deployment utilizes the Arduino development environment.

### Development Environment Setup

1. Install Arduino IDE from the [official distribution](https://www.arduino.cc/en/software).

2. Configure ESP8266 board support:
   * Navigate to **File > Preferences**
   * Add the following URL to Additional Board Manager URLs:
     ```
     http://arduino.esp8266.com/stable/package_esp8266com_index.json
     ```
   * Install ESP8266 board package via **Tools > Board > Boards Manager**

3. Install required dependencies:
   * Access library manager via **Tools > Manage Libraries**
   * Install PubSubClient library (author: Nick O'Leary)

### Firmware Deployment

1. Load the firmware source (`wow-firmware.ino`) in Arduino IDE.

2. Configure network and authentication parameters:
   ```cpp
   // --- WiFi & MQTT Credentials ---
   const char* ssid = "your-home-wifi-ssid";
   const char* password = "your-home-wifi-password";
   const char* mqtt_server = "your-mqtt-broker-address";
   const int mqtt_port = 8883;
   const char* mqtt_user = "your-mqtt-username";
   const char* mqtt_pass = "your-mqtt-password";
   ```

3. **Implementation Notes:** The firmware implements Active-HIGH relay control on GPIO D2, where HIGH signal activates the relay and LOW signal deactivates it.

4. Deployment procedure:
   * Connect NodeMCU via USB
   * Select "NodeMCU 1.0 (ESP-12E Module)" from **Tools > Board** menu
   * Select appropriate COM port from **Tools > Port** menu
   * Initiate upload process
   * Verify successful deployment via Serial Monitor (9600 baud rate)

Upon successful implementation, the system will establish network connectivity and respond to remote wake commands via the configured MQTT broker.