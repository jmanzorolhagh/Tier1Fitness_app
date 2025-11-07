import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
const tasks = [
  ["Jumping jacks: ", 5],
  ["Squats: ", 5],
  ["Push Ups: ", 5],
  ["Lunges", 5]
];
var random = Math.floor(Math.random()*tasks.length);

function App() {
  const [score, setScore] = useState(0);
  const [count, setCount] = useState(0);
  function handleClick() {
    setCount(count + 1);
    if (count>=tasks[random][1]-1) {
      setScore(score + 1);
      reset();
    }
  }

  function reset() {
    setCount(0);
    for (var i=0; i<tasks.length; i++) {
      tasks[i][1] = Math.floor(tasks[i][1] * 1.05 + Math.random()*2);
    }
    random = Math.floor(Math.random()*tasks.length);
  }
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
          <LeaderBoard score = {score}/>
        <table>
          <th>{tasks[random][0]} </th>
          <th>
            <MyButton count = {count} onClick={handleClick} outOf={tasks[random][1]}/>
          </th>
        </table>
      </header>
    </div>
  );
}

function MyButton({ count, onClick, outOf}) {
  return (
    <button onClick={onClick}>
      {count}/{outOf} times
    </button>
  );
}

function LeaderBoard({score}) {
  var tmp = 2;
  if (score<10) {
    return (
      <table>
        <tr>
          <th>Rank</th>
          <th>Name</th>
          <th>Score</th>
        </tr>

        <tr>
          <td>1</td>
          <td>Li</td>
          <td>10</td>
        </tr>

        <tr>
          <td>2</td>
          <td>Israel</td>
          <td>{score}</td>
        </tr>

      </table>
    );
  }
  if (score===10) {
    tmp = 1;
  }
  return (
      <table>
        <tr>
          <th>Rank</th>
          <th>Name</th>
          <th>Score</th>
        </tr>

        <tr>
          <td>1</td>
          <td>Israel</td>
          <td>{score}</td>
        </tr>

        <tr>
          <td>{tmp}</td>
          <td>Li</td>
          <td>10</td>
        </tr>

      </table>
    );
}

// function MyScore() {
//   return score;
// }

export default App;
