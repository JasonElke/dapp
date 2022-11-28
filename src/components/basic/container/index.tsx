import { Component } from 'react';
import classNames from "classnames";

import './index.less'

class BaseContainer extends Component<{ children: any, className: any }> {

  render() {
    let {children, className, ...props} = this.props;
    return <div className={classNames("component-container", {[className]: className})} {...props}>{children}</div>;
  }
}

export default BaseContainer;
