'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Image,
  Text,
  View,
  TouchableOpacity,
  TouchableNativeFeedback,
  AsyncStorage,
  Platform,
  Dimensions,
} = React;

var API_URL = 'http://chewmast.herokuapp.com/api/';
// var API_URL = 'http://localhost:8000/api/';
var UserActions = require('../actions/UserActions');
var UserStore = require('../stores/UserStore');
var deviceHeight = Dimensions.get('window').height;

function getUserState() {
  return {
    account: UserStore.getAccount()
  };
}

var DrawerView = React.createClass({
  getInitialState: function () {
    return {'token': 'none',
            'account': ''};
  },
  componentWillMount: function () {
    // Get home page stuff from DB
    UserStore.addChangeListener(this._onChange);
    AsyncStorage.getItem('token').then((value) => {
      if (value !== null){
        //TODO: Needs a validation check
        fetch(API_URL + 'token-check/' + value)
          .then((res) => res.json())
          .catch((err) => console.error('Fetching token data failed. Check the network connection: ' + err))
          .then((responseData) => {
            if (responseData !== 'Invalid token') {
              this.setState({token: value});
              UserActions.populate(responseData, value);
            }
          })
          .done();
      }
    }).done();
  },
  saveData: function(key, value) {
    AsyncStorage.setItem(key, value);
    this.setState({key: value});
  },
  _onChange: function() {
    this.setState(getUserState());
  },
  onHomeButtonPress: function () {
    this.props.onMenuButtonPress('Home');
  },
  onProfileButtonPress: function () {
    this.props.onMenuButtonPress('Profile');
  },
  onFavouritesButtonPress: function () {
    this.props.onMenuButtonPress('Favourites');
  },
  onSignInLogOutButtonPress: function () {
    this.saveData('token', 'none');
    UserActions.signout();
    this.props.onMenuButtonPress('SignInSignOut');
  },
  onLoginButtonPress: function () {
    this.props.onMenuButtonPress('Login');
  },
  render: function() {
    var TouchableElement = TouchableOpacity;
    if (Platform.OS === 'android') {
      console.log(Platform.OS);
      console.log('render android');
      TouchableElement = TouchableNativeFeedback;
      var component = this.state.account.user ?
      <View>
      <View style={styles.imageContainer}>
        <Image source={{uri: 'https://media2.giphy.com/media/x1u507NMakkZG/200_s.gif'}}
        style={styles.profileImage}
        />
      </View>
      <Text style={styles.name}>{this.state.account.user.first_name + ' ' + this.state.account.user.last_name}</Text>
      <TouchableElement
        onPress={this.onHomeButtonPress}
        onShowUnderlay={this.props.onHighlight}
        onHideUnderlay={this.props.onUnhighlight}
      >
        <View style={styles.textContainer}>
          <Text style={styles.listText}>Home</Text>
        </View>
      </TouchableElement>
      <TouchableElement
        onPress={this.onProfileButtonPress}
        onShowUnderlay={this.props.onHighlight}
        onHideUnderlay={this.props.onUnhighlight}
      >
        <View style={styles.textContainer}>
          <Text style={styles.listText}>Profile</Text>
        </View>
      </TouchableElement>
      <TouchableElement
        onPress={this.onSignInLogOutButtonPress}
        onShowUnderlay={this.props.onHighlight}
        onHideUnderlay={this.props.onUnhighlight}
      >
        <View style={[styles.textContainer, styles.textContainerLast]}>
          <Text style={styles.listText}>Logout</Text>
        </View>
      </TouchableElement>
      </View>
      :
      <View style={styles.loggedOut}>
        <TouchableElement
        onPress={this.onHomeButtonPress}
        onShowUnderlay={this.props.onHighlight}
        onHideUnderlay={this.props.onUnhighlight}
       >
        <View style={styles.textContainer}>
          <Text style={styles.listText}>Home</Text>
        </View>
       </TouchableElement>
        <TouchableElement
          onPress={this.onLoginButtonPress}
          onShowUnderlay={this.props.onHighlight}
          onHideUnderlay={this.props.onUnhighlight}
        >
          <View style={styles.textContainer}>
            <Text style={styles.listText}>Login</Text>
          </View>
        </TouchableElement>
      </View>;
    } else {
      console.log(Platform.OS);
      var component = this.state.account.user ?
      <View>
      <View style={styles.imageContainer}>
        <Image source={{uri: 'https://media2.giphy.com/media/x1u507NMakkZG/200_s.gif'}}
        style={styles.profileImage}
        />
      </View>
      <Text style={styles.name}>{this.state.account.user.first_name + ' ' + this.state.account.user.last_name}</Text>
      <TouchableElement
        onPress={this.onProfileButtonPress}
        onShowUnderlay={this.props.onHighlight}
        onHideUnderlay={this.props.onUnhighlight}
      >
        <View style={styles.textContainer}>
          <Text style={styles.listText}>Profile</Text>
        </View>
      </TouchableElement>
      <TouchableElement
        onPress={this.onSignInLogOutButtonPress}
        onShowUnderlay={this.props.onHighlight}
        onHideUnderlay={this.props.onUnhighlight}
      >
        <View style={[styles.textContainer, styles.textContainerLast]}>
          <Text style={styles.listText}>Logout</Text>
        </View>
      </TouchableElement>
      </View>
      :
      <View style={styles.loggedOut}>
        <TouchableElement
          onPress={this.onLoginButtonPress}
          onShowUnderlay={this.props.onHighlight}
          onHideUnderlay={this.props.onUnhighlight}
        >
          <View style={styles.textContainer}>
            <Text style={styles.listText}>Login</Text>
          </View>
        </TouchableElement>
      </View>;

    }


    var containerStyle = styles.container;
    if (Platform.OS === 'ios') {
      containerStyle = styles.containerIOS;
    }

    return (
      <View style={containerStyle}>{component}</View>
    );
  },
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  containerIOS: {
    marginTop: 20,
    flex: 1,
    backgroundColor: 'white',
  },
  imageContainer: {
    paddingTop: 15,
    paddingBottom: 10,
  },
  profileImage: {
    alignSelf: 'center',
    height: 150,
    width: 150,
    borderRadius: 75,
  },
  name: {
    alignSelf: 'center',
    fontSize: 20,
    fontWeight: '500',
    paddingBottom: 15,
  },
  textContainer: {
    paddingTop: 10,
    paddingBottom: 10,
    borderTopWidth: 1,
    borderStyle: 'solid',
    borderTopColor: '#c0c0c0',
  },
  textContainerLast: {
    borderBottomWidth: 1,
    borderBottomColor: '#c0c0c0'
  },
  listText: {
    margin: 10,
    fontSize: 15,
    textAlign: 'center',
    paddingLeft: 5,
  },
  loggedOut: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 200,
  }
});

module.exports = DrawerView;
