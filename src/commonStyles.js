const panelStyles = theme => ({
  panelTitle: {
    fontWeight: 'bold',
    fontSize: 22,
    marginBottom: theme.spacing(2),
  },

  // Real-time Stats Panel
  realTimeStatsPanel: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    padding: theme.spacing(3),
    alignItems: 'center',
    backgroundColor: theme.palette.grey[100],
  },
})

export { panelStyles }
