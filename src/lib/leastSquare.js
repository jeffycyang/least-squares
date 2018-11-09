// types:
//   0 - polynomial,
//   1 - trigonometric (discrete integer),
//   2 - exponential,
//   3 - logarithmic
// degree only matters for polynomial & trigonometric

export const matrixInvert = M => {
  // Calculated using Guassian Elimination:
  // (1) 'augment' the matrix (left) by the identity (on the right)
  // (2) Turn the matrix on the left into the identity by elemetry row ops
  // (3) The matrix on the right is the inverse (was the identity matrix)
  // Three elementary row ops: (b & c combined in code)
  // (a) Swap 2 rows
  // (b) Multiply a row by a scalar
  // (c) Add 2 rows

  // If the matrix isn't square, return (error)
  if (M.length !== M[0].length) return

  // Create identity matrix (I), and a copy (C) of the original
  const dim = M.length, I = [], C = []
  let i = 0, ii = 0, j = 0, e = 0, t = 0

  for (i = 0 ; i < dim ; i += 1) {

    // Create row
    I[I.length] = []
    C[C.length] = []
    for ( j = 0 ; j < dim ; j += 1) {

      // If on diagonal, put 1 (for identity)
      if (i === j) {
        I[i][j] = 1
      } else {
        I[i][j] = 0
      }

      // Make copy of original
      C[i][j] = M[i][j]
    }
  }

  // Perform elementary row operations
  for (i = 0 ; i < dim ; i += 1) {
    // Get element e on diagonal
    e = C[i][i]

    // If 0 on diagonal (swap with a lower row)
    if (e === 0) {

      // Look through every row below i'th row
      for (ii = i + 1 ; ii < dim ; ii += 1) {

        // If ii'th row has non-0 in the i'th col
        if (C[ii][i] !== 0) {

          // It would make diagonal have a non-0 so swap
          for (j = 0 ; j < dim ; j++) {
            e = C[i][j]       //temp store i'th row
            C[i][j] = C[ii][j]//replace i'th row by ii'th
            C[ii][j] = e      //repace ii'th by temp
            e = I[i][j]       //temp store i'th row
            I[i][j] = I[ii][j]//replace i'th row by ii'th
            I[ii][j] = e      //repace ii'th by temp
          }

          // Don't bother checking other rows since swap has been performed
          break
        }
      }

      // Get new diagonal
      e = C[i][i]

      // If still 0, M not invertable (error)
      if (e === 0) return
    }

    // Scale row down by e (to have a 1 on diagonal)
    for (j = 0 ; j < dim ; j++) {
      C[i][j] = C[i][j] / e //apply to original matrix
      I[i][j] = I[i][j] / e //apply to identity
    }

    // Subtract this row (scaled appropriately for each row) from ALL
    // other rows so there will be 0's in this column in the rows above
    // and below this one
    for (ii = 0 ; ii < dim ; ii++) {

      // Only apply to other rows (want 1 on diagonal)
      if (ii === i) continue

      // Want to change this element to 0
      e = C[ii][i]

      // Subtract (the row above(or below) scaled by e) from (the
      // current row) but start at the i'th column and assume all the
      // stuff left of diagonal is 0 (should be true if no error in
      // algorithm)
      for (j = 0 ; j < dim ; j++) {
        C[ii][j] -= e * C[i][j] //apply to original matrix
        I[ii][j] -= e * I[i][j] //apply to identity
      }
    }
  }

  // All operations completed, C is identity matrix &
  // matrix I is inverse of M
  return I
}

export const matrixMultiply = (Q, P) => {
  const qRows = Q.length,
        qCols = Q[0].length,
        pRows = P.length,
        pCols = P[0].length,
        prod = new Array(qRows)

  // If Q columns != P rows, return (error, matrix dimensions cannot be multiplied)
  if (qCols !== pRows) return

  // If P columns == 1, matrix Q multiplied with 1-D vector P
  if (pCols === 1) {
    for (let i = 0 ; i < qRows ; i++) {
      prod[i] = [0]
      for (let j = 0 ; j < pCols ; j++) {
        for (let k = 0 ; k < qCols ; k++) {
          prod[i][0] += Q[i][k] * P[k][j]
        }
      }
    }
    return prod
  }

  // If P rows == Q columns
  if (qCols === pRows) {
    for (let i = 0 ; i < qRows ; i++) {
      prod[i] = [0]
      for (let j = 0 ; j < pCols ; j++) {
        prod[i][j] = 0
        for (let k = 0 ; k < qCols ; k++) {
          prod[i][j] += Q[i][k] * P[k][j]
        }
      }
    }

  // ???
  } else {
    for (let i = 0 ; i < qCols ; i++) {
      prod[i] = []
      for (let j = 0 ; j < pRows ; j++) {
        prod[i][j] = 0
        for (let k = 0 ; k < qCols ; k++) {
          prod[i][j] += Q[i][k] * P[k][j]
        }
      }
    }
  }

  return prod
}

export const createX = (type, xValues, degree) => {
  const xArray = []

  // type 0 - polynomial, 1 - trigonometric, 2 - exponential, 3 - logarithmic
  // degree only matters for polynomial & trigonometric
  for (let i = 0 ; i < xValues.length ; i++) {

    if (type === 0) {
        xArray[i] = []
        for (let j = 0 ; j < degree ; j++) {
          xArray[i][j] = Math.pow(xValues[i], j)
        }
    }

    if (type === 1) {
      xArray[i] = []
      for (let j = 0 ; j <= degree * 2 ; j += 2) {
        if (j === 0) {
          xArray[i][j] = 1
        } else {
          const period = j / 2
          xArray[i][j - 1] = Math.sin(period * xValues[i])
          xArray[i][j] = Math.cos(period * xValues[i])
        }
      }
    }

    if (type === 2) xArray.push([1, xValues[i]])

    if (type === 3) xArray.push([1, Math.log(xValues[i])])
  }

  return xArray
}

export const createY = (type, yValues) => {
  const yVector = []

  for (let i = 0 ; i < yValues.length ; i++) {
    yVector[i] = []
    yVector[i].push(yValues[i])
  }

  // type 0 - polynomial, 1 - exponential, 2 - trigonometric, 3 - logarithmic
  // only need to consider exponential
  for (let j = 0 ; j < yValues.length ; j++) {
    if (type === 2) yVector[j][0] = Math.log(yVector[j][0])
  }

  return yVector
}

export const transposeArray = arr => {
  const newArray = [],
        numCol = arr[0].length

  for (let i = 0 ; i < numCol ; i++) {
    newArray[i] = []
  }

  for(let j = 0 ; j < arr.length ; j++) {
    for(let k = 0 ; k < numCol ; k++) {
      newArray[k].push(arr[j][k])
    }
  }

  return newArray
}

export const leastSqr = (type, xVal, yVal, degree) => {
  const xM = createX(type, xVal, degree),
        yV = createY(type, yVal),
        xT = transposeArray(xM),
        xTX = matrixMultiply(xT, xM),
        invXTX = matrixInvert(xTX),
        xTY = matrixMultiply(xT, yV)

  return matrixMultiply(invXTX, xTY)
}

export const solutionToFunc = (solution, type) =>
  x => solution.reduce((acc, curr, ind) => {
    if (type === 0) return acc + (curr[0] * Math.pow(x, ind))

    if (type === 1) {
      const period = Math.ceil(ind / 2)
      if (ind % 2 === 0) return acc + (curr[0] * Math.cos(period * x))
      if (ind % 2 === 1) return acc + (curr[0] * Math.sin(period * x))
    }

    if (type === 2) {
      if (ind === 0) return acc * curr[0]
      if (ind === 1) return acc * Math.exp(curr[0] * x)
    }

    if (type === 3) {
      if (ind === 0) return acc + curr[0]
      if (ind === 1) return acc + (curr[0] * Math.log(x))
    }
  }, (type !== 2) ? 0 : 1)

export const solutionToEquation = (solution, type) =>
  `<span><var>f(x)</var> = ${
    solution.reduce((acc, curr, ind) => {
      const term = Number(curr[0].toFixed(3))
      if (type === 0) {
        if (ind === 0) return acc + term
        return acc + `${term > 0 ? ` + ${term}` : ` <var>-</var> ${Math.abs(term)}`}<var>x</var>${ind !== 1 ? `<sup>${ind}</sup>` : ''}`
      }

      if (type === 1) {
        if (ind === 0) return acc + term
        const period = Math.ceil(ind / 2) !== 1 ? Math.ceil(ind / 2) : ''
        if (ind % 2 === 0) return acc + `${term > 0 ? ` + ${term}` : ` <var>-</var> ${Math.abs(term)}`}cos(${period}<var>x</var>)`
        if (ind % 2 === 1) return acc + `${term > 0 ? ` + ${term}` : ` <var>-</var> ${Math.abs(term)}`}sin(${period}<var>x</var>)`
      }

      if (type === 2) {
        if (ind === 0) return acc + term
        if (ind === 1) return acc + `<var>e</var><sup>${term}<var>x</var></sup>`
      }

      if (type === 3) {
        if (ind === 0) return acc + term
        if (ind === 1) return acc + ` + ${term}ln(<var>x</var>)`
      }
    }, '')
  }</span>`
