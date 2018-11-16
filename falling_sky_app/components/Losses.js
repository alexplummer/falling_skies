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
  }

  setActive(ref) {
    this.setState(
      {
        [ref]: !this.state[ref]
      },
      () => {
        this[ref].setNativeProps({
          style: {
            opacity: this.state[ref] ? 1 : 0
          }
        });
      }
    );
  }

  render() {
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

      if (attacker.name === "Romans" && attacking.leader === 1) {
        strongLegion = true;
      } else if (attacker.name === "Belgae" && attacking.leader === 1) {
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

    // Build unit display
    let noMobileUnits = [];
    let mobileUnits = [];

    Object.entries(defending).forEach((unit, index) => {
      const type = unit[0];
      const total = unit[1];
      let units = [];

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
                  source={defender.units[type].url}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.removeUnit}
                onPress={() => this.setActive(type + i.toString())}
              >
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

      if (type === "citadels" || type === "allies") {
        noMobileUnits.push(units);
      } else {
        mobileUnits.push(units);
      }
    });

    return (
      <View style={styles.content}>
        <ScrollView style={styles.units}>
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
              {defenderSelected} remove {noMobileLosses} citadels or allies
            </Text>
            {noMobileUnits}
            <View style={styles.losses} />
          </View>

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
              {defenderSelected} remove {mobileLosses} pieces
            </Text>
            {mobileUnits}
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
  mobile: {
    flexDirection: "row"
  },
  noMobile: {
    flexDirection: "row"
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
