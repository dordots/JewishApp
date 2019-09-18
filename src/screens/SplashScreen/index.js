import React, {Component} from 'react';
import {SafeAreaView} from 'react-navigation';
import {
  View,
  Platform,
  BackHandler,
  Text,
  Image,
  I18nManager,
} from 'react-native';
import {Metric} from '../../themes';
import {LocalStorage, Strings, ApiRequest} from '../../utils';
import {appSettingsSelector} from '../../redux/selector';
import {AppSettingsActions} from '../../redux';
import {connect} from 'react-redux';
import {en, he} from '../../constants';

class SplashScreen extends Component {
  static navigationOptions = {
    gesturesEnabled: Platform.OS !== 'ios',
  };

  constructor(props) {
    super(props);
    this.state = {
      language: '',
    };
    this.splashTimerGone = false;
    this.getOnlineDataTimerGone = false;
  }

  async componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);

    let language = await LocalStorage.getLanguage();
    if (language) {
      this.setState({language});
      this.props.updateLanguage(language);
    } else {
      language = Strings.HEBREW;
      this.setState({language});
      I18nManager.allowRTL(true);
      await LocalStorage.setLanguage(language);
      this.props.updateLanguage(language);
    }

    setTimeout(async () => {
      if (this.getOnlineDataTimerGone === false) {
        let introChecked = await LocalStorage.getIntroChecked();
        if (introChecked) {
          let isLoggedIn = await LocalStorage.getLoggedIn();
          if (isLoggedIn) {
            Strings.localToken = await LocalStorage.getToken();
            Strings.loginType = await LocalStorage.getLoginType();
            this.props.navigation.navigate('Home');
          } else {
            this.props.navigation.navigate('Login');
          }
        } else {
          this.props.navigation.navigate('Intro');
        }
      } else {
        this.splashTimerGone = true;
      }
    }, 3000);
  }

  componentWillUnmount(): void {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton = () => {
    return true;
  };

  render() {
    const {language} = this.state;
    let isEnglish = language === Strings.ENGLISH;
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <View style={{flex: 1}}>
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Image
              source={require('../../assets/img_splash.png')}
              style={{
                position: 'absolute',
                width: Metric.width,
                height: Metric.height,
                resizeMode: 'cover',
              }}
            />
            <Image
              source={require('../../assets/splash_background.png')}
              style={{
                position: 'absolute',
                width: Metric.width,
                height: Metric.height,
                resizeMode: 'cover',
                top: Metric.height * 0.25,
              }}
            />
            <Image
              source={require('../../assets/splash_background_top.png')}
              style={{
                position: 'absolute',
                width: Metric.width,
                height: Metric.height,
                resizeMode: 'cover',
                bottom: Metric.height * 0.75,
              }}
            />
            <View
              style={{
                flex: 1,
                paddingBottom: Metric.height * 0.3,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={require('../../assets/splash_logo.png')}
                style={{
                  width: Metric.width * 0.6,
                  resizeMode: 'contain',
                }}
              />
            </View>
          </View>
        </View>
        <View
          style={{
            height: 30,
            backgroundColor: '#EDEFF1',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text>
            {isEnglish ? en.memorial.splash_screen : he.memorial.splash_screen}
          </Text>
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  ...appSettingsSelector(state),
});
const mapDispatchToProps = dispatch => ({
  updateDeviceStatus: isDeviceTurnON =>
    dispatch(AppSettingsActions.updateDeviceStatus(isDeviceTurnON)),
  updateLightStatus: isLightTurnON =>
    dispatch(AppSettingsActions.updateLightStatus(isLightTurnON)),
  updateLanguage: language =>
    dispatch(AppSettingsActions.updateLanguage(language)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SplashScreen);