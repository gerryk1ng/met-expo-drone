import "expo-dev-client";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import dgram from "react-native-udp";

import drone from "./drone.js";

function randomPort() {
  return (Math.random() * 60536) | (0 + 5000); // 60536-65536
}

// only works for 8-bit chars
function toByteArray(obj) {
  var uint = new Uint8Array(obj.length);
  for (var i = 0, l = obj.length; i < l; i++) {
    uint[i] = obj.charCodeAt(i);
  }

  return new Uint8Array(uint);
}

export default function App() {

  const [chatter, setChatter] = useState([]);

  const updateChatter = (msg) => {
    setChatter((prev) => prev.concat([msg]));
  };

  
  useEffect(() => {

    let a = dgram.createSocket("udp4");
    let aPort = randomPort();
    a.bind(aPort, function (err) {
      if (err) throw err;
      updateChatter("a bound to " + JSON.stringify(a.address()));
    });
    
    //let b = dgram.createSocket("udp4");
    //var bIp = drone.ip
    //var bPort = drone.port;
    //b.bind(bPort, function (err) {
    //  if (err) throw err;
    //  updateChatter("b bound to " + JSON.stringify(b.address()));
    //});

    a.on("message", function (data, rinfo) {
      var str = String.fromCharCode.apply(null, new Uint8Array(data));
      updateChatter("a received echo " + str + " " + JSON.stringify(rinfo));
      a.close();
      a = null;
    //  b.close();
    //  b = null;
    });
const data = "Hello";

      a.send(data, 0, data.length, 4000, "127.0.0.1", function (err) {
        if (err) throw err;
        updateChatter("b echoed data");
      });
    //});

    //b.on("message", function (data, rinfo) {
    //  var str = String.fromCharCode.apply(null, new Uint8Array(data));
    //  updateChatter("b received " + str + " " + JSON.stringify(rinfo));

      // echo back
    //  b.send(data, 0, data.length, aPort, "127.0.0.1", function (err) {
    //    if (err) throw err;
    //    updateChatter("b echoed data");
    //  });
    //});

    //b.once("listening", function () {
    //  var msg = toByteArray("hello");
    //  a.send(msg, 0, msg.length, bPort, "127.0.0.1", function (err) {
    //    if (err) throw err;
    //    updateChatter("a sent data");
    //  });
    //});
    
    return () => {
      if (a) a.close();
      //if (b) b.close();
    };
    
  }, []);

  return (
    <View style={styles.container}>
      <Text>{JSON.stringify(drone)}</Text>
      {chatter.map((msg, index) => (
          <Text key={index} style={styles.welcome}>
            {msg}
          </Text>
        ))}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcome: {
    fontSize: 20,
    margin: 10,
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
  },
});
