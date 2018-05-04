import * as React from "react";
import * as PropTypes from "prop-types";
import Col from "react-bootstrap/es/Col";
import Row from "react-bootstrap/es/Row";
import ServiceStatusIcon from "./ServiceStatusIcon";
import {Fragment} from "react";

class ServiceDisplay extends React.Component {
  render() {
    const { service } = this.props;

    return (
      <Row>
        <Col sm={3}>
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
        <Col sm={3} className={"truncate"}>
          <span title={service.image}>{ service.image }</span>
        </Col>
      </Row>
    );
  }
}

ServiceDisplay.propTypes = {
  service : PropTypes.object.isRequired,
};

export default ServiceDisplay;
