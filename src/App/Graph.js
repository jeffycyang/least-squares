import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Plot from 'react-plotly.js'

class Graph extends Component {
  static propTypes = {
    points: PropTypes.array,
    equationType: PropTypes.string, // poly, trig, exp, log
  }

  state = {
    degree: 0,
    functionPoints: [],
    functionCoefficients: []
  }

  constructor(props) {
    super(props)
  }

  componentDidMount() {

  }

  componentDidUpdate() {

  }

  render() {
    // test data:
    const granularity = 100,
          domain = [-5, 5],
          increment = (domain[1] - domain[0]) / granularity
    const x = []
    let current = domain[0]
    for (let i = 0; i < granularity; i++) {
      x.push(current)
      current += increment
    }
    // test function:
    const func = x => Math.pow(x, 3)
    const y = []
    x.forEach(el => y.push(func(el)))

    return (
      <Plot
        data={[
          {
            x,
            y,
            type: 'scatter',
            mode: 'lines+points',
            marker: { color: 'red' },
          }
        ]}
        layout={{
          width: 640,
          height: 480,
          title: 'Least Squares Regression'
        }}
      />
    )
    // degree & other controls
    // display equation
  }
}

export default Graph
