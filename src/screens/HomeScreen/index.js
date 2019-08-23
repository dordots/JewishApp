import React, { Component } from "react";
import { SafeAreaView } from "react-navigation";
import {
  View,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity
} from "react-native";
import { styles } from "./styles";
import { appSettingsSelector } from "../../redux/selector";
import { AppSettingsActions } from "../../redux";
import { connect } from "react-redux";
import {
  HomeHeader,
  SearchButton,
  AddButton,
  FilterButton,
  AddModal,
  FilterModal,
  NewLessonModal
} from "../../components";
import { AroundEvents } from "./AroundEvents";
import { TodayLessons } from "./TodayLessons";
import { PopularLessons } from "./PopularLessons";
import { RecentLessons } from "./RecentLessons";
import { Strings } from "../../themes";

class HomeScreen extends Component {
  static navigationOptions = {
    gesturesEnabled: Platform.OS !== "ios"
  };
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View>
          <HomeHeader
            onLocation={this.onHeaderLocation}
            onMenu={this.onHeaderMenu}
            ref={ref => {
              this.refHomeHeader = ref;
            }}
          />
        </View>
        <View style={styles.buttonsLine}>
          <FilterButton onPress={this.onFilter} />
          <View style={styles.addSearchLine}>
            <AddButton onPress={this.onAdd} />
            <View style={styles.horizontalSpacing} />
            <SearchButton onPress={this.onSearch} />
          </View>
        </View>
        <ScrollView>
          <AroundEvents onDetails={this.onDetails} />
          <TodayLessons />
          <PopularLessons />
          <RecentLessons />
        </ScrollView>
        <AddModal
          ref={ref => {
            this.refAddModal = ref;
          }}
          callBack={this.callBackAddModal}
        />
        <FilterModal
          ref={ref => {
            this.refFilterModal = ref;
          }}
        />
        <NewLessonModal
          ref={ref => {
            this.refNewLessonModal = ref;
          }}
        />
      </SafeAreaView>
    );
  }

  callBackAddModal = flag => {
    switch (flag) {
      case Strings.MODAL_FLAG_ADD_LESSON:
        this.refNewLessonModal.show();
        break;
      case Strings.MODAL_FLAG_ADD_SYN:
        break;
      default:
        break;
    }
  };

  onHeaderLocation = () => {
    if (this.refHomeHeader) {
      this.refHomeHeader.updateLocation("London, UK");
    }
  };
  onHeaderMenu = () => {
    this.props.navigation.openDrawer();
  };

  onSearch = () => {};
  onAdd = () => {
    if (this.refAddModal) {
      this.refAddModal.show();
    }
  };
  onFilter = () => {
    if (this.refFilterModal) {
      this.refFilterModal.show();
    }
  };
  onDetails = () => {
    this.props.navigation.navigate("Details");
  };
}

const mapStateToProps = state => ({
  ...appSettingsSelector(state)
});
const mapDispatchToProps = dispatch => ({
  updateDeviceStatus: isDeviceTurnON =>
    dispatch(AppSettingsActions.updateDeviceStatus(isDeviceTurnON)),
  updateLightStatus: isLightTurnON =>
    dispatch(AppSettingsActions.updateLightStatus(isLightTurnON))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeScreen);
