import React from "react";
import {
  ImageBackground,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TouchableHighlight
} from "react-native";

export default class RollForLosses extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      rolledUnits: false
    };

    this.rollLosses = this.rollLosses.bind(this);
    this.calcRoll = this.calcRoll.bind(this);
  }

  componentDidMount() {
    this.setState({
      originalState: { ...this.state }
    });
  }

  componentDidUpdate(prevProps, prevState) {}

  reset() {
    this.setState({ ...this.state.originalState });
  }

  rollLosses() {
    let updatedAllLosses = { ...this.props.allLosses };

    Object.entries(this.props.shouldRoll).forEach((unit, index) => {
      const type = unit[0];
      const total = unit[1];
      let rollResults = [];

      this.setState({
        diceRolled: true
      });

      if (total > 0) {
        for (let i = 0; i < total; i++) {
          setTimeout(() => {
            const { resultUrl, rollResult } = this.calcRoll();

            if (rollResult === true) {
              updatedAllLosses[type] = updatedAllLosses[type] - 1;
            }

            rollResults.push({
              type,
              resultUrl,
              rollResult
            });

            if (i === total - 1) buildJsx.call(this, rollResults);
          }, 1000 + i * 400);
        }
      }

      function buildJsx(rollResults) {
        let rolledUnits = [];

        rollResults.forEach((thisResult, index) => {
          rolledUnits.push(
            <View style={styles.unitImg} key={thisResult.type + index}>
              <TouchableOpacity>
                <Image
                  style={{
                    width: this.props.unitSizes[thisResult.type].width,
                    height: this.props.unitSizes[thisResult.type].height
                  }}
                  source={this.props.defender.units[thisResult.type].url}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.removeUnit}>
                <Image
                  style={{ ...styles.removeUnit }}
                  source={thisResult.resultUrl}
                />
              </TouchableOpacity>
            </View>
          );
        });

        this.props.setFinalLosses(updatedAllLosses);

        this.setState({
          updatedAllLosses,
          rolledUnits,
          diceRolledComplete: true
        });
      }
    });
  }

  calcRoll() {
    const diceResult = Math.floor(6 * Math.random()) + 1;
    let resultUrl;

    switch (diceResult) {
      case 1:
        resultUrl = require("./../assets/images/dice_1.png");
        break;
      case 2:
        resultUrl = require("./../assets/images/dice_2.png");
        break;
      case 3:
        resultUrl = require("./../assets/images/dice_3.png");
        break;
      case 4:
        resultUrl = require("./../assets/images/dice_4.png");
        break;
      case 5:
        resultUrl = require("./../assets/images/dice_5.png");
        break;
      case 6:
        resultUrl = require("./../assets/images/dice_6.png");
        break;
    }

    let rollResult;

    if (diceResult > 3) {
      rollResult = true;
    } else {
      rollResult = false;
    }

    return { resultUrl, rollResult };
  }

  render() {
    // Build unit display
    let units = [];

    Object.entries(
      this.state.updatedAllLosses
        ? this.state.updatedAllLosses
        : this.props.allLosses
    ).forEach((unit, index) => {
      const type = unit[0];
      const total = unit[1];

      if (total > 0) {
        for (let i = 0; i < total; i++) {
          units.push(
            <View style={styles.unitImg} key={type + i.toString()}>
              <TouchableOpacity>
                <Image
                  style={{
                    width: this.props.unitSizes[type].width,
                    height: this.props.unitSizes[type].height
                  }}
                  source={this.props.defender.units[type].url}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.removeUnit}>
                <Image
                  style={{ ...styles.removeUnit, opacity: 0 }}
                  source={require("./../assets/images/cross.png")}
                  ref={c => (this[type + i.toString()] = c)}
                />
              </TouchableOpacity>
            </View>
          );
        }
      }
    });

    return (
      <View style={styles.content}>
        <ScrollView style={styles.units}>
          {this.state.rolledUnits && this.state.rolledUnits}
          {!this.state.diceRolledComplete && (
            <TouchableOpacity
              onPress={this.rollLosses}
              style={styles.optionButton}
              ref={c => (this.ambush = c)}
            >
              <Text style={{ color: "#FFF" }}>Roll</Text>
            </TouchableOpacity>
          )}
          {!this.state.diceRolledComplete && this.state.diceRolled && (
            <Image
              style={styles.diceAnim}
              source={require("./../assets/images/dice_anim.gif")}
            />
          )}
          <View style={styles.mobile}>
            <Text
              style={{
                color: "#000",
                marginTop: 5,
                marginBottom: 10,
                fontSize: 15,
                fontWeight: "bold",
                textAlign: "center"
              }}
            >
              Total Losses:
            </Text>
            {units}
            <View style={styles.losses} />
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000"
  },
  roll: {},
  diceAnim: {
    width: 100,
    height: 100
  },
  content: {
    position: "absolute",
    top: 100,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 20,
    flex: 1,
    alignContent: "space-around",
    padding: 60
  },
  headerContent: {
    flex: 1
  },
  header: {
    paddingTop: 40,
    paddingLeft: 20
  },
  contentSplit: {
    flex: 1,
    flexDirection: "row",
    alignContent: "space-around"
  },
  mobile: {
    flexDirection: "row"
  },
  noMobile: {
    flexDirection: "row"
  },
  units: {
    alignSelf: "stretch",
    flexDirection: "column",
    flex: 1,
    backgroundColor: "rgba(250,250,250,.8)"
  },
  unit: {
    flexDirection: "row",
    alignItems: "flex-start"
  },
  losses: {
    flexDirection: "row"
  },
  optionButton: {
    width: 100,
    alignItems: "center",
    backgroundColor: "#444",
    borderRadius: 5,
    padding: 10,
    elevation: 10,
    marginRight: 10,
    marginTop: 30
  },
  removeUnit: {
    left: 0,
    top: 0,
    position: "absolute",
    height: 20,
    width: 20,
    zIndex: 10
  },
  unitImg: {
    alignItems: "center",
    height: 60,
    width: 60
  },
  unitTitle: {
    color: "#000",
    width: 90
  },
  unitCount: {
    color: "#000",
    width: 40,
    fontSize: 20
  },
  introText: {
    fontSize: 24,
    paddingBottom: 30
  },
  factions: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-around"
  },
  backButton: {
    alignSelf: "flex-start",
    backgroundColor: "#444",
    borderRadius: 5,
    padding: 10,
    elevation: 10
  },
  factionButton: {
    backgroundColor: "#CF340C",
    borderRadius: 5,
    padding: 20,
    elevation: 10
  },
  numberButton: {
    alignSelf: "flex-start",
    backgroundColor: "#FFF",
    borderRadius: 5,
    padding: 10,
    elevation: 10,
    marginRight: 10
  },
  developmentModeText: {
    marginBottom: 20,
    color: "rgba(0,0,0,0.4)",
    fontSize: 14,
    lineHeight: 19,
    textAlign: "center"
  },
  contentContainer: {
    paddingTop: 30
  },
  welcomeContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20
  },
  welcomeImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#FF0000",
    resizeMode: "contain",
    marginTop: 3,
    marginLeft: -10
  },
  getStartedContainer: {
    alignItems: "center",
    marginHorizontal: 50
  },
  homeScreenFilename: {
    marginVertical: 7
  },
  codeHighlightText: {
    color: "rgba(96,100,109, 0.8)"
  },
  codeHighlightContainer: {
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 3,
    paddingHorizontal: 4
  },
  getStartedText: {
    fontSize: 17,
    color: "rgba(96,100,109, 1)",
    lineHeight: 24,
    textAlign: "center"
  },
  tabBarInfoContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3
      },
      android: {
        elevation: 20
      }
    }),
    alignItems: "center",
    backgroundColor: "#fbfbfb",
    paddingVertical: 20
  },
  tabBarInfoText: {
    fontSize: 17,
    color: "rgba(96,100,109, 1)",
    textAlign: "center"
  },
  navigationFilename: {
    marginTop: 5
  },
  helpContainer: {
    marginTop: 15,
    alignItems: "center"
  },
  helpLink: {
    paddingVertical: 15
  },
  helpLinkText: {
    fontSize: 14,
    color: "#2e78b7"
  }
});
