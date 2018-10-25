import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Plot from 'react-plotly.js'

class Graph extends Component {
  constructor(props) {
    super(props)
    this.state = {
      degree: 0,
      functionPoints: [],
      functionCoefficients: []
    }
  }

  render() {
    return (
      <Plot />
    )
  }
}

Graph.propTypes = {
  points: PropTypes.array,
  equationType: PropTypes.string, // poly, trig, log, exp
}

export default Graph
