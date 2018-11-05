import React, { Component } from 'react'
import Graph from './Graph'

class App extends Component {
  state = {
    dataPoints: []
  }

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.setState({
      dataPoints: [
        { x: -3, y:  1.428 },
        { x: -2, y: -3.125 },
        { x: -1, y: -2.203 },
        { x:  0, y:  0.320 },
        { x:  1, y:  5.234 },
        { x:  2, y: -1.201 },
        { x:  3, y:  2.511 }
      ]
    })
  }

  render() {
    const { dataPoints } = this.state

    return (
      <div>
        <Graph
          equationType="exp" // poly, trig, exp, log
          dataPoints={dataPoints}
        />
      </div>
    )
  }
}

export default App
