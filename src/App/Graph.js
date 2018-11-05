import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Plot from 'react-plotly.js'
import { leastSqr } from '../lib/leastSquare'

const xEx = [0.5,1.2,1.565,2.22,2.357,2.87,3.15,3.549,3.77,4.17,3.698,4.314,4.87,5.101,5.309,5.662,5.72,6.12,6.809,6.59,7.0875,7.571,7.954]
const yEx = [0.333,2.16,2.77,4.447,3.929,5.33,4.671,4.56,5.233,5.83,5.517,5.786,5.13,5.32,4.977,4.597,4.83,4.013,3.577,3.309,2.764,2.106,1.397]

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

  }

  componentDidUpdate(prevProps) {
    const { dataPoints, equationType } = this.props
    console.log('points', dataPoints)
    const type = typeMap[equationType]

    if (dataPoints !== prevProps.dataPoints) {
      const x =[], y = []
      dataPoints.forEach(point => {
        x.push(point.x)
        y.push(point.y)
      })

      // const solution = leastSqr(type, x, y, 4)
      // this.setState({ solution })

      const solution = leastSqr(type, xEx, yEx, 8)
      this.setState({ solution })
    }
  }

  render() {
    const { dataPoints, equationType } = this.props
    // const dataX =[], dataY = []
    // dataPoints.forEach(point => {
    //   dataX.push(point.x)
    //   dataY.push(point.y)
    // })
    const dataX = xEx, dataY = yEx

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
    x.forEach(xVal => {
      let order = 1
      y.push(
        solution.reduce((acc, curr, ind) => {
          if (type === 0) return acc + (curr[0] * Math.pow(xVal, ind))

          if (type === 1) {
            if (ind === 0) return acc + curr[0]
            if (ind % 2 === 1) return acc + (curr[0] * Math.sin(order * xVal))
            if (ind % 2 === 0) return acc + (curr[0] * Math.cos(order++ * xVal))
          }

          if (type === 2) {
            if (ind === 0) return acc * curr[0]
            if (ind === 1) return acc * Math.exp(curr[0] * xVal) 
          }

          if (type === 3) {

          }
        }, (type === 0 || type === 1) ? 0 : 1)
      )
    })

    return (
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
            mode: 'lines+points',
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
    )
    // degree & other controls
    // display equation
  }
}

export default Graph
