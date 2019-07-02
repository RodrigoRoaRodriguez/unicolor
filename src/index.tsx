import * as React from "react";
import * as ReactDOM from "react-dom";
import { jch } from "d3-cam02";
import { lab, hsl, hcl, interpolateHcl } from "d3";
import * as d3 from "d3";

import "./styles.css";

// TODO: write closed function n => color

const increaseChroma = d3
  .scaleLinear()
  .domain([65, 0])
  .range([128, 1]);

function renderLabeled(color) {
  return (
    <h3>
      <div class="color-box" style={{ backgroundColor: color }} />
      {` ${color}`}
    </h3>
  );
}

function toShades(color, values) {
  return values.map(value => {
    let shade = hcl(color.hex());
    shade.l = value;
    // if (value < 25) shade.c = value * 2.1;
    if (value < 25) {
      shade.c = increaseChroma(value);
    }
    return shade;
  });
}

function renderGradient([j, c, h]) {
  const scale = d3
    .scalePow()
    .exponent(2.1)
    .domain([0, 9])
    .range([1, 128]);

  const values = Array.from(Array(9).keys()).map(scale);

  const gradient = toShades(jch(j, c, h), values).map(shade => {
    return (
      <div
        className="color-box"
        style={{ margin: "1px 2.5px", backgroundColor: shade.hex() }}
      />
    );
  });
  return <div style={{ margin: 0 }}>{gradient}</div>;
}

function renderBox(color) {
  return <div className="color-box" style={{ backgroundColor: color }} />;
}

function steps(amount = 10, to = 1, from = 0) {
  return Array.from(Array(amount).keys()).map(
    index => ((index + from) * to) / (amount + from - 1)
  );
}

function App() {
  const hues = steps(9, 360, 0.5);
  // const colors = steps(9, 360, 1).map(hue => hcl(hue, 128, 50).hex());
  const colors = [[0, 0, 0], ...hues.map(hue => [64, 128, hue])];
  // const colors = hues.map(hue => hsl(hue, 1, 0.5));
  return (
    <div className="App">
      <h1>CIECAM02 Rainbow</h1>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          background: "#123",
          borderRadius: "2vw",
          padding: "1vw",
          margin: "1vw"
        }}
      >
        {colors.map(([j, c, h], i) => (
          <div>
            <h2>{i}</h2>
            {renderBox(jch(j, c, h))}
          </div>
        ))}
      </div>
      {colors.map(renderGradient)}
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
