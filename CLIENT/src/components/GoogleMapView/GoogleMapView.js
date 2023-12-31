import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Button, Icon } from "react-native-elements";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import io from "socket.io-client";
import { Modal } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const socket = io("wss://websocket-server-hopspot.glitch.me/");

const LayerOption = ({ onPress }) => (
  <TouchableOpacity style={styles.layerOption} onPress={onPress}>
    <MaterialCommunityIcons name="layers" color="white" size={24} />
  </TouchableOpacity>
);
const GoogleMapView = () => {
  const [location, setLocation] = useState(null);
  const [locationUpdates, setLocationUpdates] = useState([]);
  const [userAddress, setUserAddress] = useState("");
  const [layerMenuVisible, setLayerMenuVisible] = useState(false);

  const shareLocation = async () => {
    try {
      // Get the current location
      let location = await Location.getCurrentPositionAsync({});
      console.log("Location shared:", location);

      // Get the address from the coordinates using the Geocoding API
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.coords.latitude},${location.coords.longitude}&key=AIzaSyAkNA3MvoAczGTmO4gSqCbwKho1xPqRKyI`
      );

      const data = await response.json();

      if (data.status === "OK" && data.results.length > 0) {
        // Extract the formatted address from the response
        const formattedAddress = data.results[0].formatted_address;
        console.log("Formatted Address:", formattedAddress);

        // Set the location and address in state
        setLocation(location);
        setUserAddress(formattedAddress);

        // Emit the location data to the Socket.io server
        socket.emit("updateLocation", {
          location: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
          address: formattedAddress, // Send the formatted address to the server
        });
      } else {
        console.error("Geocoding API request failed");
      }
    } catch (error) {
      console.error("Error sharing location:", error);
    }
  };

  useEffect(() => {
    // Listen for location updates from the server
    socket.on("locationUpdate", (data) => {
      console.log("Location update received:", data);

      // Update the locationUpdates state to trigger a re-render
      setLocationUpdates((prevUpdates) => [...prevUpdates, data]);
    });

    // Clean up the event listener when the component unmounts
    return () => {
      socket.off("locationUpdate");
    };
  }, []);

  const Legend = () => (
    <View style={styles.legendContainer}>
      <Text style={styles.legendText}>Legend:</Text>
      <View style={styles.legendItem}>
        <View style={[styles.legendColor, { backgroundColor: "blue" }]} />
        <Text style={styles.legendLabel}>Vehicle A</Text>
      </View>
      <View style={styles.legendItem}>
        <View style={[styles.legendColor, { backgroundColor: "red" }]} />
        <Text style={styles.legendLabel}>Vehicle B</Text>
      </View>
      {/* Add more legend items as needed */}
    </View>
  );
  const LayerOption = ({ onPress }) => (
    <TouchableOpacity style={styles.layerOption} onPress={onPress}>
      <MaterialCommunityIcons name="layers" color="white" size={24} />
    </TouchableOpacity>
  );

  const handleLayerPress = () => {
    setLayerMenuVisible(!layerMenuVisible);
  };
  const LayerMenu = ({ visible, onRequestClose }) => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onRequestClose}
      >
        <View style={styles.layerMenuContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {/* Terrain Option 1 */}
            <TouchableOpacity style={styles.layerMenuItem}>
              {/* Add option icon or content */}
            </TouchableOpacity>

            {/* Terrain Option 2 */}
            <TouchableOpacity style={styles.layerMenuItem}>
              {/* Add option icon or content */}
            </TouchableOpacity>

            {/* Terrain Option 3 */}
            <TouchableOpacity style={styles.layerMenuItem}>
              {/* Add option icon or content */}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView>
      {/* <Legend /> */}
      <TouchableOpacity
        style={
          (styles.button,
          {
            backgroundColor: "transparent",
            top: "0%",
            right: "32%",
            zIndex: 1,
            position: "absolute",

            height: 100,
          })
        }
        onPress={shareLocation}
        activeOpacity={0.7}
      >
        <Icon
          name="map-marker"
          type="font-awesome"
          color="black"
          style={styles.icon}
        />
        <Text style={styles.buttonText}>Share Location</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity
        onPress={shareLocation}
        style={{
          backgroundColor: "#575757",
          bottom: 400,
          zIndex: 1,
          position: "absolute",

          height: 100,
        }}
      >
        <Text>Press me1</Text>
      </TouchableOpacity> */}

      <MapView
        style={styles.map}
        provider="google"
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={true}
        showsTraffic={true}
        tintColor="green"
        initialRegion={{
          latitude: 8.486097, // Local latitude
          longitude: 124.657379, // Local longitude
          latitudeDelta: 0.1522, // Zoom level
          longitudeDelta: 0.0321, // Zoom level
        }}
      >
        {locationUpdates.map((update, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: update.location.latitude,
              longitude: update.location.longitude,
            }}
            title={update.address}
          />
        ))}
      </MapView>
      {/* Layer Option */}
      <LayerOption onPress={handleLayerPress} />

      {/* Layer Menu */}
      <LayerMenu visible={layerMenuVisible} onRequestClose={handleLayerPress} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    backgroundColor: "#575757",
    position: "absolute",
    bottom: 400,
    zIndex: 1,
    height: 100,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 20,
    paddingRight: 20,
  },
  icon: {
    marginRight: 10,
  },
  buttonText: {
    color: "black",
    fontSize: 20,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  buttonText: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
  },
  legendContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  legendText: {
    marginRight: 5,
    fontWeight: "bold",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  legendColor: {
    width: 20,
    height: 20,
    marginRight: 5,
    borderRadius: 10,
  },
  legendLabel: {
    fontWeight: "bold",
  },
  layerOption: {
    position: "absolute",
    bottom: 90,
    right: 20,
    backgroundColor: "green",
    padding: 10,
    borderRadius: 20,
  },
  layerMenuContainer: {
    position: "absolute",
    bottom: 93,
    left: 215,
    backgroundColor: "white",
    elevation: 5,
    borderRadius: 10,
    padding: 10,
  },
  layerMenuItem: {
    padding: 10,
    marginRight: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});

export default GoogleMapView;
