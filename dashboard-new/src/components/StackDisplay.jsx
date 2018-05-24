import * as React from "react";
import * as PropTypes from "prop-types";
import ServiceDisplay from "./ServiceDisplay";

class StackDisplay extends React.Component {
  render() {
    const { stackName, services } = this.props;
    return (
      <div className={"stack-display"}>
          {
            services
              .sort((a, b) => a.labels["deployment.name"] < b.labels["deployment.name"] ? -1 : 1)
              .map((service, index) => <ServiceDisplay key={service.id} stackName={index === 0 ? stackName : ""} service={service}/>)
          }
      </div>
    );
  }
}

StackDisplay.propTypes = {
  stackName : PropTypes.string.isRequired,
  services : PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default StackDisplay;
