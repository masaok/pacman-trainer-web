import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles'

// Override the default MUI theme:
// https://material-ui.com/customization/default-theme/
// https://material-ui.com/customization/theming/#api

let theme = createMuiTheme({
  // palette: { type: 'dark' },
  palette: {
    primary: {
      lightest: '#f5f7ff', // very, very light blue
      main: '#3f51b5', // default MUI theme blue (required)
    },
  },

  typography: {
    // Set global fonts here (install them in Helmet below):
    // https://material-ui.com/customization/typography/#font-family

    // Default font should be Roboto with Open Sans titles and accents
    fontFamily: ['Roboto', 'sans-serif'].join(','),
    h1: {
      fontFamily: ['Open Sans', 'sans-serif'].join(','),
    },
    h2: {
      fontFamily: ['Open Sans', 'sans-serif'].join(','),
    },
    h3: {
      fontFamily: ['Open Sans', 'sans-serif'].join(','),
    },
    h4: {
      fontFamily: ['Open Sans', 'sans-serif'].join(','),
    },
    h5: {
      fontFamily: ['Open Sans', 'sans-serif'].join(','),
    },
  },
})
theme = responsiveFontSizes(theme)

export default theme
