import React from 'react';
import {
	ImageBackground,
	Image,
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View
} from 'react-native';
import { WebBrowser } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import { MonoText } from '../components/StyledText';

export default class HomeScreen extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			introText: 'Choose attacking faction',
			factions: [
				{
					name: 'Romans',
					color: '#CF340C',
					units: {
						leader: 1,
						warbands: 20,
						allies: 6,
						citadels: 6,
						legions: 12
					}
				},
				{
					name: 'Averni',
					color: '#448A66',
					units: {
						leader: 1,
						warbands: 35,
						allies: 10,
						citadels: 3
					}
				},
				{
					name: 'Belgae',
					color: '#D67D0C',
					units: {
						leader: 1,
						warbands: 25,
						allies: 10,
						citadels: 1
					}
				},
				{
					name: 'Aedui',
					color: '#1F7EBD',
					units: {
						warbands: 20,
						allies: 6,
						citadels: 2
					}
				},
				{
					name: 'German',
					color: '#000',
					units: {
						warbands: 15,
						allies: 6
					}
				}
			],
			attackerSelected: false,
			defenderSelected: false,
			factionSelectionStage: true,
			unitSelectionStage: false,
		};

		this.pickFactions = this.pickFactions.bind(this);
	}

	static navigationOptions = {
		header: null,
	};

	handleFactionSelection(faction) {
		if (this.state.attackerSelected === faction) {
			this.pickFactions();
			return;
		}

		const type = this.state.attackerSelected ? 'defenderSelected' : 'attackerSelected';

		this.setState({
			[type]: faction,
			introText: 'Choose defending faction'
		}, () => {
			this[faction].setNativeProps({
				style: {
					borderRadius: 8,
					borderWidth: 2,
					borderColor: type === 'defenderSelected' ? '#000' : '#FFF'
				}
			});
			if (type === 'defenderSelected') this.selectUnits();
		});
	}

	selectUnits() {
		let attackColor;
		let defendColor;

		this.state.factions.forEach(thisFaction=> {
			if (thisFaction.name === this.state.attackerSelected) attackColor = thisFaction.color;
			if (thisFaction.name === this.state.defenderSelected) defendColor = thisFaction.color;
		});

		const unitDisplay = (
			<View style={styles.contentSplit}>
				<View style={styles.units}>
					<Text style={{ color: attackColor, fontSize: 20 }}>{this.state.attackerSelected}</Text>
				</View>
				<View style={styles.units}>
					<Text style={{ color: defendColor, fontSize: 20 }}>{this.state.defenderSelected}</Text>
				</View>
			</View>
		);

		this.setState({
			factionSelectionStage: false,
			unitSelectionStage: true,
			unitDisplay
		});
	}

	pickFactions() {
		this.setState({
			factionSelectionStage: true,
			unitSelectionStage: false,
			attackerSelected: false,
			introText: 'Choose attacking faction'
		}, () => {
			this.state.factions.forEach(thisFaction => {
				this[thisFaction.name].setNativeProps({
					style: {
						borderWidth: 0
					}
				});
			});
		});
	}

	render() {
		return (
			<View style={styles.container}>
				<ImageBackground source={require('../assets/images/main_bg.jpg')} style={{ width: '100%', height: '100%' }}>
					{
						this.state.factionSelectionStage &&
						<View style={styles.content}>
							<View style={styles.factions}>
								<Text style={styles.introText}>{this.state.introText}:</Text>
							</View>
							<View style={styles.factions}>
								{
									this.state.factions.map(thisFaction => {
										return (
											<TouchableOpacity
												key={thisFaction.name}
												ref={c => this[thisFaction.name] = c}
												onPress={() => this.handleFactionSelection(thisFaction.name)}
												accessibilityLabel="Learn more about this purple TouchableOpacity "
												style={{ ...styles.factionButton, backgroundColor: thisFaction.color }}
											>
												<Text style={{ color: '#FFF' }}>{thisFaction.name}</Text>
											</TouchableOpacity>
										)
									})
								}
							</View>
						</View>
					}
					{
						this.state.unitSelectionStage &&
						<View>
							<View style={styles.header}>
								<TouchableOpacity
									onPress={this.pickFactions}
									accessibilityLabel="Learn more about this purple TouchableOpacity"
									style={styles.backButton}
								>
									<Text style={{ color: '#FFF' }}>Select factions</Text>
								</TouchableOpacity>
							</View>
							{this.state.unitDisplay}
						</View>
					}
				</ImageBackground>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#000'
	},
	content: {
		flex: 1,
		alignContent: 'space-around',
		padding: 60
	},
	header: {
		paddingTop: 40,
		paddingLeft: 20
	},
	contentSplit: {
		flex: 1,
		flexDirection: 'row',
		alignContent: 'space-around'
	},
	units: {
		flex: 1
	},
	introText: {
		fontSize: 24,
		paddingBottom: 30
	},
	factions: {
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-around'
	},
	backButton: {
		alignSelf: 'flex-start',
		backgroundColor: '#444',
		borderRadius: 5,
		padding: 10,
		elevation: 10,
	},
	factionButton: {
		backgroundColor: '#CF340C',
		borderRadius: 5,
		padding: 20,
		elevation: 10,
	},
	developmentModeText: {
		marginBottom: 20,
		color: 'rgba(0,0,0,0.4)',
		fontSize: 14,
		lineHeight: 19,
		textAlign: 'center',
	},
	contentContainer: {
		paddingTop: 30,
	},
	welcomeContainer: {
		alignItems: 'center',
		marginTop: 10,
		marginBottom: 20,
	},
	welcomeImage: {
		width: 100,
		height: 100,
		borderRadius: 50,
		backgroundColor: '#FF0000',
		resizeMode: 'contain',
		marginTop: 3,
		marginLeft: -10,
	},
	getStartedContainer: {
		alignItems: 'center',
		marginHorizontal: 50,
	},
	homeScreenFilename: {
		marginVertical: 7,
	},
	codeHighlightText: {
		color: 'rgba(96,100,109, 0.8)',
	},
	codeHighlightContainer: {
		backgroundColor: 'rgba(0,0,0,0.05)',
		borderRadius: 3,
		paddingHorizontal: 4,
	},
	getStartedText: {
		fontSize: 17,
		color: 'rgba(96,100,109, 1)',
		lineHeight: 24,
		textAlign: 'center',
	},
	tabBarInfoContainer: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		...Platform.select({
			ios: {
				shadowColor: 'black',
				shadowOffset: { height: -3 },
				shadowOpacity: 0.1,
				shadowRadius: 3,
			},
			android: {
				elevation: 20,
			},
		}),
		alignItems: 'center',
		backgroundColor: '#fbfbfb',
		paddingVertical: 20,
	},
	tabBarInfoText: {
		fontSize: 17,
		color: 'rgba(96,100,109, 1)',
		textAlign: 'center',
	},
	navigationFilename: {
		marginTop: 5,
	},
	helpContainer: {
		marginTop: 15,
		alignItems: 'center',
	},
	helpLink: {
		paddingVertical: 15,
	},
	helpLinkText: {
		fontSize: 14,
		color: '#2e78b7',
	},
});
