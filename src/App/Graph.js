import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Plot from 'react-plotly.js'
import { leastSqr, solutionToFunction, solutionToEquation } from '../lib/leastSquare'

const typeMap = {
  poly: 0,
  trig: 1,
  exp:  2,
  log:  3
}

class Graph extends Component {
  static propTypes = {
    dataPoints: PropTypes.array,
    equationType: PropTypes.string, // poly, trig, exp, log
  }

  state = {
    degree: 0,
    functionPoints: [],
    functionCoefficients: [],
    solution: []
  }

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { dataPoints, equationType } = this.props
    const type = typeMap[equationType]

    if (dataPoints.length > 0) {
      const x =[], y = []
      dataPoints.forEach(point => {
        x.push(point.x)
        y.push(point.y)
      })
  
      const solution = leastSqr(type, x, y, 3)
      this.setState({ solution })
    }
  }

  componentDidUpdate(prevProps) {
    const { dataPoints, equationType } = this.props
    const type = typeMap[equationType]

    if (equationType !== prevProps.equationType || dataPoints !== prevProps.dataPoints) {
      const x =[], y = []
      dataPoints.forEach(point => {
        x.push(point.x)
        y.push(point.y)
      })

      const solution = leastSqr(type, x, y, 3)
      this.setState({ solution })
    }
  }

  render() {
    const { dataPoints, equationType } = this.props
    const dataX =[], dataY = []
    dataPoints.forEach(point => {
      dataX.push(point.x)
      dataY.push(point.y)
    })

    const granularity = 500,
          domain = [-5, 15],
          increment = (domain[1] - domain[0]) / granularity
    const x = []
    let current = domain[0]
    for (let i = 0; i < granularity; i++) {
      x.push(current)
      current += increment
    }

    const { solution } = this.state

    console.log('solution', solution)

    const y = []
    const type = typeMap[equationType]
    const solutionFunction = solutionToFunction(solution, type)
    x.forEach(xVal => y.push(solutionFunction(xVal)))

    return (
      <div>
        <Plot
          data={[
            {
              x: dataX,
              y: dataY,
              type: 'scatter',
              mode: 'markers',
              marker: { color: 'blue' }
            },
            {
              x,
              y,
              type: 'scatter',
              mode: 'lines',
              marker: { color: 'red' }
            }
          ]}
          layout={{
            width: 640,
            height: 480,
            title: 'Least Squares Regression'
          }}
          config={{ scrollZoom: true }}
        />
        <div dangerouslySetInnerHTML={{ __html: solutionToEquation(solution, type) }} />
      </div>
    )
    // degree & other controls
    // display equation
  }
}

export default Graph
