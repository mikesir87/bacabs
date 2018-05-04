import * as React from "react";
import * as PropTypes from "prop-types";

class ServiceStatusIcon extends React.Component {
  render() {
    const { status, numReplicas, numRunning } = this.props;

    if (status === "UPDATING" || numReplicas !== numRunning)
      return <i className={"fa fa-spin fa-circle-o-notch"} />;

    if (status === "HEALTHY")
      return <i className={"fa fa-check text-success"} />;

    return <span />;
  }
}

ServiceStatusIcon.propTypes = {
  status : PropTypes.oneOf(["HEALTHY", "UPDATING"]).isRequired,
  numReplicas : PropTypes.number.isRequired,
  numRunning : PropTypes.number.isRequired,
};

export default ServiceStatusIcon;
