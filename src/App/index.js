import React, { Component } from 'react'
import Graph from './Graph'
import { randomSmall, trendMedium, testExp } from '../lib/sampleData'

import Graph2D from './Graph2D'

class App extends Component {
  state = {
    dataPoints: []
  }

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.setState({
      dataPoints: trendMedium
    })
  }

  componentDidUpdate() {
    // set new equationType / dataPoints / degree
  }

  render() {
    const { dataPoints } = this.state

    return (
      <div>
        <Graph
          equationType="trig" // poly, trig, exp, log
          dataPoints={dataPoints}
        />
        <Graph2D />
      </div>
    )
  }
}

export default App
