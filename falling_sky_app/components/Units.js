import React from "react";
import {
  ImageBackground,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

export default class Units extends React.Component {
	
  render() {
    let { defenderSelected, attackerSelected, attacker, defender } = this.props;
	
    return (
      <View style={styles.contentSplit}>
        <ScrollView style={styles.units}>
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
            {attackerSelected}
          </Text>
          {attacker.units.leader && (
            <View style={styles.unit}>
              <View style={styles.unitImg}>
                <Image
                  style={{ width: 30, height: 50 }}
                  source={attacker.units.leader.url}
                />
              </View>
              <Text style={styles.unitTitle}>Leader</Text>
              <Text style={styles.unitCount}>
                {this.props.attacking.leader}
              </Text>
              <TouchableOpacity
                onPress={() => this.props.addUnit("attacking", "leader", 1)}
                style={styles.numberButton}
              >
                <Text style={{ color: "#000" }}>+1</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.props.addUnit("attacking", "leader", -1)}
                style={styles.numberButton}
              >
                <Text style={{ color: "#000" }}>-1</Text>
              </TouchableOpacity>
            </View>
          )}
          {attacker.units.warbands && (
            <View style={styles.unit}>
              <View style={styles.unitImg}>
                <Image
                  style={{ width: 30, height: 28 }}
                  source={attacker.units.warbands.url}
                />
              </View>
              <Text style={styles.unitTitle}>Warbands</Text>
              <Text style={styles.unitCount}>
                {this.props.attacking.warbands}
              </Text>
              <TouchableOpacity
                onPress={() => this.props.addUnit("attacking", "warbands", 5)}
                style={styles.numberButton}
              >
                <Text style={{ color: "#000" }}>+5</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.props.addUnit("attacking", "warbands", 1)}
                style={styles.numberButton}
              >
                <Text style={{ color: "#000" }}>+1</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.props.addUnit("attacking", "warbands", -1)}
                style={styles.numberButton}
              >
                <Text style={{ color: "#000" }}>-1</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.props.addUnit("attacking", "warbands", -5)}
                style={styles.numberButton}
              >
                <Text style={{ color: "#000" }}>-5</Text>
              </TouchableOpacity>
            </View>
          )}
          {attacker.units.legions && (
            <View style={styles.unit}>
              <View style={styles.unitImg}>
                <Image
                  style={{ width: 30, height: 28 }}
                  source={attacker.units.legions.url}
                />
              </View>
              <Text style={styles.unitTitle}>Legions</Text>
              <Text style={styles.unitCount}>
                {this.props.attacking.legions}
              </Text>
              <TouchableOpacity
                onPress={() => this.props.addUnit("attacking", "legions", 5)}
                style={styles.numberButton}
              >
                <Text style={{ color: "#000" }}>+5</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.props.addUnit("attacking", "legions", 1)}
                style={styles.numberButton}
              >
                <Text style={{ color: "#000" }}>+1</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.props.addUnit("attacking", "legions", -1)}
                style={styles.numberButton}
              >
                <Text style={{ color: "#000" }}>-1</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.props.addUnit("attacking", "legions", -5)}
                style={styles.numberButton}
              >
                <Text style={{ color: "#000" }}>-5</Text>
              </TouchableOpacity>
            </View>
          )}
          {attacker.units.allies && (
            <View style={styles.unit}>
              <View style={styles.unitImg}>
                <Image
                  style={{ width: 50, height: 22 }}
                  source={attacker.units.allies.url}
                />
              </View>
              <Text style={styles.unitTitle}>Allied tribes</Text>
              <Text style={styles.unitCount}>
                {this.props.attacking.allies}
              </Text>
              <TouchableOpacity
                onPress={() => this.props.addUnit("attacking", "allies", 1)}
                style={styles.numberButton}
              >
                <Text style={{ color: "#000" }}>+1</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.props.addUnit("attacking", "allies", -1)}
                style={styles.numberButton}
              >
                <Text style={{ color: "#000" }}>-1</Text>
              </TouchableOpacity>
            </View>
          )}
          {attacker.units.citadels && (
            <View style={styles.unit}>
              <View style={styles.unitImg}>
                <Image
                  style={{ width: 50, height: 30 }}
                  source={attacker.units.citadels.url}
                />
              </View>
              <Text style={styles.unitTitle}>Citadel</Text>
              <Text style={styles.unitCount}>
                {this.props.attacking.citadels}
              </Text>
              <TouchableOpacity
                onPress={() => this.props.addUnit("attacking", "citadels", 1)}
                style={styles.numberButton}
              >
                <Text style={{ color: "#000" }}>+1</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.props.addUnit("attacking", "citadels", -1)}
                style={styles.numberButton}
              >
                <Text style={{ color: "#000" }}>-1</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>

        <ScrollView style={styles.units}>
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
            {defenderSelected}
          </Text>
          {defender.units.leader && (
            <View style={styles.unit}>
              <View style={styles.unitImg}>
                <Image
                  style={{ width: 30, height: 50 }}
                  source={defender.units.leader.url}
                />
              </View>
              <Text style={styles.unitTitle}>Leader</Text>
              <Text style={styles.unitCount}>
                {this.props.defending.leader}
              </Text>
              <TouchableOpacity
                onPress={() => this.props.addUnit("defending", "leader", 1)}
                style={styles.numberButton}
              >
                <Text style={{ color: "#000" }}>+1</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.props.addUnit("defending", "leader", -1)}
                style={styles.numberButton}
              >
                <Text style={{ color: "#000" }}>-1</Text>
              </TouchableOpacity>
            </View>
          )}
          {defender.units.warbands && (
            <View style={styles.unit}>
              <View style={styles.unitImg}>
                <Image
                  style={{ width: 30, height: 28 }}
                  source={defender.units.warbands.url}
                />
              </View>
              <Text style={styles.unitTitle}>Warbands</Text>
              <Text style={styles.unitCount}>
                {this.props.defending.warbands}
              </Text>
              <TouchableOpacity
                onPress={() => this.props.addUnit("defending", "warbands", 5)}
                style={styles.numberButton}
              >
                <Text style={{ color: "#000" }}>+5</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.props.addUnit("defending", "warbands", 1)}
                style={styles.numberButton}
              >
                <Text style={{ color: "#000" }}>+1</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.props.addUnit("defending", "warbands", -1)}
                style={styles.numberButton}
              >
                <Text style={{ color: "#000" }}>-1</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.props.addUnit("defending", "warbands", -5)}
                style={styles.numberButton}
              >
                <Text style={{ color: "#000" }}>-5</Text>
              </TouchableOpacity>
            </View>
          )}
          {defender.units.legions && (
            <View style={styles.unit}>
              <View style={styles.unitImg}>
                <Image
                  style={{ width: 30, height: 28 }}
                  source={defender.units.legions.url}
                />
              </View>
              <Text style={styles.unitTitle}>Legions</Text>
              <Text style={styles.unitCount}>
                {this.props.defending.legions}
              </Text>
              <TouchableOpacity
                onPress={() => this.props.addUnit("defending", "legions", 5)}
                style={styles.numberButton}
              >
                <Text style={{ color: "#000" }}>+5</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.props.addUnit("defending", "legions", 1)}
                style={styles.numberButton}
              >
                <Text style={{ color: "#000" }}>+1</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.props.addUnit("defending", "legions", -1)}
                style={styles.numberButton}
              >
                <Text style={{ color: "#000" }}>-1</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.props.addUnit("defending", "legions", -5)}
                style={styles.numberButton}
              >
                <Text style={{ color: "#000" }}>-5</Text>
              </TouchableOpacity>
            </View>
          )}
          {defender.units.allies && (
            <View style={styles.unit}>
              <View style={styles.unitImg}>
                <Image
                  style={{ width: 50, height: 22 }}
                  source={defender.units.allies.url}
                />
              </View>
              <Text style={styles.unitTitle}>Allied tribes</Text>
              <Text style={styles.unitCount}>
                {this.props.defending.allies}
              </Text>
              <TouchableOpacity
                onPress={()=>this.props.addUnit("defending", "allies", 1)}
                style={styles.numberButton}
              >
                <Text style={{ color: "#000" }}>+1</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={()=>this.props.addUnit("defending", "allies", -1)}
                style={styles.numberButton}
              >
                <Text style={{ color: "#000" }}>-1</Text>
              </TouchableOpacity>
            </View>
          )}
          {defender.units.citadels && (
            <View style={styles.unit}>
              <View style={styles.unitImg}>
                <Image
                  style={{ width: 50, height: 30 }}
                  source={defender.units.citadels.url}
                />
              </View>
              <Text style={styles.unitTitle}>Citadel</Text>
              <Text style={styles.unitCount}>
                {this.props.defending.citadels}
              </Text>
              <TouchableOpacity
                onPress={()=>this.props.addUnit("defending", "citadels", 1)}
                style={styles.numberButton}
              >
                <Text style={{ color: "#000" }}>+1</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={()=>this.props.addUnit("defending", "citadels", -1)}
                style={styles.numberButton}
              >
                <Text style={{ color: "#000" }}>-1</Text>
              </TouchableOpacity>
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
  unitImg: {
    alignItems: "center",
    height: 60,
    width: 60
  },
  unitTitle: {
    color: "#000",
	width: 90,
  },
  unitCount: {
	color: '#000',
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
