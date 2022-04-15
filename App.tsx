import axios from 'axios';
import React, {useState} from 'react';
import {Button, Image, PermissionsAndroid, View} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

const requestCameraPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'App Camera Permission',
        message: 'App needs access to your camera ',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Camera permission given');
    } else {
      console.log('Camera permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
};

const App = () => {
  const [sourceImage, setSourceImage] = useState([]);
  const takeImage = async () => {
    const options = {
      title: 'Select Image',

      customButtons: [
        {
          name: 'customOptionKey',

          title: 'Choose file from Custom Option',
        },
      ],

      storageOptions: {
        skipBackup: true,

        path: 'images',
      },
    };
    await requestCameraPermission();

    launchCamera(options, res => {
      console.log(res);
      if (res) setSourceImage(res);
    });
  };

  const chooseImage = async () => {
    const options = {
      title: 'Select Image',

      customButtons: [
        {
          name: 'customOptionKey',

          title: 'Choose file from Custom Option',
        },
      ],

      storageOptions: {
        skipBackup: true,

        path: 'images',
      },
    };
    await requestCameraPermission();

    launchImageLibrary(options, res => {
      console.log(res);
      if (res) setSourceImage(res);
    });
  };

  return (
    <View style={{flex: 1, margin: 20}}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Button title="take image" onPress={takeImage} />
        <Button title="choose image" onPress={chooseImage} />
      </View>

      {sourceImage?.assets &&
        sourceImage?.assets.map(({uri}) => (
          <View
            key={uri}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '50%',
            }}>
            <Image
              resizeMode="cover"
              resizeMethod="scale"
              style={{width: 200, height: 200}}
              source={{uri: uri}}
            />
          </View>
        ))}
      <View style={{position: 'absolute', bottom: 0, alignSelf: 'center'}}>
        <Button
          title="send"
          onPress={async () => {
            const config = {
              headers: {
                'Content-Type': 'multipart/form-data;',
              },
            };
            const data = new FormData();
            sourceImage?.assets &&
              data.append('file', {
                name: sourceImage?.assets[0].fileName,
                uri: sourceImage?.assets[0].uri,
                type: sourceImage?.assets[0].type,
              });

            await axios.post(
              `http://192.168.1.112:5000/upload/single`,
              data,
              config,
            );
          }}
        />
      </View>
    </View>
  );
};

export default App;
