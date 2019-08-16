import React, { Component } from 'react'
import Graph from './Graph'
import { randomSmall, trendMedium, testExp, trendSurface } from '../lib/sampleData'

import Graph2D from './Graph2D'

class App extends Component {
  state = {
    dataPoints: [],
    plotType: '1d', // 1d, 2d
    equationType: 'trig' // poly, trig, exp, log
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
    const { dataPoints, plotType, equationType } = this.state

    return (
      <div>

        <div>
          <select
            value={plotType}
            onChange={evt => this.setState({ plotType: evt.target.value })}
          >
            <option value="1d">1-D</option>
            <option value="2d">2-D</option>
          </select>

          <select
            value={equationType}
            onChange={evt => this.setState({ equationType: evt.target.value })}
          >
            <option value="poly">Polynomial</option>
            <option value="trig">Trigonometric</option>
            <option value="exp">Exponential</option>
            <option value="log">Logarithmic</option>
          </select>
        </div>

        {
          plotType === '1d'
            ? <Graph
              equationType={equationType} // poly, trig, exp, log
              dataPoints={dataPoints}
            />
            : <Graph2D
              dataPoints={trendSurface}
            />
        }
      </div>
    )
  }
}

export default App
