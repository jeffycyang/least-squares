import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Plot from 'react-plotly.js'
import { leastSqr, leastSqrSurface, solutionToFunction, solutionToFunctionSurface, solutionToEquation } from '../lib/leastSquare'

const typeMap = {
  poly: 0,
  trig: 1,
  exp:  2,
  log:  3
}

class Graph2D extends Component {
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
    const { dataPoints } = this.props
    // const type = typeMap[equationType]
    const type = 0

    if (dataPoints.length > 0) {
      const x =[], y = [], z = []
      dataPoints.forEach(point => {
        x.push(point.x)
        y.push(point.y)
        z.push(point.z)
      })

      const solution = leastSqrSurface(type, x, y, z, 3)
      this.setState({ solution })
    }
  }

  componentDidUpdate(prevProps) {

  }

  render() {
    const granularity = 100, // 500
          domain = [-5, 10], // domain = [-10, 10],
          increment = (domain[1] - domain[0]) / granularity
    const x = []
    const y = []
    let current = domain[0]
    for (let i = 0; i < granularity; i++) {
      x.push(current)
      y.push(current)
      current += increment
    }

    // const funcEq = (x, y) => Math.pow(x, 2) + (x * y) + Math.pow(y, 2)
    // const z = []
    // x.forEach(xVal => z.push(y.map(yVal => funcEq(xVal, yVal))))


// var trace = {
//   type: 'surface',
//   x: [1, 10, 100],
//   y: [100, 1000, 2000],
//   z: [ [1,2,3], [2,3,4], [3,4,5] ]
// }

// Plotly.plot('graph', [trace])


  console.log('solution2D', this.state.solution)

  const solutionFunction = solutionToFunctionSurface(this.state.solution, 0, 3)
  const z = []
  x.forEach(xVal => z.push(y.map(yVal => solutionFunction(xVal, yVal))))

  // data points
  const dataX =[], dataY = [], dataZ = []
  this.props.dataPoints.forEach(point => {
    dataX.push(point.x)
    dataY.push(point.y)
    dataZ.push(point.z)
  })

    return (
      <Plot
        data={[
          {
            type: 'surface',
            x,
            y,
            z,
            contours: {
              z: {
                show: true,
                usecolormap: true,
                highlightcolor: '#42f62',
                project: { z: true }
              }
            }
          },
          {
            x: dataX,
            y: dataY,
            z: dataZ,
            type: 'scatter3d',
            mode: 'markers',
            marker: { color: 'green' }
          }
        ]}
        layout={{
          title: 'Multiple Regression',
          scene: {
            camera: { 
              eye: { x: 1.87, y: 0.88, z: -0.64 }
            }
          },
          autosize: false,
          width: 500,
          height: 500,
          margin: {
            l: 65,
            r: 50,
            b: 65,
            t: 90,
          }
        }}
        config={{ scrollZoom: true }}
      />
    )
  }
}

export default Graph2D
