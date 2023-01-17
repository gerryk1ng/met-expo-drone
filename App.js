import  React, {useRef, useState} from  'react';
import {Button, SafeAreaView, StatusBar, StyleSheet, View} from  'react-native';
import  Tello  from  'rn-dji-tello';


const  App = () => {
  const [init, setInit] = useState<boolean>(false);
  const  drone = useRef<Tello>();

  const  onInit = () => {
    try {
      drone.current = new  Tello();

      drone.current.on('connection', () => {
       setInit(true);

       console.log('Connected to drone');

      });

      drone.current.on('state', state  => {
        console.log('Received State > ', state);
      });

      drone.current.on('send', (err, length) => {
        if (err) {
          console.log('error', err);
        }
        console.log(`Sent command is ${length} long`);
      });


      drone.current.on('message', message  => {
        console.log('Recieved Message > ', message);
      });
 
    } catch (error) {
      console.error(error);
      setInit(false);
    }
  };

  const  run = async () => {
    await  drone.current?.send('takeoff');
    await  drone.current?.send('battery?');
    await  drone.current?.send('land');
  };

  return (
    <SafeAreaView  style={styles.container}>
      <StatusBar  barStyle="light-content"  />
      <View  style={styles.viewWrapper}>
        <Button  title="Run"  disabled={!init}  onPress={run}  />
        <Button  title="Init"  disabled={init}  onPress={onInit}  />
      </View>
    </SafeAreaView>
  );

};