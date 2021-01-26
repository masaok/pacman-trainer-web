const isDev = () => {
  return window.location.hostname === 'localhost'
}

const dumpGrid = (grid, options = { header: true, stringify: true }) => {
  let result = ''
  const header = []

  // console.log('HELPERS > DUMP GRID > grid:')
  // console.log(grid)
  // console.log(typeof grid)

  // console.log('HELPERS > DUMP GRID > options:')
  // console.log(options)

  if (typeof grid === 'object' && grid.length > 0) {
    for (let i = 0; i < grid[0].length; i++) {
      header.push(i.toString())
    }

    if (options.header) {
      if (options.stringify) {
        result += JSON.stringify(header) + '\n'
      } else {
        for (let i = 0; i < header.length; i++) {
          result += header[i]
        }
        result += '\n'
      }
    }

    for (let i = 0; i < grid.length; i++) {
      const row = grid[i]
      if (options.stringify) {
        result += JSON.stringify(row) + '\n'
      } else {
        for (let col = 0; col < row.length; col++) {
          switch (row[col]) {
            // Ignore debug tokens used in creation of the random maze
            case 'N':
            case 'S':
            case 'E':
            case 'W':
            case '-':
              result += '.'
              break
            default:
              result += row[col]
          }
        }
        result += '\n'
      }
    }
  }

  return result
}

export { isDev, dumpGrid }
