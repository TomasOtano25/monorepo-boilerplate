import React from 'react'
import { setConfig, hot } from 'react-hot-loader'
import Theme from 'docz-theme-default'

const Root = () => (
  <Theme hashRouter={undefined} websocketUrl="ws://127.0.0.1:60506" />
)

export default hot(module)(Root)
