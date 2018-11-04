// Returns the inverse of matrix `M`.
export const matrixInvert = M => {
  // I use Guassian Elimination to calculate the inverse:
  // (1) 'augment' the matrix (left) by the identity (on the right)
  // (2) Turn the matrix on the left into the identity by elemetry row ops
  // (3) The matrix on the right is the inverse (was the identity matrix)
  // There are 3 elemtary row ops: (I combine b and c in my code)
  // (a) Swap 2 rows
  // (b) Multiply a row by a scalar
  // (c) Add 2 rows

  // If the matrix isn't square: exit (error)
  if (M.length !== M[0].length) return

  // Create the identity matrix (I), and a copy (C) of the original
  const dim = M.length, I = [], C = []
  let i = 0, ii = 0, j = 0, e = 0, t = 0

  for (i = 0 ; i < dim ; i += 1) {

    // Create the row
    I[I.length] = []
    C[C.length] = []
    for ( j = 0 ; j < dim ; j += 1) {

      // If we're on the diagonal, put a 1 (for identity)
      if (i === j) {
        I[i][j] = 1
      } else {
        I[i][j] = 0
      }

      // Also, make the copy of the original
      C[i][j] = M[i][j]
    }
  }

  // Perform elementary row operations
  for (i = 0 ; i < dim ; i += 1) {
    // Get the element e on the diagonal
    e = C[i][i]

    // If we have a 0 on the diagonal (we'll need to swap with a lower row)
    if (e === 0) {

      // Look through every row below the i'th row
      for (ii = i + 1 ; ii < dim ; ii += 1) {

        // If the ii'th row has a non-0 in the i'th col
        if (C[ii][i] !== 0) {

          // It would make the diagonal have a non-0 so swap it
          for (j = 0 ; j < dim ; j++) {
            e = C[i][j]       //temp store i'th row
            C[i][j] = C[ii][j]//replace i'th row by ii'th
            C[ii][j] = e      //repace ii'th by temp
            e = I[i][j]       //temp store i'th row
            I[i][j] = I[ii][j]//replace i'th row by ii'th
            I[ii][j] = e      //repace ii'th by temp
          }

          // Don't bother checking other rows since we've swapped
          break
        }
      }

      // Get the new diagonal
      e = C[i][i]

      // If it's still 0, not invertable (error)
      if (e === 0) return
    }

    // Scale this row down by e (so we have a 1 on the diagonal)
    for (j = 0 ; j < dim ; j++) {
      C[i][j] = C[i][j] / e //apply to original matrix
      I[i][j] = I[i][j] / e //apply to identity
    }

    // Subtract this row (scaled appropriately for each row) from ALL of
    // the other rows so that there will be 0's in this column in the
    // rows above and below this one
    for (ii = 0 ; ii < dim ; ii++) {

      // Only apply to other rows (we want a 1 on the diagonal)
      if (ii === i) continue

      // We want to change this element to 0
      e = C[ii][i]

      // Subtract (the row above(or below) scaled by e) from (the
      // current row) but start at the i'th column and assume all the
      // stuff left of diagonal is 0 (which it should be if we made this
      // algorithm correctly)
      for (j = 0 ; j < dim ; j++) {
        C[ii][j] -= e * C[i][j] //apply to original matrix
        I[ii][j] -= e * I[i][j] //apply to identity
      }
    }
  }

  // We've done all operations, C should be the identity
  // & matrix I should be the inverse:
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

export const createX = (type, xValues, order) => {
  let xArray

  if (order) {
    console.log('xval', xValues.length, 'order', order - 1)
    xArray = new Array(Math.min(xValues.length, order - 1))
    // xArray = new Array(order - 1)
  } else {
    xArray = []
  }

  // type 0 - polynomial, 1 - exponential, 2 - trigonometric, 3 - logarithmic
  // order only matters for polynomial & trigonometric

  // type 0, 2 (poly & trig)
  if (type === 0 || type === 2) {
    for (let i = 0 ; i < xValues.length ; i++) {

      if (type === 0) {
          xArray[i] = new Array(order)
          for (let j = 0 ; j < order ; j++) {
              xArray[i][j] = Math.pow(xValues[i], j)
          }
      }

      if (type === 2) {
        xArray[i] = new Array(order * 2)
        //this for loop is not working properly
        let trigOrder = 1
        for (let j = 0 ; j <= order * 2 ; j += 2) {
          if (j === 0) {
            xArray[i][j] = 1
          } else {
            xArray[i][j - 1] = Math.sin(trigOrder * xValues[i])
            xArray[i][j] = Math.cos(trigOrder * xValues[i])
            trigOrder++
          }
        }
      }
    }

  // type 1, 3 (exp & log)
  } else {
    for (let i = 0 ; i < xValues.length ; i++) {

      if (type === 1) xArray.push([1, xValues[i]])

      if (type === 3) xArray.push([1, Math.log(xValues[i])])
    }
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
    if (type === 1) yVector[j][0] = Math.log(yVector[j][0])
  }

  return yVector
}

export const transposeArray = arr => {
  console.log('arr',arr)
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

export const leastSqr = (type, xVal, yVal, order) => {
  const xM = createX(type, xVal, order),
        yV = createY(type, yVal),
        xT = transposeArray(xM),
        xTX = matrixMultiply(xT, xM),
        invXTX = matrixInvert(xTX),
        xTY = matrixMultiply(xT, yV)

  if (type === 0 || type=== 2 || type === 3) return matrixMultiply(invXTX, xTY)

  if (type === 1) {
    const solut = matrixMultiply(invXTX, xTY)
    solut[0][0] = Math.exp(solut[0][0])
    return solut
  }
}
