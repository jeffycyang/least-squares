import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Plot from 'react-plotly.js'
import { leastSqr } from '../lib/leastSquare'

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
    console.log('points', this.props.dataPoints)
    const { dataPoints } = this.props

    if (dataPoints !== prevProps.dataPoints) {
      const x =[], y = []
      dataPoints.forEach(point => {
        x.push(point.x)
        y.push(point.y)
      })
      const solution = leastSqr(0, x, y, 4)
      console.log('solution', solution)
      this.setState({ solution })
    }
  }

  render() {
    const granularity = 100,
          domain = [-5, 5],
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
    x.forEach(xVal => y.push(
      solution.reduce((acc, curr, ind) => acc + (curr[0] * Math.pow(xVal, ind)), 0)
    ))

    const { dataPoints } = this.props
    const dataX =[], dataY = []
    dataPoints.forEach(point => {
      dataX.push(point.x)
      dataY.push(point.y)
    })

    return (
      <Plot
        data={[
          {
            x,
            y,
            type: 'scatter',
            mode: 'lines+points',
            marker: { color: 'red' }
          },
          {
            x: dataX,
            y: dataY,
            type: 'scatter',
            mode: 'markers',
            marker: { color: 'blue' }
          }
        ]}
        layout={{
          width: 640,
          height: 480,
          title: 'Least Squares Regression'
        }}
      />
    )

    // TEST
    // // test data:
    // const granularity = 100,
    //       domain = [-5, 5],
    //       increment = (domain[1] - domain[0]) / granularity
    // const x = []
    // let current = domain[0]
    // for (let i = 0; i < granularity; i++) {
    //   x.push(current)
    //   current += increment
    // }
    // // test function:
    // const func = x => Math.pow(x, 3)
    // const y = []
    // x.forEach(el => y.push(func(el)))

    // return (
    //   <Plot
    //     data={[
    //       {
    //         x,
    //         y,
    //         type: 'scatter',
    //         mode: 'lines+points',
    //         marker: { color: 'red' },
    //       }
    //     ]}
    //     layout={{
    //       width: 640,
    //       height: 480,
    //       title: 'Least Squares Regression'
    //     }}
    //   />
    // )
    // degree & other controls
    // display equation
  }
}

export default Graph
