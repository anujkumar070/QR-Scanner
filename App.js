import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, Pressable} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { StatusBar } from 'expo-status-bar';
//import Clipboard from '@react-native-clipboard/clipboard';
import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-simple-toast';
import Torch from 'react-native-torch';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [text, setText] = useState('');
  const [isTorchOn, setIsTorchOn] = useState(false);

  const askForCameraPermission = () => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })()
  }

  // Request Camera Permission
  useEffect(() => {
    askForCameraPermission();
  }, []);

  // What happens when we scan the bar code
  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setText(data)
    Torch.switchState(false);
      setIsTorchOn(false);
    
  };

  // Flashlight
  const flashlight = async ()=>{
    if(isTorchOn===false)
    {
      Torch.switchState(true);
      setIsTorchOn(true);
    }
    else{
      Torch.switchState(false);
      setIsTorchOn(false);
    }
  }
  //Clipboard Copy
  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(text);
    Toast.showWithGravity('Copied to Clipboard', Toast.SHORT, Toast.BOTTOM);
  };

  // Check permissions and return the screens
  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting for camera permission</Text>
      </View>)
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={{ margin: 10 }}>No access to camera</Text>
        <Button title={'Allow Camera'} onPress={() => askForCameraPermission()} />
      </View>)
  }

  // Return the View
  return (
    
    <View style={styles.container}>
      <Text style={styles.mainHeading}>CodeScanner</Text>
      <View style={styles.barcodebox}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={{ height: 400, width: 400 }} />
      </View>
      {scanned && <Text style={styles.heading}>Scanned Text</Text>}
      <View style={styles.box}>
        
        <Text style={[styles.maintext]} selectable={true}>{text}</Text>
        {scanned&&<Pressable onPress={()=> copyToClipboard() }><Text>Copy to Clipboard</Text></Pressable>}
      </View>
      {!scanned && <Text style={styles.maintext}>Scan QR or Barcode here </Text>}
      {!scanned && <Button title={'Flashlight'} onPress={() => {flashlight() }} color='tomato' /> }
      {scanned && <Button title={'Scan again'} onPress={() => {setScanned(false); setText("") }} color='tomato' />}
      <StatusBar style="dark" />
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    margin:30,
    padding:30

  },
  mainHeading:{
    fontWeight:'bold',
    fontSize:32,
    padding:10,
    marginBottom:20
  },
  maintext: {
    fontSize: 16,
    marginBottom: 20,
  },
  barcodebox: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
    width: 300,
    overflow: 'hidden',
    borderRadius: 20,
    backgroundColor: '#fff'
  },
  heading:{
    fontWeight:'900',
    fontSize:24,
    textAlign:'center',
    margin:5
  },
  box: {
    height: 'auto',
    width: 250,
    overflow: 'hidden',
    margin: 24,
    alignItems:'center',
  
    padding:5,

  }
}

);

    