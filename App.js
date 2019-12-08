import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TextInput,
  PermissionsAndroid,
  ScrollView,
  TouchableOpacity,
  ToastAndroid,
  Linking,
} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import Geolocation from 'react-native-geolocation-service';
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: '',
      longitude: '',
      atmData: [],
    };
  }

  async findAtm(latitude, longitude) {
    let response = await fetch(
      'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' +
        latitude +
        ',' +
        longitude +
        '&radius=1500&type=atm&key=AIzaSyC-k_IKQGfcH1_AacKsl4uMsKj0Z49YY08',
      {
        headers: {'Content-Type': 'application/json'},
      },
    );

    let responseJson = await response.json();
    //console.log(responseJson);
    await this.setState({
      atmData: responseJson.results,
    });
  }

  async permissioncheck() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        await Geolocation.getCurrentPosition(
          position => {
            //console.log(position.coords.latitude);
            this.setState({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
            this.findAtm(position.coords.latitude, position.coords.longitude);
          },
          error => {
            alert(JSON.stringify(error));
          },
          {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 1000,
          },
        );
      } else {
        ToastAndroid.show('Please add an address', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error(error);
    }
  }
  async componentDidMount() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        await Geolocation.getCurrentPosition(
          position => {
            //console.log(position.coords.latitude);
            this.setState({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
            this.findAtm(position.coords.latitude, position.coords.longitude);
          },
          error => {
            alert(JSON.stringify(error));
          },
          {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 1000,
          },
        );
      } else {
        ToastAndroid.show('Please add an address', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error(error);
    }
  }
  renderSeparator = () => {
    return (
      <View
        style={{
          height: 10,
          width: '100%',
        }}
      />
    );
  };
  render() {
    return (
      <View style={styles.container}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <GooglePlacesAutocomplete
            enablePoweredByContainer={false}
            placeholder="Address "
            placeholderTextColor="#a9a9a9"
            listViewDisplayed={false}
            minLength={2}
            autoFocus={false}
            returnKeyType={'default'}
            fetchDetails={true}
            renderDescription={row => row.description}
            onPress={(data, details = null) => {
              this.findAtm(
                details.geometry.location.lat,
                details.geometry.location.lng,
              );
            }}
            query={{
              key: 'AIzaSyC-k_IKQGfcH1_AacKsl4uMsKj0Z49YY08',
              language: 'en',
              types: '(cities)',
            }}
            styles={{
              textInputContainer: {
                backgroundColor: '#ffffff',
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                borderColor: '#ffffff',
                height: 50,
              },
              textInput: {
                height: '100%',
                width: '100%',
                fontSize: 14,
              },
              description: {
                fontWeight: 'normal',
                fontSize: 12,
                color: '#444444',
              },
            }}
            nearbyPlacesAPI="GooglePlacesSearch"
            debounce={200}
          />
        </View>

        <View
          style={{
            backgroundColor: 'rgba(2, 3, 11, 0.04)',
          }}>
          <FlatList
            extraData={this.state}
            data={this.state.atmData}
            ItemSeparatorComponent={this.renderSeparator}
            containerStyle={{flex: 1}}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() =>
                  Linking.openURL(
                    'google.navigation:q=' +
                      item.geometry.location.lat +
                      ',' +
                      item.geometry.location.lng,
                  )
                }
                style={{
                  height: 100,
                  width: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 5,
                  borderWidth: 0.5,
                }}>
                <View
                  style={{
                    height: '100%',
                    width: '90%',
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                  }}>
                  <View style={{width: '40%', height: '100%'}}>
                    <Image
                      style={{width: '100%', height: '100%'}}
                      source={{uri: item.icon}}
                      resizeMode="contain"
                    />
                  </View>
                  <View
                    style={{
                      width: '50%',
                      height: '100%',
                      justifyContent: 'center',
                      alignItems: 'flex-start',
                    }}>
                    <Text numberOfLines={2}>{item.name}</Text>
                    <Text numberOfLines={3}>{item.vicinity}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={item => item.id}
          />
        </View>
        <TouchableOpacity
          onPress={() => {
            if (this.state.latitude == '') {
              this.permissioncheck();
            } else {
              this.findAtm(this.state.latitude, this.state.longitude);
            }
          }}
          style={{position: 'absolute', bottom: 20, right: 20}}>
          <View
            style={{
              borderRadius: 140 / 2,
              backgroundColor: 'rgba(2, 3, 11, 0.04)',
              width: 70,
              height: 70,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              style={{width: 50, height: 50}}
              source={require('./assets/map.png')}
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}
export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
