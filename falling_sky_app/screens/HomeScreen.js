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
import { WebBrowser } from "expo";
import { Ionicons } from "@expo/vector-icons";
import { MonoText } from "../components/StyledText";
import Units from "../components/Units";
import Losses from "../components/Losses";
import RollForLosses from "../components/RollForLosses";

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      introText: "Choose attacking faction",
      unitSizes: {
        leader: {
          width: 30,
          height: 50
        },
        warbands: {
          height: 38,
          width: 30
        },
        legions: {
          height: 28,
          width: 30
        },
        allies: {
          height: 22,
          width: 50
        },
        citadels: {
          height: 30,
          width: 50
        }
      },
      factions: [
        {
          name: "Romans",
          color: "#CF340C",
          units: {
            leader: {
              total: 1,
              url: require("./../assets/images/units/roman_leader.png")
            },
            warbands: {
              total: 20,
              url: require("./../assets/images/units/roman_warband.png")
            },
            allies: {
              total: 6,
              url: require("./../assets/images/units/roman_ally.png")
            },
            citadels: {
              total: 6,
              url: require("./../assets/images/units/roman_citadel.png")
            },
            legions: {
              total: 12,
              url: require("./../assets/images/units/roman_legion.png")
            }
          }
        },
        {
          name: "Averni",
          color: "#448A66",
          units: {
            leader: {
              total: 1,
              url: require("./../assets/images/units/averni_leader.png")
            },
            warbands: {
              total: 35,
              url: require("./../assets/images/units/averni_warband.png")
            },
            allies: {
              total: 10,
              url: require("./../assets/images/units/averni_ally.png")
            },
            citadels: {
              total: 3,
              url: require("./../assets/images/units/averni_citadel.png")
            }
          }
        },
        {
          name: "Belgae",
          color: "#D67D0C",
          units: {
            leader: {
              total: 1,
              url: require("./../assets/images/units/belgae_leader.png")
            },
            warbands: {
              total: 25,
              url: require("./../assets/images/units/belgae_warband.png")
            },
            allies: {
              total: 10,
              url: require("./../assets/images/units/belgae_ally.png")
            },
            citadels: {
              total: 1,
              url: require("./../assets/images/units/belgae_citadel.png")
            }
          }
        },
        {
          name: "Aedui",
          color: "#1F7EBD",
          units: {
            warbands: {
              total: 20,
              url: require("./../assets/images/units/aedui_warband.png")
            },
            allies: {
              total: 6,
              url: require("./../assets/images/units/aedui_ally.png")
            },
            citadels: {
              total: 2,
              url: require("./../assets/images/units/aedui_citadel.png")
            }
          }
        },
        {
          name: "German",
          color: "#000",
          units: {
            warbands: {
              total: 15,
              url: require("./../assets/images/units/german_warband.png")
            },
            allies: {
              total: 6,
              url: require("./../assets/images/units/german_ally.png")
            }
          }
        }
      ],
      attackerSelected: false,
      defenderSelected: false,
      factionSelectionStage: true,
      unitSelectionStage: false,
      attacking: {
        leader: 0,
        warbands: 0,
        legions: 0,
        allies: 0,
        citadels: 0
      },
      defending: {
        leader: 0,
        warbands: 0,
        legions: 0,
        allies: 0,
        citadels: 0
      },
      retreat: false,
      ambush: false,
      shouldRoll: {},
      rollComplete: true,
      totalLosses: 0,
      rollForLosses: false,
      counterShouldRoll: {},
      counterRollComplete: true,
      counterTotalLosses: 0,
      counterRollForLosses: false
    };

    this.pickFactions = this.pickFactions.bind(this);
    this.addUnit = this.addUnit.bind(this);
    this.calculateFight = this.calculateFight.bind(this);
    this.pickUnits = this.pickUnits.bind(this);
    this.setLosses = this.setLosses.bind(this);
    this.rollLosses = this.rollLosses.bind(this);
    this.totalRequiredLosses = this.totalRequiredLosses.bind(this);
    this.counterTotalRequiredLosses = this.counterTotalRequiredLosses.bind(
      this
    );
    this.counterAttack = this.counterAttack.bind(this);
    this.setFinalLosses = this.setFinalLosses.bind(this);
    this.setCounterLosses = this.setCounterLosses.bind(this);
    this.fight = this.fight.bind(this);
    this.reset = this.reset.bind(this);
  }

  static navigationOptions = {
    header: null
  };

  componentDidMount() {
    this.setState({
      originalState: { ...this.state }
    });
  }

  handleFactionSelection(faction) {
    if (
      this.state.attackerSelected === faction ||
      this.state.defenderSelected === faction
    ) {
      this.pickFactions();
      return;
    }

    if (this.state.attackerSelected && this.state.defenderSelected) return;

    const type = this.state.attackerSelected
      ? "defenderSelected"
      : "attackerSelected";

    this.setState(
      {
        [type]: faction,
        introText: "Choose defending faction"
      },
      () => {
        this[faction].setNativeProps({
          style: {
            borderRadius: 8,
            borderWidth: 2,
            borderColor: type === "defenderSelected" ? "#000" : "#FFF"
          }
        });
        if (type === "defenderSelected") this.selectUnits();
      }
    );
  }

  selectUnits() {
    let attacker;
    let defender;

    this.state.factions.forEach(thisFaction => {
      if (thisFaction.name === this.state.attackerSelected)
        attacker = thisFaction;
      if (thisFaction.name === this.state.defenderSelected)
        defender = thisFaction;
    });

    this.setState({
      attacker,
      defender
    });
  }

  pickFactions() {
    this.setState(
      {
        factionSelectionStage: true,
        unitSelectionStage: false,
        attackerSelected: false,
        defenderSelected: false,
        defending: {},
        attacking: {},
        attacker: "",
        defender: "",
        introText: "Choose attacking faction",
        ambush: false,
        retreat: false
      },
      () => {
        this.state.factions.forEach(thisFaction => {
          this[thisFaction.name].setNativeProps({
            style: {
              borderWidth: 0
            }
          });
        });
      }
    );
  }

  pickUnits() {
    this.setState(
      {
        unitSelectionStage: true,
        lossResolveStage: false
      },
      () => {}
    );
  }

  addUnit(type, unit, count) {
    let updatedCount = this.state[type][unit] + count;
    const completeType =
      type === "attacking" ? this.state.attacker : this.state.defender;
    const maxCount = completeType.units[unit].total;

    if (updatedCount > maxCount) updatedCount = maxCount;
    if (updatedCount < 0) updatedCount = 0;

    this.setState({
      [type]: {
        ...this.state[type],
        [unit]: updatedCount
      }
    });
  }

  setOption(action) {
    this.setState(
      {
        [action]: !this.state[action]
      },
      () => {
        if (this.state[action]) {
          this[action].setNativeProps({
            style: {
              borderRadius: 8,
              borderWidth: 2,
              borderColor: "#FFF"
            }
          });
        } else {
          this[action].setNativeProps({
            style: {
              borderWidth: 0
            }
          });
        }
      }
    );
  }

  calculateFight() {
    let attacking = this.state.attacking;
    let defending = this.state.defending;
    let halfLosses = false;
    let noMobileFirst = false;

    const calcTotal = obj => Object.values(obj).reduce((a, b) => a + b);

    // No retreat
    if (
      !this.state.retreat ||
      this.state.defenderSelected === "German" ||
      this.state.ambush
    ) {
      noMobileFirst = false;

      // Yes Citadel
      if (defending.citadels > 0) {
        halfLosses = true;
      }
      // No Citadel
      else {
        halfLosses = false;
      }
    }
    // Yes retreat
    else {
      noMobileFirst = true;
    }

    const damage =
      attacking.leader + attacking.warbands + attacking.legions > 0
        ? true
        : false;
    const defense = calcTotal(defending) > 0 ? true : false;

    if (!damage || !defense) return;

    this.setState({
      defendingWithLosses: { ...defending },
      counterDefendingWithLosses: { ...attacking },
      unitSelectionStage: false,
      lossResolveStage: true,
      halfLosses,
      noMobileFirst
    });
  }

  setLosses(type, count, shouldRoll) {
    let allLosses = count;

    if (this.state.allLosses && this.state.allLosses[type]) {
      allLosses = this.state.allLosses[type] += count;
    }

    this.setState(
      {
        defendingWithLosses: {
          ...this.state.defendingWithLosses,
          [type]: (this.state.defendingWithLosses[type] -= count)
        },
        allLosses: {
          ...this.state.allLosses,
          [type]: allLosses
        },
        totalLosses: (this.state.totalLosses += count),
        shouldRoll: {
          ...this.state.shouldRoll,
          [type]: this.state.shouldRoll[type] ? this.state.shouldRoll[type] : 0
        }
      },
      () => {
        this.setState(
          {
            finalLosses: allLosses,
            shouldRoll: {
              ...this.state.shouldRoll,
              [type]: shouldRoll
                ? (this.state.shouldRoll[type] += count)
                : this.state.shouldRoll[type]
            }
          },
          () => {
            if (this.state.shouldRoll[type] > 0) {
              this.setState({
                rollComplete: false
              });
            }
          }
        );
      }
    );
  }

  setCounterLosses(type, count, shouldRoll) {
    let counterAllLosses = count;

    if (this.state.counterAllLosses && this.state.counterAllLosses[type]) {
      counterAllLosses = this.state.counterAllLosses[type] += count;
    }

    this.setState(
      {
        counterDefendingWithLosses: {
          ...this.state.counterDefendingWithLosses,
          [type]: (this.state.counterDefendingWithLosses[type] -= count)
        },
        counterAllLosses: {
          ...this.state.counterAllLosses,
          [type]: counterAllLosses
        },
        counterTotalLosses: (this.state.counterTotalLosses += count),
        counterShouldRoll: {
          ...this.state.counterShouldRoll,
          [type]: this.state.counterShouldRoll[type]
            ? this.state.counterShouldRoll[type]
            : 0
        }
      },
      () => {
        this.setState(
          {
            counterShouldRoll: {
              ...this.state.counterShouldRoll,
              [type]: counterShouldRoll
                ? (this.state.counterShouldRoll[type] += count)
                : this.state.counterShouldRoll[type]
            }
          },
          () => {
            if (this.state.counterShouldRoll[type] > 0) {
              this.setState({
                counterRollComplete: false
              });
            }
          }
        );
      }
    );
  }

  totalRequiredLosses(totalRequiredLosses) {
    this.setState({ totalRequiredLosses });
  }

  counterTotalRequiredLosses(totalRequiredLosses) {
    this.setState({ counterTotalRequiredLosses: totalRequiredLosses });
  }

  fight() {
    if (!this.state.attacker || !this.state.defender) return;

    this.setState({
      factionSelectionStage: false,
      unitSelectionStage: true
    });
  }

  setFinalLosses(finalLosses) {
    let updatedFinalLosses = { ...this.state.defending };

    Object.entries(this.state.defending).forEach(entry => {
      const type = entry[0];
      const count = entry[1];

      if (finalLosses[type] != null) {
        updatedFinalLosses = {
          ...updatedFinalLosses,
          [type]: (updatedFinalLosses[type] -= finalLosses[type])
        };
      }
    });

    this.setState({ updatedFinalLosses });
  }

  rollLosses() {
    if (this.state.totalRequiredLosses >= this.state.totalLosses) {
      this.setState({
        rollForLosses: true
      });
    }
  }

  counterAttack() {
    this.setState({
      counterAttack: true,
      counterAttackOver: true,
      rollForLosses: false,
      lossResolveStage: false
    });
  }

  reset() {
    this.setState({
      ...this.state.originalState,
      lossResolveStage: false,
      counterAttack: false
    });
    
    this.losses && this.losses.reset();
    this.rflosses && this.rflosses.reset();
    this.cattack && this.cattack.reset();
  }

  render() {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={require("../assets/images/main_bg.jpg")}
          style={{ width: "100%", height: "100%" }}
        >
          {this.state.factionSelectionStage && (
            <View style={styles.content}>
              <View style={styles.factions}>
                <Text style={styles.introText}>{this.state.introText}:</Text>
              </View>
              <View style={styles.factions}>
                {this.state.factions.map(thisFaction => {
                  return (
                    <TouchableOpacity
                      key={thisFaction.name}
                      ref={c => (this[thisFaction.name] = c)}
                      onPress={() =>
                        this.handleFactionSelection(thisFaction.name)
                      }
                      style={{
                        ...styles.factionButton,
                        backgroundColor: thisFaction.color
                      }}
                    >
                      <Text style={{ color: "#FFF" }}>{thisFaction.name}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <View style={styles.options}>
                <TouchableOpacity
                  onPress={() => this.setOption("ambush")}
                  style={styles.optionButton}
                  ref={c => (this.ambush = c)}
                >
                  <Text style={{ color: "#FFF" }}>Ambush</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.setOption("retreat")}
                  style={styles.optionButton}
                  ref={c => (this.retreat = c)}
                >
                  <Text style={{ color: "#FFF" }}>Retreat</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.options}>
                <TouchableOpacity
                  onPress={this.fight}
                  style={styles.optionButton}
                >
                  <Text style={{ color: "#FFF" }}>FIGHT!</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          {this.state.unitSelectionStage && (
            <View style={styles.headerContent}>
              <View style={styles.header}>
                <TouchableOpacity
                  onPress={this.pickFactions}
                  style={styles.backButton}
                >
                  <Text style={{ color: "#FFF" }}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={this.calculateFight}
                  style={styles.forwardButton}
                >
                  <Text style={{ color: "#FFF" }}>Fight</Text>
                </TouchableOpacity>
              </View>
              {this.state.attacker && (
                <Units
                  attackerSelected={this.state.attackerSelected}
                  defenderSelected={this.state.defenderSelected}
                  attacker={this.state.attacker}
                  defender={this.state.defender}
                  attacking={this.state.attacking}
                  defending={this.state.defending}
                  addUnit={this.addUnit}
                />
              )}
            </View>
          )}
          {this.state.lossResolveStage && (
            <View style={styles.headerContent}>
              <View style={styles.header}>
                <TouchableOpacity
                  onPress={this.pickUnits}
                  style={styles.backButton}
                >
                  <Text style={{ color: "#FFF" }}>Back</Text>
                </TouchableOpacity>
                {Object.values(this.state.shouldRoll).length > 0 &&
                  Object.values(this.state.shouldRoll).reduce((a, b) => a + b) >
                    0 && (
                    <TouchableOpacity
                      onPress={this.rollLosses}
                      style={styles.forwardButton}
                    >
                      <Text style={{ color: "#FFF" }}>Roll</Text>
                    </TouchableOpacity>
                  )}
                {!this.state.ambush &&
                  this.state.attackerSelected !== "German" && (
                    <TouchableOpacity
                      onPress={this.counterAttack}
                      style={styles.forwardButton}
                    >
                      <Text style={{ color: "#FFF" }}>Counter attack?</Text>
                    </TouchableOpacity>
                  )}
                {!this.state.counterAttack || (
                  <TouchableOpacity
                    onPress={this.reset}
                    style={styles.forwardButton}
                  >
                    <Text style={{ color: "#FFF" }}>Battle over</Text>
                  </TouchableOpacity>
                )}
              </View>
              <Losses
                ref={c => {
                  this.losses = c;
                }}
                unitSizes={this.state.unitSizes}
                defenderSelected={this.state.defenderSelected}
                defender={this.state.defender}
                defending={this.state.defending}
                attacker={this.state.attacker}
                attacking={this.state.attacking}
                noMobileFirst={this.state.noMobileFirst}
                halfLosses={this.state.halfLosses}
                setLosses={this.setLosses}
                defendingWithLosses={this.state.defendingWithLosses}
                ambush={this.state.ambush}
                totalRequiredLosses={this.totalRequiredLosses}
              />
            </View>
          )}
          {this.state.rollForLosses && (
            <RollForLosses
              ref={c => {
                this.rflosses = c;
              }}
              shouldRoll={this.state.shouldRoll}
              unitSizes={this.state.unitSizes}
              defenderSelected={this.state.defenderSelected}
              defender={this.state.defender}
              allLosses={this.state.allLosses}
              setFinalLosses={this.setFinalLosses}
            />
          )}
          {this.state.counterAttack && (
            <View style={styles.headerContent}>
              <View style={styles.header}>
                <TouchableOpacity
                  onPress={this.reset}
                  style={styles.forwardButton}
                >
                  <Text style={{ color: "#FFF" }}>Battle over</Text>
                </TouchableOpacity>
              </View>
              <Losses
                ref={c => {
                  this.cattack = c;
                }}
                counterAttack={true}
                unitSizes={this.state.unitSizes}
                defenderSelected={this.state.attackerSelected}
                defender={this.state.attacker}
                defending={this.state.attacking}
                attacker={this.state.defender}
                attacking={
                  this.state.updatedFinalLosses
                    ? this.state.updatedFinalLosses
                    : this.state.defendingWithLosses
                }
                noMobileFirst={true}
                halfLosses={false}
                ambush={false}
                setLosses={() => {}}
                defendingWithLosses={this.state.counterDefendingWithLosses}
                totalRequiredLosses={this.counterTotalRequiredLosses}
              />
            </View>
          )}
        </ImageBackground>
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
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 40,
    paddingLeft: 10,
    paddingRight: 10
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
  forwardButton: {
    alignSelf: "flex-end",
    backgroundColor: "#444",
    borderRadius: 5,
    padding: 10,
    elevation: 10
  },
  options: {
    flexDirection: "row",
    justifyContent: "center"
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
