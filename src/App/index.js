import React, { Component } from 'react'
import Graph from './Graph'
import { randomSmall, trendMedium } from '../lib/sampleData'

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

  render() {
    const { dataPoints } = this.state

    return (
      <div>
        <Graph
          equationType="trig" // poly, trig, exp, log
          dataPoints={dataPoints}
        />
      </div>
    )
  }
}

export default App
