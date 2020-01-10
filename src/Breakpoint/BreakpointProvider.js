import React from 'react';
import PropTypes from 'prop-types';

import BreakpointUtil from './breakpoint-util';
import debounce from 'lodash.debounce';

const BreakpointContext = React.createContext({
  currentWidth: 9999,
  currentBreakpointName: '',
  lastWidth: 9999,
  lastBreakpointName: ''
});

export default class BreakpointProvider extends React.Component {
  constructor(props) {
    super(props);
    const currentWidth = BreakpointUtil.currentWidth;

    this.state = {
      currentWidth: currentWidth,
      currentBreakpointName: BreakpointUtil.getBreakpointName(currentWidth),
      lastWidth: currentWidth,
      lastBreakpointName: BreakpointUtil.getBreakpointName(currentWidth)
    };

    this.handleResize = debounce(this.handleResize.bind(this), 100);
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
    this.handleResize.cancel();
  }

  handleResize() {
    const lastWidth = this.state.currentWidth;
    const lastBreakpointName = this.state.currentBreakpointName;
    const currentWidth = BreakpointUtil.currentWidth;

    this.setState({
      currentWidth: currentWidth,
      currentBreakpointName: BreakpointUtil.getBreakpointName(currentWidth),
      lastWidth,
      lastBreakpointName
    });
  }

  render() {
    const { children } = this.props;
    const { currentWidth, currentBreakpointName, lastWidth, lastBreakpointName } = this.state;

    return (
      <BreakpointContext.Provider
        value={{
          currentWidth,
          currentBreakpointName,
          lastWidth,
          lastBreakpointName
        }}
      >
        { children }
      </BreakpointContext.Provider>
    );
  }
}

export const useCurrentWidth = () => {
  return React.useContext(BreakpointContext).currentWidth
}

export const useCurrentBreakpointName = () => {
  return React.useContext(BreakpointContext).currentBreakpointName
}

BreakpointProvider.propTypes = {
  children: PropTypes.node,
};

export {
  BreakpointContext,
};
