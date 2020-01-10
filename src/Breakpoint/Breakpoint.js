import React from 'react';
import PropTypes from 'prop-types';

import BreakpointUtil from './breakpoint-util';
import { BreakpointContext } from './BreakpointProvider';

export default class Breakpoint extends React.Component {
  constructor(props) {
    super(props);

    this.extractBreakpointAndModifierFromProps = this.extractBreakpointAndModifierFromProps.bind(
      this
    );
  }

  extractBreakpointAndModifierFromProps(allProps) {
    let breakpoint;
    let modifier;
    let tagName = allProps.tagName || 'div';
    let className = allProps.className || '';
    let style = allProps.style;
    let usesCustomQuery = false;

    Object.keys(allProps).forEach((prop) => {
      if (prop === 'up' || prop === 'down' || prop === 'only') {
        modifier = prop;
      } else if (prop === 'customQuery') {
        usesCustomQuery = true;
      } else if (prop !== 'tagName' && prop !== 'className' && prop !== 'style' && prop !== 'onActivate') {
        breakpoint = prop;
      } 
    });

    if (modifier === 'up' || modifier === 'down' || modifier === 'only') {
      usesCustomQuery = false;
    }

    if (!modifier && !usesCustomQuery)  modifier  = 'only';

    return {
      breakpoint,
      modifier,
      tagName,
      className,
      style,
      customQuery: usesCustomQuery ? allProps.customQuery : null
    };
  }

  render() {
    const { children, ...rest } = this.props;
    const { 
      breakpoint, 
      modifier, 
      className, 
      tagName, 
      style, 
      customQuery
    } = this.extractBreakpointAndModifierFromProps(rest);

    const { currentBreakpointName, currentWidth, lastBreakpointName, lastWidth } = this.context;

    const shouldRender = BreakpointUtil.shouldRender({
      breakpointName: breakpoint,
      modifier,
      currentBreakpointName,
      currentWidth,
      customQuery
    });

    if (lastBreakpointName !== currentBreakpointName && shouldRender) {
      this.props.onActivate && this.props.onActivate();
    }

    if (!shouldRender) return null;

    const Tag = tagName
    return (
      <Tag className={`breakpoint__${breakpoint}-${modifier} ${className}`} style={style}>{children}</Tag>
    );
  }
}

Breakpoint.contextType = BreakpointContext;

Breakpoint.propTypes = {
  children: PropTypes.node,
  up: PropTypes.bool,
  down: PropTypes.bool,
  only: PropTypes.bool,
  tagName: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ])),
  customQuery: PropTypes.string
};
