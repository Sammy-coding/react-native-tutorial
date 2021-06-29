import React, { useEffect, useRef, useState } from "react";
import { Text, View, StyleSheet, Button, Alert } from "react-native";
import NumberContainer from "./../components/NumberContainer";
import Card from "./../components/Card";

const generateRandomNumber = (min, max, exclude) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  const rdnNum = Math.floor(Math.random() * (max - min)) + 1;
  if (rdnNum === exclude) {
    return generateRandomNumber(min, max, exclude);
  } else {
    return rdnNum;
  }
};

const GameScreen = (props) => {
  const [currentGuess, setCurrentGuess] = useState(
    generateRandomNumber(1, 100, props.userChoice)
  );
  const [rounds, setRounds] = useState(0);

  const currentLow = useRef(1);
  const currentHigh = useRef(100);

  const { userChoice, onGameOver } = props;

  // this runs only after the logic renders. it renders last after logic must have rendered.
  useEffect(() => {
    if (currentGuess === userChoice) {
      onGameOver(rounds);
    }
    // this dependecies ensure that the side effects run if there is any changes to them.
  }, [currentGuess, userChoice, onGameOver]);

  const nextGuessHandler = (direction) => {
    if (
      (direction === "lower" && currentGuess < props.userChoice) ||
      (direction === "greater" && currentGuess > props.userChoice)
    ) {
      Alert.alert("Don't Lie!", "You know this is wrong...", [
        { text: "sorry!", style: "cancel" },
      ]);
      return;
    }

    if (direction === "lower") {
      currentHigh.current = currentGuess;
    }
    if (direction === "greater") {
      currentLow.current = currentGuess;
    }

    const nextRandomNumber = generateRandomNumber(
      currentLow.current,
      currentHigh.current,
      currentGuess
    );
    setCurrentGuess(nextRandomNumber);
    setRounds((curRounds) => curRounds + 1);
  };
  return (
    <View style={styles.screen}>
      <Text>Opponent's Guess</Text>
      <NumberContainer>{currentGuess}</NumberContainer>
      <Card style={styles.buttonContainer}>
        <Button title="Lower" onPress={() => nextGuessHandler("lower")} />
        <Button title="Greater" onPress={() => nextGuessHandler("greater")} />
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 10,
    alignItems: "center",
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    width: 300,
    maxWidth: "80%",
  },
});

export default GameScreen;
