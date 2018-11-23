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

export default class Losses extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.setActive = this.setActive.bind(this);
    this.calculateLosses = this.calculateLosses.bind(this);
    this.calcAmbush = this.calcAmbush.bind(this);
  }

  componentDidMount() {
    this.setState(
      {
        originalState: { ...this.state }
      },
      () => {
        this.calculateLosses();

        if (
          this.props.defender.name === "Romans" &&
          this.props.defending.leader === 1
        ) {
          if (this.props.ambush || this.props.attacker.name === "German") {
            this.setState({
              ambushCheck: true
            });
          }
        }
      }
    );
  }

  componentDidUpdate(prevProps, prevState) {
    prevProps !== this.props && this.calculateLosses();

    this.state.totalRequiredLosses &&
      prevState.totalRequiredLosses !== this.state.totalRequiredLosses &&
      this.props.totalRequiredLosses(this.state.totalRequiredLosses);
  }

  reset() {
    this.setState({ ...this.state.originalState });
  }

  calcAmbush() {
    this.setState({
      ambushDiceRolled: true
    });

    setTimeout(() => {
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

      let ambushRoll;

      if (diceResult > 3) {
        ambushRoll = true;
      } else {
        ambushRoll = false;
      }

      if (this.props.attacker.name === "Belgae") {
        if (diceResult > 4) {
          ambushRoll = true;
        } else {
          ambushRoll = false;
        }
      }

      this.setState({
        ambushDiceRolledComplete: true,
        ambushDiceResult: resultUrl,
        ambushRoll
      });
    }, 1500);

    setTimeout(() => {
      this.setState(
        {
          ambushCheck: false
        },
        () => {
          this.calculateLosses();
        }
      );
    }, 3000);
  }

  setActive(type, mobileType, ref, shouldRoll) {
    if (this.state[mobileType].limit && !this.state[ref]) return;

    const count = this.state[ref] ? -1 : 1;
    let prevCount =
      this.state[mobileType].count == null ? 0 : this.state[mobileType].count;

    this.setState(
      {
        [ref]: !this.state[ref],
        [mobileType]: {
          ...this.state[mobileType],
          count: (prevCount += count)
        }
      },
      () => {
        this.props.setLosses(type, count, shouldRoll);

        this[ref].setNativeProps({
          style: {
            opacity: this.state[ref] ? 1 : 0
          }
        });

        this.setState({
          [mobileType]: {
            ...this.state[mobileType],
            limit:
              this.state[mobileType].count >= this.state[mobileType].losses
                ? true
                : false
          }
        });
      }
    );
  }

  calculateLosses() {
    let {
      defenderSelected,
      defender,
      attacker,
      attacking,
      defending,
      halfLosses,
      noMobileFirst
    } = this.props;

    // Calculate total attack
    function calcAttack() {
      let strongLegion = false;
      let strongWarband = false;

      if (
        attacker.name === "Romans" &&
        attacking.leader != null &&
        attacking.leader === 1
      ) {
        strongLegion = true;
      } else if (
        attacker.name === "Belgae" &&
        attacking.leader != null &&
        attacking.leader === 1
      ) {
        strongWarband = true;
      }

      let totalAttack = 0;

      Object.entries(attacking).map((unit, index) => {
        const type = unit[0];
        const total = unit[1];

        switch (type) {
          case "leader":
            totalAttack += total;
            break;

          case "warbands":
            strongWarband
              ? (totalAttack += total)
              : (totalAttack += Math.floor(total / 2));
            break;

          case "legions":
            strongLegion ? (totalAttack += 2 * total) : (totalAttack += total);
            break;
        }
      });

      return totalAttack;
    }

    // Calculate total losses
    const totalLosses = halfLosses
      ? Math.floor(calcAttack() / 2)
      : calcAttack();

    this.setState({ totalRequiredLosses: totalLosses });

    // Calculate total non-mobile pieces
    let noMobilePieces = 0;

    Object.entries(defending).forEach(unit => {
      const type = unit[0];
      const total = unit[1];

      switch (type) {
        case "citadels":
          noMobilePieces += total;
          break;

        case "allies":
          noMobilePieces += total;
          break;
      }
    });

    // Calculate total mobile pieces
    const mobilePieces =
      Object.values(defending).reduce((a, b) => a + b) - noMobilePieces;

    // Calculate if mobile needs selecting first and total losses
    let selectMobile = false;
    let noMobileLosses = 0;
    let mobileLosses = 0;

    // If mobile peices removed first
    if (noMobileFirst === true) {
      // If more losses than non-mobile pieces
      if (totalLosses > noMobilePieces) {
        noMobileLosses = noMobilePieces;
        mobileLosses = totalLosses - noMobileLosses;
      } else {
        noMobileLosses = totalLosses;
      }
    }
    // Mobile pieces removed last
    else {
      // If more losses than mobile pieces
      if (totalLosses > mobilePieces) {
        mobileLosses = mobilePieces;
        noMobileLosses = totalLosses - mobileLosses;
      } else {
        mobileLosses = totalLosses;
      }
    }

    this.setState({
      noMobileFirst,
      mobile: { ...this.state.mobile, losses: mobileLosses },
      noMobile: { ...this.state.noMobile, losses: noMobileLosses }
    });
  }

  render() {
    // Build unit display
    let noMobileUnits = [];
    let mobileUnits = [];

    Object.entries(this.props.defending).forEach((unit, index) => {
      const type = unit[0];
      const total = unit[1];
      let units = [];
      let mobileType;

      if (type === "citadels" || type === "allies") {
        mobileType = "noMobile";
      } else {
        mobileType = "mobile";
      }

      let shouldRoll = false;

      if (type === "citadels" || type === "leader" || type === "legions") {
        shouldRoll = true;

        if (this.props.ambush || this.props.attacker.name === "German") {
          if (this.state.ambushRoll) {
            shouldRoll = true;
          } else {
            shouldRoll = false;
          }
        }
      }

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
              <TouchableOpacity
                style={styles.removeUnit}
                onPress={() =>
                  this.setActive(
                    type,
                    mobileType,
                    type + i.toString(),
                    shouldRoll
                  )
                }
              >
                <Image
                  style={{ ...styles.removeUnit, opacity: 0 }}
                  source={
                    shouldRoll
                      ? require("./../assets/images/cross_dice.png")
                      : require("./../assets/images/cross.png")
                  }
                  ref={c => (this[type + i.toString()] = c)}
                />
              </TouchableOpacity>
            </View>
          );
        }
      }

      mobileType === "noMobile"
        ? (noMobileUnits = noMobileUnits.concat(units))
        : (mobileUnits = mobileUnits.concat(units));
    });

    return (
      <View style={styles.content}>
        <ScrollView style={styles.units}>
          {this.state.ambushCheck && (
            <View style={styles.roll}>
              <Text>Ambush! Check for defensive rolls and counterattack:</Text>
              <TouchableOpacity
                onPress={this.calcAmbush}
                style={styles.forwardButton}
              >
                <Text style={{ color: "#FFF" }}>Roll</Text>
              </TouchableOpacity>
              {this.state.ambushDiceRolled && (
                <Image
                  style={styles.diceAnim}
                  source={
                    !this.state.ambushDiceRolledComplete
                      ? require("./../assets/images/dice_anim.gif")
                      : this.state.ambushDiceResult
                  }
                />
              )}
            </View>
          )}
          {!this.state.ambushCheck && this.props.ambush && (
            <View style={styles.roll}>
              <Text>
                {!this.state.ambushRoll
                  ? "Fail, no defense rolls or counterattack"
                  : "Success, defense rolls and counterattack permitted"}
              </Text>
            </View>
          )}
          {!this.state.ambushCheck && (
            <View>
              {noMobileUnits.length > 0 && (
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
                    Remove{" "}
                    {this.state.noMobile &&
                      this.state.noMobile.losses &&
                      this.state.noMobile.losses.toString()}{" "}
                    citadels or allies
                  </Text>
                  <View style={styles.unitDisplay}>{noMobileUnits}</View>
                </View>
              )}
              {mobileUnits.length > 0 && (
                <View style={styles.noMobile}>
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
                    Remove{" "}
                    {this.state.mobile &&
                      this.state.mobile.losses &&
                      this.state.mobile.losses.toString()}{" "}
                    pieces
                  </Text>
                  <View style={styles.unitDisplay}>{mobileUnits}</View>
                </View>
              )}
            </View>
          )}
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
  mobile: {},
  noMobile: {},
  unitDisplay: {
    flexDirection: "row",
    flexWrap: "wrap"
  },
  units: {
    flexDirection: "column",
    flex: 1,
    backgroundColor: "rgba(250,250,250,.5)",
    margin: 5
  },
  unit: {
    flexDirection: "row",
    alignItems: "flex-start"
  },
  losses: {
    flexDirection: "row"
  },
  removeUnit: {
    left: 0,
    top: 0,
    position: "absolute",
    height: 60,
    width: 60,
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
