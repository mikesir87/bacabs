import * as React from "react";
import * as PropTypes from "prop-types";
import Col from "react-bootstrap/es/Col";
import Row from "react-bootstrap/es/Row";
import ServiceStatusIcon from "./ServiceStatusIcon";
import {Fragment} from "react";
import Tooltip from "react-bootstrap/es/Tooltip";
import OverlayTrigger from "react-bootstrap/es/OverlayTrigger";

class ServiceDisplay extends React.Component {

  displayTooltip = (service) => (
    <Tooltip id={"tooltip"}>
      { service.image }
    </Tooltip>
  );

  render() {
    const { stackName, service } = this.props;

    return (
      <Row>
        <Col sm={2}><strong>{ stackName }</strong></Col>
        <Col sm={2}>
          <a href={service.labels["deployment.url"]}>{ service.labels["deployment.name"] }</a>
        </Col>
        <Col sm={2}>
          { service.labels["deployment.issue.url"] && (
            <a href={service.labels["deployment.issue.url"]}>{ service.labels["deployment.issue.identifier"] }</a>
          )}

          { service.labels["deployment.issue.url"] === undefined && (
            <Fragment>{ service.labels["deployment.issue.identifier"] }</Fragment>
          )}
        </Col>
        <Col sm={2}>
          <ServiceStatusIcon status={service.status} numReplicas={service.replicas} numRunning={service.runningTasks} />&nbsp;
          { service.runningTasks }/{ service.replicas }
        </Col>
        <Col sm={4} className={"truncate"}>
          <OverlayTrigger placement={"left"} overlay={this.displayTooltip(service)}>
            <span>{ service.image }</span>
          </OverlayTrigger>
        </Col>
      </Row>
    );
  }
}

ServiceDisplay.propTypes = {
  stackName : PropTypes.string,
  service : PropTypes.object.isRequired,
};

export default ServiceDisplay;
