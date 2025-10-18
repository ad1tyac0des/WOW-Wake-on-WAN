<div align="center">

![banner-wow3.png](https://i.postimg.cc/9Xy75XRV/banner-wow3.png)

[![Arduino](https://img.shields.io/badge/Arduino-%2300979D.svg?style=for-the-badge&logo=arduino&logoColor=white)](https://www.arduino.cc/)
[![MQTT](https://img.shields.io/badge/MQTT-%23660066.svg?style=for-the-badge&logo=mqtt&logoColor=white)](https://mqtt.org/)
[![Node.js](https://img.shields.io/badge/Node.js-%23339933.svg?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-%23000000.svg?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-%2313AA52.svg?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/license-Apache%202.0-orange.svg?style=for-the-badge)](LICENSE)
</div>

## ✨ Overview

WOW (Wake On WAN) is a DIY solution that allows you to remotely power on your home or office PC from anywhere in the world, making it available for Remote Desktop Protocol (RDP) access. This project bridges the gap between traditional Wake-on-LAN (which only works within a local network) and the need to access your computer remotely over the internet.

## 🧩 How It Works

The system consists of three main components:

1. **Web Interface**: A secure, modern UI for authentication and sending power commands
2. **Backend Server**: Handles authentication, security, and message routing
3. **NodeMCU Hardware**: A small ESP8266-based device that physically connects to your PC's `power_sw` pins

When you're away from home and need to access your computer:
1. Log in to the WOW web interface
2. Click the "POWER ON" button
3. The system sends a secure command through MQTT to your home network
4. The NodeMCU device receives this command and `simulates` pressing your PC's power button
5. Your computer boots up and becomes available for RDP connection

## 🌟 Features

- **Secure Authentication**: JWT-based login system with rate limiting to prevent brute force attacks
- **Customizable Power Pulse**: Adjust the duration of the power button press (useful for different PC configurations)
- **Modern UI**: Sleek, responsive interface with animations and status indicators
- **MQTT Communication**: Reliable, lightweight messaging protocol for IoT device communication
- **Low Power Consumption**: The NodeMCU device uses minimal electricity while waiting for commands

## ⚡ Getting Started

### Prerequisites

- NodeMCU ESP8266 development board, optocoupler(PC817), resistor(100Ω - 250Ω)
- MQTT broker : [HiveMQ](https://www.hivemq.com/products/mqtt-cloud-broker/)(Recommended) or [Mosquitto](https://mosquitto.org/)
- Web hosting for the backend and frontend (or use a service like [Render](https://render.com/))

### Installation

1. [Hardware Setup](hardware-setup.md) - Follow this guide to handle the hardware connections, upload the firmware.
2. MQTT Broker Setup:
   - using HiveMQ, create an account and set up a new broker.
    - get the secure `MQTT_BROKER`, `MQTT_USER`, and `MQTT_PASS`.

3. MongoDB Setup:
   - using MongoDB Atlas, create an account and set up a new cluster.
   - get the connection string. `MONGODB_URI`
4. Backend Setup:
   ```bash
   cd backend
   npm install
   ```
5. Configure environment variables in a `.env` file:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secure_jwt_secret
   MQTT_BROKER=wss://your_broker_address:8884/mqtt
   MQTT_USER=your_mqtt_username
   MQTT_PASS=your_mqtt_password
   ```
6. Start the backend:
   ```bash
   npm start
   ```
7. Access the web interface by navigating to the server address in your browser

## 🛡️ Security Considerations

- The system uses HTTPS and secure cookies for web communication
- Authentication is required before sending any power commands
- MQTT communication can be configured with TLS for additional security
- Rate limiting prevents brute force attacks

## 🔧 Troubleshooting

- **PC doesn't power on**: Check the hardware connections and verify the NodeMCU is receiving commands
- **Can't connect to web interface**: Ensure your backend server is running and accessible
- **Authentication issues**: Verify your MongoDB connection and user credentials
- **MQTT connection problems**: Check your broker settings and network configuration

## 🚀 Future Enhancements

- Power status monitoring
- Scheduled power on/off
- Siri/Alexa/Google Assistant integration


## 🤝 Contributions

Contributions are welcome! Feel free to:

- Report bugs
- Suggest new features
- Submit pull requests

## 📄 License

[![License](https://img.shields.io/badge/license-Apache%202.0-orange.svg?style=for-the-badge)](LICENSE)

This project is open source and available under the [Apache License 2.0](LICENSE). This license requires that you:

- Include a copy of the license in any redistribution
- Clearly state any significant changes made to the code
- Preserve all copyright, patent, trademark, and attribution notices
- Include the original author's name when using this project

---

**Note**: This project is for educational purposes. Always ensure you have proper authorization to remotely access computers in your organization.